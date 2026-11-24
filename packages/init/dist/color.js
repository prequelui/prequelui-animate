const BRAND = {
    npm: "\u001b[38;2;203;56;55m",
    pnpm: "\u001b[38;2;246;146;32m",
    yarn: "\u001b[38;2;44;142;187m",
    bun: "\u001b[38;2;251;240;223m",
    npx: "\u001b[38;2;203;56;55m",
    bunx: "\u001b[38;2;251;240;223m",
    curl: "\u001b[38;2;7;150;120m",
};
const RESET = "\u001b[0m";
const BOLD = "\u001b[1m";
const DIM = "\u001b[2m";
const CYAN = "\u001b[36m";
const BLUE = "\u001b[34m";
const YELLOW = "\u001b[33m";
const GREEN = "\u001b[32m";
const RED = "\u001b[31m";
const GRAY = "\u001b[90m";
export function colorEnabled(stream) {
    if (process.env.NO_COLOR)
        return false;
    if (process.env.FORCE_COLOR)
        return true;
    return Boolean(stream.isTTY);
}
export function paint(text, code, enabled) {
    return enabled ? `${code}${text}${RESET}` : text;
}
export function bold(text, enabled) {
    return paint(text, BOLD, enabled);
}
export function dim(text, enabled) {
    return paint(text, DIM, enabled);
}
export function green(text, enabled) {
    return paint(text, GREEN, enabled);
}
export function red(text, enabled) {
    return paint(text, RED, enabled);
}
export function yellow(text, enabled) {
    return paint(text, YELLOW, enabled);
}
export function formatCommand(args, enabled) {
    return args
        .map((token, index) => {
        const brand = BRAND[token];
        if (brand && enabled) {
            return `${brand}${BOLD}${token}${RESET}`;
        }
        if (token.startsWith("-")) {
            return enabled ? `${CYAN}${token}${RESET}` : token;
        }
        if (/^https?:\/\//.test(token)) {
            return enabled ? `${BLUE}${token}${RESET}` : token;
        }
        if (index === 1 && ["install", "add", "dlx", "run", "create"].includes(token)) {
            return enabled ? `${BOLD}${token}${RESET}` : token;
        }
        return token;
    })
        .join(" ");
}
export function packageManagerColor(manager, enabled) {
    return paint(manager, BRAND[manager] ?? "", enabled);
}
