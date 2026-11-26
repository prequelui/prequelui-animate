/*
 * Framework-neutral runtime for the five imported icon families.
 *
 * It renders one SVG from a plain set definition and replays the same group
 * and accent recipes as the React frame, using motion's imperative animate().
 * Vue, Svelte, Solid and vanilla wrappers only mount this runtime.
 */
import { animate } from "motion";

const SHAPES = new Set([
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
]);

const T = (duration, ease = "easeInOut") => ({ duration, ease });

const recipe = (group, accent = [{}, {}]) => ({
  group: { initial: group[0], animate: group[1] },
  accent: { initial: accent[0], animate: accent[1] },
});

export const SET_MOTIONS = {
  ring: recipe(
    [
      { rotate: 0 },
      {
        rotate: [0, 18, -12, 8, -4, 0],
        transformOrigin: "top center",
        transition: T(0.9),
      },
    ],
    [
      { y: 0, x: 0 },
      { y: [0, 1, -0.5, 0], x: [0, -2, 1.5, -1, 0], transition: T(1.05) },
    ],
  ),
  beat: recipe(
    [{ scale: 1 }, { scale: [1, 1.16, 0.96, 1.08, 1], transition: T(0.75) }],
    [{ opacity: 1 }, { opacity: [1, 0.55, 1], transition: T(0.75) }],
  ),
  slideRight: recipe(
    [{ x: 0 }, { x: [0, 3, 0], transition: T(0.55) }],
    [{ x: 0 }, { x: [0, -1, 0], transition: T(0.55) }],
  ),
  slideLeft: recipe(
    [{ x: 0 }, { x: [0, -3, 0], transition: T(0.55) }],
    [{ x: 0 }, { x: [0, 1, 0], transition: T(0.55) }],
  ),
  slideUp: recipe(
    [{ y: 0 }, { y: [0, -3, 0], transition: T(0.55) }],
    [{ y: 0 }, { y: [0, 1, 0], transition: T(0.55) }],
  ),
  slideDown: recipe(
    [{ y: 0 }, { y: [0, 3, 0], transition: T(0.55) }],
    [{ y: 0 }, { y: [0, -1, 0], transition: T(0.55) }],
  ),
  rise: recipe(
    [{ y: 0 }, { y: [0, -2.5, 0], transition: T(0.6) }],
    [{ y: 0 }, { y: [0, 2, -1, 0], transition: T(0.6) }],
  ),
  drop: recipe(
    [{ y: 0 }, { y: [0, 2.5, 0], transition: T(0.6) }],
    [{ y: 0 }, { y: [0, -2, 1, 0], transition: T(0.6) }],
  ),
  focus: recipe(
    [{ scale: 1 }, { scale: [1, 1.06, 1], transition: T(0.6) }],
    [
      { pathLength: 1, opacity: 1 },
      { pathLength: [0.2, 1], opacity: [0.35, 1], transition: T(0.5, "easeOut") },
    ],
  ),
  mail: recipe(
    [{ scale: 1 }, { scale: [1, 1.05, 1], transition: T(0.6) }],
    [
      { y: 0, pathLength: 1 },
      { y: [0, -1.5, 0], pathLength: [0.2, 1], transition: T(0.6) },
    ],
  ),
  chat: recipe(
    [
      { scale: 1, y: 0 },
      { scale: [1, 1.05, 1], y: [0, -1.5, 0], transition: T(0.6) },
    ],
    [
      { opacity: 0.4 },
      { opacity: [0.4, 1, 0.4], transition: T(0.6) },
    ],
  ),
  trash: recipe(
    [{ y: 0 }, { y: [0, -1.5, 0], transition: T(0.55) }],
    [
      { y: 0, rotate: 0 },
      { y: [0, -2.5, 0], rotate: [0, -8, 0], transition: T(0.55) },
    ],
  ),
  copy: recipe(
    [
      { x: 0, y: 0 },
      { x: [0, -2, 0], y: [0, -2, 0], transition: T(0.5) },
    ],
    [
      { x: 0, y: 0 },
      { x: [0, 2, 0], y: [0, 2, 0], transition: T(0.5) },
    ],
  ),
  check: recipe(
    [{ scale: 1 }, { scale: [1, 1.08, 1], transition: T(0.5, "easeOut") }],
    [
      { pathLength: 1, opacity: 1 },
      { pathLength: [0, 1], opacity: [0.3, 1], transition: T(0.5, "easeOut") },
    ],
  ),
  plus: recipe([
    { rotate: 0, scale: 1 },
    { rotate: [0, 90, 0], scale: [1, 1.08, 1], transition: T(0.55) },
  ]),
  close: recipe([
    { rotate: 0, scale: 1 },
    { rotate: [0, -8, 0], scale: [1, 0.9, 1], transition: T(0.5, "easeOut") },
  ]),
  lock: recipe(
    [{ rotate: 0 }, { rotate: [0, -6, 6, 0], transition: T(0.6) }],
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.6) }],
  ),
  eye: recipe(
    [
      { scaleY: 1 },
      { scaleY: [1, 0.15, 1], transformOrigin: "center", transition: T(0.65) },
    ],
    [{ scale: 1 }, { scale: [1, 0.6, 1], transition: T(0.65) }],
  ),
  star: recipe(
    [
      { rotate: 0, scale: 1 },
      {
        rotate: [0, -16, 12, -6, 0],
        scale: [1, 1.14, 1],
        transformOrigin: "center",
        transition: T(0.8),
      },
    ],
    [{ opacity: 0 }, { opacity: [0, 0.4, 0], transition: T(0.8) }],
  ),
  bookmark: recipe(
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.6) }],
    [{ opacity: 0 }, { opacity: [0, 0.5, 0], transition: T(0.6) }],
  ),
  gear: recipe(
    [{ rotate: 0 }, { rotate: [0, 30, 0], transition: T(0.7) }],
    [{ opacity: 0.6 }, { opacity: [0.6, 1, 0.6], transition: T(0.7) }],
  ),
  bounce: recipe(
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.5, "easeOut") }],
    [{ y: 0 }, { y: [0, -1, 0], transition: T(0.5, "easeOut") }],
  ),
  coin: recipe(
    [
      { rotate: 0, scale: 1 },
      { rotate: [0, -10, 10, 0], scale: [1, 1.06, 1], transition: T(0.7) },
    ],
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.7) }],
  ),
  float: recipe(
    [
      { x: 0, y: 0 },
      { x: [0, 1.5, 0], y: [0, -1, 0], transition: T(1.1) },
    ],
    [{ opacity: 0.5 }, { opacity: [0.5, 1, 0.5], transition: T(1.1) }],
  ),
  clock: recipe(
    [{ rotate: 0 }, { rotate: [0, 0, 0], transition: T(0.1) }],
    [
      { rotate: 0 },
      { rotate: [0, 40, 0], transformOrigin: "center", transition: T(0.8) },
    ],
  ),
  flip: recipe(
    [
      { rotate: 0, scale: 1 },
      { rotate: [0, 10, -6, 0], scale: [1, 1.05, 1], transition: T(0.7) },
    ],
    [{ y: 0 }, { y: [0, -2, 0], transition: T(0.7) }],
  ),
  sun: recipe(
    [{ rotate: 0 }, { rotate: [0, 40, 0], transition: T(0.9) }],
    [
      { pathLength: 1 },
      { pathLength: [0.4, 1], transition: T(0.7, "easeOut") },
    ],
  ),
  moon: recipe(
    [
      { rotate: 0, y: 0 },
      { rotate: [0, -18, 0], y: [0, 1.5, 0], transition: T(0.8) },
    ],
    [{ opacity: 0.5 }, { opacity: [0.5, 0.9, 0.5], transition: T(0.8) }],
  ),
  signal: recipe(
    [{ scale: 1 }, { scale: [1, 1.06, 1], transition: T(0.6) }],
    [{ opacity: 0.3 }, { opacity: [0.3, 1, 0.3], transition: T(0.6) }],
  ),
  charge: recipe(
    [{ scaleY: 1 }, { scaleY: [1, 1.04, 1], transition: T(0.6) }],
    [
      { scaleY: 1 },
      {
        scaleY: [1, 1.15, 1],
        transformOrigin: "bottom center",
        transition: T(0.6),
      },
    ],
  ),
  grow: recipe(
    [{ y: 0 }, { y: [0, -1.5, 0], transition: T(0.6) }],
    [
      { scaleY: 1 },
      {
        scaleY: [0.65, 1.05, 1],
        transformOrigin: "bottom center",
        transition: T(0.5, "easeOut"),
      },
    ],
  ),
  shield: recipe(
    [{ scale: 1 }, { scale: [1, 1.05, 1], transition: T(0.6) }],
    [
      { pathLength: 1 },
      { pathLength: [0.4, 1], transition: T(0.6, "easeOut") },
    ],
  ),
  shake: recipe(
    [{ x: 0 }, { x: [0, -2, 2, -1.5, 0], transition: T(0.55) }],
    [{ opacity: 1 }, { opacity: [1, 0.6, 1], transition: T(0.55) }],
  ),
  pop: recipe(
    [{ scale: 1 }, { scale: [1, 1.08, 0.98, 1], transition: T(0.5, "easeOut") }],
    [{ opacity: 0.6 }, { opacity: [0.6, 1], transition: T(0.5) }],
  ),
  file: recipe(
    [
      { y: 0, rotate: 0 },
      { y: [0, -1.5, 0], rotate: [0, -3, 0], transition: T(0.6) },
    ],
    [
      { pathLength: 1, opacity: 1 },
      { pathLength: [0.3, 1], opacity: [0.4, 1], transition: T(0.55, "easeOut") },
    ],
  ),
  spin: recipe([
    { rotate: 0 },
    { rotate: [0, 360], transition: { duration: 1, ease: "linear" } },
  ]),
  press: recipe(
    [{ scale: 1 }, { scale: [1, 0.94, 1], transition: T(0.4, "easeOut") }],
    [{ opacity: 1 }, { opacity: [1, 0.7, 1], transition: T(0.4) }],
  ),
  sway: recipe(
    [{ rotate: 0 }, { rotate: [0, -6, 5, -3, 0], transition: T(0.6) }],
    [{ x: 0 }, { x: [0, 1, -1, 0], transition: T(0.6) }],
  ),
  orbit: recipe(
    [{ rotate: 0 }, { rotate: [0, 12, -6, 0], transition: T(1) }],
    [
      { pathLength: 1 },
      { pathLength: [0.2, 1], transition: T(0.6, "easeOut") },
    ],
  ),
};

