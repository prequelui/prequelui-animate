import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("/home/claude2/travail/saas/_modele/node_modules/playwright");

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const ASSETS = path.join(ROOT, "packages/init/assets");
const WORK = path.join(ROOT, ".tmp/init-demo/frames");
const CAST = path.join(ASSETS, "prequelui-init.cast");
const GIF = path.join(ASSETS, "prequelui-init.gif");
const POSTER_PLAN = path.join(ASSETS, "prequelui-init-plan.png");
const POSTER_DONE = path.join(ASSETS, "prequelui-init-done.png");

if (!fs.existsSync(CAST)) {
  process.stderr.write(`Missing ${CAST}. Run npm run lint:init:demo first.\n`);
  process.exit(1);
}

const header = JSON.parse(fs.readFileSync(CAST, "utf8").split("\n")[0] ?? "{}");
const width = Math.max(80, Math.min(120, header.width ?? 96));
const height = Math.max(20, Math.min(40, header.height ?? 34));
const raw = fs
  .readFileSync(CAST, "utf8")
  .split("\n")
  .slice(1)
  .filter(Boolean)
  .map((line) => JSON.parse(line));
const output = raw.filter(([, kind, data]) => kind === "o" && typeof data === "string");
const duration = (raw.at(-1)?.[0] ?? 0) + 1.4;

const BASE16 = [
  [0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0],
  [0, 0, 128], [128, 0, 128], [0, 128, 128], [192, 192, 192],
  [128, 128, 128], [255, 0, 0], [0, 255, 0], [255, 255, 0],
  [0, 0, 255], [255, 0, 255], [0, 255, 255], [255, 255, 255],
];
const STANDARD = [
  "#5b5b66", "#f87171", "#6edc96", "#f5b450",
  "#78aaff", "#c79bff", "#5fd7d7", "#e7e7ee",
];
const BRIGHT = [
  "#8a8a96", "#ff9a9a", "#9be8b4", "#ffd08a",
  "#9cc4ff", "#d7b8ff", "#8fe8e8", "#ffffff",
];
const CUBE = [0, 95, 135, 175, 215, 255];

function xterm256(index) {
  if (index < 16) {
    const [r, g, b] = BASE16[index];
    return `rgb(${r},${g},${b})`;
  }
  if (index < 232) {
    const value = index - 16;
    const r = CUBE[Math.floor(value / 36) % 6];
    const g = CUBE[Math.floor(value / 6) % 6];
    const b = CUBE[value % 6];
    return `rgb(${r},${g},${b})`;
  }
  const gray = 8 + (index - 232) * 10;
  return `rgb(${gray},${gray},${gray})`;
}

function emptyStyle() {
  return { fg: null, bg: null, bold: false, dim: false, italic: false, underline: false };
}

function applySgr(style, params) {
  const codes = params.length ? params : [0];
  for (let i = 0; i < codes.length; i += 1) {
    const code = codes[i];
    if (code === 0) Object.assign(style, emptyStyle());
    else if (code === 1) style.bold = true;
    else if (code === 2) style.dim = true;
    else if (code === 3) style.italic = true;
    else if (code === 4) style.underline = true;
    else if (code === 22) style.bold = false;
    else if (code === 23) style.italic = false;
    else if (code === 24) style.underline = false;
    else if (code === 39) style.fg = null;
    else if (code === 49) style.bg = null;
    else if (code >= 30 && code <= 37) style.fg = STANDARD[code - 30];
    else if (code >= 90 && code <= 97) style.fg = BRIGHT[code - 90];
    else if (code >= 40 && code <= 47) style.bg = STANDARD[code - 40];
    else if (code >= 100 && code <= 107) style.bg = BRIGHT[code - 100];
    else if (code === 38 || code === 48) {
      const target = code === 38 ? "fg" : "bg";
      if (codes[i + 1] === 2) {
        style[target] = `rgb(${codes[i + 2] ?? 255},${codes[i + 3] ?? 255},${codes[i + 4] ?? 255})`;
        i += 4;
      } else if (codes[i + 1] === 5) {
        style[target] = xterm256(codes[i + 2] ?? 0);
        i += 2;
      }
    }
  }
}

class Terminal {
  constructor(cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.lines = [[]];
    this.row = 0;
    this.col = 0;
    this.style = emptyStyle();
  }

