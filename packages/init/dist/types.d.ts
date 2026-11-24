export type FrameworkId = "next-app" | "next-pages" | "vite-react" | "nuxt" | "vite-vue" | "sveltekit" | "vite-svelte" | "solid-start" | "vite-solid" | "astro" | "laravel" | "html" | "unknown";
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
export declare const FRAMEWORK_LABELS: Record<FrameworkId, string>;
export declare const FRAMEWORK_RUNTIME: Record<FrameworkId, RuntimeId>;
export declare const PACKAGE_MANAGERS: PackageManager[];
export type PlanStepKind = "install" | "config" | "init" | "add" | "write" | "build" | "verify";
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
