import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import {
  MASCOT_CSS,
  MASCOT_MARKUP,
  MASCOT_RUNTIME,
  astroDemo,
  reactDemo,
  solidDemo,
  svelteDemo,
  vanillaHtml,
  vueDemo,
} from "../dist/templates.js";
import { writeJson } from "./lib.mjs";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ts = require(path.join(HERE, "../../../web/node_modules/typescript"));

const checks = [];
const check = (name, ok, detail = "") => {
  checks.push({ name, ok, detail });
  if (!ok) console.error(`  ✗ ${name}: ${detail}`);
  else console.log(`  ✓ ${name}`);
};

const paths = {
  button: "@/components/prequelui/button",
  gradient: "@/components/prequelui/gradient-text",
  typing: "@/components/prequelui/typing-text",
};

check("markup is interactive", MASCOT_MARKUP.includes('role="button"') && MASCOT_MARKUP.includes('tabindex="0"'));
check("markup has two eyes and two thinking dots", (MASCOT_MARKUP.match(/prequel-mascot__eye/g) ?? []).length === 2 && (MASCOT_MARKUP.match(/prequel-mascot__dot--/g) ?? []).length === 2);
check("markup starts in a calm mood", MASCOT_MARKUP.includes('data-mood="idle"'));
check("markup greets once, then the runtime hides the bubble", MASCOT_MARKUP.includes('data-talk="true"') && MASCOT_RUNTIME.includes("5200"));

check("css follows the pointer through custom properties", MASCOT_CSS.includes("--look-x") && MASCOT_CSS.includes("--look-y") && MASCOT_CSS.includes("--eye-scale"));
check("css has the three moods", MASCOT_CSS.includes('[data-mood="happy"]') && MASCOT_CSS.includes('[data-mood="think"]') && MASCOT_CSS.includes('[data-mood="worried"]'));
check("css keeps the reduced-motion branch", MASCOT_CSS.includes("prefers-reduced-motion"));

check("runtime follows the pointer", MASCOT_RUNTIME.includes("pointermove") && MASCOT_RUNTIME.includes("requestAnimationFrame"));
check("runtime blinks irregularly", MASCOT_RUNTIME.includes("2400 + Math.random() * 3800"));
check("runtime reacts to hover, click, keyboard and errors", ["pointerenter", "click", "keydown", "unhandledrejection"].every((item) => MASCOT_RUNTIME.includes(item)));
check("runtime respects reduced motion", MASCOT_RUNTIME.includes("prefers-reduced-motion"));

const templates = [
  ["react", reactDemo(paths), "useEffect"],
  ["vue", vueDemo(paths), "onMounted"],
  ["svelte", svelteDemo(paths), "onMount"],
  ["solid", solidDemo(paths), "onCleanup"],
  ["astro", astroDemo(paths), "is:inline"],
  ["html", vanillaHtml("prequelui/dialog/dialog.js"), "initPrequelMascot();"],
];

for (const [name, source, hook] of templates) {
  const escaped = source.includes('role=\\"button\\"') || source.includes('role="button"');
  check(`${name} injects the one runtime`, source.includes("initPrequelMascot") && source.includes(hook), hook);
  check(`${name} injects the one markup`, source.includes("prequel-mascot__ring") && source.includes("prequel-mascot__dot--left"));
  check(`${name} keeps the mascot accessible`, escaped && source.includes("Prequel bot."));
  check(`${name} has no hidden mascot`, !source.includes('class="prequel-mascot" aria-hidden'));
}