const TIME_KEYS = new Set([
  "duration",
  "delay",
  "repeatDelay",
  "delayChildren",
  "staggerChildren",
]);

function escape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function kebab(key) {
  return key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function attrsString(attrs) {
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${kebab(key)}="${escape(value)}"`)
    .join(" ");
}

export function viewBoxSize(viewBox) {
  const numbers = String(viewBox || "0 0 24 24")
    .split(/[\s,]+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
  if (numbers.length !== 4 || numbers[2] <= 0) return 24;
  return numbers[2];
}

export function renderSetIcon(definition, options = {}) {
  const size = options.size ?? 28;
  const className = options.className
    ? ` class="${escape(options.className)}"`
    : "";
  const label = options.label
    ? ` role="img" aria-label="${escape(options.label)}"`
    : ' aria-hidden="true"';
  const stroke = definition.mode !== "fill";
  const accents = definition.accents ?? [];
  const pieces = [];

  definition.parts.forEach((part, index) => {
    if (!SHAPES.has(part.tag)) return;
    const attrs = { ...(part.attrs ?? {}) };
    if (accents.includes(index)) attrs["data-set-accent"] = "";
    pieces.push(`<${part.tag} ${attrsString(attrs)} />`);
  });

  const paint = stroke
    ? `fill="none" stroke="currentColor" stroke-width="${definition.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"`
    : 'fill="currentColor" stroke="none"';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${escape(
    size,
  )}" height="${escape(
    size,
  )}" viewBox="${escape(
    definition.viewBox,
  )}" ${paint}${label}${className} data-slot="prequel-set-icon" data-icon-set="${
    stroke ? "outline" : "fill"
  }">${pieces.join("")}</svg>`;
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function scaleTransition(transition, factor) {
  if (!transition || factor === 1) return { ...(transition ?? {}) };
  const next = {};
  for (const [key, value] of Object.entries(transition)) {
    if (typeof value === "number" && TIME_KEYS.has(key)) next[key] = value * factor;
    else if (isPlainObject(value)) next[key] = scaleTransition(value, factor);
    else next[key] = value;
  }
  return next;
}

function scaleCoord(value, factor) {
  if (factor === 1) return value;
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "number" ? item * factor : item,
    );
  }
  return typeof value === "number" ? value * factor : value;
}

