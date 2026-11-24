export type FrameworkId =
  | "next-app"
  | "next-pages"
  | "vite-react"
  | "nuxt"
  | "vite-vue"
  | "sveltekit"
  | "vite-svelte"
  | "solid-start"
  | "vite-solid"
  | "astro"
  | "laravel"
  | "html"
  | "unknown";

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export type TailwindVersion = "v3" | "v4" | null;

export type RuntimeId = "react" | "vue" | "svelte" | "solid" | "vanilla";

export type ProjectInfo = {
  root: string;
  framework: FrameworkId;
  frameworkLabel: string;
  runtime: RuntimeId;
  packageManager: PackageManager;
  typescript: boolean;
  tailwind: TailwindVersion;
  shadcn: boolean;
  srcDir: boolean;
  appDir: string | null;
  evidence: string[];
  warnings: string[];
};

export type DetectionResult = {
  project: ProjectInfo;
  ambiguous: boolean;
  candidates: FrameworkId[];
  question: string | null;
};

export const FRAMEWORK_LABELS: Record<FrameworkId, string> = {
  "next-app": "Next.js (App Router)",
  "next-pages": "Next.js (Pages Router)",
  "vite-react": "Vite + React",
  nuxt: "Nuxt",
  "vite-vue": "Vite + Vue",
  sveltekit: "SvelteKit",
  "vite-svelte": "Vite + Svelte",
  "solid-start": "SolidStart",
  "vite-solid": "Vite + Solid",
  astro: "Astro",
  laravel: "Laravel + React",
  html: "HTML / JavaScript",
  unknown: "Unknown",
};

export const FRAMEWORK_RUNTIME: Record<FrameworkId, RuntimeId> = {
  "next-app": "react",
  "next-pages": "react",
  "vite-react": "react",
  nuxt: "vue",
  "vite-vue": "vue",
  sveltekit: "svelte",
  "vite-svelte": "svelte",
  "solid-start": "solid",
  "vite-solid": "solid",
  astro: "react",
  laravel: "react",
  html: "vanilla",
  unknown: "vanilla",
};

export const PACKAGE_MANAGERS: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

export type PlanStepKind =
  | "install"
  | "config"
  | "init"
  | "add"
  | "write"
  | "build"
  | "verify";

export type PlanFile = {
  path: string;
  content: string;
};

export type PlanStep = {
  id: string;
  kind: PlanStepKind;
  title: string;
  detail?: string;
  command?: string;
  display?: string;
  args?: string[];
  env?: Record<string, string>;
  files?: PlanFile[];
  optional?: boolean;
  keepExisting?: boolean;
};

export type Plan = {
  project: ProjectInfo;
  summary: string;
  steps: PlanStep[];
  example: {
    path: string;
    url: string;
    devCommand: string;
  };
  guided?: string;
};

export type RunResult = {
  ok: boolean;
  step: PlanStep | null;
  code: number | null;
  output: string;
  error?: string;
};
