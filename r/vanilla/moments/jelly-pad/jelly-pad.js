import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

export function createJellyPad(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let wave = 0;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <button type="button" aria-label="Press the jelly pad" style="width:160px;height:112px"
      class="group relative flex items-center justify-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-pad aria-hidden="true" class="absolute inset-0 rounded-3xl border border-white/15 bg-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,.35),inset_0_-20px_34px_rgba(0,0,0,.22)]"></span>
      <span data-glow aria-hidden="true" class="absolute size-16 rounded-full bg-white/20 blur-xl"></span>
      <span class="pointer-events-none absolute inset-x-5 top-3 h-px rounded-full bg-white/35"></span>
      <span data-label class="relative z-10 text-[13px] uppercase tracking-[0.22em] text-white/85">Press</span>
    </button>`;

  const button = surface.querySelector("button");
  const pad = surface.querySelector("[data-pad]");
  const glow = surface.querySelector("[data-glow]");
  const label = surface.querySelector("[data-label]");

  const glowControl = animate(
    glow,
    reduce
      ? { opacity: 0.4, scale: 1 }
      : { opacity: [0.25, 0.5, 0.25], scale: [1, 1.12, 1] },
    reduce
      ? { duration: 0 }
      : { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  );

  function render() {
    if (reduce || wave === 0) {
      animate(
        pad,
        { scaleX: 1, scaleY: 1, rotate: 0, borderRadius: 24 },
        { duration: 0 },
      );
      animate(label, { y: 0, opacity: 1 }, { duration: 0 });
      return;
    }
    animate(
      pad,
      {
        scaleX: [1, 1.14, 0.9, 1.05, 0.98, 1],
        scaleY: [1, 0.86, 1.1, 0.97, 1.01, 1],
        rotate: [0, -2.5, 2, -1, 0.5, 0],
        borderRadius: [24, 38, 16, 30, 22, 24],
      },
      { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
    );
    animate(
      label,
      { y: [0, 3, -1, 0], opacity: [0.8, 1, 1] },
      { duration: 0.5 },
    );
  }

  button.addEventListener("click", () => {
    wave += 1;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 900, 2600, (on) => {
      if (on && !pulse) {
        pulse = true;
        wave += 1;
        render();
      } else if (!on) {
        pulse = false;
      }
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
      glowControl?.stop?.();
      surface.innerHTML = "";
    },
  };
}
