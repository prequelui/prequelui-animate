import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const PETALS = Array.from({ length: 7 }, (_, index) => index);

export function createBloomToggle(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let checked = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-4");
  surface.innerHTML = `
    <button type="button" role="switch" aria-checked="false" aria-label="Bloom toggle"
      class="relative h-9 w-[74px] rounded-full p-1 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-knob class="relative z-10 block size-7 rounded-full bg-white">
        <span aria-hidden="true" class="absolute inset-0">
          ${PETALS.map(
            (index) =>
              `<span data-petal class="absolute left-1/2 top-1/2 size-[9px] rounded-full bg-white/80" style="margin-left:-4.5px;margin-top:-4.5px"></span>`,
          ).join("")}
        </span>
      </span>
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Rest</span>`;

  const button = surface.querySelector("button");
  const knob = surface.querySelector("[data-knob]");
  const label = surface.querySelector("[data-label]");
  const petals = Array.from(surface.querySelectorAll("[data-petal]"));

  function render() {
    const on = preview ? pulse : checked;
    button.setAttribute("aria-checked", String(on));
    button.classList.toggle("bg-white/25", on);
    button.classList.toggle("bg-white/10", !on);
    label.textContent = on ? "Bloom" : "Rest";
    animate(knob, { x: on ? 38 : 0 }, reduce ? { duration: 0 } : springSoft);
    petals.forEach((petal, index) => {
      const angle = (360 / PETALS.length) * index;
      const radians = (angle * Math.PI) / 180;
      animate(
        petal,
        reduce
          ? { opacity: on ? 1 : 0, scale: on ? 1 : 0 }
          : {
              opacity: on ? 1 : 0,
              scale: on ? 1 : 0,
              x: on ? Math.cos(radians) * 16 : 0,
              y: on ? Math.sin(radians) * 16 : 0,
            },
        reduce ? { duration: 0 } : { ...springSoft, delay: index * 0.025 },
      );
    });
  }

  button.addEventListener("click", () => {
    checked = !checked;
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
