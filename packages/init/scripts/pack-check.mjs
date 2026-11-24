/* Inspect the tarball produced by `npm pack`: the published package must carry
 * the compiled CLI, the recorded demo assets, the README and the licence, and
 * must not carry the TypeScript sources or the test harness.
 *
 * Usage: node packages/init/scripts/pack-check.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const OUT = path.join(ROOT, "analyse/init/pack.json");
const BAC = process.env.BAC_BASE || "/home/claude2/bac";
const FOLDER = process.env.PACK_FOLDER || "prequelui-init-vite-react";

const candidates = fs
  .readdirSync(path.join(BAC, FOLDER))
  .filter((name) => name.endsWith(".tgz"))
  .map((name) => path.join(BAC, FOLDER, name));
if (!candidates.length) {
  process.stderr.write(`No tarball in ${path.join(BAC, FOLDER)}\n`);
  process.exit(1);
}
const tarball = candidates.sort().pop();
const listing = spawnSync("tar", ["-tzf", tarball], { encoding: "utf8", timeout: 60_000 });
const files = (listing.stdout ?? "").split("\n").filter(Boolean);
const required = [
  "package/package.json",
  "package/dist/cli.js",
  "package/dist/index.js",
  "package/dist/index.d.ts",
  "package/dist/templates.js",
  "package/assets/prequelui-init.gif",
  "package/assets/prequelui-init.cast",
  "package/README.md",
  "package/LICENSE",
];
const forbidden = ["package/src/", "package/tests/", "package/scripts/"];
const missing = required.filter((entry) => !files.includes(entry));
const leaked = files.filter((entry) => forbidden.some((prefix) => entry.startsWith(prefix)));
const bin = files.includes("package/dist/cli.js");
const report = {
  generatedAt: new Date().toISOString(),
  tarball,
  entries: files.length,
  required,
  missing,
  leaked,
  hasBin: bin,
  status: listing.status === 0 && missing.length === 0 && leaked.length === 0 && bin ? "pass" : "fail",
};
fs.writeFileSync(OUT, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
process.exitCode = report.status === "pass" ? 0 : 1;
