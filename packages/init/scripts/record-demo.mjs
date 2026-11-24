import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const CLI = path.join(ROOT, "packages/init/dist/cli.js");
const WORK = process.env.INIT_DEMO_WORK || "/tmp/prequelui-init-demo";
const APP = path.join(WORK, "app");
const SOURCE =
  process.env.INIT_DEMO_SOURCE ||
  "/home/claude2/bac/prequelui-init-vite-react/my-app";
const OUT = path.join(ROOT, "packages/init/assets");
const ANALYSIS = path.join(ROOT, "analyse/init");

if (!fs.existsSync(CLI)) {
  process.stderr.write(`Missing ${CLI}. Run npm run lint:init:build first.\n`);
  process.exit(1);
}
if (!fs.existsSync(SOURCE)) {
  process.stderr.write(
    `Missing demo source ${SOURCE}. Set INIT_DEMO_SOURCE to a proven Vite + React project.\n`,
  );
  process.exit(1);
}

fs.rmSync(WORK, { recursive: true, force: true });
fs.mkdirSync(WORK, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(ANALYSIS, { recursive: true });

const skipped = ["node_modules", "dist", ".git"];
fs.cpSync(SOURCE, APP, {
  recursive: true,
  filter: (entry) => {
    const rel = path.relative(SOURCE, entry);
    if (!rel) return true;
    return !skipped.includes(rel.split(path.sep)[0]);
  },
});
fs.symlinkSync(path.join(SOURCE, "node_modules"), path.join(APP, "node_modules"), "dir");

// Force the example-page step, while keeping the registry items installed so
// the recording never depends on the network.
for (const file of ["prequelui-demo.html", "src/prequelui-demo.tsx"]) {
  fs.rmSync(path.join(APP, file), { force: true });
}

const shq = (value) => `'${String(value).replace(/'/g, `'\\''`)}'`;
const command = `node ${shq(CLI)} ${shq(APP)}`;
const env = {
  ...process.env,
  TERM: "xterm-256color",
  FORCE_COLOR: "1",
  VITE_CONFIG_NATIVE_IGNORE_WARNING: "true",
};
delete env.CI;
delete env.NO_COLOR;
delete env.PREQUELUI_REDUCED_MOTION;
delete env.PREQUELUI_REGISTRY_URL;

const started = Date.now();
const events = [];
let wroteYes = false;

const child = spawn("script", ["-qefc", command, "/dev/null"], {
  cwd: APP,
  env,
  stdio: ["pipe", "pipe", "pipe"],
});

const push = (data) => {
  const text = data.toString("utf8");
  if (!text) return;
  events.push([Number(((Date.now() - started) / 1000).toFixed(3)), "o", text]);
};

child.stdout.on("data", push);
child.stderr.on("data", push);

const answer = setTimeout(() => {
  if (child.stdin.writable) {
    wroteYes = true;
    events.push([
      Number(((Date.now() - started) / 1000).toFixed(3)),
      "i",
      "y\n",
    ]);
    child.stdin.write("y\n");
  }
}, 1400);

const timeout = setTimeout(() => {
  child.kill("SIGKILL");
}, 120_000);

child.on("close", (code) => {
  clearTimeout(answer);
  clearTimeout(timeout);
  const duration = Number(((Date.now() - started) / 1000).toFixed(3));

  const plain = events
    .filter(([, kind]) => kind === "o")
    .map(([, , text]) => text)
    .join("")
    .replace(/\x1b\[[0-9;?]*[ -/]*[@-~]/g, "")
    .replace(/\x1b\][^\x07]*\x07/g, "")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();

  const cast = {
    version: 2,
    width: 96,
    height: 34,
    timestamp: Math.floor(started / 1000),
    env: { SHELL: "/bin/bash", TERM: "xterm-256color" },
    title: "npx prequelui-animate init",
    command: "npx prequelui-animate init",
  };
  const castBody = [
    JSON.stringify(cast),
    ...events.map((event) => JSON.stringify(event)),
  ].join("\n");

  fs.writeFileSync(path.join(OUT, "prequelui-init.cast"), `${castBody}\n`);
  fs.writeFileSync(path.join(ANALYSIS, "demo-session.log"), `${plain}\n`);
  fs.writeFileSync(
    path.join(ANALYSIS, "demo-recording.json"),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: SOURCE,
        app: APP,
        command,
        exitCode: code,
        answeredYes: wroteYes,
        durationSeconds: duration,
        chunks: events.length,
        cast: "packages/init/assets/prequelui-init.cast",
        log: "analyse/init/demo-session.log",
      },
      null,
      2,
    )}\n`,
  );

  process.stdout.write(`recording ${code === 0 ? "ok" : `failed (${code})`}\n`);
  process.stdout.write(`duration ${duration}s, ${events.length} chunks\n`);
  process.stdout.write(`${plain.slice(-1800)}\n`);
  process.exitCode = code === 0 ? 0 : 1;
});
