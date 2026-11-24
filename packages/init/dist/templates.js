export const DEMO_SITE = (process.env.PREQUELUI_SITE_URL || "https://prequeluianimate.terravidhal.me").replace(/\/+$/, "");
// The mascot is the same disc-in-a-ring character as the site: two eyes, a slow
// breath, irregular blinks, and real reactions. One markup block, one CSS block
// and one small framework-free runtime are injected into every generated page,
// so React, Vue, Svelte, Solid, Astro and plain HTML get the same life. Reduced
// motion keeps the face and removes every movement.
export const MASCOT_CSS = `
.prequel-mascot{--look-x:0px;--look-y:0px;--look-r:0deg;--eye-scale:1;position:fixed;right:20px;bottom:20px;z-index:50;display:flex;align-items:flex-end;gap:10px}
.prequel-mascot__bubble{max-width:190px;border:1px solid color-mix(in oklab,currentColor 14%,transparent);background:color-mix(in oklab,currentColor 6%,transparent);backdrop-filter:blur(6px);border-radius:14px;padding:8px 10px;font-size:13px;line-height:1.4;opacity:0;transform:translateY(6px) scale(.97);transition:opacity .2s ease,transform .24s cubic-bezier(.23,1,.32,1)}
.prequel-mascot:hover .prequel-mascot__bubble,.prequel-mascot[data-talk="true"] .prequel-mascot__bubble{opacity:1;transform:none}
.prequel-mascot__ring{position:relative;width:54px;height:54px;border-radius:999px;background:#17171c;box-shadow:0 0 0 1px color-mix(in oklab,currentColor 22%,transparent),0 10px 30px rgba(0,0,0,.18);display:grid;place-items:center;cursor:pointer;outline:none;transition:transform .25s cubic-bezier(.34,1.2,.64,1),box-shadow .2s ease;animation:prequel-breathe 5.2s ease-in-out infinite}
.prequel-mascot__ring:hover{transform:scale(1.07)}
.prequel-mascot__ring:active{transform:scale(.94) rotate(-5deg)}
.prequel-mascot:focus-visible .prequel-mascot__ring{box-shadow:0 0 0 2px color-mix(in oklab,currentColor 55%,transparent),0 10px 30px rgba(0,0,0,.18)}
.prequel-mascot__disc{width:38px;height:38px;border-radius:999px;background:#fff;display:flex;align-items:center;justify-content:center;gap:7px;transform:scale(1);transition:transform .3s cubic-bezier(.34,1.3,.64,1)}
.prequel-mascot[data-mood="think"] .prequel-mascot__disc{transform:scale(.34)}
.prequel-mascot__eye{display:block;width:6px;height:6px;border-radius:999px;background:#101014;transform:translate(var(--look-x),var(--look-y)) rotate(var(--look-r)) scaleY(var(--eye-scale));transform-origin:center;transition:transform .18s cubic-bezier(.23,1,.32,1),width .18s ease,height .18s ease,border-radius .18s ease,opacity .12s ease}
.prequel-mascot[data-mood="happy"] .prequel-mascot__eye{width:9px;height:4px;border-radius:999px}
.prequel-mascot[data-mood="worried"] .prequel-mascot__eye{width:5px;height:8px}
.prequel-mascot[data-mood="worried"] .prequel-mascot__eye:first-child{transform:translate(var(--look-x),var(--look-y)) rotate(calc(var(--look-r) - 12deg)) scaleY(var(--eye-scale))}
.prequel-mascot[data-mood="worried"] .prequel-mascot__eye:last-child{transform:translate(var(--look-x),var(--look-y)) rotate(calc(var(--look-r) + 9deg)) scaleY(var(--eye-scale))}
.prequel-mascot[data-mood="think"] .prequel-mascot__eye{opacity:0;transform:scale(.2)}
.prequel-mascot__dot{position:absolute;top:50%;left:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:999px;background:#8e8e93;opacity:0;transform:translateX(0) scale(.4);transition:transform .3s cubic-bezier(.34,1.3,.64,1),opacity .2s ease}
.prequel-mascot[data-mood="think"] .prequel-mascot__dot{opacity:.85;animation:prequel-pulse .7s ease-in-out infinite alternate}
.prequel-mascot[data-mood="think"] .prequel-mascot__dot--left{transform:translateX(-16px) scale(1)}
.prequel-mascot[data-mood="think"] .prequel-mascot__dot--right{transform:translateX(16px) scale(1);animation-direction:alternate-reverse}
@keyframes prequel-breathe{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-2px) scale(1.02)}}
@keyframes prequel-pulse{from{opacity:.4}to{opacity:.95}}
@media (prefers-reduced-motion: reduce){
  .prequel-mascot__ring{animation:none;transition:none}
  .prequel-mascot__disc,.prequel-mascot__eye,.prequel-mascot__dot{transition:none}
  .prequel-mascot__dot{display:none}
}
@media (max-width:420px){
  .prequel-mascot__bubble{display:none}
  .prequel-mascot{right:12px;bottom:12px}
  .prequel-mascot__ring{width:46px;height:46px}
  .prequel-mascot__disc{width:32px;height:32px;gap:6px}
  .prequel-mascot__eye{width:5px;height:5px}
}
`;
export const MASCOT_MARKUP = `<div class="prequel-mascot" data-prequel-mascot data-mood="idle" data-talk="true" role="button" tabindex="0" aria-label="Prequel bot. Hover to say hello, click to make it think.">
  <span class="prequel-mascot__bubble">Hi! I am the Prequel bot. Hover or click me.</span>
  <span class="prequel-mascot__ring">
    <span class="prequel-mascot__dot prequel-mascot__dot--left"></span>
    <span class="prequel-mascot__disc"><span class="prequel-mascot__eye"></span><span class="prequel-mascot__eye"></span></span>
    <span class="prequel-mascot__dot prequel-mascot__dot--right"></span>
  </span>
</div>`;
// Framework-free. It follows the pointer, blinks irregularly, breathes through
// CSS, turns happy on hover, thinks on click or Enter, and worries on an error.
// Returns a cleanup function; the callers that need one use it.
export const MASCOT_RUNTIME = `
function initPrequelMascot() {
  const root = document.querySelector(".prequel-mascot");
  if (!(root instanceof HTMLElement)) return function () {};
  const disc = root.querySelector(".prequel-mascot__disc");
  if (!(disc instanceof HTMLElement)) return function () {};
  const eyes = root.querySelectorAll(".prequel-mascot__eye");
  if (eyes.length < 2) return function () {};
  const bubble = root.querySelector(".prequel-mascot__bubble");
  const quiet = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (quiet) return function () {};
  var frame = 0;
  var blinkAt = 0;
  var idleAt = 0;
  var moodAt = 0;
  var moodAt2 = 0;
  var talkAt = 0;
  var px = 0;
  var py = 0;
  var hasPointer = false;
  var alive = true;
  var original = bubble ? bubble.textContent : "";
  function center() {
    var rect = disc.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, r: rect.width / 2 };
  }
  // @ts-ignore -- kept framework-free for JS targets
  function setMood(value) {
    root.setAttribute("data-mood", value);
  }
  // @ts-ignore -- kept framework-free for JS targets
  function talk(on, text, hold = 2200) {
    if (!bubble) return;
    if (text) bubble.textContent = text;
    root.setAttribute("data-talk", on ? "true" : "false");
    if (talkAt) window.clearTimeout(talkAt);
    if (on) {
      talkAt = window.setTimeout(function () {
        root.setAttribute("data-talk", "false");
        if (bubble) bubble.textContent = original;
      }, hold);
    }
  }
  function look() {
    frame = 0;
    if (!alive || !hasPointer) return;
    var point = center();
    var dx = px - point.x;
    var dy = py - point.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var max = Math.max(2, point.r * 0.32);
    var strength = Math.min(1, distance / (point.r * 2.4));
    var x = distance ? (dx / distance) * max * strength : 0;
    var y = distance ? (dy / distance) * max * strength : 0;
    root.style.setProperty("--look-x", x.toFixed(2) + "px");
    root.style.setProperty("--look-y", y.toFixed(2) + "px");
    root.style.setProperty("--look-r", (x * 0.5).toFixed(2) + "deg");
  }
  function restLook() {
    root.style.setProperty("--look-x", "0px");
    root.style.setProperty("--look-y", "0px");
    root.style.setProperty("--look-r", "0deg");
  }
  function blink() {
    if (!alive) return;
    root.style.setProperty("--eye-scale", "0.12");
    window.setTimeout(function () {
      if (!alive) return;
      root.style.setProperty("--eye-scale", "1");
      scheduleBlink();
    }, 110);
  }
  function scheduleBlink() {
    if (!alive) return;
    blinkAt = window.setTimeout(blink, 2400 + Math.random() * 3800);
  }
  // @ts-ignore -- typed by the browser event, kept framework-free for JS targets
  function onMove(event) {
    hasPointer = true;
    px = event.clientX;
    py = event.clientY;
    if (!frame) frame = window.requestAnimationFrame(look);
    if (idleAt) window.clearTimeout(idleAt);
    idleAt = window.setTimeout(restLook, 2600);
  }
  function onEnter() {
    if (!alive) return;
    setMood("happy");
    talk(true, "Hello! Nice to see you.");
  }
  function onLeave() {
    if (!alive) return;
    setMood("idle");
    restLook();
  }
  function onActivate() {
    if (!alive) return;
    setMood("think");
    talk(true, "Thinking about it...", 1100);
    if (moodAt) window.clearTimeout(moodAt);
    if (moodAt2) window.clearTimeout(moodAt2);
    moodAt = window.setTimeout(function () {
      if (!alive) return;
      setMood("happy");
      talk(true, "There you go.");
    }, 900);
    moodAt2 = window.setTimeout(function () {
      if (!alive) return;
      setMood("idle");
      root.setAttribute("data-talk", "false");
    }, 2200);
  }
  function onError() {
    if (!alive) return;
    setMood("worried");
    talk(true, "Something went wrong. Check the console.", 3400);
    if (moodAt2) window.clearTimeout(moodAt2);
    moodAt2 = window.setTimeout(function () {
      if (!alive) return;
      setMood("idle");
      root.setAttribute("data-talk", "false");
    }, 3400);
  }
  // @ts-ignore -- typed by the browser event, kept framework-free for JS targets
  function onKey(event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onActivate();
  }
  root.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("click", onActivate);
  root.addEventListener("keydown", onKey);
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("error", onError);
  window.addEventListener("unhandledrejection", onError);
  setMood("idle");
  talk(true, original, 5200);
  scheduleBlink();
  return function () {
    alive = false;
    if (frame) window.cancelAnimationFrame(frame);
    window.clearTimeout(blinkAt);
    window.clearTimeout(idleAt);
    window.clearTimeout(moodAt);
    window.clearTimeout(moodAt2);
    window.clearTimeout(talkAt);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("error", onError);
    window.removeEventListener("unhandledrejection", onError);
    root.removeEventListener("pointerenter", onEnter);
    root.removeEventListener("pointerleave", onLeave);
    root.removeEventListener("click", onActivate);
    root.removeEventListener("keydown", onKey);
  };
}
`;
// The code cards use the same small, framework-free recipe: a highlighted
// block (built once, at generation time), a copy button, and one runtime that
// reads the visible text back. It keeps the examples readable at 13 px and
// never lets the page open a horizontal scroll of its own.
export const CODE_CSS = `
.prequel-code{--pc-bg:rgba(0,0,0,.035);--pc-border:rgba(0,0,0,.10);--pc-fg:#27272a;--pc-muted:#71717a;--pc-hover:rgba(0,0,0,.05);--pc-done:#15803d;--pc-error:#b91c1c;--pc-focus:#6366f1;--pc-key:#7c3aed;--pc-str:#0f766e;--pc-tag:#b45309;--pc-com:#71717a;--pc-pun:#52525b;margin-top:16px;border:1px solid var(--pc-border);border-radius:10px;background:var(--pc-bg);overflow:hidden}
.dark .prequel-code{--pc-bg:rgba(255,255,255,.035);--pc-border:rgba(255,255,255,.10);--pc-fg:#e4e4e7;--pc-muted:#a1a1aa;--pc-hover:rgba(255,255,255,.06);--pc-done:#4ade80;--pc-error:#f87171;--pc-focus:#818cf8;--pc-key:#c4b5fd;--pc-str:#5eead4;--pc-tag:#fcd34d;--pc-com:#a1a1aa;--pc-pun:#d4d4d8}
.prequel-code__bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 8px 6px 12px;border-bottom:1px solid var(--pc-border);background:color-mix(in oklab,currentColor 3%,transparent)}
.prequel-code__lang{font-size:13px;line-height:1;color:var(--pc-muted);letter-spacing:.04em;text-transform:lowercase}
.prequel-code__copy{font-family:inherit;font-size:13px;font-weight:500;line-height:1;color:var(--pc-fg);background:transparent;border:1px solid var(--pc-border);border-radius:6px;padding:5px 8px;cursor:pointer;transition:background .15s ease,color .15s ease,border-color .15s ease}
.prequel-code__copy:hover{background:var(--pc-hover)}
.prequel-code__copy[data-state="done"]{color:var(--pc-done);border-color:var(--pc-done)}
.prequel-code__copy[data-state="error"]{color:var(--pc-error);border-color:var(--pc-error)}
.prequel-code__copy:focus-visible{outline:2px solid var(--pc-focus);outline-offset:2px}
.prequel-code__pre{margin:0;padding:12px;overflow-x:auto;scrollbar-width:thin;font:13px/1.7 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:var(--pc-fg);tab-size:2}
.prequel-code__pre code{display:block;font:inherit;white-space:pre-wrap;overflow-wrap:break-word}
.pc-key{color:var(--pc-key)}
.pc-str{color:var(--pc-str)}
.pc-tag{color:var(--pc-tag)}
.pc-com{color:var(--pc-com);font-style:italic}
.pc-pun{color:var(--pc-pun)}
`;
export const CODE_RUNTIME = `
function initPrequelCode() {
  var roots = document.querySelectorAll("[data-prequel-code]");
  var cleanups = [];
  // @ts-ignore -- kept framework-free for JS targets
  roots.forEach(function (root) {
    var button = root.querySelector("[data-prequel-copy]");
    var code = root.querySelector("code");
    if (!button || !code) return;
    var original = button.textContent;
    var timer = 0;
    // @ts-ignore -- typed by the browser event, kept framework-free for JS targets
    function announce(ok) {
      button.textContent = ok ? "Copied" : "Copy failed";
      button.setAttribute("data-state", ok ? "done" : "error");
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        button.textContent = original;
        button.removeAttribute("data-state");
      }, 1600);
    }
    function fallback(text) {
      try {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        area.style.opacity = "0";
        document.body.appendChild(area);
        area.select();
        var ok = document.execCommand("copy");
        document.body.removeChild(area);
        announce(ok);
      } catch (error) {
        announce(false);
      }
    }
    function onCopy() {
      var text = code.textContent || "";
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(
          function () { announce(true); },
          function () { fallback(text); },
        );
        return;
      }
      fallback(text);
    }
    button.addEventListener("click", onCopy);
    cleanups.push(function () {
      button.removeEventListener("click", onCopy);
      if (timer) window.clearTimeout(timer);
    });
  });
  return function () {
    cleanups.forEach(function (dispose) { dispose(); });
  };
}
`;
function escapeHtml(value) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
/** Tiny, dependency-free highlighter for the short snippets in the cards. */
export function highlightCode(code) {
    const pattern = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.:-]*|\/?>)|(\b(?:import|from|export|default|function|return|const|let|var|async|await|new|class)\b)|([{}()[\];,])/g;
    let html = "";
    let last = 0;
    for (const match of code.matchAll(pattern)) {
        const index = match.index ?? 0;
        html += escapeHtml(code.slice(last, index));
        const [text, comment, string, tag, keyword] = match;
        const kind = comment ? "com" : string ? "str" : tag ? "tag" : keyword ? "key" : "pun";
        let body = escapeHtml(text ?? "");
        // `wbr` gives the browser a clean break opportunity inside long import
        // paths; it carries no text, so the copy button still copies exact code.
        if (kind === "str")
            body = body.replace(/\//g, "/<wbr>");
        html += `<span class="pc-${kind}">${body}</span>`;
        last = index + (text?.length ?? 0);
    }
    html += escapeHtml(code.slice(last));
    return html;
}
/** A string valid inside JS, TS, Vue, Svelte and Astro scripts. */
export function jsString(value) {
    return JSON.stringify(value)
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/\u2028/g, "\\u2028")
        .replace(/\u2029/g, "\\u2029");
}
function codeCard(code, lang) {
    const highlighted = highlightCode(code);
    return `<div class="prequel-code" data-prequel-code>
  <div class="prequel-code__bar">
    <span class="prequel-code__lang">${lang}</span>
    <button type="button" class="prequel-code__copy" data-prequel-copy aria-live="polite">Copy</button>
  </div>
  <pre class="prequel-code__pre"><code>${highlighted}</code></pre>
</div>`;
}
function jsxSnippets(paths) {
    const { button, gradient, typing } = paths;
    return [
        `import { Button } from "${button}";

export function Example() {
  return <Button>Press me</Button>;
}`,
        `import { GradientText } from "${gradient}";

export function Example() {
  return <GradientText text="Motion that feels right." />;
}`,
        `import { TypingText } from "${typing}";

export function Example() {
  return (
    <TypingText text="Typed character by character." duration={70} loop />
  );
}`,
    ].map((code) => codeCard(code, "tsx"));
}
function vueSnippets(paths) {
    const { button, gradient, typing } = paths;
    return [
        `<script setup>
import Button from "${button}";
</script>

<template>
  <Button>Press me</Button>
</template>`,
        `<script setup>
import GradientText from "${gradient}";
</script>

<template>
  <GradientText text="Motion that feels right." />
</template>`,
        `<script setup>
import TypingText from "${typing}";
</script>

<template>
  <TypingText text="Typed character by character." :duration="70" loop />
</template>`,
    ].map((code) => codeCard(code, "vue"));
}
function svelteSnippets(paths) {
    const { button, gradient, typing } = paths;
    return [
        `<script>
  import Button from "${button}";
</script>

<Button>Press me</Button>`,
        `<script>
  import GradientText from "${gradient}";
</script>

<GradientText text="Motion that feels right." />`,
        `<script>
  import TypingText from "${typing}";
</script>

<TypingText text="Typed character by character." duration={70} loop />`,
    ].map((code) => codeCard(code, "svelte"));
}
function solidSnippets(paths) {
    const { button, gradient, typing } = paths;
    return [
        `import { Button } from "${button}";

export function Example() {
  return <Button>Press me</Button>;
}`,
        `import { GradientText } from "${gradient}";

export function Example() {
  return <GradientText text="Motion that feels right." />;
}`,
        `import { TypingText } from "${typing}";

export function Example() {
  return (
    <TypingText text="Typed character by character." duration={70} loop />
  );
}`,
    ].map((code) => codeCard(code, "tsx"));
}
function astroSnippets(paths) {
    const { button, gradient, typing } = paths;
    return [
        `---
import { Button } from "${button}";
---

<Button client:visible>Press me</Button>`,
        `---
import { GradientText } from "${gradient}";
---

<GradientText client:visible text="Motion that feels right." />`,
        `---
import { TypingText } from "${typing}";
---

<TypingText client:visible text="Typed character by character." duration={70} loop />`,
    ].map((code) => codeCard(code, "astro"));
}
export function reactDemo(paths) {
    const { button, gradient, typing } = paths;
    const mascot = jsString(MASCOT_MARKUP);
    const [buttonCode, gradientCode, typingCode] = jsxSnippets(paths).map(jsString);
    return `// @ts-nocheck -- the mascot runtime is framework-free JavaScript shared by every target
import { useEffect } from "react";
import { Button } from "${button}";
import { GradientText } from "${gradient}";
import { TypingText } from "${typing}";

const STYLES = \`${MASCOT_CSS}${CODE_CSS}\`;
const MASCOT_HTML = ${mascot};
const BUTTON_CODE = ${buttonCode};
const GRADIENT_CODE = ${gradientCode};
const TYPING_CODE = ${typingCode};
${MASCOT_RUNTIME}
${CODE_RUNTIME}

export function PrequelDemo() {
  useEffect(() => {
    const stopMascot = initPrequelMascot();
    const stopCode = initPrequelCode();
    return () => {
      stopMascot();
      stopCode();
    };
  }, []);

  return (
    <main className="min-h-svh bg-background px-6 py-12 text-left text-foreground">
      <div className="mx-auto w-full max-w-[980px]">
        <header>
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            PrequelUI Animate
          </p>
          <h1 className="mt-3 text-[32px] font-medium leading-[1.12] tracking-[-0.03em]">
            <GradientText text="Your first animated page" />
          </h1>
          <p className="mt-3 max-w-[520px] text-[15px] leading-6 text-muted-foreground">
            One command installed the registry, the motion helpers and this page.
            Each card is a real component from the registry, with its code beside it.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Button>Press me</Button>
            <span className="inline-flex h-10 items-center rounded-lg border px-3 text-[13px] text-muted-foreground">
              Reduced motion respected
            </span>
          </div>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <article className="min-w-0 rounded-2xl border bg-card p-5">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Button</p>
            <div className="mt-4 flex h-16 items-center"><Button>Press me</Button></div>
            <div dangerouslySetInnerHTML={{ __html: BUTTON_CODE }} />
          </article>
          <article className="min-w-0 rounded-2xl border bg-card p-5">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Gradient Text</p>
            <div className="mt-4 flex h-16 items-center"><GradientText text="Motion that feels right." className="text-[22px]" /></div>
            <div dangerouslySetInnerHTML={{ __html: GRADIENT_CODE }} />
          </article>
          <article className="min-w-0 rounded-2xl border bg-card p-5">
            <p className="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Typing Text</p>
            <div className="mt-4 flex h-16 items-center"><TypingText text="Typed character by character." duration={70} loop className="text-[15px]" /></div>
            <div dangerouslySetInnerHTML={{ __html: TYPING_CODE }} />
          </article>
        </section>

        <footer className="mt-10 flex flex-wrap gap-4 text-[13px]">
          <a className="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/components">Browse components</a>
          <a className="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/docs">Documentation</a>
          <a className="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/icons">Icon gallery</a>
        </footer>
      </div>

      <div dangerouslySetInnerHTML={{ __html: MASCOT_HTML }} />
      <style>{STYLES}</style>
    </main>
  );
}
`;
}
export function viteReactEntry(button, gradient) {
    return `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PrequelDemo } from "./prequelui-demo";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PrequelDemo />
  </StrictMode>,
);
`;
}
export function viteHtml(entry, title) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${entry}"></script>
  </body>
