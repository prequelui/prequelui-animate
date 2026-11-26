// @ts-nocheck
/*
 * Framework-neutral runtime for the Linear-style isometric objects.
 *
 * The static SVG is generated at build time; this runtime only adds the depth
 * press, the neighbour lift, the 45 ms stagger and the colour transition. Vue,
 * Svelte, Solid and vanilla wrappers mount it.
 */
export const LINEAR_TIMING = {
  sink: 6.5,
  lift: 2.2,
  depth: 700,
  stagger: 45,
  color: 260,
  touchLeave: 1400,
};

const ZH = Math.sqrt(1 - 0.5 * 0.5);
const STYLE_ID = "prequel-linear-runtime-style";
const COLLAPSE = /[\s,]+/;

function escape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const STYLE = `[data-linear-scene]{position:relative;}
[data-linear-scene] svg{display:block;width:100%;height:100%;touch-action:pan-y;user-select:none;}
[data-linear-scene] [data-linear-block]{transition:transform ${LINEAR_TIMING.depth}ms cubic-bezier(0.32,0.72,0,1);will-change:transform;}
[data-linear-scene] path{transition:stroke ${LINEAR_TIMING.color}ms cubic-bezier(0.5,0,0.1,1),fill ${LINEAR_TIMING.color}ms cubic-bezier(0.5,0,0.1,1);}
[data-linear-scene] [data-linear-block].ls-active > path[stroke]:not([stroke="none"]){stroke:var(--ls-hi);}
[data-linear-scene] [data-linear-block].ls-active > path[fill]:not([fill="none"]):not([fill="var(--ls-plate)"]){fill:var(--ls-hi);}
[data-linear-scene][data-linear-reduced="true"] [data-linear-block]{transition:none;}
@media (prefers-reduced-motion: reduce){[data-linear-scene] [data-linear-block]{transition:none;}}`;

const VARS = [
  "--ls-plate:light-dark(#ffffff,#0a0a0a)",
  "--ls-edge:light-dark(oklch(0.43 0 0),oklch(0.79 0 0))",
  "--ls-lo:light-dark(oklch(0.7 0 0),oklch(0.44 0 0))",
  "--ls-mid:light-dark(oklch(0.53 0 0),oklch(0.6 0 0))",
  "--ls-well:light-dark(oklch(0.6 0 0),oklch(0.52 0 0))",
  "--ls-hi:light-dark(oklch(0.13 0 0),oklch(0.995 0 0))",
].join(";");

function ensureStyle() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = STYLE;
  document.head.appendChild(style);
}

export function renderLinearScene(svg, options = {}) {
  const label = options.label;
  const className = options.className
    ? ` class="${escape(options.className)}"`
    : "";
  const a11y =
    label === undefined
      ? ' role="img"'
      : label
        ? ` role="img" aria-label="${escape(label)}"`
        : ' aria-hidden="true"';
  return `<div${className} data-linear-scene data-linear-reduced="false"${a11y} style="aspect-ratio:5 / 4;position:relative;${VARS}">${svg}</div>`;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function bindLinearScene(host, options = {}) {
  ensureStyle();
  const root = host.querySelector("[data-linear-scene]");
  if (!root) return { replay() {}, destroy() {} };
  const groups = Array.from(root.querySelectorAll("[data-linear-block]"));
  const interactive = options.interactive !== false;
  const reduced = prefersReducedMotion();
  const first = groups.findIndex((group) => !group.hasAttribute("data-linear-static"));
  const restingIndex =
    typeof options.active === "number" && options.active >= 0
      ? options.active
      : first >= 0
        ? first
        : 0;
  let active = restingIndex;
  let timers = [];
  let leaveTimer = 0;

  root.setAttribute("data-linear-reduced", reduced ? "true" : "false");

  function clearTimers() {
    for (const timer of timers) window.clearTimeout(timer);
    timers = [];
    if (leaveTimer) {
      window.clearTimeout(leaveTimer);
      leaveTimer = 0;
    }
  }

  function paint(index, down) {
    active = index;
    groups.forEach((group, groupIndex) => {
      const fixed = group.hasAttribute("data-linear-static");
      const pressed = down && !fixed && !reduced;
      let value = 0;
      let delay = 0;
      if (pressed && groupIndex === index) {
        value = LINEAR_TIMING.sink * ZH;
      } else if (pressed) {
        value = -LINEAR_TIMING.lift * ZH;
        delay = Math.abs(groupIndex - index) * LINEAR_TIMING.stagger;
      }
      group.style.transitionDelay = `${delay}ms`;
      group.style.transform = value ? `translateY(${value.toFixed(3)}px)` : "";
      const lit = !fixed && groupIndex === index;
      group.classList.toggle("ls-active", lit);
    });
  }

  function activate(index) {
    if (!interactive || reduced) return;
    if (leaveTimer) {
      window.clearTimeout(leaveTimer);
      leaveTimer = 0;
    }
    paint(index, true);
  }

  function rest() {
    paint(restingIndex, false);
  }

  const listeners = [];
  groups.forEach((group, index) => {
    if (group.hasAttribute("data-linear-static")) return;
    const enter = () => activate(index);
    const down = () => activate(index);
    group.addEventListener("pointerenter", enter);
    group.addEventListener("pointerdown", down);
    listeners.push([group, "pointerenter", enter], [group, "pointerdown", down]);
  });

  function onSvgLeave(event) {
    if (!interactive || reduced) return;
    if (event?.pointerType === "touch") {
      if (leaveTimer) window.clearTimeout(leaveTimer);
      leaveTimer = window.setTimeout(rest, LINEAR_TIMING.touchLeave);
      return;
    }
    rest();
  }

  function onSvgDown(event) {
    if (!interactive || reduced) return;
    if (event?.pointerType !== "touch") return;
    if (leaveTimer) window.clearTimeout(leaveTimer);
    leaveTimer = window.setTimeout(rest, LINEAR_TIMING.touchLeave);
  }

  const svg = root.querySelector("svg");
  if (svg) {
    svg.addEventListener("pointerleave", onSvgLeave);
    svg.addEventListener("pointerup", onSvgDown);
    svg.addEventListener("pointercancel", onSvgDown);
    listeners.push(
      [svg, "pointerleave", onSvgLeave],
      [svg, "pointerup", onSvgDown],
      [svg, "pointercancel", onSvgDown],
    );
  }

  rest();

  function replay() {
    clearTimers();
    if (reduced || !interactive) return;
    const indices = groups
      .map((group, index) =>
        group.hasAttribute("data-linear-static") ? -1 : index,
      )
      .filter((index) => index >= 0);
    indices.forEach((index, order) => {
      timers.push(
        window.setTimeout(() => paint(index, true), 140 + order * 880),
      );
    });
    timers.push(window.setTimeout(rest, 140 + indices.length * 880));
  }

  return {
    replay,
    destroy() {
      clearTimers();
      for (const [element, event, handler] of listeners) {
        element.removeEventListener(event, handler);
      }
    },
  };
}
