import fs from "node:fs";
import path from "node:path";
import {
  FRAMEWORK_LABELS,
  FRAMEWORK_RUNTIME,
  type DetectionResult,
  type FrameworkId,
  type PackageManager,
  type ProjectInfo,
  type TailwindVersion,
} from "./types.js";

type Json = Record<string, unknown>;
type Candidate = { id: FrameworkId; score: number; evidence: string };

const CONFIG_FILES = {
  next: ["next.config.js", "next.config.mjs", "next.config.ts"],
  nuxt: ["nuxt.config.js", "nuxt.config.mjs", "nuxt.config.ts"],
  svelte: ["svelte.config.js", "svelte.config.mjs", "svelte.config.ts"],
  astro: ["astro.config.js", "astro.config.mjs", "astro.config.ts"],
  solidStart: ["app.config.js", "app.config.mjs", "app.config.ts"],
} as const;

const CSS_CANDIDATES = [
  "app/globals.css",
  "src/app/globals.css",
  "src/index.css",
  "src/app.css",
  "src/style.css",
  "src/routes/layout.css",
  "src/styles/globals.css",
  "src/lib/app.css",
  "resources/css/app.css",
  "assets/css/main.css",
  "app/assets/css/main.css",
] as const;

export function exists(target: string): boolean {
  try {
    fs.accessSync(target);
    return true;
  } catch {
    return false;
  }
}

export function isDirectory(target: string): boolean {
  try {
    return fs.statSync(target).isDirectory();
  } catch {
    return false;
  }
}

export function readText(target: string): string | null {
  try {
    return fs.readFileSync(target, "utf8");
  } catch {
    return null;
  }
}

export function readJson(target: string): Json | null {
  const text = readText(target);
  if (text === null) return null;
  try {
    return JSON.parse(text) as Json;
  } catch {
    return null;
  }
}

/** Reads JSON that may contain comments and trailing commas (tsconfig style). */
export function readJsonc(target: string): Json | null {
  const text = readText(target);
  if (text === null) return null;
  try {
    return JSON.parse(text) as Json;
  } catch {
    let out = "";
    let inString = false;
    let quote = "";
    let escape = false;
    for (let i = 0; i < text.length; i += 1) {
      const c = text[i]!;
      const n = text[i + 1];
      if (inString) {
        out += c;
        if (escape) escape = false;
        else if (c === "\\") escape = true;
        else if (c === quote) inString = false;
        continue;
      }
      if (c === '"' || c === "'") {
        inString = true;
        quote = c;
        out += c;
        continue;
      }
      if (c === "/" && n === "/") {
        while (i < text.length && text[i] !== "\n") i += 1;
        out += "\n";
        continue;
      }
      if (c === "/" && n === "*") {
        i += 2;
        while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i += 1;
        i += 1;
        out += " ";
        continue;
      }
      out += c;
    }
    try {
      return JSON.parse(out.replace(/,\s*([}\]])/g, "$1")) as Json;
    } catch {
      return null;
    }
  }
}

function hasFile(root: string, names: readonly string[]): string | null {
  for (const name of names) {
    if (exists(path.join(root, name))) return name;
  }
  return null;
}

function hasDir(root: string, names: readonly string[]): string | null {
  for (const name of names) {
    if (isDirectory(path.join(root, name))) return name;
  }
  return null;
}

function packageDependencies(pkg: Json | null): Record<string, string> {
  if (!pkg) return {};
  const out: Record<string, string> = {};
  for (const key of [
    "dependencies",
    "devDependencies",
    "peerDependencies",
    "optionalDependencies",
  ]) {
    const value = pkg[key];
    if (value && typeof value === "object") {
      for (const [name, range] of Object.entries(value as Record<string, unknown>)) {
        if (typeof range === "string") out[name] = range;
      }
    }
  }
  return out;
}

export function detectPackageManager(root: string, pkg: Json | null): PackageManager {
  const locks: Array<[PackageManager, string[]]> = [
    ["bun", ["bun.lockb", "bun.lock"]],
    ["pnpm", ["pnpm-lock.yaml"]],
    ["yarn", ["yarn.lock"]],
    ["npm", ["package-lock.json", "npm-shrinkwrap.json"]],
  ];
  for (const [manager, files] of locks) {
    if (hasFile(root, files)) return manager;
  }
  const declared = pkg?.packageManager;
  if (typeof declared === "string") {
    const name = declared.split("@")[0];
    if (name === "pnpm" || name === "yarn" || name === "bun" || name === "npm") {
      return name;
    }
  }
  return "npm";
}

