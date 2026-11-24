import fs from "node:fs";
import path from "node:path";
import { exists, isDirectory, readJson, readJsonc, readText } from "./detect.js";
import {
  POSTCSS_V4,
  NUXT_CONFIG,
  NUXT_CSS,
  SOLID_COMPONENTS_JSON,
  SOLID_CSS,
  SOLID_START_CONFIG,
  VITE_REACT_CONFIG,
  VITE_SOLID_CONFIG,
  VITE_SVELTE_CONFIG,
  VITE_VUE_CONFIG,
  astroDemo,
  reactDemo,
  solidDemo,
  solidEntry,
  svelteDemo,
  svelteEntry,
  vanillaHtml,
  viteHtml,
  vueDemo,
  vueEntry,
} from "./templates.js";
import type {
  PackageManager,
  Plan,
  PlanFile,
  PlanStep,
  ProjectInfo,
  RuntimeId,
} from "./types.js";

export const REGISTRY_URL = (
  process.env.PREQUELUI_REGISTRY_URL ||
  "https://prequeluianimate.terravidhal.me/r"
).replace(/\/+$/, "");

export class PlanError extends Error {
  constructor(
    message: string,
    readonly hint?: string,
  ) {
    super(message);
    this.name = "PlanError";
  }
}

const DEMO_COMPONENTS = ["button", "gradient-text", "typing-text"] as const;

const COMPONENT_DIRS = [
  "components/prequelui",
  "src/components/prequelui",
  "src/lib/components/prequelui",
  "app/components/prequelui",
  "src/app/components/prequelui",
];