  line() {
    if (!this.lines[this.row]) this.lines[this.row] = [];
    return this.lines[this.row];
  }

  clearLine() {
    this.lines[this.row] = [];
  }

  newline() {
    this.row += 1;
    this.col = 0;
    if (this.row >= this.rows) {
      this.lines.shift();
      this.row = this.rows - 1;
    }
    this.line();
  }

  write(data) {
    let index = 0;
    while (index < data.length) {
      const char = data[index];
      if (char === "\x1b") {
        index += 1;
        if (data[index] === "[") {
          index += 1;
          const start = index;
          while (index < data.length && !/[@-~]/.test(data[index])) index += 1;
          const final = data[index];
          const body = data.slice(start, index);
          index += 1;
          if (final === "m") {
            applySgr(this.style, body.split(";").filter(Boolean).map(Number));
          } else if (final === "K") {
            const mode = Number(body || "0");
            if (mode === 2) this.clearLine();
            else if (mode === 0) this.line().length = Math.min(this.line().length, this.col);
          } else if (final === "A") {
            this.row = Math.max(0, this.row - Number(body || "1"));
          } else if (final === "B") {
            this.newline();
          }
          continue;
        }
        if (data[index] === "]") {
          index += 1;
          while (index < data.length && data[index] !== "\x07") index += 1;
          index += 1;
          continue;
        }
        index += 1;
        continue;
      }
      if (char === "\r") {
        this.col = 0;
        index += 1;
        continue;
      }
      if (char === "\n") {
        this.newline();
        index += 1;
        continue;
      }
      if (char === "\b") {
        this.col = Math.max(0, this.col - 1);
        index += 1;
        continue;
      }
      if (char === "\t") {
        this.col = Math.min(this.cols - 1, (Math.floor(this.col / 8) + 1) * 8);
        index += 1;
        continue;
      }
      if (char < " ") {
        index += 1;
        continue;
      }
      if (this.col >= this.cols) this.newline();
      this.line()[this.col] = { ch: char, style: { ...this.style } };
      this.col += 1;
      index += 1;
    }
  }

  usedRows() {
    let last = 0;
    for (let row = 0; row < this.lines.length; row += 1) {
      if (this.lines[row].some(Boolean)) last = row;
    }
    return last + 1;
  }

  toHtml() {
    const rows = Math.min(this.rows, this.usedRows());
    const parts = [];
    for (let row = 0; row < rows; row += 1) {
      const line = this.lines[row] ?? [];
      let last = -1;
      for (let col = 0; col < line.length; col += 1) if (line[col]) last = col;
      let html = "";
      let current = null;
      let text = "";
      const flush = () => {
        if (!text) return;
        html += current ? `<span style="${current}">${escapeHtml(text)}</span>` : escapeHtml(text);
        text = "";
      };
      for (let col = 0; col <= last; col += 1) {
        const cell = line[col] ?? { ch: " ", style: emptyStyle() };
        const css = cellCss(cell.style);
        if (css !== current) {
          flush();
          current = css;
        }
        text += cell.ch;
      }
      flush();
      parts.push(html || "&nbsp;");
    }
    return parts.join("\n");
  }
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/ /g, "&nbsp;");
}

function cellCss(style) {
  if (!style) return null;
  const rules = [];
  if (style.fg) rules.push(`color:${style.fg}`);
  if (style.bg) rules.push(`background:${style.bg}`);
  if (style.bold) rules.push("font-weight:650");
  if (style.italic) rules.push("font-style:italic");
  if (style.underline) rules.push("text-decoration:underline");
  if (style.dim) rules.push("opacity:0.62");
  return rules.length ? rules.join(";") : null;
}

const FPS = 10;
const HOLD = 1.4;
const total = duration + HOLD;
const terminal = new Terminal(width, height);
let next = 0;
let previous = null;
const frames = [];

for (let step = 0; step <= Math.ceil(total * FPS); step += 1) {
  const time = Math.min(total, step / FPS);
  while (next < output.length && output[next][0] <= time) {
    terminal.write(output[next][2]);
    next += 1;
  }
  const html = terminal.toHtml();
  const blank = html === previous;
  if (!blank) previous = html;
  frames.push({ time, html, blank });
}

while (
  frames.length &&
  frames[0].html.replace(/&nbsp;/g, "").replace(/\n/g, "").trim() === ""
) {
  frames.shift();
}

