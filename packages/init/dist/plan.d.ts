import type { Plan, PlanFile, PlanStep, ProjectInfo } from "./types.js";
export declare const REGISTRY_URL: string;
export declare class PlanError extends Error {
    readonly hint?: string | undefined;
    constructor(message: string, hint?: string | undefined);
}
/** True when a previous init already wrote both starter components. */
export declare function demoComponentsPresent(project: ProjectInfo): boolean;
export declare function buildPlan(project: ProjectInfo): Plan;
export declare function makeDemoFiles(project: ProjectInfo, step: PlanStep): PlanFile[];
export declare function relativeFiles(project: ProjectInfo, files: PlanFile[]): PlanFile[];
export declare function applyWrites(project: ProjectInfo, files: PlanFile[], options?: {
    keepExisting?: boolean;
}): void;