function normaliseComponentName(file: string): string {
  return file
    .replace(/\.(?:[jt]sx?|vue|svelte)$/i, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

/** True when a previous init already wrote both starter components. */
export function demoComponentsPresent(project: ProjectInfo): boolean {
  const found = new Set<string>();
  for (const dir of COMPONENT_DIRS) {
    const absolute = path.join(project.root, dir);
    if (!isDirectory(absolute)) continue;
    for (const entry of fs.readdirSync(absolute)) {
      found.add(normaliseComponentName(entry));
    }
  }
  return DEMO_COMPONENTS.every((name) => found.has(normaliseComponentName(name)));
}

/** Dependencies the recipe needs but the project does not declare yet. */
function missingRuntimeDependencies(project: ProjectInfo): string[] {
  const pkg = readJson(path.join(project.root, "package.json"));
  const declared = new Set<string>([
    ...Object.keys(pkg?.dependencies ?? {}),
    ...Object.keys(pkg?.devDependencies ?? {}),
  ]);
  return runtimeDependencies(project.runtime).filter((name) => !declared.has(name));
}

function installArgs(pm: PackageManager, packages: string[]): string[] {
  if (pm === "pnpm") return ["pnpm", "add", ...packages];
  if (pm === "yarn") return ["yarn", "add", ...packages];
  if (pm === "bun") return ["bun", "add", ...packages];
  return ["npm", "install", ...packages];
}

function dlxArgs(pm: PackageManager, cli: string, args: string[]): string[] {
  if (pm === "pnpm") return ["pnpm", "dlx", cli, ...args];
  if (pm === "yarn") return ["yarn", "dlx", cli, ...args];
  if (pm === "bun") return ["bunx", cli, ...args];
  return ["npx", "--yes", cli, ...args];
}

function runArgs(pm: PackageManager, script: string): string[] {
  if (pm === "pnpm") return ["pnpm", "run", script];
  if (pm === "yarn") return ["yarn", script];
  if (pm === "bun") return ["bun", "run", script];
  return ["npm", "run", script];
}

function command(args: string[]): string {
  return args
    .map((part) => (/\s/.test(part) ? JSON.stringify(part) : part))
    .join(" ");
}

function installStep(
  id: string,
  title: string,
  pm: PackageManager,
  packages: string[],
): PlanStep {
  const args = installArgs(pm, packages);
  return { id, kind: "install", title, args, command: command(args) };
}

function writeStep(
  id: string,
  title: string,
  files: PlanFile[],
  detail?: string,
  keepExisting = false,
): PlanStep {
  return {
    id,
    kind: "write",
    title,
    detail,
    files,
    keepExisting,
    display: files.map((file) => `write ${file.path}`).join(", "),
  };
}

function appendCss(file: string, content: string): PlanFile {
  const existing = readText(file);
  const body =
    existing === null || existing.trim() === ""
      ? '@import "tailwindcss";\n'
      : existing.includes('@import "tailwindcss"')
        ? existing
        : `@import "tailwindcss";\n${existing}`;
  return { path: file, content: body };
}

function patchViteConfig(
  source: string,
  options: { tailwind: boolean; alias: boolean },
): string {
  let out = source;
  if (options.tailwind && !out.includes("@tailwindcss/vite")) {
    if (!/plugins:\s*\[/.test(out)) {
      throw new PlanError(
        "The Vite config is not a shape this CLI can safely extend.",
        "Add the Tailwind plugin and the @ alias by hand, or run the install guide.",
      );
    }
    out = `import tailwindcss from "@tailwindcss/vite";\n${out}`;
    out = out.replace(
      /plugins:\s*\[([\s\S]*?)\]/,
      (_match, inner: string) => {
        const trimmed = inner.trim().replace(/,$/, "");
        return `plugins: [${trimmed}${trimmed ? ", " : ""}tailwindcss()]`;
      },
    );
  }
  if (options.alias && !/\balias\s*:/.test(out)) {
    if (!out.includes('import path from "node:path"')) {
      out = `import path from "node:path";\n${out}`;
    }
    const alias = 'alias: { "@": path.resolve(import.meta.dirname, "./src") }';
    if (/resolve:\s*\{/.test(out)) {
      out = out.replace(/resolve:\s*\{/, `resolve: { ${alias}, `);
    } else if (/export default defineConfig\(\s*\{/.test(out)) {
      out = out.replace(
        /export default defineConfig\(\s*\{/,
        `export default defineConfig({\n  resolve: { ${alias} },`,
      );
    } else {
      throw new PlanError(
        "The Vite config does not use defineConfig, so the alias cannot be added safely.",
        "Add the @ alias by hand, or run the install guide.",
      );
    }
  }
  return out;
}

function findViteConfig(root: string, preferred: string[]): string | null {
  for (const name of preferred) {
    if (exists(path.join(root, name))) return name;
  }
  return null;
}

function writeTsconfigPaths(project: ProjectInfo, prefix = "@", target = "./src/*"): PlanFile[] {
  const files: PlanFile[] = [];
  for (const name of ["tsconfig.json", "tsconfig.app.json"]) {
    const file = path.join(project.root, name);
    if (!exists(file)) continue;
    const json = readJsonc(file);
    if (!json) continue;
    const compilerOptions =
      json.compilerOptions && typeof json.compilerOptions === "object"
        ? (json.compilerOptions as Record<string, unknown>)
        : {};
    delete compilerOptions.baseUrl;
    const paths =
      compilerOptions.paths && typeof compilerOptions.paths === "object"
        ? (compilerOptions.paths as Record<string, unknown>)
        : {};
    paths[`${prefix}/*`] = [target];
    compilerOptions.paths = paths;
    json.compilerOptions = compilerOptions;
    files.push({ path: name, content: `${JSON.stringify(json, null, 2)}\n` });
  }
  return files;
}

function writeSvelteLib(project: ProjectInfo): PlanFile[] {
  const files: PlanFile[] = [];
  const pkgPath = path.join(project.root, "package.json");
  const pkg = readJson(pkgPath);
  if (pkg) {
    const imports =
      pkg.imports && typeof pkg.imports === "object"
        ? (pkg.imports as Record<string, unknown>)
        : {};
    imports["#lib"] = "./src/lib/index.js";
    imports["#lib/*"] = "./src/lib/*";
    pkg.imports = imports;
    files.push({ path: "package.json", content: `${JSON.stringify(pkg, null, 2)}\n` });
  }
  for (const name of ["tsconfig.json", "tsconfig.app.json"]) {
    const file = path.join(project.root, name);
    if (!exists(file)) continue;
    const json = readJsonc(file);
    if (!json) continue;
    const compilerOptions =
      json.compilerOptions && typeof json.compilerOptions === "object"
        ? (json.compilerOptions as Record<string, unknown>)
        : {};
    delete compilerOptions.baseUrl;
    const paths =
      compilerOptions.paths && typeof compilerOptions.paths === "object"
        ? (compilerOptions.paths as Record<string, unknown>)
        : {};
    paths["#lib"] = ["./src/lib"];
    paths["#lib/*"] = ["./src/lib/*"];
    compilerOptions.paths = paths;
    json.compilerOptions = compilerOptions;
    files.push({ path: name, content: `${JSON.stringify(json, null, 2)}\n` });
  }
  return files;
}

function runtimeDependencies(runtime: RuntimeId): string[] {
  switch (runtime) {
    case "react":
      return ["motion", "lucide-react"];
    case "vue":
      return ["motion", "@lucide/vue"];
    case "svelte":
      return ["motion", "lucide-svelte"];
    case "solid":
      return ["motion", "lucide-solid"];
    default:
      return ["motion"];
  }
}

function registryBase(runtime: RuntimeId): string {
  // React items live at the registry root; the other frameworks are nested.
  return runtime === "react" ? REGISTRY_URL : `${REGISTRY_URL}/${runtime}`;
}

function addArgs(project: ProjectInfo, cli: string): string[] {
  const base = registryBase(project.runtime);
  const urls = DEMO_COMPONENTS.map((slug) => `${base}/${slug}.json`);
  const flags = project.runtime === "svelte" ? ["--overwrite", "--yes"] : [];
  return dlxArgs(project.packageManager, cli, ["add", ...urls, ...flags]);
}

function shadcnCli(runtime: RuntimeId): string {
  if (runtime === "vue") return "shadcn-vue@latest";
  if (runtime === "svelte") return "shadcn-svelte@latest";
  return "shadcn@latest";
}

function shadcnInitArgs(project: ProjectInfo): string[] | null {
  switch (project.framework) {
    case "nuxt":
      return ["init", "-y", "-d", "-t", "nuxt"];
    case "vite-vue":
      return ["init", "-y", "-d", "-t", "vite"];
    case "sveltekit":
    case "vite-svelte":
      return [
        "init",
        "--overwrite",
        "--preset",
        "luma",
        "--base-color",
        "neutral",
        "--css",
        project.framework === "sveltekit"
          ? svelteCss(project)
          : "src/app.css",
        "--lib-alias",
        "#lib",
        "--components-alias",
        "#lib/components",
        "--utils-alias",
        "#lib/utils",
        "--hooks-alias",
        "#lib/hooks",
        "--ui-alias",
        "#lib/components/ui",
      ];
    case "solid-start":
    case "vite-solid":
      return null;
    default:
      return ["init", "-y", "-b", "radix", "-p", "nova", "--no-monorepo"];
  }
}

function svelteCss(project: ProjectInfo): string {
  if (exists(path.join(project.root, "src/routes/layout.css"))) {
    return "src/routes/layout.css";
  }
  if (exists(path.join(project.root, "src/app.css"))) return "src/app.css";
  return "src/routes/layout.css";
}

function appRoot(project: ProjectInfo): string {
  if (isDirectory(path.join(project.root, "app"))) return "app";
  if (isDirectory(path.join(project.root, "src/app"))) return "src/app";
  return "app";
}

function pagesRoot(project: ProjectInfo): string {
  if (isDirectory(path.join(project.root, "src/pages"))) return "src/pages";
  return "pages";
}

function demoStep(project: ProjectInfo): PlanStep {
  const step = demoStepWrite(project);
  // The page belongs to the project: a second run never overwrites it.
  step.keepExisting = true;
  return step;
}

// Nuxt only renders a pages/ folder through <NuxtPage />. The minimal template
// ships <NuxtWelcome />. Replace that marker (or create the shell when missing)
// and leave any custom app shell alone, so the example route really answers.
function nuxtShellStep(project: ProjectInfo): PlanStep | null {
  if (project.framework !== "nuxt") return null;
  const root = isDirectory(path.join(project.root, "app")) ? "app" : "";
  const prefix = root ? "app/" : "";
  const appFile = path.join(project.root, prefix, "app.vue");
  const source = readText(appFile);
  if (source === null) {
    return writeStep(
      "nuxt-shell",
      "Route the pages",
      [{ path: `${prefix}app.vue`, content: "<template>\n  <NuxtPage />\n</template>\n" }],
      "app.vue now renders <NuxtPage />.",
    );
  }
  if (/<NuxtPage\b/.test(source) || !/<NuxtWelcome\b[^>]*\/>/.test(source)) return null;
  return writeStep(
    "nuxt-shell",
    "Route the pages",
    [
      {
        path: `${prefix}app.vue`,
        content: source.replace(/<NuxtWelcome\b[^>]*\/>/, "<NuxtPage />"),
      },
    ],
    "app.vue now renders <NuxtPage />.",
  );
}

function demoStepWrite(project: ProjectInfo): PlanStep {
  const runtime = project.runtime;
  const base = registryBase(runtime);

  if (project.framework === "next-app") {
    const dir = project.typescript ? "tsx" : "jsx";
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: `${appRoot(project)}/prequelui-demo/page.${dir}`,
          content: reactDemo({
            button: "@/components/prequelui/button",
            gradient: "@/components/prequelui/gradient-text",
            typing: "@/components/prequelui/typing-text",
          })
            .replace(/^\/\/ @ts-nocheck[^\n]*\n/, (line) => `${line}"use client";\n\n`)
            .replace("export function PrequelDemo", "export default function PrequelDemo"),
        },
      ],
      "A route rendered by the framework.",
    );
  }
  if (project.framework === "next-pages") {
    const dir = project.typescript ? "tsx" : "jsx";
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: `${pagesRoot(project)}/prequelui-demo.${dir}`,
          content: reactDemo({
            button: "@/components/prequelui/button",
            gradient: "@/components/prequelui/gradient-text",
            typing: "@/components/prequelui/typing-text",
          })
            .replace(/^\/\/ @ts-nocheck[^\n]*\n/, (line) => `${line}"use client";\n\n`)
            .replace("export function PrequelDemo", "export default function PrequelDemo"),
        },
      ],
      "A pages route.",
    );
  }
  if (project.framework === "vite-react") {
    const ext = project.typescript ? "tsx" : "jsx";
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: `src/prequelui-demo.${ext}`,
          content: `${reactDemo({
            button: "@/components/prequelui/button",
            gradient: "@/components/prequelui/gradient-text",
            typing: "@/components/prequelui/typing-text",
          })}
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrequelDemo />
  </StrictMode>,
);
`,
        },
        {
          path: "prequelui-demo.html",
          content: viteHtml(`/src/prequelui-demo.${ext}`, "PrequelUI Animate"),
        },
      ],
      "A second Vite entry, next to your app.",
    );
  }
  if (project.framework === "nuxt") {
    const root = isDirectory(path.join(project.root, "app")) ? "app" : "";
    const prefix = root ? "app/" : "";
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: `${prefix}pages/prequelui-demo.vue`,
          content: vueDemo({
            button: "@/components/prequelui/Button.vue",
            gradient: "@/components/prequelui/GradientText.vue",
            typing: "@/components/prequelui/TypingText.vue",
          }).replace("<main ", '<ClientOnly><main ').replace("</main>", "</main></ClientOnly>"),
        },
      ],
      "A Nuxt route.",
    );
  }
  if (project.framework === "vite-vue") {
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: "src/PrequelDemo.vue",
          content: vueDemo({
            button: "@/components/prequelui/Button.vue",
            gradient: "@/components/prequelui/GradientText.vue",
            typing: "@/components/prequelui/TypingText.vue",
          }),
        },
        { path: "src/prequelui-demo.ts", content: vueEntry() },
        {
          path: "prequelui-demo.html",
          content: viteHtml("/src/prequelui-demo.ts", "PrequelUI Animate"),
        },
      ],
      "A second Vite entry, next to your app.",
    );
  }
  if (project.framework === "sveltekit") {
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: "src/routes/prequelui-demo/+page.svelte",
          content: svelteDemo({
            button: "#lib/components/prequelui/Button.svelte",
            gradient: "#lib/components/prequelui/GradientText.svelte",
            typing: "#lib/components/prequelui/TypingText.svelte",
          }),
        },
      ],
      "A SvelteKit route.",
    );
  }
  if (project.framework === "vite-svelte") {
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: "src/PrequelDemo.svelte",
          content: svelteDemo({
            button: "#lib/components/prequelui/Button.svelte",
            gradient: "#lib/components/prequelui/GradientText.svelte",
            typing: "#lib/components/prequelui/TypingText.svelte",
          }),
        },
        { path: "src/prequelui-demo.ts", content: svelteEntry() },
        {
          path: "prequelui-demo.html",
          content: viteHtml("/src/prequelui-demo.ts", "PrequelUI Animate"),
        },
      ],
      "A second Vite entry, next to your app.",
    );
  }
  if (project.framework === "solid-start") {
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: "src/routes/prequelui-demo.tsx",
          content: solidDemo({
            button: "~/components/prequelui/button",
            gradient: "~/components/prequelui/gradient-text",
            typing: "~/components/prequelui/typing-text",
          }),
        },
      ],
      "A SolidStart route.",
    );
  }
  if (project.framework === "vite-solid") {
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: "src/PrequelDemo.tsx",
          content: solidDemo({
            button: "~/components/prequelui/button",
            gradient: "~/components/prequelui/gradient-text",
            typing: "~/components/prequelui/typing-text",
          }),
        },
        {
          path: "src/prequelui-demo.tsx",
          content: solidEntry("./PrequelDemo"),
        },
        {
          path: "prequelui-demo.html",
          content: viteHtml("/src/prequelui-demo.tsx", "PrequelUI Animate"),
        },
      ],
      "A second Vite entry, next to your app.",
    );
  }
  if (project.framework === "astro") {
    // The page lives in src/pages and must load the project's Tailwind theme,
    // usually src/styles/global.css (imported by the shared layout).
    const css = ["src/styles/global.css", "src/styles/globals.css", "src/app.css", "src/index.css"].find(
      (file) => exists(path.join(project.root, file)),
    );
    return writeStep(
      "demo",
      "Create the example page",
      [
        {
          path: "src/pages/prequelui-demo.astro",
          content: astroDemo(
            {
              button: "@/components/prequelui/button",
              gradient: "@/components/prequelui/gradient-text",
              typing: "@/components/prequelui/typing-text",
            },
            css ? `../${css.replace(/^src\//, "")}` : null,
          ),
        },
      ],
      "An Astro page with the React island hydrated.",
    );
  }
  return writeStep(
    "demo",
    "Create the example page",
    [{ path: "prequelui-demo.html", content: vanillaHtml("prequelui/dialog/dialog.js") }],
    "A standalone HTML page.",
  );
}

