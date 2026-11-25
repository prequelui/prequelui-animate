import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

export function createEclipseHalf(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let eclipsed = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-3");
  surface.innerHTML = `
    <button type="button" role="switch" aria-checked="false" aria-label="Eclipse the light"
      class="relative flex size-[90px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0b0b0e] outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-light aria-hidden="true" class="absolute size-[56px] rounded-full bg-white" style="box-shadow:0 0 34px 8px rgba(255,255,255,.32)"></span>
      <span data-moon aria-hidden="true" class="absolute size-[56px] rounded-full bg-[#0b0b0e]" style="box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)"></span>
      <span data-label aria-live="polite" class="absolute bottom-1.5 text-[13px] uppercase tracking-[0.12em] text-white/40">Sun</span>
    </button>`;

  const button = surface.querySelector("button");
  const light = surface.querySelector("[data-light]");
  const moon = surface.querySelector("[data-moon]");
  const label = surface.querySelector("[data-label]");

  function render() {
    const on = preview ? pulse : eclipsed;
    button.setAttribute("aria-checked", String(on));
    label.textContent = on ? "Eclipse" : "Sun";
    animate(
      light,
      on
        ? { scale: reduce ? 1 : [1, 1.04, 1], opacity: 0.55 }
        : { scale: 1, opacity: 1 },
      reduce
        ? { duration: 0 }
        : { duration: 2.4, repeat: on ? Infinity : 0, ease: "easeInOut" },
    );
    animate(moon, { x: on ? 27 : 76 }, reduce ? { duration: 0 } : springSoft);
  }

  button.addEventListener("click", () => {
    eclipsed = !eclipsed;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1300, 2800, (next) => {
      pulse = next;
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
