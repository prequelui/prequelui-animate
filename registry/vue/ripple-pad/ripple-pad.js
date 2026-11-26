import { animate } from "motion";
import {
  applySurface,
  localPoint,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

export function createRipplePad(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let pulse = false;
  let cancelPreview = () => {};
  let counter = 0;
  const timers = new Set();
  const ripples = [];

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <div data-pad role="button" tabindex="0" aria-label="Tap the pad to send a ripple"
      class="relative h-[112px] w-[178px] cursor-pointer overflow-hidden rounded-2xl border border-white/12 bg-white/8 outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span aria-hidden="true" class="pointer-events-none absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/6 blur-lg"></span>
      <span class="pointer-events-none absolute inset-0 flex items-center justify-center text-[13px] uppercase tracking-[0.18em] text-white/40">Tap anywhere</span>
    </div>`;

  const pad = surface.querySelector("[data-pad]");

  function spawn(x, y) {
    const ring = document.createElement("span");
    ring.dataset.ripple = String(++counter);
    ring.setAttribute("aria-hidden", "true");
    ring.className =
      "pointer-events-none absolute rounded-full border border-white/70";
    ring.style.left = `${x - 12}px`;
    ring.style.top = `${y - 12}px`;
    ring.style.width = "24px";
    ring.style.height = "24px";
    pad.appendChild(ring);
    ripples.push(ring);
    if (ripples.length > 4) {
      const dropped = ripples.shift();
      if (dropped) dropped.remove();
    }
    animate(
      ring,
      { scale: [0.2, reduce ? 1 : 5.4], opacity: [0.9, 0] },
      { duration: reduce ? 0.2 : 0.78, ease: [0.23, 1, 0.32, 1] },
    );
    const timer = window.setTimeout(() => {
      ring.remove();
      timers.delete(timer);
      const index = ripples.indexOf(ring);
      if (index >= 0) ripples.splice(index, 1);
    }, 820);
    timers.add(timer);
  }

  function onClick(event) {
    const point = localPoint(event, pad);
    spawn(point.x, point.y);
  }

  function onKey(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      spawn(88, 56);
    }
  }

  pad.addEventListener("click", onClick);
  pad.addEventListener("keydown", onKey);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 900, 2300, (on) => {
      pulse = on;
      if (pulse) spawn(88, 56);
    }, reduce);
  }

  setPreview(preview);

  return {
    update(next = {}) {
      if (next.preview !== undefined && Boolean(next.preview) !== preview) {
        setPreview(next.preview);
      }
    },
    destroy() {
      cancelPreview();
      timers.forEach((timer) => window.clearTimeout(timer));
      timers.clear();
      ripples.length = 0;
      pad.removeEventListener("click", onClick);
      pad.removeEventListener("keydown", onKey);
      surface.innerHTML = "";
    },
  };
}