</html>
`;
}
export function vueDemo(paths) {
    const { button, gradient, typing } = paths;
    const [buttonCode, gradientCode, typingCode] = vueSnippets(paths).map(jsString);
    return `<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Button from "${button}";
import GradientText from "${gradient}";
import TypingText from "${typing}";

const BUTTON_CODE = ${buttonCode};
const GRADIENT_CODE = ${gradientCode};
const TYPING_CODE = ${typingCode};
${MASCOT_RUNTIME}
${CODE_RUNTIME}
let stopMascot = () => {};
let stopCode = () => {};
onMounted(() => {
  stopMascot = initPrequelMascot();
  stopCode = initPrequelCode();
});
onBeforeUnmount(() => {
  stopMascot();
  stopCode();
});
</script>

<template>
  <main class="min-h-svh bg-background px-6 py-12 text-left text-foreground">
    <div class="mx-auto w-full max-w-[980px]">
      <header>
        <p class="text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">PrequelUI Animate</p>
        <h1 class="mt-3 text-[32px] font-medium leading-[1.12] tracking-[-0.03em]">
          <GradientText text="Your first animated page" />
        </h1>
        <p class="mt-3 max-w-[520px] text-[15px] leading-6 text-muted-foreground">
          One command installed the registry, the motion helpers and this page.
          Each card is a real component from the registry, with its code beside it.
        </p>
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <Button>Press me</Button>
          <span class="inline-flex h-10 items-center rounded-lg border px-3 text-[13px] text-muted-foreground">Reduced motion respected</span>
        </div>
      </header>

      <section class="mt-10 grid gap-4 md:grid-cols-3">
        <article class="min-w-0 rounded-2xl border bg-card p-5">
          <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Button</p>
          <div class="mt-4 flex h-16 items-center"><Button>Press me</Button></div>
          <div v-html="BUTTON_CODE"></div>
        </article>
        <article class="min-w-0 rounded-2xl border bg-card p-5">
          <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Gradient Text</p>
          <div class="mt-4 flex h-16 items-center"><GradientText text="Motion that feels right." /></div>
          <div v-html="GRADIENT_CODE"></div>
        </article>
        <article class="min-w-0 rounded-2xl border bg-card p-5">
          <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Typing Text</p>
          <div class="mt-4 flex h-16 items-center"><TypingText text="Typed character by character." :duration="70" loop /></div>
          <div v-html="TYPING_CODE"></div>
        </article>
      </section>

      <footer class="mt-10 flex flex-wrap gap-4 text-[13px]">
        <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/components">Browse components</a>
        <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/docs">Documentation</a>
        <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/icons">Icon gallery</a>
      </footer>
    </div>

    ${MASCOT_MARKUP}
  </main>
