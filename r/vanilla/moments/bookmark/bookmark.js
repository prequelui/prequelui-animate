import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springBounce,
  springSoft,
} from "./moment-core.js";

export function createBookmark(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let saved = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-3");
  surface.innerHTML = `
    <button type="button" role="switch" aria-checked="false" aria-label="Bookmark this page"
      class="group flex h-[88px] w-[88px] items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style="perspective:420px">
      <svg width="50" height="68" viewBox="0 0 50 68" class="drop-shadow-[0_12px_22px_rgba(0,0,0,.45)]">
        <path data-face d="M7 6 H43 V62 L25 49 L7 62 Z" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.68)" stroke-width="2" stroke-linejoin="round" />
        <path data-side d="M7 6 L14 6 L14 62 L7 62 Z" fill="rgba(0,0,0,.18)" stroke="none" opacity="0" />
        <path data-line-one d="M17 21 H35" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round" />
        <path data-line-two d="M17 30 H35" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round" />
      </svg>
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Save</span>`;

  const button = surface.querySelector("button");
  const svg = surface.querySelector("svg");
  const face = surface.querySelector("[data-face]");
  const side = surface.querySelector("[data-side]");
  const lineOne = surface.querySelector("[data-line-one]");
  const lineTwo = surface.querySelector("[data-line-two]");
  const label = surface.querySelector("[data-label]");

  animate(lineOne, { pathLength: 0.32, opacity: 0.6 }, { duration: 0 });
  animate(lineTwo, { pathLength: 0.32, opacity: 0.6 }, { duration: 0 });

  function render() {
    const on = preview ? pulse : saved;
    button.setAttribute("aria-checked", String(on));
    label.textContent = on ? "Saved" : "Save";
    animate(
      svg,
      reduce
        ? { rotateY: 0, y: 0, scale: 1 }
        : { rotateY: on ? 26 : 0, y: on ? 2 : 0, scale: on ? 1.04 : 1 },
      reduce ? { duration: 0 } : springSoft,
    );
    animate(
      face,
      { fill: on ? "#ffffff" : "rgba(255,255,255,.06)" },
      { duration: reduce ? 0 : 0.26 },
    );
    animate(side, { opacity: on ? 0.55 : 0 }, { duration: reduce ? 0 : 0.24 });
    [lineOne, lineTwo].forEach((line, index) => {
      animate(
        line,
        { pathLength: on ? 1 : 0.32, opacity: on ? 1 : 0.6 },
        { duration: reduce ? 0 : 0.3, delay: reduce ? 0 : index * 0.06 },
      );
      line.setAttribute("stroke", on ? "#111114" : "rgba(255,255,255,.5)");
    });
    animate(
      label,
      { opacity: 1, y: 0 },
      reduce ? { duration: 0 } : springBounce,
    );
  }

  button.addEventListener("click", () => {
    saved = !saved;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1100, 2600, (on) => {
      pulse = on;
      render();
    }, reduce);
    render();
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
      surface.innerHTML = "";
    },
  };
}
