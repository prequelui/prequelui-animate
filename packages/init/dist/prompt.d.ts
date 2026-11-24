export type PromptOptions = {
    yes: boolean;
    interactive: boolean;
};
export declare function confirm(question: string, options: PromptOptions, defaultYes?: boolean): Promise<boolean>;
export declare function choose(question: string, options: string[], promptOptions: PromptOptions): Promise<string>;
