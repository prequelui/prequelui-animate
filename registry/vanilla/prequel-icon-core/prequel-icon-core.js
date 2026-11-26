/*
 * Framework-neutral runtime for the PrequelUI animated icon catalogue.
 *
 * The same file is shipped in the Vue, Svelte, Solid and vanilla registries.
 * An icon file only carries its SVG parts, geometry and the animation set that
 * React uses; this runtime renders that data once and replays the very same
 * hover / tap / loop targets with `motion`'s imperative `animate()`.
 *
 * Reduced motion: the icon is always drawn in full. When the reader asks for
 * less motion, the triggers become no-ops instead of freezing at a mid-state.
 */
import { animate } from "motion";

const INK = "light-dark(oklch(0.28 0.02 80 / 0.7), oklch(0.92 0.02 80 / 0.55))";

const TIME_KEYS = new Set([
  "duration",
  "delay",
  "repeatDelay",
  "delayChildren",
  "staggerChildren",
]);

const OUTLINE_WIDTH = { light: 1.75, regular: 2, bold: 2.6 };
const SOLID_WIDTH = { light: 2.4, regular: 2.8, bold: 3.2 };
const EMOJI_WIDTH = { light: 2.3, regular: 2.6, bold: 3 };

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

function styleString(style) {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const unit =
        typeof value === "number" && (key === "strokeWidth" || key === "strokeDashoffset")
          ? "px"
          : "";
      return `${kebab(key)}:${escape(value)}${unit}`;
    })
    .join(";");
}