export function detectTypeScript(root: string, deps: Record<string, string>): boolean {
  if (exists(path.join(root, "tsconfig.json"))) return true;
  if ("typescript" in deps) return true;
  for (const file of ["src/app/page.tsx", "src/main.tsx", "src/main.ts", "src/App.tsx"]) {
    if (exists(path.join(root, file))) return true;
  }
  return false;
}

export function detectTailwind(
  root: string,
  deps: Record<string, string>,
  evidence: string[],
): TailwindVersion {
  const range = deps.tailwindcss;
  if (typeof range === "string") {
    const major = range.replace(/[^0-9]/g, "").slice(0, 1);
    if (major === "4") {
      evidence.push(`tailwindcss ${range} in package.json`);
      return "v4";
    }
    if (major === "3") {
      evidence.push(`tailwindcss ${range} in package.json`);
      return "v3";
    }
  }
  if ("@tailwindcss/vite" in deps || "@tailwindcss/postcss" in deps) {
    evidence.push("Tailwind CSS v4 plugin in package.json");
    return "v4";
  }
  for (const file of CSS_CANDIDATES) {
    const css = readText(path.join(root, file));
    if (css === null) continue;
    if (/@import\s+["']tailwindcss["']/.test(css)) {
      evidence.push(`${file} imports Tailwind CSS v4`);
      return "v4";
    }
    if (/@tailwind\s+base/.test(css)) {
      evidence.push(`${file} uses Tailwind CSS v3 directives`);
      return "v3";
    }
  }
  const config = hasFile(root, [
    "tailwind.config.js",
    "tailwind.config.mjs",
    "tailwind.config.ts",
  ]);
  if (config) {
    evidence.push(`${config} found`);
    return "v3";
  }
  return null;
}

export function detectShadcn(root: string): boolean {
  return exists(path.join(root, "components.json"));
}

export function detectAppDir(root: string): string | null {
  const app = hasDir(root, ["app", "src/app"]);
  if (app) return app;
  const pages = hasDir(root, ["pages", "src/pages"]);
  return pages ?? null;
}

function detectAlias(root: string): boolean {
  for (const file of ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"]) {
    const json = readJsonc(path.join(root, file));
    const compilerOptions = json?.compilerOptions;
    if (compilerOptions && typeof compilerOptions === "object") {
      const paths = (compilerOptions as Json).paths;
      if (paths && typeof paths === "object") {
        const keys = Object.keys(paths as Json);
        if (keys.some((key) => key === "@/*" || key === "~/*" || key === "#lib/*")) {
          return true;
        }
      }
    }
  }
  const components = readJsonc(path.join(root, "components.json"));
  if (components) {
    const aliases = components.aliases;
    if (aliases && typeof aliases === "object") return true;
  }
  return false;
}

function collectCandidates(
  root: string,
  deps: Record<string, string>,
  evidence: string[],
): Candidate[] {
  const candidates: Candidate[] = [];
  const add = (id: FrameworkId, score: number, reason: string) => {
    candidates.push({ id, score, evidence: reason });
  };

  const composer = exists(path.join(root, "composer.json"));
  const laravelVite = "laravel-vite-plugin" in deps;
  const laravelViews = isDirectory(path.join(root, "resources/views"));
  if (composer && (laravelVite || laravelViews)) {
    add("laravel", 10, "composer.json and Laravel front-end files");
  }

  if ("next" in deps || hasFile(root, CONFIG_FILES.next)) {
    add("next-app", 10, "next dependency or next.config");
  }
  if ("nuxt" in deps || hasFile(root, CONFIG_FILES.nuxt)) {
    add("nuxt", 10, "nuxt dependency or nuxt.config");
  }
  if ("@sveltejs/kit" in deps || (hasFile(root, CONFIG_FILES.svelte) && isDirectory(path.join(root, "src/routes")))) {
    add("sveltekit", 10, "@sveltejs/kit or svelte.config with src/routes");
  }
  if (
    "solid-start" in deps ||
    "@solidjs/start" in deps ||
    (hasFile(root, CONFIG_FILES.solidStart) && isDirectory(path.join(root, "src/routes")))
  ) {
    add("solid-start", 10, "SolidStart dependency or app.config with src/routes");
  }
  if ("astro" in deps || hasFile(root, CONFIG_FILES.astro)) {
    add("astro", 10, "astro dependency or astro.config");
  }
  const vite = "vite" in deps;
  if (vite && "svelte" in deps) {
    add("vite-svelte", 8, "vite and svelte dependencies");
  }
  if (vite && "solid-js" in deps) {
    add("vite-solid", 8, "vite and solid-js dependencies");
  }
  if (vite && "vue" in deps) {
    add("vite-vue", 8, "vite and vue dependencies");
  }
  if (vite && ("react" in deps || "react-dom" in deps)) {
    add("vite-react", 8, "vite and react dependencies");
  }
  if (!candidates.length && exists(path.join(root, "index.html"))) {
    add("html", 2, "index.html without a recognized framework");
  }
  if (!candidates.length) {
    add("unknown", 0, "no framework marker found");
  }

  candidates.sort((a, b) => b.score - a.score);
  for (const candidate of candidates) evidence.push(candidate.evidence);
  return candidates;
}

export function detectProject(input: string): DetectionResult {
  const root = path.resolve(input);
  const pkg = readJson(path.join(root, "package.json"));
  const deps = packageDependencies(pkg);
  const evidence: string[] = [];
  const warnings: string[] = [];

  if (!exists(root) || !isDirectory(root)) {
    return {
      ambiguous: false,
      candidates: [],
      question: null,
      project: {
        root,
        framework: "unknown",
        frameworkLabel: FRAMEWORK_LABELS.unknown,
        runtime: "vanilla",
        packageManager: "npm",
        typescript: false,
        tailwind: null,
        shadcn: false,
        srcDir: false,
        appDir: null,
        evidence: ["directory not found"],
        warnings: ["The target directory does not exist."],
      },
    };
  }

  if (!pkg) {
    warnings.push("No package.json found in the target directory.");
  }

  const candidates = collectCandidates(root, deps, evidence);
  const top = candidates[0]!;
  const tied = candidates.filter(
    (candidate) => candidate.score === top.score && candidate.id !== top.id,
  );

  let framework = top.id;
  let ambiguous = false;
  let question: string | null = null;

  if (tied.length > 0 && top.score >= 8) {
    ambiguous = true;
    const options = [top, ...tied].map((candidate) => candidate.id);
    question = `Several frameworks match this project (${options.join(", ")}). Which one should PrequelUI use?`;
    framework = top.id;
  }

  if (framework === "next-app") {
    const app = hasDir(root, ["app", "src/app"]);
    const pages = hasDir(root, ["pages", "src/pages"]);
    if (!app && pages) framework = "next-pages";
    else if (app) framework = "next-app";
    else {
      framework = "next-app";
      warnings.push("Next.js found without app/ or pages/; assuming the App Router.");
    }
  }

  const packageManager = detectPackageManager(root, pkg);
  const typescript = detectTypeScript(root, deps);
  const tailwind = detectTailwind(root, deps, evidence);
  const shadcn = detectShadcn(root);
  const srcDir = isDirectory(path.join(root, "src"));
  const appDir = detectAppDir(root);

  if (pkg && !deps.react && framework === "astro") {
    warnings.push("Astro project without React: the React island needs @astrojs/react.");
  }
  if (framework === "laravel") {
    warnings.push("Laravel installs are environment-specific; the CLI will show the proven steps instead of editing the app.");
  }
  if (framework === "unknown") {
    warnings.push("No supported framework detected. Use --framework to pick one, or read /docs/installation.");
  }
  if (!tailwind) {
    warnings.push("Tailwind CSS is not detected; the setup will add or ask for it.");
  }
  if (!detectAlias(root) && ["vite-react", "vite-vue", "vite-solid"].includes(framework)) {
    warnings.push("No import alias detected; the CLI will add @/* -> ./src/* when the Vite config is the untouched template.");
  }

  const project: ProjectInfo = {
    root,
    framework,
    frameworkLabel: FRAMEWORK_LABELS[framework],
    runtime: FRAMEWORK_RUNTIME[framework],
    packageManager,
    typescript,
    tailwind,
    shadcn,
    srcDir,
    appDir,
    evidence: Array.from(new Set(evidence)),
    warnings: Array.from(new Set(warnings)),
  };

  return {
    project,
    ambiguous,
    candidates: [top, ...tied].map((candidate) => candidate.id),
    question,
  };
}

export function describeProject(project: ProjectInfo): string {
  const bits = [
    project.frameworkLabel,
    project.typescript ? "TypeScript" : "JavaScript",
    project.tailwind ? `Tailwind ${project.tailwind}` : "no Tailwind",
    project.shadcn ? "components.json" : "no components.json",
    project.packageManager,
  ];
  return bits.join(" · ");
}

export function withFramework(project: ProjectInfo, framework: FrameworkId): ProjectInfo {
  return {
    ...project,
    framework,
    frameworkLabel: FRAMEWORK_LABELS[framework],
    runtime: FRAMEWORK_RUNTIME[framework],
  };
}

export function withPackageManager(
  project: ProjectInfo,
  packageManager: PackageManager,
): ProjectInfo {
  return { ...project, packageManager };
}
