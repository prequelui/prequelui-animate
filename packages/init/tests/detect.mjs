import assert from "node:assert/strict";
import fs from "node:fs";
import { detectProject } from "../dist/detect.js";
import { createFixtures, defaultBase, FIXTURES } from "./fixtures.mjs";
import { readJson, same, summarise, writeJson } from "./lib.mjs";

const base = defaultBase();
fs.mkdirSync(base, { recursive: true });
const { root, paths } = createFixtures(base);
const rows = [];
const detections = [];

for (const fixture of FIXTURES) {
  const projectPath = paths[fixture.name];
  const detection = detectProject(projectPath);
  const project = detection.project;
  const actual = {
    framework: project.framework,
    runtime: project.runtime,
    packageManager: project.packageManager,
    typescript: project.typescript,
    tailwind: project.tailwind,
    shadcn: project.shadcn,
    srcDir: project.srcDir,
    ambiguous: detection.ambiguous,
  };
  const mismatches = Object.entries(fixture.expect).filter(
    ([key, value]) => actual[key] !== value,
  );
  const ok = mismatches.length === 0;
  rows.push({
    name: fixture.name,
    description: fixture.description,
    root: projectPath,
    expected: fixture.expect,
    actual,
    ok,
    mismatches: mismatches.map(([key, value]) => ({ key, expected: value, actual: actual[key] })),
  });
  detections.push({
    name: fixture.name,
    description: fixture.description,
    project: {
      framework: project.framework,
      frameworkLabel: project.frameworkLabel,
      runtime: project.runtime,
      packageManager: project.packageManager,
      typescript: project.typescript,
      tailwind: project.tailwind,
      shadcn: project.shadcn,
      srcDir: project.srcDir,
      appDir: project.appDir,
      evidence: project.evidence,
      warnings: project.warnings,
    },
    ambiguous: detection.ambiguous,
    candidates: detection.candidates,
    question: detection.question,
  });
  assert.ok(ok, `${fixture.name}: ${JSON.stringify(mismatches)}`);
}

const summary = summarise(rows);
const previous = readJson("detection.json");
if (previous) {
  assert.ok(Array.isArray(previous.fixtures), "detection.json keeps its shape");
}
writeJson("detection.json", {
  generatedAt: new Date().toISOString(),
  fixtureRoot: root,
  frameworkLabels: true,
  summary,
  fixtures: rows,
});
writeJson("projets.json", {
  generatedAt: new Date().toISOString(),
  fixtureRoot: root,
  projects: detections,
});
writeJson("unit.json", {
  generatedAt: new Date().toISOString(),
  suite: "detection",
  summary,
  tests: rows.map((row) => ({
    name: `detect ${row.name}`,
    ok: row.ok,
    expected: row.expected,
    actual: row.actual,
  })),
});

console.log(`detection: ${summary.passed}/${summary.total}`);
if (!summary.ok) {
  for (const row of rows.filter((entry) => !entry.ok)) {
    console.error(`  ✗ ${row.name}`, row.mismatches);
  }
  process.exitCode = 1;
} else if (process.env.INIT_VERBOSE || same(true, true)) {
  for (const row of rows) console.log(`  ✓ ${row.name} → ${row.actual.framework}`);
}
