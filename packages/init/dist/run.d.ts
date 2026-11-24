import type { PlanStep, ProjectInfo, RunResult } from "./types.js";
export type RunOptions = {
    inherit?: boolean;
    env?: NodeJS.ProcessEnv;
};
export declare function runStep(project: ProjectInfo, step: PlanStep, options?: RunOptions): Promise<RunResult>;
export declare function displayOutput(output: string, max?: number): void;
