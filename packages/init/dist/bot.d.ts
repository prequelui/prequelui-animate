export type BotMood = "idle" | "think" | "happy" | "worried" | "propose";
type BotOptions = {
    color: boolean;
    reduced: boolean;
    stream?: NodeJS.WriteStream;
};
export declare function isBlinkFrame(mood: BotMood, frame: number): boolean;
export declare function eyesFor(mood: BotMood, frame: number): [string, string];
export declare function faceFor(mood: BotMood, frame: number): string;
export declare function tagFor(mood: BotMood): string;
export declare class TerminalBot {
    private readonly stream;
    private readonly color;
    private readonly reduced;
    private timer;
    private frame;
    private mood;
    private message;
    private wroteLive;
    constructor(options: BotOptions);
    private face;
    private renderLive;
    private clearLive;
    private stopTimer;
    start(message?: string): void;
    think(message: string): void;
    update(message: string): void;
    /** Finish an animated line on the spot: same row, frozen as a check. */
    done(message: string): void;
    happy(message: string): void;
    worried(message: string): void;
    note(message: string): void;
    propose(message: string): void;
    say(message: string): void;
    warn(message: string): void;
    stop(): void;
    clear(): void;
    step(index: number, total: number, title: string): void;
}
export {};