for (const [name, source] of [
  ["react", reactDemo(paths)],
  ["solid", solidDemo(paths)],
]) {
  const file = ts.createSourceFile(
    `${name}-demo.tsx`,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  check(`${name} example parses as TSX`, file.parseDiagnostics.length === 0, `${file.parseDiagnostics.length} diagnostics`);
}
check("the runtime parses as JavaScript", (() => {
  try {
    new Function(MASCOT_RUNTIME);
    return true;
  } catch {
    return false;
  }
})());

function fakeBot(quiet) {
  class FakeElement {}
  const listeners = { root: {}, window: {} };
  const timers = new Map();
  const attributes = { "data-mood": "idle", "data-talk": "true" };
  let nextId = 1;
  let raf = null;
  const style = { values: {}, setProperty(key, value) { this.values[key] = value; } };
  const bubble = { textContent: "Hi! I am the Prequel bot. Hover or click me." };
  const disc = Object.assign(new FakeElement(), {
    getBoundingClientRect: () => ({ left: 100, top: 100, width: 38, height: 38 }),
  });
  const eye = {};
  const root = Object.assign(new FakeElement(), {
    style,
    getAttribute: (key) => attributes[key] ?? null,
    setAttribute: (key, value) => { attributes[key] = String(value); },
    addEventListener: (type, fn) => { listeners.root[type] = fn; },
    removeEventListener: (type) => { delete listeners.root[type]; },
    querySelector: (selector) => {
      if (selector.includes("disc")) return disc;
      if (selector.includes("bubble")) return bubble;
      return null;
    },
    querySelectorAll: () => [eye, eye],
  });
  const win = {
    matchMedia: () => ({ matches: quiet }),
    setTimeout: (fn, delay) => { const id = nextId++; timers.set(id, { fn, delay }); return id; },
    clearTimeout: (id) => timers.delete(id),
    requestAnimationFrame: (fn) => { raf = fn; return 1; },
    cancelAnimationFrame: () => { raf = null; },
    addEventListener: (type, fn) => { listeners.window[type] = fn; },
    removeEventListener: (type) => { delete listeners.window[type]; },
  };
  const document = { querySelector: () => root };
  const factory = new Function(
    "window",
    "document",
    "HTMLElement",
    `${MASCOT_RUNTIME}\nreturn initPrequelMascot;`,
  );
  return {
    init: factory(win, document, FakeElement),
    listeners,
    timers,
    attributes,
    style,
    bubble,
    flush: (delay) => {
      for (const [id, timer] of [...timers]) {
        if (timer.delay === delay) {
          timers.delete(id);
          timer.fn();
        }
      }
    },
    tick: () => { if (raf) { const run = raf; raf = null; run(); } },
  };
}

const bot = fakeBot(false);
const stop = bot.init();
check("live bot listens to the page pointer and errors", Boolean(bot.listeners.window.pointermove && bot.listeners.window.error && bot.listeners.window.unhandledrejection));
check("live bot listens to its own pointer, click and keyboard", Boolean(bot.listeners.root.pointerenter && bot.listeners.root.pointerleave && bot.listeners.root.click && bot.listeners.root.keydown));
bot.listeners.window.pointermove({ clientX: 200, clientY: 160 });
bot.tick();
check("eyes follow the pointer", bot.style.values["--look-x"] !== "0px" && bot.style.values["--look-y"] !== "0px");
bot.listeners.root.pointerenter();
check("hover is happy", bot.attributes["data-mood"] === "happy");
bot.listeners.root.click();
check("click thinks first", bot.attributes["data-mood"] === "think" && bot.attributes["data-talk"] === "true");
bot.flush(900);
check("click becomes happy", bot.attributes["data-mood"] === "happy");
bot.flush(2200);
check("then rests", bot.attributes["data-mood"] === "idle");
bot.listeners.window.error();
check("an error worries the bot", bot.attributes["data-mood"] === "worried");
stop();
check("cleanup removes the listeners", !bot.listeners.window.pointermove && !bot.listeners.root.click);

const calm = fakeBot(true);
const stopCalm = calm.init();
check("reduced motion attaches nothing", !calm.listeners.window.pointermove && !calm.listeners.root.click);
stopCalm();

const summary = {
  total: checks.length,
  passed: checks.filter((row) => row.ok).length,
  failed: checks.filter((row) => !row.ok).length,
};
writeJson("mascot.json", { generatedAt: new Date().toISOString(), summary, checks });
console.log(`\nmascot: ${summary.passed}/${summary.total}`);
process.exitCode = summary.failed ? 1 : 0;
