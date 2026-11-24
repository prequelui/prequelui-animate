import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
export const OUT = path.join(ROOT, "analyse/init");

export function ensureOut() {
  fs.mkdirSync(OUT, { recursive: true });
}

export function writeJson(name, value) {
  ensureOut();
  fs.writeFileSync(path.join(OUT, name), `${JSON.stringify(value, null, 2)}\n`);
}

export function readJson(name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(OUT, name), "utf8"));
  } catch {
    return null;
  }
}

export function same(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

export function snapshot(dir) {
  const entries = [];
  const walk = (current, prefix) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const full = path.join(current, entry.name);
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) walk(full, rel);
      else if (entry.isFile()) entries.push(`${rel}:${fs.readFileSync(full, "utf8")}`);
    }
  };
  walk(dir, "");
  return entries;
}

export function compareSnapshot(before, after) {
  if (before.length !== after.length) return false;
  for (let i = 0; i < before.length; i += 1) {
    if (before[i] !== after[i]) return false;
  }
  return true;
}

export function result(ok, detail) {
  return { ok, detail };
}

export function summarise(rows) {
  const total = rows.length;
  const passed = rows.filter((row) => row.ok).length;
  return { total, passed, failed: total - passed, ok: passed === total };
}