function stripVariant(variant) {
  if (!variant || typeof variant !== "object") {
    return { values: {}, transition: {}, transformOrigin: undefined };
  }
  const { transition, transformOrigin, ...values } = variant;
  return { values, transition: transition ?? {}, transformOrigin };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function prepareValues(values, coordFactor) {
  const next = {};
  for (const [key, value] of Object.entries(values)) {
    next[key] = key === "x" || key === "y" ? scaleCoord(value, coordFactor) : value;
  }
  return next;
}

export function bindSetIcon(host, definition, options = {}) {
  const read = typeof options === "function" ? options : () => options;
  const base = SET_MOTIONS[definition.motion] ?? SET_MOTIONS.pop;
  const factor = viewBoxSize(definition.viewBox) / 24;
  let timer = 0;
  let observer = null;
  let observed = false;
  let destroyed = false;
  let controls = [];

  const svg = () => host.querySelector("svg");
  const accents = () => Array.from(host.querySelectorAll("[data-set-accent]"));

  function stop() {
    for (const control of controls) {
      try {
        control.stop?.();
      } catch {
        /* ignore a control that already finished */
      }
    }
    controls = [];
  }

  function applyVariant(element, variant, timeFactor, loop, coordFactor) {
    if (!element || !variant || !variant.animate) return;
    const { values, transition, transformOrigin } = stripVariant(variant.animate);
    if (transformOrigin) element.style.transformOrigin = transformOrigin;
    const scaled = scaleTransition(transition, timeFactor);
    if (loop) {
      scaled.repeat = Infinity;
      scaled.repeatType = "loop";
    }
    const prepared = prepareValues(values, coordFactor);
    const { pathLength, ...others } = prepared;
    if (pathLength !== undefined) {
      controls.push(animate(element, { pathLength }, scaled));
      if (Object.keys(others).length) {
        controls.push(animate(element, others, scaled));
      }
      return;
    }
    if (Object.keys(others).length) {
      controls.push(animate(element, others, scaled));
    }
  }

  function settleVariant(element, variant, coordFactor) {
    if (!element || !variant || !variant.initial) return;
    const { values, transformOrigin } = stripVariant(variant.initial);
    if (transformOrigin) element.style.transformOrigin = transformOrigin;
    const prepared = prepareValues(values, coordFactor);
    if (Object.keys(prepared).length) {
      controls.push(animate(element, prepared, { duration: 0 }));
    }
  }

  function settle() {
    if (destroyed) return;
    settleVariant(svg(), base.group, 1);
    for (const element of accents()) settleVariant(element, base.accent, factor);
  }

  function play() {
    if (destroyed || prefersReducedMotion()) return;
    const current = read() ?? {};
    const timeFactor = 1 / Math.max(0.05, current.speed ?? 1);
    const loop = Boolean(current.loop);
    const run = () => {
      if (destroyed) return;
      stop();
      applyVariant(svg(), base.group, timeFactor, loop, 1);
      for (const element of accents()) {
        applyVariant(element, base.accent, timeFactor, loop, factor);
      }
    };
    window.clearTimeout(timer);
    const delay = Number(current.delay ?? 0);
    if (delay > 0) timer = window.setTimeout(run, delay * 1000);
    else run();
  }

  function reset() {
    if (destroyed) return;
    stop();
    const { values, transformOrigin } = stripVariant(base.group.initial);
    if (transformOrigin) {
      const root = svg();
      if (root) root.style.transformOrigin = transformOrigin;
    }
    if (Object.keys(values).length && svg()) {
      controls.push(animate(svg(), values, { duration: 0.18, ease: "easeOut" }));
    }
    const accent = stripVariant(base.accent.initial);
    if (accent.transformOrigin) {
      for (const element of accents()) {
        element.style.transformOrigin = accent.transformOrigin;
      }
    }
    const prepared = prepareValues(accent.values, factor);
    if (Object.keys(prepared).length) {
      for (const element of accents()) {
        controls.push(animate(element, prepared, { duration: 0.18, ease: "easeOut" }));
      }
    }
  }

  function hover(event) {
    const current = read() ?? {};
    if ((current.animateOnHover ?? true) === false) return;
    if (event && event.pointerType === "touch") return;
    play();
  }

  function leave() {
    const current = read() ?? {};
    if ((current.animateOnHover ?? true) || (current.animateOnTap ?? true)) reset();
  }

  function down() {
    const current = read() ?? {};
    if ((current.animateOnTap ?? true) === false) return;
    play();
  }

  function up() {
    const current = read() ?? {};
    if ((current.animateOnTap ?? true) === false) return;
    reset();
  }

  function onView(entries) {
    const current = read() ?? {};
    if (!current.animateOnView) return;
    if (entries.some((entry) => entry.isIntersecting)) {
      observed = true;
      play();
      if (current.animateOnViewOnce !== false) observer?.disconnect();
    } else if (current.animateOnViewOnce === false) {
      reset();
    }
  }

  host.addEventListener("pointerenter", hover);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);

  settle();

  const initial = read() ?? {};
  if (initial.animate) {
    window.requestAnimationFrame(play);
  }
  if (
    initial.animateOnView &&
    !prefersReducedMotion() &&
    typeof IntersectionObserver !== "undefined"
  ) {
    observer = new IntersectionObserver(onView, { threshold: 0.5 });
    observer.observe(host);
  }

  return {
    play,
    reset,
    destroy() {
      destroyed = true;
      window.clearTimeout(timer);
      observer?.disconnect();
      stop();
      host.removeEventListener("pointerenter", hover);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
    },
    get observed() {
      return observed;
    },
  };
}
