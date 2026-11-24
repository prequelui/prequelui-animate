import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const OUT = path.join(ROOT, "analyse/init");
const BASE = process.env.BAC_BASE || "/home/claude2/bac";
const ORIGIN = "https://prequeluianimate.terravidhal.me";
const LOCAL = "http://127.0.0.1:8787";
const REGISTRY = (
  process.env.INIT_REGISTRY_URL ||
  process.env.PREQUELUI_REGISTRY_URL ||
  `${LOCAL}/r`
).replace(/\/+$/, "");
const REMOTE_REGISTRY = !REGISTRY.startsWith(LOCAL);

const TARGETS = {
  "next-app": {
    scaffold:
      'NODE_OPTIONS="--require /app/patch-userinfo.js" npx --yes create-next-app@latest my-app --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --turbopack --yes',
    dir: "my-app",
  },
  "vite-react": {
    scaffold: "npx --yes create-vite@latest my-app --template react-ts",
    dir: "my-app",
  },
  nuxt: {
    scaffold:
      "npx --yes nuxi@latest init my-app --template minimal --packageManager npm --no-gitInit",
    dir: "my-app",
  },
  "vite-vue": {
    scaffold: "npx --yes create-vite@latest my-app --template vue-ts",
    dir: "my-app",
  },
  sveltekit: {
    scaffold:
      "npx --yes sv@latest create my-app --template minimal --types ts --no-add-ons --install npm",
    dir: "my-app",
  },
  "vite-svelte": {
    scaffold: "npx --yes create-vite@latest my-app --template svelte-ts",
    dir: "my-app",
  },
  "solid-start": {
    scaffold:
      "npx --yes create-solid@latest my-app --solidstart --template basic --ts --v2 && cd my-app && npm install && cd ..",
    dir: "my-app",
    pmArg: "--package-manager npm",
  },
  "vite-solid": {
    scaffold:
      "npx --yes create-solid@latest my-app --vanilla --template basic --ts && cd my-app && npm install && cd ..",
    dir: "my-app",
    pmArg: "--package-manager npm",
  },
  astro: {
    scaffold:
      "npx --yes create-astro@latest my-app --template with-tailwindcss --install --add react --no-git --yes --skip-houston",
    dir: "my-app",
  },
  html: {
    scaffold:
      "mkdir -p my-app && printf '%s\\n' '<!doctype html><html><body><h1>Plain page</h1></body></html>' > my-app/index.html",
    dir: "my-app",
  },
};

const target = process.env.INIT_TARGET || "next-app";
const twice = process.env.INIT_TWICE === "1";
const packed = process.env.INIT_PACKED === "1";
const spec = TARGETS[target];
if (!spec) {
  process.stderr.write(`Unknown INIT_TARGET ${target}. Use one of ${Object.keys(TARGETS).join(", ")}\n`);
  process.exit(1);
}

const folder = `prequelui-init-${target}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
const dir = path.join(BASE, folder);
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(path.join(dir, "init"), { recursive: true });

fs.cpSync(path.join(ROOT, "packages/init/dist"), path.join(dir, "init/dist"), { recursive: true });
fs.copyFileSync(path.join(ROOT, "packages/init/package.json"), path.join(dir, "init/package.json"));

fs.mkdirSync(path.join(ROOT, "analyse/init/logs"), { recursive: true });
let tarball = null;
let packLog = null;
if (packed) {
  const pack = spawnSync(
    "npm",
    ["pack", "--pack-destination", dir],
    { cwd: path.join(ROOT, "packages/init"), encoding: "utf8", timeout: 300_000 },
  );
  packLog = `${pack.stdout ?? ""}${pack.stderr ?? ""}`;
  const name = (pack.stdout ?? "").trim().split("\n").filter(Boolean).pop();
  if (pack.status !== 0 || !name || !fs.existsSync(path.join(dir, name))) {
    fs.writeFileSync(path.join(ROOT, "analyse/init/logs", `pack-${target}.log`), packLog);
    process.stderr.write(`npm pack failed for ${target}\n${packLog.slice(-2000)}\n`);
    process.exit(1);
  }
  tarball = name;
  fs.writeFileSync(path.join(ROOT, "analyse/init/logs", `pack-${target}.log`), packLog);
}

let rewritten = 0;
if (!REMOTE_REGISTRY) {
  fs.cpSync(path.join(ROOT, "web/public/r"), path.join(dir, "registry"), { recursive: true });
  const rewrite = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) rewrite(full);
      else if (entry.isFile() && entry.name.endsWith(".json")) {
        const source = fs.readFileSync(full, "utf8");
        if (source.includes(ORIGIN)) {
          fs.writeFileSync(full, source.split(ORIGIN).join(LOCAL));
          rewritten += 1;
        }
      }
    }
  };
  rewrite(path.join(dir, "registry"));
}

fs.writeFileSync(
  path.join(dir, "serve-registry.mjs"),
  `import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const root = process.env.REGISTRY_ROOT || "/app/registry";
const types = { ".json": "application/json", ".js": "text/javascript", ".md": "text/markdown" };
http.createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://127.0.0.1");
  const rel = url.pathname.replace(/^\\/r(?=\\/|$)/, "") || "/";
  let file = path.join(root, rel);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const stat = fs.statSync(file);
    if (stat.isDirectory()) file = path.join(file, "index.json");
    const body = fs.readFileSync(file);
    res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end("not found");
  }
}).listen(8787, "127.0.0.1", () => console.log("registry ready"));
`,
);

fs.writeFileSync(
  path.join(dir, "patch-userinfo.js"),
  `const os = require("os");