function exampleInfo(project: ProjectInfo): Plan["example"] {
  const pm = project.packageManager;
  const dev = command(runArgs(pm, "dev"));
  switch (project.framework) {
    case "next-app":
    case "next-pages":
      return { path: `${project.framework === "next-app" ? appRoot(project) : pagesRoot(project)}/prequelui-demo`, url: "http://localhost:3000/prequelui-demo", devCommand: dev };
    case "nuxt":
      return { path: "pages/prequelui-demo.vue", url: "http://localhost:3000/prequelui-demo", devCommand: dev };
    case "vite-react":
      return { path: "src/prequelui-demo.tsx", url: "http://localhost:5173/prequelui-demo.html", devCommand: dev };
    case "vite-vue":
      return { path: "src/PrequelDemo.vue", url: "http://localhost:5173/prequelui-demo.html", devCommand: dev };
    case "sveltekit":
      return { path: "src/routes/prequelui-demo/+page.svelte", url: "http://localhost:5173/prequelui-demo", devCommand: dev };
    case "vite-svelte":
      return { path: "src/PrequelDemo.svelte", url: "http://localhost:5173/prequelui-demo.html", devCommand: dev };
    case "solid-start":
      return { path: "src/routes/prequelui-demo.tsx", url: "http://localhost:3000/prequelui-demo", devCommand: dev };
    case "vite-solid":
      return { path: "src/PrequelDemo.tsx", url: "http://localhost:5173/prequelui-demo.html", devCommand: dev };
    case "astro":
      return { path: "src/pages/prequelui-demo.astro", url: "http://localhost:4321/prequelui-demo", devCommand: dev };
    default:
      return {
        path: "prequelui-demo.html",
        url: "http://localhost:3000/prequelui-demo.html",
        devCommand: "npx --yes serve@latest .",
      };
  }
}

