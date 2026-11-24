import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { reactDemo } from "../dist/templates.js";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/claude2/travail/saas/_modele/node_modules/playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const PROJECT =
  process.env.DEMO_PROJECT || "/home/claude2/bac/prequelui-init-vite-react/my-app";
const OUT = path.resolve(ROOT, process.env.CAPTURE_DIR || "web/captures/choix");
const PREFIX = process.env.CAPTURE_PREFIX || "init-demo";
const REPORT = path.join(
  ROOT,
  process.env.CAPTURE_REPORT || "analyse/init/demo-captures.json",
);
const PORT = 4199;
const VITE = path.join(PROJECT, "node_modules/.bin/vite");
const REFRESH = process.argv.includes("--refresh-template");

if (!fs.existsSync(path.join(PROJECT, "prequelui-demo.html"))) {
  console.error(`No demo page at ${PROJECT}/prequelui-demo.html`);
  process.exit(1);
}

if (REFRESH) {
  const page = `${reactDemo({
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
`;
  fs.writeFileSync(path.join(PROJECT, "src/prequelui-demo.tsx"), page);
}

function reachable() {
  return new Promise((resolve) => {
    const request = http.get(`http://127.0.0.1:${PORT}/prequelui-demo.html`, (response) => {
      response.resume();
      resolve(response.statusCode === 200);
    });
    request.on("error", () => resolve(false));
    request.setTimeout(800, () => {
      request.destroy();
      resolve(false);
    });
  });
}

const server = spawn(VITE, ["--port", String(PORT), "--strictPort", "--host", "127.0.0.1"], {
  cwd: PROJECT,
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, BROWSER: "none", NO_COLOR: "1" },
});

let serverLog = "";
server.stdout?.on("data", (chunk) => {
  serverLog += chunk.toString();
});
server.stderr?.on("data", (chunk) => {
  serverLog += chunk.toString();
});

const stop = () => {
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    try {
      server.kill("SIGTERM");
    } catch {}
  }
};

const deadline = Date.now() + 45_000;
while (Date.now() < deadline && !(await reachable())) {
  await new Promise((resolve) => setTimeout(resolve, 300));
}
if (!(await reachable())) {
  stop();
  console.error("The demo server did not start.\n", serverLog.slice(-3000));
  process.exit(1);
}

fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const shots = [];
const errors = [];
const probes = {};
const viewports = [
  { name: "1440", width: 1440, height: 900 },
  { name: "1280", width: 1280, height: 720 },
  { name: "390", width: 390, height: 844 },
];
const schemes = ["light", "dark"];

function openContext(viewport, scheme, extra = {}) {
  return browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    colorScheme: scheme,
    locale: "en-US",
    deviceScaleFactor: 1,
    ...extra,
  });
}