os.userInfo = () => ({
  username: "node",
  uid: process.getuid ? process.getuid() : 1001,
  gid: process.getgid ? process.getgid() : 1001,
  shell: "/bin/bash",
  homedir: process.env.HOME || "/app/.home",
});
`,
);
fs.chmodSync(path.join(dir, "patch-userinfo.js"), 0o644);

const registrySetup = REMOTE_REGISTRY
  ? `if ! curl -fsS ${REGISTRY}/registry.json > /dev/null 2>&1; then
  echo "registry ${REGISTRY} is unreachable"
  exit 1
fi`
  : `node /app/serve-registry.mjs > /app/registry.log 2>&1 &
SERVER=$!
for i in $(seq 1 50); do
  if curl -fsS ${LOCAL}/r/registry.json > /dev/null 2>&1; then break; fi
  sleep 0.2
done
if ! curl -fsS ${LOCAL}/r/registry.json > /dev/null 2>&1; then
  echo "registry server did not start"
  cat /app/registry.log
  exit 1
fi`;
const registryStop = REMOTE_REGISTRY ? "" : "kill $SERVER 2>/dev/null || true";

fs.writeFileSync(
  path.join(dir, "run.sh"),
  `#!/bin/bash
set -e
export HOME=/app/.home
export CI=1
export NO_COLOR=1
export PREQUELUI_REDUCED_MOTION=1
export PREQUELUI_REGISTRY_URL=${REGISTRY}
mkdir -p "$HOME"
cd /app
${registrySetup}
echo "=== scaffold ==="
${spec.scaffold}
export HOME=/app/${spec.dir}
${packed ? `echo "=== init (packed, npx) ==="
npx --yes --package /app/${tarball} prequelui-animate init /app/${spec.dir} --yes ${spec.pmArg ?? ""}` : `echo "=== init ==="
node /app/init/dist/cli.js /app/${spec.dir} --yes ${spec.pmArg ?? ""}`}
cd /app
echo "=== files ==="
ls -R ${spec.dir}/components/prequelui 2>/dev/null || true
find ${spec.dir} -maxdepth 3 -name "prequelui-demo*" -print
find ${spec.dir} -type f \\( -path "*/prequelui/*" -o -path "*/prequelui-demo/*" -o -name "prequelui-demo*" \\) -not -path "*/node_modules/*" -not -path "*/.next/*" -print0 | sort -z | xargs -0 sha256sum > /app/prequelui-first.sha
${twice ? `echo "=== rerun ==="
${packed ? `npx --yes --package /app/${tarball} prequelui-animate init /app/${spec.dir} --yes ${spec.pmArg ?? ""}` : `node /app/init/dist/cli.js /app/${spec.dir} --yes ${spec.pmArg ?? ""}`}
echo "=== files-after-rerun ==="
ls -R ${spec.dir}/components/prequelui 2>/dev/null || true
find ${spec.dir} -maxdepth 3 -name "prequelui-demo*" -print
find ${spec.dir} -type f \\( -path "*/prequelui/*" -o -path "*/prequelui-demo/*" -o -name "prequelui-demo*" \\) -not -path "*/node_modules/*" -not -path "*/.next/*" -print0 | sort -z | xargs -0 sha256sum > /app/prequelui-second.sha
if diff -u /app/prequelui-first.sha /app/prequelui-second.sha; then echo "=== rerun-ok ==="; else echo "=== rerun-changed ==="; exit 1; fi
` : ""}${registryStop}
echo "=== bac-ok ==="
`,
);
fs.chmodSync(path.join(dir, "run.sh"), 0o755);

fs.mkdirSync(path.join(OUT, "logs"), { recursive: true });
const started = Date.now();
const run = spawnSync(
  "sudo",
  ["-n", "/usr/local/bin/bac-test", "node", folder, "bash /app/run.sh"],
  { encoding: "utf8", timeout: 1_800_000, maxBuffer: 32 * 1024 * 1024 },
);
const log = `${run.stdout ?? ""}${run.stderr ?? ""}`;
fs.writeFileSync(path.join(OUT, "logs", `${folder}.log`), log);

const report = {
  generatedAt: new Date().toISOString(),
  target,
  folder,
  hostDir: dir,
  registry: REGISTRY,
  registryMode: REMOTE_REGISTRY ? "remote" : "local",
  registryFilesRewritten: rewritten,
  status: run.status === 0 ? "pass" : "fail",
  exitCode: run.status,
  signal: run.signal,
  rerun: twice ? (log.includes("=== rerun-ok ===") ? "pass" : "fail") : "not-run",
  packed: packed ? "pass" : "not-used",
  tarball,
  durationMs: Date.now() - started,
  log: `analyse/init/logs/${folder}.log`,
  tail: log.slice(-6000),
};
fs.writeFileSync(path.join(OUT, `bac-${target}.json`), `${JSON.stringify(report, null, 2)}\n`);
if (REMOTE_REGISTRY) {
  const resultsDir = path.join(ROOT, "analyse/tests");
  fs.mkdirSync(resultsDir, { recursive: true });
  fs.writeFileSync(
    path.join(resultsDir, `init-remote-${target}.json`),
    `${JSON.stringify(report, null, 2)}\n`,
  );
}
process.stdout.write(log.slice(-6000));
process.exitCode = report.status === "pass" ? 0 : 1;