function demoAlreadyWritten(project: ProjectInfo, step: PlanStep): boolean {
  const files = step.files ?? [];
  return files.length > 0 && files.every((file) => exists(path.resolve(project.root, file.path)));
}

function planHtml(project: ProjectInfo): Plan {
  const steps: PlanStep[] = [];
  const dialogPath = path.join(project.root, "prequelui/dialog/dialog.js");
  if (!exists(dialogPath)) {
    steps.push({
      id: "dialog",
      kind: "install",
      title: "Copy the framework-free dialog",
      args: [
        "curl",
        "-fsSL",
        "--create-dirs",
        `${REGISTRY_URL}/vanilla/dialog/dialog.js`,
        "-o",
        "prequelui/dialog/dialog.js",
      ],
      command: `curl -fsSL --create-dirs ${REGISTRY_URL}/vanilla/dialog/dialog.js -o prequelui/dialog/dialog.js`,
    });
  }
  const demo = demoStep(project);
  if (!demoAlreadyWritten(project, demo)) steps.push(demo);
  steps.push({
    id: "verify",
    kind: "verify",
    title: "Check the files",
    display: "check prequelui/dialog/dialog.js and prequelui-demo.html",
  });
  return {
    project,
    summary: exists(dialogPath)
      ? "The dialog and the example page are already there; nothing to copy."
      : "One framework-free dialog, one page, no build step.",
    steps,
    example: exampleInfo(project),
  };
}

