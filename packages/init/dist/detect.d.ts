import { type DetectionResult, type FrameworkId, type PackageManager, type ProjectInfo, type TailwindVersion } from "./types.js";
type Json = Record<string, unknown>;
export declare function exists(target: string): boolean;
export declare function isDirectory(target: string): boolean;
export declare function readText(target: string): string | null;
export declare function readJson(target: string): Json | null;
/** Reads JSON that may contain comments and trailing commas (tsconfig style). */
export declare function readJsonc(target: string): Json | null;
export declare function detectPackageManager(root: string, pkg: Json | null): PackageManager;
export declare function detectTypeScript(root: string, deps: Record<string, string>): boolean;
export declare function detectTailwind(root: string, deps: Record<string, string>, evidence: string[]): TailwindVersion;
export declare function detectShadcn(root: string): boolean;
export declare function detectAppDir(root: string): string | null;
export declare function detectProject(input: string): DetectionResult;
export declare function describeProject(project: ProjectInfo): string;
export declare function withFramework(project: ProjectInfo, framework: FrameworkId): ProjectInfo;
export declare function withPackageManager(project: ProjectInfo, packageManager: PackageManager): ProjectInfo;
export {};
