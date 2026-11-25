import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

export function createRockerSwitch(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let on = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-4");
  surface.innerHTML = `
    <button type="button" role="switch" aria-checked="false" aria-label="Rocker switch, off"
      class="flex h-[62px] w-[92px] items-center justify-center rounded-2xl border border-white/12 bg-[#111114] p-2 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style="perspective:500px">
      <span data-rocker class="relative flex h-[42px] w-[68px] flex-col items-center overflow-hidden rounded-xl border border-white/10" style="transform-style:preserve-3d">
        <span class="flex h-1/2 w-full items-center justify-center bg-white/18 text-[13px] text-white/50">0</span>
        <span class="flex h-1/2 w-full items-center justify-center bg-white text-[13px] font-semibold text-black">I</span>
        <span data-divider aria-hidden="true" class="absolute left-1/2 top-1/2 h-[2px] w-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25"></span>
      </span>
    </button>
    <span data-label aria-live="polite" class="text-[13px] uppercase tracking-[0.18em] text-white/45">Off</span>`;

  const button = surface.querySelector("button");
  const rocker = surface.querySelector("[data-rocker]");
  const divider = surface.querySelector("[data-divider]");
  const label = surface.querySelector("[data-label]");

  function render() {
    const up = preview ? pulse : on;
    button.setAttribute("aria-checked", String(up));
    button.setAttribute("aria-label", `Rocker switch, ${up ? "on" : "off"}`);
    label.textContent = up ? "On" : "Off";
    animate(rocker, { rotateX: up ? 18 : -18 }, reduce ? { duration: 0 } : springSoft);
    animate(divider, { opacity: up ? 0.2 : 0.7 }, { duration: reduce ? 0 : 0.2 });
  }

  button.addEventListener("click", () => {
    on = !on;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1100, 2600, (next) => {
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