function planGuided(project: ProjectInfo, message: string): Plan {
  return {
    project,
    summary: "Guided mode",
    steps: [],
    example: exampleInfo(project),
    guided: message,
  };
}

function ensureTailwindAndAlias(
  project: ProjectInfo,
  steps: PlanStep[],
  writes: PlanFile[],
): void {
  const { framework, root, packageManager } = project;
  const viteConfigs = ["vite.config.ts", "vite.config.js", "vite.config.mjs"];

  if (framework === "next-app" || framework === "next-pages") {
    if (project.tailwind === null) {
      steps.push(
        installStep("tailwind-deps", "Install Tailwind CSS v4", packageManager, [
          "tailwindcss",
          "@tailwindcss/postcss",
          "postcss",
        ]),
      );
      if (!exists(path.join(root, "postcss.config.mjs")) && !exists(path.join(root, "postcss.config.js"))) {
        writes.push({ path: "postcss.config.mjs", content: POSTCSS_V4 });
      }
      const globals =
        project.framework === "next-app" && exists(path.join(root, "src/app/globals.css"))
          ? "src/app/globals.css"
          : exists(path.join(root, "app/globals.css"))
            ? "app/globals.css"
            : exists(path.join(root, "src/app/globals.css"))
              ? "src/app/globals.css"
              : null;
      if (!globals) {
        throw new PlanError(
          "Next.js found without app/globals.css.",
          "Create app/globals.css with @import \"tailwindcss\"; then run the CLI again.",
        );
      }
      writes.push(appendCss(globals, ""));
      steps.push(writeStep("tailwind-css", "Load Tailwind in the app", [appendCss(globals, "")]));
    }
    return;
  }

  if (framework === "vite-react" || framework === "vite-vue") {
    const needsTailwind = project.tailwind === null;
    const configName = findViteConfig(root, viteConfigs);
    const configText = configName ? readText(path.join(root, configName)) : null;
    const needsAlias = !/\balias\s*:/.test(configText ?? "");
    if (needsTailwind) {
      steps.push(
        installStep("tailwind-deps", "Install Tailwind CSS v4", packageManager, [
          "tailwindcss",
          "@tailwindcss/vite",
          ...(framework === "vite-vue" ? ["@types/node"] : []),
        ]),
      );
      if (framework === "vite-vue" && !exists(path.join(root, "src/shims-vue.d.ts"))) {
        writes.push({
          path: "src/shims-vue.d.ts",
          content:
            'declare module "*.vue" {\n  import type { DefineComponent } from "vue";\n  const component: DefineComponent<{}, {}, any>;\n  export default component;\n}\n',
        });
      }
    }
    let nextConfig = configText ?? "";
    if (needsTailwind || needsAlias) {
      if (configText === null) {
        nextConfig = framework === "vite-react" ? VITE_REACT_CONFIG : VITE_VUE_CONFIG;
      } else {
        nextConfig = patchViteConfig(configText, {
          tailwind: needsTailwind,
          alias: needsAlias,
        });
      }
      if (nextConfig !== configText) {
        writes.push({ path: configName ?? "vite.config.ts", content: nextConfig });
      }
      if (needsAlias) writes.push(...writeTsconfigPaths(project));
    }
    if (needsTailwind) {
      const css = framework === "vite-react" ? "src/index.css" : "src/style.css";
      writes.push(appendCss(path.join(root, css), ""));
    }
    return;
  }

  if (framework === "nuxt") {
    const configName = findViteConfig(root, ["nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs"]);
    const configText = configName ? readText(path.join(root, configName)) : null;
    const needsTailwind = project.tailwind === null;
    const needsAlias = !/alias\s*:/.test(configText ?? "");
    if (needsTailwind) {
      steps.push(
        installStep("tailwind-deps", "Install Tailwind CSS v4", packageManager, [
          "tailwindcss",
          "@tailwindcss/vite",
        ]),
      );
      writes.push({ path: "app/assets/css/main.css", content: NUXT_CSS });
    }
    if (needsTailwind || needsAlias) {
      const simpleNuxt =
        configText === null ||
        !/\b(modules|routeRules|nitro|runtimeConfig|app|plugins|extends|css|vite|alias)\s*:/.test(
          configText,
        );
      if (!simpleNuxt) {
        throw new PlanError(
          "The Nuxt config already organises modules, CSS or Vite options.",
          "Add the @ alias, the css file and the Tailwind Vite plugin as shown in /docs/installation/nuxt.",
        );
      }
      writes.push({ path: configName ?? "nuxt.config.ts", content: NUXT_CONFIG });
    }
    return;
  }

  if (framework === "sveltekit") {
    if (project.tailwind === null) {
      steps.push({
        id: "tailwind-sv",
        kind: "config",
        title: "Add Tailwind CSS with the Svelte CLI",
        args: dlxArgs(packageManager, "sv@latest", [
          "add",
          'tailwindcss=plugins:none',
          "--install",
          packageManager,
          "--no-git-check",
        ]),
        command: command(
          dlxArgs(packageManager, "sv@latest", [
            "add",
            'tailwindcss=plugins:none',
            "--install",
            packageManager,
            "--no-git-check",
          ]),
        ),
      });
      if (!exists(path.join(root, "src/routes/layout.css"))) {
        writes.push({
          path: "src/routes/layout.css",
          content: '@import "tailwindcss";\n',
        });
      }
    }
    return;
  }

  if (framework === "vite-svelte") {
    const needsTailwind = project.tailwind === null;
    if (needsTailwind) {
      steps.push(
        installStep("tailwind-deps", "Install Tailwind CSS v4", packageManager, [
          "tailwindcss",
          "@tailwindcss/vite",
        ]),
      );
      writes.push({ path: "src/app.css", content: '@import "tailwindcss";\n' });
    }
    writes.push(...writeSvelteLib(project));
    const configName = findViteConfig(root, viteConfigs);
    const configText = configName ? readText(path.join(root, configName)) : null;
    if (needsTailwind && configText !== null && !configText.includes("tailwindcss")) {
      writes.push({
        path: configName!,
        content: patchViteConfig(configText, { tailwind: true, alias: false }),
      });
    } else if (needsTailwind && configText === null) {
      writes.push({ path: "vite.config.ts", content: VITE_SVELTE_CONFIG });
    }
    return;
  }

  if (framework === "solid-start" || framework === "vite-solid") {
    const needsTailwind = project.tailwind === null;
    if (needsTailwind) {
      steps.push(
        installStep("tailwind-deps", "Install Tailwind CSS v4", packageManager, [
          "tailwindcss",
          "@tailwindcss/vite",
          ...(framework === "vite-solid" ? ["@types/node"] : []),
        ]),
      );
    }
    if (framework === "solid-start") {
      const configName = findViteConfig(root, viteConfigs);
      const configText = configName ? readText(path.join(root, configName)) : null;
      if (configText !== null && !/solidStart\(\)/.test(configText)) {
        throw new PlanError(
          "The SolidStart Vite config is not the shape this CLI can extend.",
          "Add the Tailwind Vite plugin as shown in /docs/installation/solid-start.",
        );
      }
      if (needsTailwind || configText === null) {
        writes.push({ path: configName ?? "vite.config.ts", content: SOLID_START_CONFIG });
      }
      if (!project.shadcn) {
        writes.push({ path: "src/app.css", content: SOLID_CSS });
        writes.push({
          path: "components.json",
          content: SOLID_COMPONENTS_JSON("src/app.css"),
        });
      }
    } else {
      const configName = findViteConfig(root, viteConfigs);
      const configText = configName ? readText(path.join(root, configName)) : null;
      // The Solid template has used both `solid()` and `solid({ ... })` over
      // time, and newer scaffolds may import the plugin under another name.
      // Accept any config that references the plugin itself, then replace the
      // untouched template with the known-good one.
      if (
        configText !== null &&
        !/solid\s*\(/.test(configText) &&
        !/vite-plugin-solid/.test(configText)
      ) {
        throw new PlanError(
          "The Vite + Solid config is not the shape this CLI can extend.",
          "Add the Tailwind plugin and the ~ alias as shown in /docs/installation/vite-solid.",
        );
      }
      if (needsTailwind || !/alias\s*:/.test(configText ?? "")) {
        writes.push({ path: configName ?? "vite.config.ts", content: VITE_SOLID_CONFIG });
      }
      if (!project.shadcn) {
        writes.push({ path: "src/index.css", content: SOLID_CSS });
        writes.push({
          path: "components.json",
          content: SOLID_COMPONENTS_JSON("src/index.css"),
        });
      }
    }
    return;
  }

  if (framework === "astro") {
    if (project.tailwind === null) {
      throw new PlanError(
        "Astro is missing Tailwind CSS v4.",
        "Create the project with the with-tailwindcss template, or run `npx astro add tailwind` then run this command again.",
      );
    }
    if (!project.typescript) {
      throw new PlanError(
        "Astro needs TypeScript for the registry items.",
        "Run `npx astro add react` and use the TypeScript template, then try again.",
      );
    }
    writes.push(...writeTsconfigPaths(project));
    return;
  }
}

export function buildPlan(project: ProjectInfo): Plan {
  if (project.framework === "unknown") {
    return planGuided(
      project,
      "No supported framework was detected. Pick one with --framework, or follow /docs/installation in the browser.",
    );
  }
  if (project.framework === "laravel") {
    return planGuided(
      project,
      "Laravel projects mix PHP, Inertia and Vite. The proven steps are in /docs/installation/laravel: install motion and lucide-react, then run the shadcn add command against the React registry.",
    );
  }
  if (project.framework === "html") return planHtml(project);

  const steps: PlanStep[] = [];
  const writes: PlanFile[] = [];

  ensureTailwindAndAlias(project, steps, writes);

  const cli = shadcnCli(project.runtime);
  const componentsReady = demoComponentsPresent(project);
  if (!project.shadcn) {
    const init = shadcnInitArgs(project);
    if (init) {
      const args = dlxArgs(project.packageManager, cli, init);
      steps.push({
        id: "init",
        kind: "init",
        title: "Initialise the registry configuration",
        args,
        command: command(args),
        detail: "Writes components.json, the theme variables and the utils file.",
      });
    }
  }

  const missingDependencies = missingRuntimeDependencies(project);
  if (missingDependencies.length) {
    steps.push(
      installStep(
        "runtime",
        "Install the runtime dependencies",
        project.packageManager,
        missingDependencies,
      ),
    );
  }

  if (!componentsReady) {
    const add = addArgs(project, cli);
    steps.push({
      id: "add",
      kind: "add",
      title: "Add the first components",
      args: add,
      command: command(add),
      env: project.runtime === "svelte" ? { HOME: project.root } : undefined,
      detail: "Writes button, gradient-text, typing-text, the shared motion helpers and their targets.",
    });
  }

  if (writes.length) {
    let insertAt = 0;
    for (let index = 0; index < steps.length; index += 1) {
      if (steps[index]!.kind === "config") insertAt = index + 1;
    }
    steps.splice(insertAt, 0, writeStep("prepare", "Prepare the framework", writes));
  }

  steps.push({
    id: "build",
    kind: "build",
    title: "Verify the build",
    args: runArgs(project.packageManager, "build"),
    command: command(runArgs(project.packageManager, "build")),
    detail: "A failed build is reported without deleting anything.",
  });

  const demo = demoStep(project);
  const demoWritten = demoAlreadyWritten(project, demo);
  if (!demoWritten) {
    const at = steps.length - 1;
    steps.splice(at, 0, demo);
  }

  const shell = nuxtShellStep(project);
  if (shell) steps.splice(steps.length - 1, 0, shell);

  const summary = componentsReady
    ? `${project.frameworkLabel}: starter components already installed${demoWritten ? ", example page kept" : ", one example page"}, one build.`
    : `${project.frameworkLabel}: ${project.shadcn ? "registry already configured" : "registry configuration"}, ${DEMO_COMPONENTS.join(" + ")}, one example page, one build.`;

  return { project, summary, steps, example: exampleInfo(project) };
}

export function makeDemoFiles(project: ProjectInfo, step: PlanStep): PlanFile[] {
  return step.files ?? [];
}

export function relativeFiles(project: ProjectInfo, files: PlanFile[]): PlanFile[] {
  return files.map((file) => ({ ...file, path: path.resolve(project.root, file.path) }));
}

export function applyWrites(
  project: ProjectInfo,
  files: PlanFile[],
  options: { keepExisting?: boolean } = {},
): void {
  for (const file of files) {
    const target = path.resolve(project.root, file.path);
    if (exists(target)) {
      if (options.keepExisting) continue;
      if (readText(target) === file.content) continue;
    }
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content);
  }
}
