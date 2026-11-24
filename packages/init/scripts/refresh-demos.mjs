/* Refresh the example page in the proven local targets and rebuild them.
 * Usage: node packages/init/scripts/refresh-demos.mjs [target ...]
 * This does not replace the Docker bac proof; it checks that the current
 * templates still compile in every framework after the mascot upgrade.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  astroDemo,
  reactDemo,
  solidDemo,
  svelteDemo,
  vanillaHtml,
  vueDemo,
} from "../dist/templates.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../..");
const BAC = "/home/claude2/bac";
const REPORT = path.join(ROOT, "analyse/init/refresh-builds.json");
const OUT = path.join(ROOT, "web/captures/choix");

const paths = {
  react: {
    button: "@/components/prequelui/button",
    gradient: "@/components/prequelui/gradient-text",
    typing: "@/components/prequelui/typing-text",
  },
  vue: {
    button: "@/components/prequelui/Button.vue",
    gradient: "@/components/prequelui/GradientText.vue",
    typing: "@/components/prequelui/TypingText.vue",
  },
  svelte: {
    button: "#lib/components/prequelui/Button.svelte",
    gradient: "#lib/components/prequelui/GradientText.svelte",
    typing: "#lib/components/prequelui/TypingText.svelte",
  },
  solid: {
    button: "~/components/prequelui/button",
    gradient: "~/components/prequelui/gradient-text",
    typing: "~/components/prequelui/typing-text",
  },
};

const entry = (demo) => `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    ${demo}
  </StrictMode>,
);
`;

const targets = [
  {
    id: "vite-react",
    dir: `${BAC}/prequelui-init-vite-react/my-app`,
    write: (dir) =>
      fs.writeFileSync(
        path.join(dir, "src/prequelui-demo.tsx"),
        `${reactDemo(paths.react)}\n${entry("<PrequelDemo />")}`,
      ),
  },
  {
    id: "vite-vue",
    dir: `${BAC}/prequelui-init-vite-vue/my-app`,
    write: (dir) =>
      fs.writeFileSync(path.join(dir, "src/PrequelDemo.vue"), vueDemo(paths.vue)),
  },
  {
    id: "sveltekit",
    dir: `${BAC}/prequelui-init-sveltekit/my-app`,
    write: (dir) =>
      fs.writeFileSync(
        path.join(dir, "src/routes/prequelui-demo/+page.svelte"),
        svelteDemo(paths.svelte),
      ),
  },
  {
    id: "vite-svelte",
    dir: `${BAC}/prequelui-init-vite-svelte/my-app`,
    write: (dir) =>
      fs.writeFileSync(path.join(dir, "src/PrequelDemo.svelte"), svelteDemo(paths.svelte)),
  },
  {
    id: "solid-start",
    dir: `${BAC}/prequelui-init-solid-start/my-app`,
    write: (dir) =>
      fs.writeFileSync(path.join(dir, "src/routes/prequelui-demo.tsx"), solidDemo(paths.solid)),
  },
  {
    id: "vite-solid",
    dir: `${BAC}/prequelui-init-vite-solid/my-app`,
    write: (dir) =>
      fs.writeFileSync(path.join(dir, "src/PrequelDemo.tsx"), solidDemo(paths.solid)),
  },
  {
    id: "astro",
    dir: `${BAC}/prequelui-init-astro/my-app`,
    write: (dir) =>
      fs.writeFileSync(path.join(dir, "src/pages/prequelui-demo.astro"), astroDemo(paths.react)),
  },
  {
    id: "next-app",
    dir: `${BAC}/prequelui-init-next-app/my-app`,
    write: (dir) =>
      fs.writeFileSync(
        path.join(dir, "app/prequelui-demo/page.tsx"),
        reactDemo(paths.react)
          .replace(/^\/\/ @ts-nocheck[^\n]*\n/, (line) => `${line}"use client";\n\n`)
          .replace("export function PrequelDemo", "export default function PrequelDemo"),
      ),
  },
  {
    id: "nuxt",
    dir: `${BAC}/prequelui-init-nuxt/my-app`,
    write: (dir) =>
      fs.writeFileSync(
        path.join(dir, "app/pages/prequelui-demo.vue"),
        vueDemo(paths.vue)
          .replace("<main ", "<ClientOnly><main ")
          .replace("</main>", "</main></ClientOnly>"),
      ),
  },
  {
    id: "html",
    dir: `${BAC}/prequelui-init-html/my-app`,
    write: (dir) =>
      fs.writeFileSync(
        path.join(dir, "prequelui-demo.html"),
        vanillaHtml("prequelui/dialog/dialog.js"),
      ),
    build: null,
  },
];

const only = process.argv.slice(2).filter((item) => !item.startsWith("-"));
const selected = only.length
  ? targets.filter((target) => only.includes(target.id))
  : targets;

fs.mkdirSync(OUT, { recursive: true });
const report = { generatedAt: new Date().toISOString(), targets: [] };

for (const target of selected) {
  const row = { id: target.id, dir: target.dir, write: null, build: null, log: null };
  if (!fs.existsSync(target.dir)) {
    row.write = "missing";
    report.targets.push(row);
    continue;
  }
  try {
    target.write(target.dir);
    row.write = "ok";
  } catch (error) {
    row.write = String(error.message ?? error);
  }
  if (row.write !== "ok" || target.build === null) {
    report.targets.push(row);
    continue;
  }
  const log = path.join(ROOT, "analyse/init/logs", `refresh-${target.id}.log`);
  const result = spawnSync("npm", ["run", "build"], {
    cwd: target.dir,
    encoding: "utf8",
    timeout: 240_000,
    env: {
      ...process.env,
      CI: "1",
      NO_COLOR: "1",
      NEXT_TELEMETRY_DISABLED: "1",
    },
  });
  const text = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
  fs.writeFileSync(log, text);
  row.build = result.status === 0 ? "pass" : `fail (${result.status ?? "timeout"})`;
  row.log = path.relative(ROOT, log);
  if (result.status !== 0) {
    row.tail = text.slice(-2400);
  } else {
    row.tail = text
      .split("\n")
      .filter((line) => /built in|Compiled successfully|✓|Build complete|Generating static/i.test(line))
      .slice(-4);
  }
  report.targets.push(row);
}

fs.writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.targets.some((row) => row.build && row.build !== "pass") ? 1 : 0;
