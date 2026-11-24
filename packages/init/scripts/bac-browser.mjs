/* Open the generated example page of every proven target in the Playwright
 * container, check that it really renders, that the bot is alive, that the
 * console stays clean, and keep 1440/390 captures.
 *
 * Usage:
 *   node packages/init/scripts/bac-browser.mjs            all targets
 *   INIT_TARGET=vite-react node packages/init/scripts/bac-browser.mjs
 *
 * The targets were scaffolded and built by bac.mjs; this pass reuses those
 * folders, so no project is installed twice.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const BAC = process.env.BAC_BASE || "/home/claude2/bac";
const OUT = path.join(ROOT, "analyse/init/tests");
const LOGS = path.join(ROOT, "analyse/init/logs");
const SHOTS = path.join(ROOT, "web/captures/choix");

const TARGETS = {
  "next-app": { port: 3000, route: "/prequelui-demo", dev: "npm run dev -- --port 3000 --hostname 127.0.0.1" },
  "vite-react": { port: 5173, route: "/prequelui-demo.html", dev: "npm run dev -- --port 5173 --host 127.0.0.1" },
  nuxt: { port: 3000, route: "/prequelui-demo", dev: "npm run dev -- --port 3000 --host 127.0.0.1" },
  "vite-vue": { port: 5173, route: "/prequelui-demo.html", dev: "npm run dev -- --port 5173 --host 127.0.0.1" },
  sveltekit: { port: 5173, route: "/prequelui-demo", dev: "npm run dev -- --port 5173 --host 127.0.0.1" },
  "vite-svelte": { port: 5173, route: "/prequelui-demo.html", dev: "npm run dev -- --port 5173 --host 127.0.0.1" },
  "solid-start": { port: 3000, route: "/prequelui-demo", dev: "npm run dev -- --port 3000 --host 127.0.0.1" },
  "vite-solid": { port: 5173, route: "/prequelui-demo.html", dev: "npm run dev -- --port 5173 --host 127.0.0.1" },
  astro: { port: 4321, route: "/prequelui-demo", dev: "npm run dev -- --port 4321 --host 127.0.0.1" },
  html: { port: 3000, route: "/prequelui-demo.html", dev: "node /app/serve-page.cjs 3000" },
};

const BROWSER_CHECK = String.raw`
const fs = require("node:fs");
const { chromium } = require("playwright");

const url = process.env.CHECK_URL;
const errors = [];
const speak = (message) => process.stdout.write(message + "\n");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fileSnapshot = {};
for (const rel of [
  "app.vue",
  "app/app.vue",
  "nuxt.config.ts",
  "package.json",
  "app/pages/prequelui-demo.vue",
  "src/styles/global.css",
  "src/styles/globals.css",
  "src/layouts/Layout.astro",
  "src/layouts/main.astro",
]) {
  try {
    fileSnapshot[rel] = fs.readFileSync(rel, "utf8").slice(0, 2400);
  } catch {}
}

async function main() {
  const deadline = Date.now() + 120000;
  let reachable = false;
  let lastStatus = 0;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      lastStatus = response.status;
      if (response.ok) {
        reachable = true;
        break;
      }
    } catch {}
    await sleep(500);
  }
  if (!reachable) throw new Error("server never answered, last status " + lastStatus);

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const results = {};

  for (const viewport of [
    { name: "1440", width: 1440, height: 900 },
    { name: "390", width: 390, height: 844 },
  ]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: "light",
      locale: "en-US",
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const tag = viewport.name;
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(tag + ": " + message.text());
    });
    page.on("pageerror", (error) => errors.push(tag + ": " + error.message));

    const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 120000 });
    await page.waitForSelector("main h1", { state: "visible", timeout: 120000 });
    await page.waitForTimeout(1400);

    const info = await page.evaluate(() => {
      const mascot = document.querySelector(".prequel-mascot");
      const box = mascot ? mascot.getBoundingClientRect() : null;
      const heading = document.querySelector("main h1") ?? document.querySelector("h1");
      return {
        title: document.title,
        heading: heading?.textContent?.trim() ?? "",
        cards: document.querySelectorAll("article").length,
        buttons: Array.from(document.querySelectorAll("button"))
          .map((node) => (node.textContent ?? "").trim())
          .filter(Boolean),
        mascot: Boolean(mascot),
        mascotBox: box ? { width: Math.round(box.width), height: Math.round(box.height) } : null,
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        bodyText: (document.body.innerText ?? "").slice(0, 400),
      };
    });

    const shot = "/app/capture-" + tag + ".png";
    await page.screenshot({ path: shot, fullPage: true });
    results[tag] = { status: response ? response.status() : 0, shot, ...info };

    if (tag === "1440") {
      const mascot = page.locator(".prequel-mascot");
      const before = await mascot.getAttribute("data-mood");
      const box = await mascot.boundingBox();
      if (box) {
        await page.mouse.move(box.x - 90, box.y - 70);
        await page.waitForTimeout(360);
      }
      const look = await page.evaluate(() => {
        const root = document.querySelector(".prequel-mascot");
        return {
          x: root?.style.getPropertyValue("--look-x") ?? "",
          y: root?.style.getPropertyValue("--look-y") ?? "",
        };
      });
      await mascot.hover();
      await page.waitForTimeout(320);
      const hover = await mascot.getAttribute("data-mood");
      await page.mouse.move(4, 4);
      await page.waitForTimeout(220);
      await mascot.click();
      await page.waitForTimeout(240);
      const clicked = await mascot.getAttribute("data-mood");
      await page.waitForTimeout(1000);
      const after = await mascot.getAttribute("data-mood");
      results.interactions = { before, look, hover, clicked, after };
      speak("mascot " + JSON.stringify(results.interactions));
    }

    speak("viewport " + tag + " " + info.heading + " / cards " + info.cards + " / bot " + info.mascot);
    await context.close();
  }

  await browser.close();
  const result = {
    ok: errors.length === 0,
    url,
    results,
    consoleErrors: errors,
    files: fileSnapshot,
  };
  fs.writeFileSync("/app/browser-result.json", JSON.stringify(result, null, 2) + "\n");
  speak(JSON.stringify(result, null, 2));
  process.exit(errors.length === 0 ? 0 : 1);
}

main().catch((error) => {
  const result = {
    ok: false,
    url,
    results: {},
    consoleErrors: [String(error && error.message ? error.message : error)],
    files: fileSnapshot,
  };
  fs.writeFileSync("/app/browser-result.json", JSON.stringify(result, null, 2) + "\n");
  speak(JSON.stringify(result, null, 2));
  process.exit(1);
});
`;

const STATIC_SERVER = String.raw`
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = "/app/my-app";
const port = Number(process.argv[2] || 3000);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
};
http
  .createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    const rel = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const file = path.join(root, rel);
    if (!file.startsWith(root)) {
      response.writeHead(403).end();
      return;
    }
    try {
      const body = fs.readFileSync(file);
      response.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" });
      response.end(body);
    } catch {
      response.writeHead(404, { "content-type": "text/plain" });
      response.end("not found");
    }
  })
  .listen(port, "127.0.0.1", () => console.log("static server ready"));
`;

const only = process.env.INIT_TARGET;
const ids = only ? [only] : Object.keys(TARGETS);
for (const id of ids) {
  if (!TARGETS[id]) {
    process.stderr.write(`Unknown INIT_TARGET ${id}. Use ${Object.keys(TARGETS).join(", ")}\n`);
    process.exit(1);
  }
}

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(LOGS, { recursive: true });
fs.mkdirSync(SHOTS, { recursive: true });

const summary = { generatedAt: new Date().toISOString(), runner: "bac-test pw", targets: [] };

for (const id of ids) {
  const spec = TARGETS[id];
  const folder = `prequelui-init-${id}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const hostDir = path.join(BAC, folder, "my-app");
  const row = {
    target: id,
    folder,
    hostDir,
    url: `http://127.0.0.1:${spec.port}${spec.route}`,
    status: "fail",
    startedAt: new Date().toISOString(),
  };

  if (!fs.existsSync(hostDir)) {
    row.reason = "missing project, run bac.mjs first";
    summary.targets.push(row);
    continue;
  }

  fs.writeFileSync(path.join(BAC, folder, "browser-check.cjs"), BROWSER_CHECK);
  fs.writeFileSync(path.join(BAC, folder, "serve-page.cjs"), STATIC_SERVER);

  const script = `#!/bin/bash
set -u
export HOME=/app/my-app
export CI=1
export NO_COLOR=1
export NEXT_TELEMETRY_DISABLED=1
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
if [ ! -d /app/pw/node_modules/playwright ]; then
  echo "=== install playwright ==="
  mkdir -p /app/pw
  cd /app/pw
  npm init -y > /dev/null 2>&1
  npm install playwright@1.64.1 --no-audit --no-fund --loglevel=error || exit 20
fi
cd /app/my-app
echo "=== start ${id} ==="
${spec.dev} > /app/dev-browser.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
echo "=== browser ==="
NODE_PATH=/app/pw/node_modules CHECK_URL="http://127.0.0.1:${spec.port}${spec.route}" node /app/browser-check.cjs
CODE=$?
echo "=== server log tail ==="
tail -n 40 /app/dev-browser.log || true
exit $CODE
`;
  const scriptPath = path.join(BAC, folder, "browser.sh");
  fs.writeFileSync(scriptPath, script, { mode: 0o755 });

  const started = Date.now();
  const run = spawnSync(
    "sudo",
    ["-n", "/usr/local/bin/bac-test", "pw", folder, "bash /app/browser.sh"],
    { encoding: "utf8", timeout: 900_000, maxBuffer: 32 * 1024 * 1024 },
  );
  const log = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  const logFile = path.join(LOGS, `${folder}-browser.log`);
  fs.writeFileSync(logFile, log);
  row.durationMs = Date.now() - started;
  row.exitCode = run.status;
  row.signal = run.signal;
  row.log = path.relative(ROOT, logFile);

  const resultFile = path.join(BAC, folder, "browser-result.json");
  if (fs.existsSync(resultFile)) {
    try {
      row.check = JSON.parse(fs.readFileSync(resultFile, "utf8"));
    } catch (error) {
      row.reason = `unreadable browser result: ${error.message}`;
    }
  } else {
    row.reason = "no browser result";
  }
  for (const width of ["1440", "390"]) {
    const source = path.join(BAC, folder, `capture-${width}.png`);
    if (fs.existsSync(source)) {
      const target = path.join(SHOTS, `init-bac-${id}-${width}.png`);
      fs.copyFileSync(source, target);
      row[`capture${width}`] = path.relative(ROOT, target);
    }
  }
  const serverLog = path.join(BAC, folder, "dev-browser.log");
  if (fs.existsSync(serverLog)) {
    const target = path.join(LOGS, `${folder}-dev.log`);
    fs.copyFileSync(serverLog, target);
    row.devLog = path.relative(ROOT, target);
  }

  const check = row.check;
  const views = check?.results ?? {};
  // The plain HTML target intentionally ships the framework-free dialog only.
  const expectsCards = id !== "html";
  const clean =
    check?.ok === true &&
    check.consoleErrors?.length === 0 &&
    ["1440", "390"].every((width) => {
      const view = views[width];
      if (!view || view.status !== 200 || view.mascot !== true || view.horizontalOverflow) return false;
      if (!view.heading.includes("Your first animated page")) return false;
      return expectsCards
        ? view.cards >= 3 && view.buttons.includes("Press me")
        : view.buttons.includes("Open the dialog");
    });
  row.status = run.status === 0 && clean ? "pass" : "fail";
  row.finishedAt = new Date().toISOString();
  if (row.status === "fail" && !row.reason) {
    row.reason = "browser assertions failed";
    row.tail = log.slice(-2400);
  }
  summary.targets.push(row);
  process.stdout.write(`${id}: ${row.status} (${Math.round(row.durationMs / 1000)} s)\n`);
}

summary.summary = {
  total: summary.targets.length,
  passed: summary.targets.filter((row) => row.status === "pass").length,
  failed: summary.targets.filter((row) => row.status !== "pass").length,
};
fs.writeFileSync(path.join(OUT, "synthese.json"), `${JSON.stringify(summary, null, 2)}\n`);
for (const row of summary.targets) {
  fs.writeFileSync(path.join(OUT, `${row.target}.json`), `${JSON.stringify(row, null, 2)}\n`);
}
process.stdout.write(`${JSON.stringify(summary.summary)}\n`);
process.exitCode = summary.summary.failed ? 1 : 0;