</template>

<style>
${MASCOT_CSS}
${CODE_CSS}
</style>
`;
}
export function vueEntry() {
    return `import { createApp } from "vue";
import Demo from "./PrequelDemo.vue";
import "./style.css";

createApp(Demo).mount("#root");
`;
}
export function svelteDemo(paths) {
    const { button, gradient, typing } = paths;
    const [buttonCode, gradientCode, typingCode] = svelteSnippets(paths).map(jsString);
    return `<script>
  import { onMount } from "svelte";
  import Button from "${button}";
  import GradientText from "${gradient}";
  import TypingText from "${typing}";

  const BUTTON_CODE = ${buttonCode};
  const GRADIENT_CODE = ${gradientCode};
  const TYPING_CODE = ${typingCode};
${MASCOT_RUNTIME}
${CODE_RUNTIME}
  onMount(() => {
    const stopMascot = initPrequelMascot();
    const stopCode = initPrequelCode();
    return () => {
      stopMascot();
      stopCode();
    };
  });
</script>

<main class="min-h-svh bg-background px-6 py-12 text-left text-foreground">
  <div class="mx-auto w-full max-w-[980px]">
    <header>
      <p class="text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">PrequelUI Animate</p>
      <h1 class="mt-3 text-[32px] font-medium leading-[1.12] tracking-[-0.03em]">
        <GradientText text="Your first animated page" />
      </h1>
      <p class="mt-3 max-w-[520px] text-[15px] leading-6 text-muted-foreground">
        One command installed the registry, the motion helpers and this page.
        Each card is a real component from the registry, with its code beside it.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-2">
        <Button>Press me</Button>
        <span class="inline-flex h-10 items-center rounded-lg border px-3 text-[13px] text-muted-foreground">Reduced motion respected</span>
      </div>
    </header>

    <section class="mt-10 grid gap-4 md:grid-cols-3">
      <article class="min-w-0 rounded-2xl border bg-card p-5">
        <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Button</p>
        <div class="mt-4 flex h-16 items-center"><Button>Press me</Button></div>
        <div>{@html BUTTON_CODE}</div>
      </article>
      <article class="min-w-0 rounded-2xl border bg-card p-5">
        <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Gradient Text</p>
        <div class="mt-4 flex h-16 items-center"><GradientText text="Motion that feels right." /></div>
        <div>{@html GRADIENT_CODE}</div>
      </article>
      <article class="min-w-0 rounded-2xl border bg-card p-5">
        <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Typing Text</p>
        <div class="mt-4 flex h-16 items-center"><TypingText text="Typed character by character." duration={70} loop /></div>
        <div>{@html TYPING_CODE}</div>
      </article>
    </section>

    <footer class="mt-10 flex flex-wrap gap-4 text-[13px]">
      <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/components">Browse components</a>
      <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/docs">Documentation</a>
      <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/icons">Icon gallery</a>
    </footer>
  </div>

  ${MASCOT_MARKUP}