function watch(page, label) {
  page.on("pageerror", (error) => errors.push(`${label}: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`${label}: ${message.text()}`);
  });
}

try {
  for (const viewport of viewports) {
    for (const scheme of schemes) {
      const label = `${viewport.name}-${scheme}`;
      const context = await openContext(viewport, scheme);
      const page = await context.newPage();
      watch(page, label);
      await page.goto(`http://127.0.0.1:${PORT}/prequelui-demo.html`, {
        waitUntil: "networkidle",
        timeout: 60_000,
      });
      if (scheme === "dark") {
        await page.evaluate(() => document.documentElement.classList.add("dark"));
      }
      // The greeting bubble hides after 5.2 s. Waiting for the resting face
      // keeps the capture about the page and the code, not the first hello.
      await page.waitForTimeout(5600);
      const file = path.join(OUT, `${PREFIX}-${viewport.name}-${scheme}.png`);
      await page.screenshot({ path: file, fullPage: true });
      shots.push({ viewport: viewport.name, scheme, file: path.relative(ROOT, file) });

      if (viewport.name === "1440" && scheme === "light") {
        const mascot = page.locator(".prequel-mascot");
        const lookShot = path.join(OUT, `${PREFIX}-look-1440-light.png`);
        const happyShot = path.join(OUT, `${PREFIX}-happy-1440-light.png`);
        const thinkShot = path.join(OUT, `${PREFIX}-thinking-1440-light.png`);
        const worriedShot = path.join(OUT, `${PREFIX}-worried-1440-light.png`);
        const box = await mascot.boundingBox();
        const initial = await mascot.getAttribute("data-mood");
        if (box) {
          await page.mouse.move(box.x - 90, box.y - 70);
          await page.waitForTimeout(320);
        }
        const look = await page.evaluate(() => {
          const root = document.querySelector(".prequel-mascot");
          const disc = root?.querySelector(".prequel-mascot__disc");
          return {
            x: root?.style.getPropertyValue("--look-x") ?? "",
            y: root?.style.getPropertyValue("--look-y") ?? "",
            scale: disc ? getComputedStyle(disc).transform : "",
          };
        });
        await mascot.screenshot({ path: lookShot });
        shots.push({ viewport: viewport.name, scheme, state: "look", file: path.relative(ROOT, lookShot) });

        await mascot.hover();
        await page.waitForTimeout(320);
        const hover = await mascot.getAttribute("data-mood");
        await mascot.screenshot({ path: happyShot });
        shots.push({ viewport: viewport.name, scheme, state: "happy", file: path.relative(ROOT, happyShot) });

        await page.mouse.move(4, 4);
        await page.waitForTimeout(220);
        await mascot.click();
        await page.waitForTimeout(240);
        const clicked = await mascot.getAttribute("data-mood");
        const dots = await page.evaluate(() => {
          const dot = document.querySelector(".prequel-mascot__dot");
          return dot ? Number(getComputedStyle(dot).opacity) : 0;
        });
        await mascot.screenshot({ path: thinkShot });
        shots.push({ viewport: viewport.name, scheme, state: "thinking", file: path.relative(ROOT, thinkShot) });

        await page.waitForTimeout(1000);
        const afterClick = await mascot.getAttribute("data-mood");
        await page.evaluate(() => window.dispatchEvent(new Event("error")));
        await page.waitForTimeout(160);
        const worried = await mascot.getAttribute("data-mood");
        await mascot.screenshot({ path: worriedShot });
        shots.push({ viewport: viewport.name, scheme, state: "worried", file: path.relative(ROOT, worriedShot) });
        probes.desktop = {
          initial,
          look,
          hover,
          clicked,
          thinkingDotsOpacity: dots,
          afterClick,
          worried,
        };
        probes.code = await page.evaluate(() => {
          const code = document.querySelector(".prequel-code code");
          const pre = document.querySelector(".prequel-code__pre");
          const copy = document.querySelector("[data-prequel-copy]");
          if (!code || !pre) return null;
          const text = code.textContent ?? "";
          return {
            text,
            lines: text.split("\n").length,
            firstLine: text.split("\n")[0],
            codeHeight: code.getBoundingClientRect().height,
            preHeight: pre.getBoundingClientRect().height,
            scrollWidth: pre.scrollWidth,
            clientWidth: pre.clientWidth,
            codeWhiteSpace: getComputedStyle(code).whiteSpace,
            codeDisplay: getComputedStyle(code).display,
            copy: copy?.textContent ?? null,
          };
        });
        await context.grantPermissions(["clipboard-read", "clipboard-write"], {
          origin: `http://127.0.0.1:${PORT}`,
        });
        const copyButton = page.locator("[data-prequel-copy]").first();
        await copyButton.click();
        await page.waitForTimeout(140);
        const copied = await page.evaluate(() => navigator.clipboard.readText());
        probes.copy = {
          clicked: await copyButton.textContent(),
          matchesCode: copied === probes.code?.text,
          lines: copied.split("\n").length,
          firstLine: copied.split("\n")[0],
        };
      }
      await context.close();
    }
  }

  const calmViewport = viewports[0];
  const calmContext = await openContext(calmViewport, "light", { reducedMotion: "reduce" });
  const calm = await calmContext.newPage();
  watch(calm, "reduced");
  await calm.goto(`http://127.0.0.1:${PORT}/prequelui-demo.html`, {
    waitUntil: "networkidle",
    timeout: 60_000,
  });
  await calm.waitForTimeout(900);
  const calmBefore = await calm.locator(".prequel-mascot").getAttribute("data-mood");
  await calm.locator(".prequel-mascot").hover();
  await calm.waitForTimeout(260);
  const calmAfter = await calm.locator(".prequel-mascot").getAttribute("data-mood");
  const calmShot = path.join(OUT, `${PREFIX}-reduced-1440-light.png`);
  await calm.locator(".prequel-mascot").screenshot({ path: calmShot });
  shots.push({ viewport: "1440", scheme: "light", state: "reduced", file: path.relative(ROOT, calmShot) });
  probes.reduced = { before: calmBefore, after: calmAfter };
  await calmContext.close();
} finally {
  await browser.close();
  stop();
}

const report = {
  generatedAt: new Date().toISOString(),
  project: PROJECT,
  refreshed: REFRESH,
  prefix: PREFIX,
  dir: path.relative(ROOT, OUT),
  shots,
  probes,
  consoleErrors: errors,
};
fs.writeFileSync(REPORT, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exitCode = errors.length === 0 ? 0 : 1;
