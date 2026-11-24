import { bold, dim, green, paint, red, yellow } from "./color.js";
const SPINNER = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const FACES = {
    idle: ["◉", "◉"],
    think: ["◐", "◓"],
    happy: ["◠", "◠"],
    worried: ["◔", "◔"],
    propose: ["◉", "◉"],
};
const BLINK = ["–", "–"];
const MOOD_COLOR = {
    idle: "\u001b[38;2;160;160;170m",
    think: "\u001b[38;2;120;170;255m",
    happy: "\u001b[38;2;110;220;150m",
    worried: "\u001b[38;2;245;180;80m",
    propose: "\u001b[38;2;190;150;255m",
};
// One blink every 48 animated frames: at the 90 ms tick used by `think`, that
// is roughly every 4.3 seconds. A single frame keeps it alive without flicker.
const BLINK_PERIOD = 48;
export function isBlinkFrame(mood, frame) {
    if (mood !== "think" && mood !== "propose")
        return false;
    return frame > 0 && frame % BLINK_PERIOD === BLINK_PERIOD - 1;
}
export function eyesFor(mood, frame) {
    if (isBlinkFrame(mood, frame))
        return BLINK;
    if (mood === "think") {
        // The gaze swings to the side every two frames, the way a person scans a
        // project before answering. Slow enough to read, never a strobe.
        return Math.floor(frame / 2) % 2 === 0 ? FACES.think : [FACES.think[1], FACES.think[0]];
    }
    return FACES[mood];
}
export function faceFor(mood, frame) {
    const [left, right] = eyesFor(mood, frame);
    return `${left} ${right}`;
}
export function tagFor(mood) {
    if (mood === "happy" || mood === "propose")
        return "✦";
    return "";
}
export class TerminalBot {
    stream;
    color;
    reduced;
    timer = null;
    frame = 0;
    mood = "idle";
    message = "";
    wroteLive = false;
    constructor(options) {
        this.stream = options.stream ?? process.stdout;
        this.color = options.color;
        this.reduced = options.reduced;
    }
    face() {
        const pair = faceFor(this.mood, this.reduced ? 0 : this.frame);
        const tag = tagFor(this.mood);
        const decorated = tag ? `${pair} ${tag}` : pair;
        return this.color ? `${MOOD_COLOR[this.mood]}${decorated}\u001b[0m` : decorated;
    }
    renderLive() {
        if (!this.stream.isTTY)
            return;
        const spinner = this.mood === "think" && !this.reduced
            ? `${SPINNER[this.frame % SPINNER.length]} `
            : "";
        const line = `  ( ${this.face()} )  ${spinner}${this.message}`;
        this.stream.write(`\r\u001b[2K${line}`);
        this.wroteLive = true;
    }
    clearLive() {
        if (this.wroteLive && this.stream.isTTY) {
            this.stream.write("\r\u001b[2K");
        }
        this.wroteLive = false;
    }
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    start(message = "Ready when you are.") {
        this.mood = "idle";
        this.message = message;
        this.stopTimer();
        this.clearLive();
        this.stream.write(`  ( ${this.face()} )  ${dim(message, this.color)}\n`);
    }
    think(message) {
        this.mood = "think";
        this.message = message;
        this.stopTimer();
        this.frame = 0;
        if (this.stream.isTTY && !this.reduced) {
            this.renderLive();
            this.timer = setInterval(() => {
                this.frame += 1;
                this.renderLive();
            }, 90);
        }
        else {
            this.stream.write(`  ( ${this.face()} )  ${message}\n`);
        }
    }
    update(message) {
        this.message = message;
        if (this.timer)
            this.renderLive();
    }
    /** Finish an animated line on the spot: same row, frozen as a check. */
    done(message) {
        this.stopTimer();
        this.clearLive();
        const mark = this.color ? green("✓", true) : "✓";
        this.stream.write(`  ${mark} ${message}\n`);
    }
    happy(message) {
        this.stopTimer();
        this.mood = "happy";
        this.message = message;
        this.clearLive();
        const text = this.color ? green(message, true) : message;
        this.stream.write(`  ( ${this.face()} )  ${text}\n`);
    }
    worried(message) {
        this.stopTimer();
        this.mood = "worried";
        this.message = message;
        this.clearLive();
        const text = this.color ? red(message, true) : message;
        this.stream.write(`  ( ${this.face()} )  ${text}\n`);
    }
    note(message) {
        this.stopTimer();
        this.mood = "idle";
        this.message = message;
        this.clearLive();
        this.stream.write(`  ( ${this.face()} )  ${dim(message, this.color)}\n`);
    }
    propose(message) {
        this.stopTimer();
        this.mood = "propose";
        this.message = message;
        this.clearLive();
        this.stream.write(`  ( ${this.face()} )  ${message}\n`);
    }
    say(message) {
        this.stopTimer();
        this.clearLive();
        this.stream.write(`  ${dim("│", this.color)} ${message}\n`);
    }
    warn(message) {
        this.stopTimer();
        this.clearLive();
        const label = this.color ? yellow("warning", true) : "warning";
        this.stream.write(`  ${label}  ${message}\n`);
    }
    stop() {
        this.stopTimer();
        this.clearLive();
    }
    clear() {
        this.stopTimer();
        this.clearLive();
    }
    step(index, total, title) {
        const counter = this.color ? paint(`[${index}/${total}]`, "\u001b[90m", true) : `[${index}/${total}]`;
        this.stream.write(`\n  ${counter} ${bold(title, this.color)}\n`);
    }
}