</main>

<style>
${MASCOT_CSS}
${CODE_CSS}
</style>
`;
}
export function svelteEntry() {
    return `import { mount } from "svelte";
import Demo from "./PrequelDemo.svelte";
import "./app.css";

mount(Demo, { target: document.getElementById("root")! });
`;
}
export function solidDemo(paths) {
    const { button, gradient, typing } = paths;
    const mascot = jsString(MASCOT_MARKUP);
    const [buttonCode, gradientCode, typingCode] = solidSnippets(paths).map(jsString);
    return `// @ts-nocheck -- the mascot and code runtimes are framework-free JavaScript shared by every target
import { onCleanup, onMount } from "solid-js";
import { Button } from "${button}";
import { GradientText } from "${gradient}";
import { TypingText } from "${typing}";

const STYLES = \`${MASCOT_CSS}${CODE_CSS}\`;
const MASCOT_HTML = ${mascot};
const BUTTON_CODE = ${buttonCode};
const GRADIENT_CODE = ${gradientCode};
const TYPING_CODE = ${typingCode};
${MASCOT_RUNTIME}
${CODE_RUNTIME}

export default function PrequelDemo() {
  onMount(() => {
    const stopMascot = initPrequelMascot();
    const stopCode = initPrequelCode();
    onCleanup(() => {
      stopMascot();
      stopCode();
    });
  });
  return (
    <main class="min-h-svh bg-background px-6 py-12 text-left text-foreground">
      <div class="mx-auto w-full max-w-[980px]">
        <header>
          <p class="text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">PrequelUI Animate</p>
          <h1 class="mt-3 text-[32px] font-medium leading-[1.12] tracking-[-0.03em]">
            <GradientText text="Your first animated page" />
          </h1>
          <p class="mt-3 max-w-[520px] text-[15px] leading-6 text-muted-foreground">
            One command installed the registry, the motion helpers and this page.
            Each card is a real component from the registry, with its code beside it.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-2">
            <Button>Press me</Button>
            <span class="inline-flex h-10 items-center rounded-lg border px-3 text-[13px] text-muted-foreground">Reduced motion respected</span>
          </div>
        </header>

        <section class="mt-10 grid gap-4 md:grid-cols-3">
          <article class="min-w-0 rounded-2xl border bg-card p-5">
            <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Button</p>
            <div class="mt-4 flex h-16 items-center"><Button>Press me</Button></div>
            <div innerHTML={BUTTON_CODE} />
          </article>
          <article class="min-w-0 rounded-2xl border bg-card p-5">
            <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Gradient Text</p>
            <div class="mt-4 flex h-16 items-center"><GradientText text="Motion that feels right." /></div>
            <div innerHTML={GRADIENT_CODE} />
          </article>
          <article class="min-w-0 rounded-2xl border bg-card p-5">
            <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Typing Text</p>
            <div class="mt-4 flex h-16 items-center"><TypingText text="Typed character by character." duration={70} loop /></div>
            <div innerHTML={TYPING_CODE} />
          </article>
        </section>

        <footer class="mt-10 flex flex-wrap gap-4 text-[13px]">
          <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/components">Browse components</a>
          <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/docs">Documentation</a>
          <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/icons">Icon gallery</a>
        </footer>
      </div>

      <div innerHTML={MASCOT_HTML} />
      <style>{STYLES}</style>
    </main>
  );
}
`;
}
export function solidEntry(demo) {
    return `/* @refresh reload */
import { render } from "solid-js/web";
import Demo from "${demo}";
import "./index.css";

render(() => <Demo />, document.getElementById("root")!);
`;
}
export function astroDemo(paths, css = "../styles/global.css") {
    const { button, gradient, typing } = paths;
    const cssImport = css ? `import "${css}";\n` : "";
    const [buttonCode, gradientCode, typingCode] = astroSnippets(paths).map(jsString);
    return `---
import { Button } from "${button}";
import { GradientText } from "${gradient}";
import { TypingText } from "${typing}";
${cssImport}
const BUTTON_CODE = ${buttonCode};
const GRADIENT_CODE = ${gradientCode};
const TYPING_CODE = ${typingCode};
---

<main class="min-h-svh bg-background px-6 py-12 text-left text-foreground">
  <div class="mx-auto w-full max-w-[980px]">
    <header>
      <p class="text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">PrequelUI Animate</p>
      <h1 class="mt-3 text-[32px] font-medium leading-[1.12] tracking-[-0.03em]">
        <GradientText client:visible text="Your first animated page" />
      </h1>
      <p class="mt-3 max-w-[520px] text-[15px] leading-6 text-muted-foreground">
        One command installed the registry, the motion helpers and this page.
        Each card is a real component from the registry, with its code beside it.
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-2">
        <Button client:visible>Press me</Button>
        <span class="inline-flex h-10 items-center rounded-lg border px-3 text-[13px] text-muted-foreground">Reduced motion respected</span>
      </div>
    </header>

    <section class="mt-10 grid gap-4 md:grid-cols-3">
      <article class="min-w-0 rounded-2xl border bg-card p-5">
        <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Button</p>
        <div class="mt-4 flex h-16 items-center"><Button client:visible>Press me</Button></div>
        <div set:html={BUTTON_CODE} />
      </article>
      <article class="min-w-0 rounded-2xl border bg-card p-5">
        <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Gradient Text</p>
        <div class="mt-4 flex h-16 items-center"><GradientText client:visible text="Motion that feels right." /></div>
        <div set:html={GRADIENT_CODE} />
      </article>
      <article class="min-w-0 rounded-2xl border bg-card p-5">
        <p class="text-[13px] font-medium uppercase tracking-[0.16em] text-muted-foreground">Typing Text</p>
        <div class="mt-4 flex h-16 items-center"><TypingText client:visible text="Typed character by character." duration={70} loop /></div>
        <div set:html={TYPING_CODE} />
      </article>
    </section>

    <footer class="mt-10 flex flex-wrap gap-4 text-[13px]">
      <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/components">Browse components</a>
      <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/docs">Documentation</a>
      <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/icons">Icon gallery</a>
    </footer>
  </div>

  ${MASCOT_MARKUP}
</main>

<style>
${MASCOT_CSS}
${CODE_CSS}
</style>

<script is:inline>
${MASCOT_RUNTIME}
${CODE_RUNTIME}
initPrequelMascot();
initPrequelCode();
</script>
`;
}
export function vanillaHtml(dialogPath) {
    return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>PrequelUI Animate</title>
    <script>
      const saved = localStorage.getItem("theme");
      const dark =
        saved === "dark" ||
        (!saved && matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    </script>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
      @custom-variant dark (&:where(.dark, .dark *));
      @theme inline {
        --color-background: var(--background);
        --color-foreground: var(--foreground);
        --color-muted-foreground: var(--muted-foreground);
        --color-accent: var(--accent);
        --color-border: var(--border);
        --color-popover: var(--popover);
        --color-popover-foreground: var(--popover-foreground);
      }
      ${MASCOT_CSS}
      :root {
        --background: oklch(1 0 0);
        --foreground: oklch(0.145 0 0);
        --muted-foreground: oklch(0.556 0 0);
        --accent: oklch(0.97 0 0);
        --border: oklch(0.922 0 0);
        --popover: oklch(1 0 0);
        --popover-foreground: oklch(0.145 0 0);
      }
      .dark {
        --background: oklch(0.145 0 0);
        --foreground: oklch(0.985 0 0);
        --muted-foreground: oklch(0.708 0 0);
        --accent: oklch(0.269 0 0);
        --border: oklch(1 0 0 / 10%);
        --popover: oklch(0.205 0 0);
        --popover-foreground: oklch(0.985 0 0);
      }
    </style>
  </head>
  <body class="grid min-h-svh place-items-center bg-background text-foreground">
    <main class="w-full max-w-[560px] rounded-2xl border bg-background p-8">
      <p class="text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        PrequelUI Animate
      </p>
      <h1 class="mt-3 text-[32px] font-medium leading-[1.15] tracking-[-0.03em]">
        Your first animated page
      </h1>
      <p class="mt-3 max-w-[440px] text-[15px] leading-6 text-muted-foreground">
        The framework-free dialog creates its markup, its styles and its
        reduced-motion branch.
      </p>
      <div id="app" class="mt-6"></div>
      <footer class="mt-8 flex flex-wrap gap-4 border-t pt-5 text-[13px]">
        <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/components">Browse components</a>
        <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/docs">Documentation</a>
        <a class="font-medium underline decoration-border underline-offset-4" href="${DEMO_SITE}/icons">Icon gallery</a>
      </footer>
    </main>
    ${MASCOT_MARKUP}
    <script>
${MASCOT_RUNTIME}
initPrequelMascot();
    </script>
    <script type="module">
      import { createDialog } from "./${dialogPath}";

      createDialog(document.getElementById("app"), {
        trigger: "Open the dialog",
        title: "PrequelUI Animate",
        description: "A small page, one file, no build step.",
      });
    </script>
  </body>
</html>
`;
}
export const NUXT_CSS = `@import "tailwindcss";
@source "../../";
@source "../../../components";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}
`;
export const SOLID_CSS = `@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
}
`;
export const SOLID_COMPONENTS_JSON = (css) => `{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "${css}",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils",
    "ui": "~/components/ui",
    "lib": "~/lib",
    "hooks": "~/hooks"
  },
  "iconLibrary": "lucide"
}
`;
export const VITE_REACT_CONFIG = `import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
});
`;
export const VITE_VUE_CONFIG = `import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "./src") } },
});
`;
export const VITE_SVELTE_CONFIG = `import tailwindcss from "@tailwindcss/vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [svelte(), tailwindcss()],
});
`;
export const VITE_SOLID_CONFIG = `import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid(), tailwindcss()],
  resolve: { alias: { "~": path.resolve(import.meta.dirname, "./src") } },
});
`;
export const SOLID_START_CONFIG = `import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";

export default defineConfig({
  plugins: [solidStart(), tailwindcss(), nitro()],
});
`;
export const NUXT_CONFIG = `import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2026-01-01",
  css: ["~/assets/css/main.css"],
  alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  vite: { plugins: [tailwindcss()] },
});
`;
export const POSTCSS_V4 = `export default { plugins: { "@tailwindcss/postcss": {} } };
`;
