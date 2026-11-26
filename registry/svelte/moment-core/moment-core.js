/*
 * Shared runtime for the framework-free moment builds.
 *
 * It mirrors the primitives the React moments import from shared.tsx: the
 * spring presets, the preview loops and the pointer helpers. Every framework
 * wrapper (Vue, Svelte, Solid) mounts the same engine, so all runtimes share
 * one source of truth for timings and easing curves.
 */

export const springFast = { type: "spring", stiffness: 620, damping: 32 };
export const springSoft = { type: "spring", stiffness: 260, damping: 22 };
export const springBounce = { type: "spring", stiffness: 380, damping: 18 };
export const springHeavy = { type: "spring", stiffness: 200, damping: 26 };
export const springSnap = { type: "spring", stiffness: 700, damping: 38 };

export const tweenFast = { duration: 0.18, ease: [0.23, 1, 0.32, 1] };
export const tweenSoft = { duration: 0.32, ease: [0.23, 1, 0.32, 1] };

export const surface =
  "relative flex h-[150px] w-[230px] max-w-full select-none items-center justify-center text-foreground";

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function localPoint(event, node) {
  const rect = node.getBoundingClientRect();
  const scaleX = node.offsetWidth ? rect.width / node.offsetWidth : 1;
  const scaleY = node.offsetHeight ? rect.height / node.offsetHeight : 1;
  return {
    x: (event.clientX - rect.left) / (scaleX || 1),
    y: (event.clientY - rect.top) / (scaleY || 1),
  };
}

export function naturalWidth(node) {
  return node.offsetWidth || node.getBoundingClientRect().width;
}

export function pointerScaleX(node) {
  const rect = node.getBoundingClientRect();
  return node.offsetWidth ? rect.width / node.offsetWidth : 1;
}

export function applySurface(root, extra = "") {
  root.className = `${surface} ${extra}`.trim();
  return root;
}

/*
 * Preview loops. Each returns a cancel function. They intentionally start
 * immediately, exactly like usePreviewPulse / usePreviewStep /
 * usePreviewPointer in the React source.
 */
export function previewPulse(preview, duration, gap, set, reduce) {
  if (!preview || reduce) {
    set(false);
    return () => {};
  }
  let close = 0;
  let next = 0;
  const run = () => {
    set(true);
    close = window.setTimeout(() => set(false), duration);
    next = window.setTimeout(run, gap);
  };
  run();
  return () => {
    window.clearTimeout(close);
    window.clearTimeout(next);
  };
}

export function previewStep(preview, steps, interval, set, reduce) {
  if (!preview || reduce) {
    set(0);
    return () => {};
  }
  set(1);
  let current = 1;
  const id = window.setInterval(() => {
    current = (current + 1) % steps;
    set(current);
  }, interval);
  return () => window.clearInterval(id);
}

export function previewPointer(preview, width, height, set, reduce) {
  if (!preview || reduce) return () => {};
  let frame = 0;
  let start = 0;
  const loop = (time) => {
    if (!start) start = time;
    const t = (time - start) / 1000;
    set({
      x: width / 2 + Math.cos(t * 1.4) * (width * 0.36),
      y: height / 2 + Math.sin(t * 2.1) * (height * 0.28),
    });
    frame = requestAnimationFrame(loop);
  };
  frame = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(frame);
}

export function setText(node, value) {
  if (node && node.textContent !== value) node.textContent = value;
}

export function setAttrs(node, attrs) {
  if (!node) return;
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null) node.removeAttribute(key);
    else node.setAttribute(key, String(value));
  }
}

export function icon(kind) {
  if (kind === "check") {
    return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M20 6 9 17l-5-5" /></svg>';
  }
  return '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m9 18 6-6-6-6" /></svg>';
}