function attrsString(attrs, extra) {
  const all = { ...attrs, ...extra };
  return Object.entries(all)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${kebab(key)}="${escape(value)}"`)
    .join(" ");
}

function lightDark(light, dark) {
  return `light-dark(${light}, ${dark})`;
}

function paintFor(spec, options) {
  const variant = options.variant ?? "outline";
  const weight = options.weight ?? "regular";
  const stroke = OUTLINE_WIDTH[weight] ?? OUTLINE_WIDTH.regular;
  const solidOpen = SOLID_WIDTH[weight] ?? SOLID_WIDTH.regular;
  const emojiStroke = EMOJI_WIDTH[weight] ?? EMOJI_WIDTH.regular;
  const color = spec.palette?.color;
  const emoji = spec.palette?.emoji;
  const primary = color
    ? lightDark(color.primary, color.primaryDark)
    : "currentColor";
  const accent = color
    ? lightDark(color.accent, color.accentDark)
    : "currentColor";
  const tint = `color-mix(in oklab, ${primary} var(--pi-tint, 22%), transparent)`;
  const emojiPrimary = emoji?.primary ?? "currentColor";
  const emojiSecondary = emoji?.secondary ?? "currentColor";
  const emojiAccent = emoji?.accent ?? "currentColor";

  function part(role, closed, draw, inside) {
    if (variant === "solid") {
      if (inside) {
        const cutout =
          "var(--pi-cutout, light-dark(oklch(1 0 0), oklch(0.145 0 0)))";
        return closed
          ? { fill: cutout, stroke: cutout, strokeWidth: draw ? stroke : 1 }
          : { fill: "none", stroke: cutout, strokeWidth: stroke };
      }
      if (closed) {
        return {
          fill: "currentColor",
          fillRule: "evenodd",
          stroke: "currentColor",
          strokeWidth: draw ? stroke : 1,
        };
      }
      return { fill: "none", stroke: "currentColor", strokeWidth: solidOpen };
    }

    if (variant === "duotone") {
      if (closed) {
        return {
          fill: "currentColor",
          fillOpacity: "var(--pi-secondary, 0.2)",
          fillRule: "evenodd",
          stroke: "currentColor",
          strokeWidth: stroke,
        };
      }
      return { fill: "none", stroke: "currentColor", strokeWidth: stroke };
    }

    if (variant === "color") {
      const tone = role === "accent" ? accent : primary;
      return {
        fill: closed ? tint : "none",
        fillRule: "evenodd",
        stroke: tone,
        strokeWidth: stroke,
      };
    }

    if (variant === "emoji") {
      if (closed) {
        return {
          fill: role === "accent" ? emojiAccent : emojiPrimary,
          fillRule: "evenodd",
          stroke: INK,
          strokeWidth: emojiStroke,
        };
      }
      return {
        fill: "none",
        stroke: role === "accent" ? emojiAccent : emojiPrimary,
        strokeWidth: emojiStroke,
      };
    }

    return { fill: "none", stroke: "currentColor", strokeWidth: stroke };
  }

  function halo(role) {
    if (variant === "emoji") {
      return { fill: "none", stroke: INK, strokeWidth: emojiStroke + 1.6 };
    }
    if (variant === "duotone") {
      return {
        fill: "none",
        stroke: role === "accent" ? accent : primary,
        strokeOpacity: "var(--pi-secondary, 0.2)",
        strokeWidth: stroke + 4,
      };
    }
    return { display: "none" };
  }

  function flash() {
    if (variant === "color") return { fill: primary };
    if (variant === "emoji") return { fill: emojiPrimary };
    if (variant === "duotone") {
      return { fill: "currentColor", fillOpacity: "var(--pi-secondary, 0.2)" };
    }
    return { fill: "currentColor" };
  }

  function sticker() {
    if (!emoji) return { display: "none" };
    return {
      fill: emojiSecondary,
      fillOpacity: 0.26,
      stroke: INK,
      strokeOpacity: 0.22,
      strokeWidth: 1.2,
    };
  }

  function highlight() {
    return {
      fill: "oklch(1 0 0)",
      fillOpacity: "var(--pi-highlight, 0.22)",
      stroke: "none",
    };
  }

  return { variant, weight, part, halo, flash, sticker, highlight };
}

export function renderIcon(spec, options = {}) {
  const size = options.size ?? 28;
  const paint = paintFor(spec, options);
  const pieces = [];
  const closed = spec.closed ?? [];
  const roles = spec.roles ?? [];
  const draw = spec.draw ?? [];
  const inside = spec.inside ?? [];
  const hasClosed = spec.hasClosed ?? closed.some(Boolean);
  const emoji = paint.variant === "emoji";

  if (emoji && !hasClosed) {
    pieces.push(
      `<rect ${attrsString(
        { x: 2, y: 2, width: 20, height: 20, rx: 7 },
        { class: "pi-sticker", style: styleString(paint.sticker()) },
      )} />`,
    );
  }

  spec.parts.forEach((part, index) => {
    const role = roles[index] ?? "primary";
    const isClosed = Boolean(closed[index]);
    if ((paint.variant === "duotone" || emoji) && !isClosed) {
      pieces.push(
        `<${part.tag} ${attrsString(part.attrs, {
          class: "pi-halo",
          "data-paint": "halo",
          "data-part": index,
          style: styleString(paint.halo(role)),
        })} />`,
      );
    }
    pieces.push(
      `<${part.tag} ${attrsString(part.attrs, {
        class: "pi-part",
        "data-part": index,
        style: styleString(paint.part(role, isClosed, Boolean(draw[index]), Boolean(inside[index]))),
      })} />`,
    );
  });

  for (const d of spec.fill ?? []) {
    pieces.push(
      `<path ${attrsString(
        { d },
        { class: "pi-flash", "data-paint": "flash", style: styleString(paint.flash()) },
      )} />`,
    );
  }

  if (emoji && spec.highlight) {
    const { cx, cy, rx, ry } = spec.highlight;
    pieces.push(
      `<ellipse ${attrsString(
        {
          cx,
          cy,
          rx,
          ry,
          transform: `rotate(-24 ${cx} ${cy})`,
        },
        { class: "pi-highlight", style: styleString(paint.highlight()) },
      )} />`,
    );
  }

  const className = options.className
    ? ` class="${escape(options.className)}"`
    : "";
  const label = options.label
    ? ` role="img" aria-label="${escape(options.label)}"`
    : ' aria-hidden="true"';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${escape(
    size,
  )}" height="${escape(size)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${label}${className} data-slot="prequel-icon" data-icon-style="${
    paint.variant
  }" data-icon-weight="${paint.weight}">${pieces.join("")}</svg>`;
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function scaleTransition(transition, factor) {
  if (!transition || factor === 1) return { ...(transition ?? {}) };
  const next = {};
  for (const [key, value] of Object.entries(transition)) {
    if (typeof value === "number" && TIME_KEYS.has(key)) next[key] = value * factor;
    else if (typeof value === "number" && key === "stiffness")
      next[key] = value / (factor * factor);
    else if (typeof value === "number" && key === "damping") next[key] = value / factor;
    else if (isPlainObject(value)) next[key] = scaleTransition(value, factor);
    else next[key] = value;
  }
  return next;
}

function stripTransition(target) {
  if (!target || typeof target !== "object") return { values: {}, transition: {} };
  const { transition, transformOrigin, ...values } = target;
  return { values, transition: transition ?? {}, transformOrigin };
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function applyVariant(element, variant, factor, loop) {
  if (!element || !variant || !variant.animate) return;
  const { values, transition, transformOrigin } = stripTransition(variant.animate);
  if (transformOrigin) element.style.transformOrigin = transformOrigin;
  const scaled = scaleTransition(transition, factor);
  if (loop) {
    scaled.repeat = Infinity;
    scaled.repeatType = "loop";
  }
  const { pathLength, ...others } = values;
  if (pathLength !== undefined) {
    animate(element, { pathLength }, scaled);
    if (others.opacity !== undefined) {
      const { opacity, ...rest } = others;
      animate(element, { opacity }, scaled);
      if (Object.keys(rest).length) animate(element, rest, scaled);
    } else if (Object.keys(others).length) {
      animate(element, others, scaled);
    }
    return;
  }
  if (Object.keys(values).length) animate(element, values, scaled);
}

function resetElement(element, variant) {
  if (!element || !variant || !variant.initial) return;
  const { values, transformOrigin } = stripTransition(variant.initial);
  if (transformOrigin) element.style.transformOrigin = transformOrigin;
  if (Object.keys(values).length) {
    animate(element, values, { duration: 0.18, ease: "easeOut" });
  }
}

/* React mounts every icon with `initial="initial"`, so a flash overlay starts
   at opacity 0 and a drawable part sits at its resting geometry. The framework
   ports must do the same or the first paint differs: the flash would show at
   full strength before the first hover. Apply the resting values instantly,
   then let the triggers animate away from that state. */
function settleElement(element, variant) {
  if (!element || !variant || !variant.initial) return;
  const { values, transformOrigin } = stripTransition(variant.initial);
  if (transformOrigin) element.style.transformOrigin = transformOrigin;
  if (Object.keys(values).length) animate(element, values, { duration: 0 });
}

export function bindPrequelIcon(host, spec, options = {}) {
  const read = typeof options === "function" ? options : () => options;
  let timer = 0;
  let observed = false;
  let observer = null;
  let destroyed = false;

  const root = () => host.querySelector("svg");
  const parts = (index) =>
    Array.from(host.querySelectorAll(`[data-part="${index}"]`));
  const fill = () => Array.from(host.querySelectorAll(".pi-flash"));

  function factor() {
    const current = read() ?? {};
    return (current.tempo ?? 1) / Math.max(0.05, current.speed ?? 1);
  }

  function play(trigger) {
    if (destroyed || prefersReducedMotion()) return;
    const current = read() ?? {};
    const set =
      spec.animations?.[trigger] ??
      spec.animations?.[current.animation] ??
      spec.animations?.hover;
    if (!set) return;
    const run = () => {
      if (destroyed) return;
      const loop = Boolean(current.loop);
      const scale = factor();
      applyVariant(root(), set.group, scale, loop);
      for (let index = 0; index < spec.parts.length; index += 1) {
        const variant = set[`p${index}`];
        if (!variant) continue;
        for (const element of parts(index)) {
          applyVariant(element, variant, scale, loop);
        }
      }
      if (set.fill) {
        for (const element of fill()) applyVariant(element, set.fill, scale, loop);
      }
    };
    window.clearTimeout(timer);
    const delay = Number(current.delay ?? 0);
    if (delay > 0) timer = window.setTimeout(run, delay);
    else run();
  }

  function reset() {
    if (destroyed) return;
    const current = read() ?? {};
    const set =
      spec.animations?.[current.animation] ??
      spec.animations?.hover ??
      spec.animations?.tap;
    if (!set) return;
    resetElement(root(), set.group);
    for (let index = 0; index < spec.parts.length; index += 1) {
      const variant = set[`p${index}`];
      if (!variant) continue;
      for (const element of parts(index)) resetElement(element, variant);
    }
    if (set.fill) {
      for (const element of fill()) resetElement(element, set.fill);
    }
  }

  function hover(event) {
    const current = read() ?? {};
    if ((current.animateOnHover ?? true) === false) return;
    if (event && event.pointerType === "touch") return;
    play(typeof current.animate === "string" ? current.animate : "hover");
  }

  function leave() {
    const current = read() ?? {};
    if ((current.animateOnHover ?? true) || (current.animateOnTap ?? true)) reset();
  }

  function down() {
    const current = read() ?? {};
    if ((current.animateOnTap ?? true) === false) return;
    play("tap");
  }

  function up() {
    const current = read() ?? {};
    if ((current.animateOnTap ?? true) === false) return;
    reset();
  }

  function onView(entries) {
    const current = read() ?? {};
    if (!current.animateOnView) return;
    const visible = entries.some((entry) => entry.isIntersecting);
    if (visible) {
      observed = true;
      play(typeof current.animateOnView === "string" ? current.animateOnView : "hover");
      if (current.animateOnViewOnce !== false) observer?.disconnect();
    } else if (current.animateOnViewOnce === false) {
      reset();
    }
  }

  /* Match the React first paint: apply the active set's `initial` values
     before any trigger can fire. */
  function settle() {
    if (destroyed) return;
    const current = read() ?? {};
    const set =
      spec.animations?.[current.animation] ??
      spec.animations?.hover ??
      spec.animations?.tap ??
      spec.animations?.loop;
    if (!set) return;
    settleElement(root(), set.group);
    for (let index = 0; index < spec.parts.length; index += 1) {
      const variant = set[`p${index}`];
      if (!variant) continue;
      for (const element of parts(index)) settleElement(element, variant);
    }
    if (set.fill) {
      for (const element of fill()) settleElement(element, set.fill);
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
    window.requestAnimationFrame(() =>
      play(typeof initial.animate === "string" ? initial.animate : "hover"),
    );
  }
  const reduce = prefersReducedMotion();
  if (initial.animateOnView && !reduce && typeof IntersectionObserver !== "undefined") {
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
