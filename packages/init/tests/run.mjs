import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPlan } from "../dist/plan.js";
import { detectProject } from "../dist/detect.js";
import { applyWrites } from "../dist/plan.js";
import { runStep } from "../dist/run.js";
import { createFixtures, defaultBase } from "./fixtures.mjs";
import {
  OUT,
  ROOT,
  compareSnapshot,
  ensureOut,
  readJson,
  result,
  snapshot,
  summarise,
  writeJson,
} from "./lib.mjs";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(DIR, "../dist/cli.js");
const TSC = path.join(ROOT, "web/node_modules/.bin/tsc");

if (!fs.existsSync(CLI)) {
  const build = spawnSync(TSC, ["-p", path.join(DIR, "../tsconfig.json")], {
    cwd: ROOT,
    encoding: "utf8",
  });
  if (build.status !== 0) {
    process.stderr.write(build.stdout ?? "");
    process.stderr.write(build.stderr ?? "");
    process.exit(1);
  }
}

function run(args, options = {}) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd: options.cwd ?? ROOT,
    encoding: "utf8",
    env: {
      ...process.env,
      NO_COLOR: "1",
      PREQUELUI_REDUCED_MOTION: "1",
      ...options.env,
    },
  });
}

const results = [];
const add = (name, ok, detail) => {
  results.push({ name, ok, detail });
  if (!ok) console.error(`  ✗ ${name}: ${detail}`);
  else console.log(`  ✓ ${name}`);
};

for (const suite of ["detect.mjs", "plan.mjs", "bot.mjs", "mascot.mjs", "templates.mjs"]) {
  const child = spawnSync(process.execPath, [path.join(DIR, suite)], {
    cwd: ROOT,
    encoding: "utf8",
    env: { ...process.env, NO_COLOR: "1" },
  });
  add(
    `suite ${suite}`,
    child.status === 0,
    `${child.stdout ?? ""}${child.stderr ?? ""}`.slice(-500),
  );
}

const base = defaultBase();
fs.mkdirSync(base, { recursive: true });
const { root, paths } = createFixtures(base);

const help = run(["--help"]);
add("cli --help", help.status === 0 && help.stdout.includes("npx prequelui-animate init"), help.stdout.slice(0, 120));

const version = run(["--version"]);
add("cli --version", version.status === 0 && /^\d+\.\d+\.\d+/.test(version.stdout.trim()), version.stdout.trim());

const probeProject = detectProject(paths["vite-react"]).project;
const probe = await runStep(
  probeProject,
  {
    id: "env-probe",
    kind: "install",
    title: "env probe",
    args: [process.execPath, "-e", 'process.stdout.write(process.env.npm_config_package || "clean")'],
  },
  { env: { npm_config_package: "/tmp/prequelui-animate-0.1.0.tgz" } },
);
add(
  "nested commands ignore npx npm_config_package",
  probe.ok && probe.output.trim() === "clean",
  probe.output,
);

const next = paths["next-app"];
const before = snapshot(next);
const dry = run([next, "--dry-run"]);
const after = snapshot(next);
add(
  "cli --dry-run prints a plan and changes nothing",
  dry.status === 0 && dry.stdout.includes("Dry run: nothing was changed.") && compareSnapshot(before, after),
  `${dry.status} ${dry.stdout.slice(-200)}`,
);
add(
  "cli plan names the registry add step and the build",
  dry.stdout.includes("shadcn@latest add") &&
    dry.stdout.includes("/r/button.json") &&
    dry.stdout.includes("npm run build"),
  dry.stdout.slice(-600),
);
add(
  "cli plan prints the address to open",
  dry.stdout.includes("http://localhost:3000/prequelui-demo"),
  dry.stdout.slice(-400),
);

const unknownDir = path.join(root, "unknown-project");
fs.mkdirSync(unknownDir, { recursive: true });
const guided = run([unknownDir, "--dry-run"]);
add(
  "cli guided mode changes nothing",
  guided.status === 1 && guided.stdout.includes("Nothing was changed."),
  guided.stdout.slice(-300),
);

const laravel = run([paths.laravel, "--dry-run"]);
add(
  "laravel is guided, not rewritten",
  laravel.status === 1 && laravel.stdout.includes("Laravel") && laravel.stdout.includes("Nothing was changed."),
  laravel.stdout.slice(-400),
);

