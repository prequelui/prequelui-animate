import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { detectProject, withFramework } from "../dist/detect.js";
import { applyWrites, buildPlan, REGISTRY_URL } from "../dist/plan.js";
import { createFixtures, defaultBase, FIXTURES } from "./fixtures.mjs";
import { OUT, summarise, writeJson } from "./lib.mjs";

const base = defaultBase();
fs.mkdirSync(base, { recursive: true });
const { root, paths } = createFixtures(base);
const rows = [];

const EXPECTED_URL = {
  "next-app": "http://localhost:3000/prequelui-demo",
  "next-pages": "http://localhost:3000/prequelui-demo",
  "vite-react": "http://localhost:5173/prequelui-demo.html",
  nuxt: "http://localhost:3000/prequelui-demo",
  "vite-vue": "http://localhost:5173/prequelui-demo.html",
  sveltekit: "http://localhost:5173/prequelui-demo",
  "vite-svelte": "http://localhost:5173/prequelui-demo.html",
  "solid-start": "http://localhost:3000/prequelui-demo",
  "vite-solid": "http://localhost:5173/prequelui-demo.html",
  astro: "http://localhost:4321/prequelui-demo",
  "tailwind-v3": "http://localhost:5173/prequelui-demo.html",
  html: "http://localhost:3000/prequelui-demo.html",
};

function check(name, project) {
  const plan = buildPlan(project);
  const ids = plan.steps.map((step) => step.id);
  const add = plan.steps.find((step) => step.id === "add");
  const expectations = [];
  const push = (ok, detail) => expectations.push({ ok, detail });
  push(plan.example.url === EXPECTED_URL[name], `example url ${plan.example.url}`);
  if (name === "laravel") {
    push(Boolean(plan.guided), "guided mode");
    push(ids.length === 0, "no steps");
  } else if (name === "html") {
    push(ids.includes("dialog"), "copies the vanilla dialog");
    push(ids.includes("demo"), "writes the demo page");
    push(ids.includes("verify"), "verifies the files");
    push(plan.steps.every((step) => !step.command || !step.command.includes("shadcn")), "no shadcn");
  } else {
    push(ids.includes("demo"), "writes a demo page");
    push(ids.includes("build"), "runs the build");
    push(Boolean(add), "adds registry items");
    const urls = add?.args ?? [];
    const base = project.runtime === "react" ? REGISTRY_URL : `${REGISTRY_URL}/${project.runtime}`;
    push(urls.some((value) => value === `${base}/button.json`), "button registry url");
    push(urls.some((value) => value === `${base}/gradient-text.json`), "gradient-text registry url");
    if (["next-app", "next-pages", "vite-react", "nuxt", "vite-vue", "sveltekit", "vite-svelte", "astro"].includes(name)) {
      const needsInit = !project.shadcn;
      push(ids.includes("init") === needsInit, needsInit ? "initialises components.json" : "skips init");
    }
    if (name === "vite-svelte") {
      push(ids.includes("tailwind-deps") || project.tailwind !== null, "installs Tailwind");
      const prepare = plan.steps.find((step) => step.id === "prepare");
      push(
        Boolean(prepare?.files?.some((file) => file.path.includes("package.json"))),
        "maps #lib in package.json",
      );
    }
    if (name === "sveltekit") {
      push(ids.includes("tailwind-sv") || project.tailwind !== null, "Tailwind step only when needed");
    }
    if (name === "vite-solid" || name === "solid-start") {
      const prepare = plan.steps.find((step) => step.id === "prepare");
      push(
        Boolean(prepare?.files?.some((file) => file.path.includes("components.json"))) ===
          !project.shadcn,
        "components.json is written only when missing",
      );
    }
    if (name === "vite-react") {
      push(
        plan.steps.some((step) => step.id === "prepare" && step.files?.some((file) => file.path.includes("vite.config"))),
        "extends the Vite config",
      );
    }
    if (name === "astro") {
      const demo = plan.steps.find((step) => step.id === "demo");
      const page = demo?.files?.find((file) => file.path.endsWith("prequelui-demo.astro"));
      push(Boolean(page?.content.includes('import "../styles/global.css";')), "demo page loads the Tailwind theme");
    }
  }
  return { plan, expectations };
}

