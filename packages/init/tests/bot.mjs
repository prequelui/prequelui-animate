import assert from "node:assert/strict";
import { TerminalBot, eyesFor, faceFor, tagFor, isBlinkFrame } from "../dist/bot.js";
import { summarise, writeJson } from "./lib.mjs";

const rows = [];

function check(name, fn) {
  try {
    fn();
    rows.push({ name, ok: true });
  } catch (error) {
    rows.push({ name, ok: false, detail: error instanceof Error ? error.message : String(error) });
  }
}

check("idle keeps the calm face", () => {
  assert.equal(faceFor("idle", 0), "◉ ◉");
  assert.equal(faceFor("idle", 12), "◉ ◉");
});

check("happy opens the eyes upward", () => {
  assert.equal(faceFor("happy", 0), "◠ ◠");
});

check("worried narrows the eyes", () => {
  assert.equal(faceFor("worried", 0), "◔ ◔");
});

check("think scans the project with its gaze", () => {
  assert.deepEqual(eyesFor("think", 0), ["◐", "◓"]);
  assert.deepEqual(eyesFor("think", 2), ["◓", "◐"]);
  assert.deepEqual(eyesFor("think", 4), ["◐", "◓"]);
});

check("think blinks once per period", () => {
  assert.equal(isBlinkFrame("think", 0), false);
  assert.equal(isBlinkFrame("think", 47), true);
  assert.equal(faceFor("think", 47), "– –");
  assert.equal(isBlinkFrame("think", 95), true);
  assert.equal(isBlinkFrame("think", 48), false);
});

check("idle and happy never blink", () => {
  assert.equal(isBlinkFrame("idle", 47), false);
  assert.equal(isBlinkFrame("happy", 95), false);
  assert.equal(isBlinkFrame("worried", 47), false);
});

check("propose and happy carry one small sparkle", () => {
  assert.equal(tagFor("propose"), "✦");
  assert.equal(tagFor("happy"), "✦");
  assert.equal(tagFor("think"), "");
  assert.equal(tagFor("worried"), "");
});

check("every mood has two readable eyes", () => {
  for (const mood of ["idle", "think", "happy", "worried", "propose"]) {
    const eyes = eyesFor(mood, 0);
    assert.ok(eyes.length === 2 && eyes.every((glyph) => glyph.length > 0), mood);
  }
});

check("the reading line animates in place then freezes once", () => {
  let out = "";
  const stream = { isTTY: true, write: (chunk) => { out += chunk; return true; } };
  const bot = new TerminalBot({ color: false, reduced: false, stream });
  bot.think("Reading the project.");
  bot.done("Reading the project.");
  assert.equal((out.match(/\n/g) ?? []).length, 1, "one visible row");
  assert.ok(out.endsWith("✓ Reading the project.\n"));
  assert.ok(!out.includes("◉"), "no separate idle row");
});

check("a quiet start prints one static row", () => {
  let out = "";
  const stream = { isTTY: false, write: (chunk) => { out += chunk; return true; } };
  const bot = new TerminalBot({ color: false, reduced: true, stream });
  bot.start("Reading the project.");
  assert.equal((out.match(/\n/g) ?? []).length, 1);
  assert.ok(out.includes("Reading the project."));
  assert.ok(!out.includes("✓"));
});

const summary = summarise(rows);
writeJson("bot.json", { generatedAt: new Date().toISOString(), summary, tests: rows });
console.log(`bot: ${summary.passed}/${summary.total}`);
if (!summary.ok) {
  for (const row of rows.filter((entry) => !entry.ok)) console.error(`  ✗ ${row.name}: ${row.detail}`);
  process.exitCode = 1;
} else {
  for (const row of rows) console.log(`  ✓ ${row.name}`);
}