const ambiguous = run([paths.ambiguous, "--dry-run"]);
add(
  "ambiguous project resolves to a plan",
  ambiguous.status === 0 && ambiguous.stdout.includes("Using") && ambiguous.stdout.includes("Dry run"),
  ambiguous.stdout.slice(-400),
);

const html = run([paths.html, "--dry-run"]);
add(
  "html plan copies the vanilla dialog without shadcn",
  html.status === 0 && html.stdout.includes("curl") && !html.stdout.includes("shadcn@latest add"),
  html.stdout.slice(-500),
);

const writeDir = path.join(root, "write-check");
fs.cpSync(paths["vite-react"], writeDir, { recursive: true });
const project = detectProject(writeDir).project;
const plan = buildPlan(project);
const demo = plan.steps.find((step) => step.id === "demo");
if (demo) applyWrites(project, demo.files ?? []);
add(
  "demo step writes real files",
  fs.existsSync(path.join(writeDir, "src/prequelui-demo.tsx")) &&
    fs.existsSync(path.join(writeDir, "prequelui-demo.html")) &&
    fs.readFileSync(path.join(writeDir, "src/prequelui-demo.tsx"), "utf8").includes("GradientText"),
  "written demo files",
);

const rerunDir = path.join(root, "rerun-check");
fs.cpSync(paths["vite-react"], rerunDir, { recursive: true });
const rerunComponents = path.join(rerunDir, "src/components/prequelui");
fs.mkdirSync(rerunComponents, { recursive: true });
fs.writeFileSync(
  path.join(rerunComponents, "button.tsx"),
  "export function Button() { return null; }\n",
);
fs.writeFileSync(
  path.join(rerunComponents, "gradient-text.tsx"),
  "export function GradientText() { return null; }\n",
);
fs.writeFileSync(
  path.join(rerunComponents, "typing-text.tsx"),
  "export function TypingText() { return null; }\n",
);
fs.writeFileSync(path.join(rerunDir, "components.json"), "{}\n");
fs.mkdirSync(path.join(rerunDir, "src"), { recursive: true });
fs.writeFileSync(
  path.join(rerunDir, "src/prequelui-demo.tsx"),
  "export function PrequelDemo() { return null; }\n",
);
fs.writeFileSync(path.join(rerunDir, "prequelui-demo.html"), "<!doctype html>\n");
const rerunPlan = buildPlan(detectProject(rerunDir).project);
const rerunIds = rerunPlan.steps.map((step) => step.id);
add(
  "a second run skips the registry add, init and page",
  !rerunIds.includes("add") &&
    !rerunIds.includes("init") &&
    !rerunIds.includes("demo") &&
    rerunIds.includes("build"),
  rerunIds.join(", "),
);

const keepDir = path.join(root, "keep-check");
fs.cpSync(paths["vite-react"], keepDir, { recursive: true });
const keepProject = detectProject(keepDir).project;
const keepPlan = buildPlan(keepProject);
const keepDemo = keepPlan.steps.find((step) => step.id === "demo");
const keepPage = path.join(keepDir, "src/prequelui-demo.tsx");
fs.mkdirSync(path.dirname(keepPage), { recursive: true });
fs.writeFileSync(keepPage, "// my own page\n");
if (keepDemo) {
  applyWrites(keepProject, keepDemo.files ?? [], { keepExisting: keepDemo.keepExisting });
}
add(
  "a second run keeps an edited example page",
  keepDemo?.keepExisting === true && fs.readFileSync(keepPage, "utf8") === "// my own page\n",
  "edited page untouched",
);

const detection = readJson("detection.json");
const planReport = readJson("plan.json");
const botReport = readJson("bot.json");
const mascotReport = readJson("mascot.json");
const summary = summarise(results);
const bac = fs
  .readdirSync(OUT)
  .filter((name) => /^bac-.*\.json$/.test(name) && name !== "bac-synthese.json")
  .sort()
  .map((name) => {
    const report = readJson(name);
    return {
      target: report?.target ?? name,
      status: report?.status ?? "unknown",
      exitCode: report?.exitCode ?? null,
      durationMs: report?.durationMs ?? null,
      packed: report?.packed ?? "not-used",
      tarball: report?.tarball ?? null,
      log: report?.log ?? null,
    };
  });