for (const fixture of FIXTURES) {
  const detection = detectProject(paths[fixture.name]);
  const project = detection.project;
  if (!["laravel"].includes(fixture.name) && !detection.ambiguous) {
    const { plan, expectations } = check(fixture.name, project);
    const ok = expectations.every((entry) => entry.ok);
    rows.push({
      name: fixture.name,
      ok,
      project: { framework: project.framework, runtime: project.runtime, tailwind: project.tailwind, shadcn: project.shadcn },
      summary: plan.summary,
      steps: plan.steps.map((step) => ({
        id: step.id,
        kind: step.kind,
        title: step.title,
        command: step.command ?? step.display ?? null,
        files: step.files?.map((file) => file.path) ?? [],
      })),
      example: plan.example,
      expectations,
    });
    assert.ok(ok, `${fixture.name}: ${JSON.stringify(expectations.filter((entry) => !entry.ok))}`);
  }
}

const laravel = detectProject(paths.laravel).project;
const guided = buildPlan(laravel);
rows.push({
  name: "laravel",
  ok: Boolean(guided.guided),
  project: { framework: laravel.framework },
  guided: guided.guided,
  steps: [],
  expectations: [{ ok: Boolean(guided.guided), detail: "guided mode" }],
});

for (const candidate of ["nuxt", "astro"]) {
  const detected = detectProject(paths.ambiguous).project;
  const project = { ...withFramework(detected, candidate), tailwind: candidate === "astro" ? "v4" : detected.tailwind };
  const plan = buildPlan(project);
  const ok = plan.steps.some((step) => step.id === "add") && plan.steps.some((step) => step.id === "build");
  rows.push({
    name: `ambiguous-${candidate}`,
    ok,
    project: { framework: candidate, runtime: project.runtime, tailwind: project.tailwind, shadcn: project.shadcn },
    summary: plan.summary,
    steps: plan.steps.map((step) => step.id),
    expectations: [{ ok, detail: "plan builds after the answer" }],
  });
  assert.ok(ok, `ambiguous-${candidate}`);
}

// The Nuxt minimal template renders <NuxtWelcome />, so a new pages/ folder is
// not routed. The shell step must swap that marker once, and never again.
const minimalRoot = path.join(base, "nuxt-minimal");
fs.rmSync(minimalRoot, { recursive: true, force: true });
fs.cpSync(paths.nuxt, minimalRoot, { recursive: true });
fs.writeFileSync(
  path.join(minimalRoot, "app/app.vue"),
  "<template>\n  <div>\n    <NuxtRouteAnnouncer />\n    <NuxtWelcome />\n  </div>\n</template>\n",
);
const minimalProject = detectProject(minimalRoot).project;
const minimalPlan = buildPlan(minimalProject);
const shell = minimalPlan.steps.find((step) => step.id === "nuxt-shell");
const shellFile = shell?.files?.find((file) => file.path.endsWith("app.vue"));
if (shell?.files) applyWrites(minimalProject, shell.files);
const shellAfter = fs.readFileSync(path.join(minimalRoot, "app/app.vue"), "utf8");
const replanned = buildPlan(detectProject(minimalRoot).project);
const shellOk =
  Boolean(shellFile) &&
  shellFile.content.includes("<NuxtPage />") &&
  !shellFile.content.includes("<NuxtWelcome") &&
  shellAfter.includes("<NuxtPage />") &&
  !shellAfter.includes("<NuxtWelcome") &&
  !replanned.steps.some((step) => step.id === "nuxt-shell");
rows.push({
  name: "nuxt-minimal-shell",
  ok: shellOk,
  project: { framework: minimalProject.framework },
  summary: minimalPlan.summary,
  steps: minimalPlan.steps.map((step) => step.id),
  expectations: [{ ok: shellOk, detail: "NuxtWelcome becomes NuxtPage once" }],
});
assert.ok(shellOk, "nuxt-minimal-shell");

const summary = summarise(rows);
writeJson("plan.json", {
  generatedAt: new Date().toISOString(),
  fixtureRoot: root,
  summary,
  plans: rows,
});
const unitPath = path.join(OUT, "unit.json");
const previous = fs.existsSync(unitPath) ? JSON.parse(fs.readFileSync(unitPath, "utf8")) : null;
const detectionSuite = previous?.suite === "detection" ? previous : null;
writeJson("unit.json", {
  generatedAt: new Date().toISOString(),
  suites: [
    ...(detectionSuite ? [detectionSuite] : []),
    {
      suite: "plan",
      summary,
      tests: rows.map((row) => ({ name: `plan ${row.name}`, ok: row.ok })),
    },
  ],
});

console.log(`plan: ${summary.passed}/${summary.total}`);
if (!summary.ok) {
  for (const row of rows.filter((entry) => !entry.ok)) {
    console.error(`  ✗ ${row.name}`, row.expectations?.filter((entry) => !entry.ok));
  }
  process.exitCode = 1;
} else {
  for (const row of rows) console.log(`  ✓ ${row.name}`);
}