fs.rmSync(WORK, { recursive: true, force: true });
fs.mkdirSync(WORK, { recursive: true });

const font = '"DejaVu Sans Mono", "Liberation Mono", monospace';
const charHeight = 21;
const chromeHeight = 38;
const padX = 22;
const padY = 18;
const contentWidth = `${width}ch`;

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const tab = await browser.newPage({
  viewport: { width: 1200, height: 1000 },
  deviceScaleFactor: 1,
});

async function render(html, file) {
  await tab.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    * { box-sizing: border-box; }
    body { margin: 0; background: transparent; }
    .window { width: calc(${contentWidth} + ${padX * 2}px); border-radius: 14px; overflow: hidden;
      background: #0d0d13; border: 1px solid rgba(255,255,255,.10);
      box-shadow: 0 24px 60px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.4); }
    .bar { height: ${chromeHeight}px; display: flex; align-items: center; gap: 8px; padding: 0 14px;
      background: #14141b; border-bottom: 1px solid rgba(255,255,255,.07); position: relative; }
    .dot { width: 11px; height: 11px; border-radius: 50%; }
    .title { position: absolute; left: 0; right: 0; text-align: center;
      font: 500 12px/1 ui-sans-serif, system-ui, -apple-system, sans-serif; color: #8d8d99;
      letter-spacing: .02em; pointer-events: none; }
    pre { margin: 0; padding: ${padY}px ${padX}px; width: ${contentWidth}; height: calc(${height} * ${charHeight}px);
      overflow: hidden; white-space: pre; font-family: ${font}; font-size: 14px; line-height: ${charHeight}px;
      color: #e7e7ee; tab-size: 8; }
  </style></head><body>
    <div class="window">
      <div class="bar">
        <span class="dot" style="background:#ff5f57"></span>
        <span class="dot" style="background:#febc2e"></span>
        <span class="dot" style="background:#28c840"></span>
        <span class="title">prequelui-animate init</span>
      </div>
      <pre id="term">${html}</pre>
    </div>
  </body></html>`);
  await tab.locator(".window").screenshot({ path: file, animations: "disabled" });
}

let written = 0;
for (const frame of frames) {
  const file = path.join(WORK, `frame-${String(written).padStart(4, "0")}.png`);
  if (frame.blank && written > 0) {
    fs.copyFileSync(path.join(WORK, `frame-${String(written - 1).padStart(4, "0")}.png`), file);
  } else {
    await render(frame.html, file);
  }
  written += 1;
}

function frameAt(seconds) {
  let chosen = frames[0];
  for (const frame of frames) {
    if (frame.time <= seconds) chosen = frame;
    else break;
  }
  return chosen;
}

await render(frameAt(1.15).html, POSTER_PLAN);
await render(frames.at(-1).html, POSTER_DONE);
await browser.close();

const test = spawnSync("/usr/bin/ffmpeg", ["-version"], { encoding: "utf8" });
if (test.status !== 0) {
  process.stderr.write("ffmpeg is missing; PNG frames and posters were written.\n");
  process.exit(1);
}

const gif = spawnSync(
  "/usr/bin/ffmpeg",
  [
    "-y",
    "-framerate", String(FPS),
    "-i", path.join(WORK, "frame-%04d.png"),
    "-vf",
    "split[a][b];[a]palettegen=max_colors=176:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4",
    "-loop", "0",
    GIF,
  ],
  { encoding: "utf8" },
);
if (gif.status !== 0) {
  process.stderr.write(`${gif.stderr ?? ""}\n`);
  process.exit(1);
}

const size = fs.statSync(GIF).size;
fs.writeFileSync(
  path.join(ROOT, "analyse/init/demo-gif.json"),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      source: "packages/init/assets/prequelui-init.cast",
      gif: path.relative(ROOT, GIF),
      gifBytes: size,
      frames: written,
      fps: FPS,
      seconds: Number(total.toFixed(2)),
      size: { cols: width, rows: height },
      posters: [path.relative(ROOT, POSTER_PLAN), path.relative(ROOT, POSTER_DONE)],
    },
    null,
    2,
  )}\n`,
);

process.stdout.write(`gif ${(size / 1024 / 1024).toFixed(2)} MB, ${written} frames, ${total.toFixed(1)}s\n`);