const bacSummary = {
  total: bac.length,
  passed: bac.filter((row) => row.status === "pass").length,
  failed: bac.filter((row) => row.status === "fail").length,
};
const browserPath = path.join(OUT, "tests/synthese.json");
const browser = fs.existsSync(browserPath) ? JSON.parse(fs.readFileSync(browserPath, "utf8")) : null;
const packReport = readJson("pack.json");
const all = {
  generatedAt: new Date().toISOString(),
  fixtureRoot: root,
  summary,
  integration: results,
  screens: {
    detection: detection?.summary ?? null,
    plan: planReport?.summary ?? null,
    bot: botReport?.summary ?? null,
    mascot: mascotReport?.summary ?? null,
  },
  bac: bacSummary,
  targets: bac,
};
writeJson("resultats.json", all);
writeJson("integration.json", all);
writeJson("bac-synthese.json", { generatedAt: new Date().toISOString(), summary: bacSummary, targets: bac });

ensureOut();
const md = [];
md.push("# Synthèse des tests — paquet `prequelui-animate init`");
md.push("");
md.push(`Généré le ${new Date().toISOString().slice(0, 10)}.`);
md.push("");
md.push(`- Détection : ${detection?.summary?.passed ?? "?"}/${detection?.summary?.total ?? "?"}`);
md.push(`- Plans : ${planReport?.summary?.passed ?? "?"}/${planReport?.summary?.total ?? "?"}`);
md.push(`- Bot : ${botReport?.summary?.passed ?? "?"}/${botReport?.summary?.total ?? "?"}`);
md.push(`- Mascotte de la page d'exemple : ${mascotReport?.summary?.passed ?? "?"}/${mascotReport?.summary?.total ?? "?"}`);
md.push(`- Intégration CLI : ${summary.passed}/${summary.total}`);
md.push(`- Cibles réelles du bac : ${bacSummary.passed}/${bacSummary.total} (${bacSummary.failed} échec)`);
md.push(
  `- Page d'exemple dans un vrai navigateur : ${browser?.summary?.passed ?? "?"}/${browser?.summary?.total ?? "?"} (${browser?.summary?.failed ?? "?"} échec)`,
);
md.push(`- Contenu du tarball \`npm pack\` : ${packReport?.status === "pass" ? "OK" : "non vérifié"}`);
md.push("");
md.push("## Cibles réelles (`bac-test`)");
md.push("");
md.push("| Cible | Statut | Durée | Paquet | Journal |");
md.push("| --- | --- | --- | --- | --- |");
for (const row of bac) {
  const packed = row.packed === "pass" ? "tarball + npx" : "dist";
  md.push(
    `| \`${row.target}\` | ${row.status === "pass" ? "OK" : "ÉCHEC"} | ${row.durationMs ? `${Math.round(row.durationMs / 1000)} s` : "?"} | ${packed} | \`${row.log}\` |`,
  );
}
md.push("");
if (browser?.targets?.length) {
  md.push("## Page d'exemple dans le navigateur (`bac-test pw`)");
  md.push("");
  md.push("| Cible | Statut | URL | Erreurs console | Captures |");
  md.push("| --- | --- | --- | --- | --- |");
  for (const row of browser.targets) {
    const captures = [row.capture1440, row.capture390].filter(Boolean).length;
    md.push(
      `| \`${row.target}\` | ${row.status === "pass" ? "OK" : "ÉCHEC"} | \`${row.url}\` | ${row.check?.consoleErrors?.length ?? "?"} | ${captures}/2 |`,
    );
  }
  md.push("");
  md.push("Chaque cible est ouverte en 1440 et 390, le bot suit le pointeur, réagit au survol et au clic, et la page ne déborde pas horizontalement.");
  md.push("");
}
md.push("## Projets factices");
md.push("");
md.push("| Cas | Attendu |");
md.push("| --- | --- |");
for (const fixture of detection?.fixtures ?? []) {
  md.push(`| \`${fixture.name}\` | ${fixture.description} |`);
}
md.push("");
md.push("## Intégration");
md.push("");
for (const row of results) {
  md.push(`- ${row.ok ? "OK" : "ÉCHEC"} — ${row.name}`);
}
md.push("");
md.push("Les détails machines sont dans `detection.json`, `projets.json`, `plan.json`, `bot.json`, `unit.json`, `integration.json` et `resultats.json`.");
md.push("Le navigateur écrit un rapport par cible et une synthèse dans `tests/`.");
fs.writeFileSync(path.join(OUT, "SYNTHESE.md"), `${md.join("\n")}\n`);

console.log(`\nintegration: ${summary.passed}/${summary.total}`);
process.exitCode = summary.ok ? 0 : 1;
