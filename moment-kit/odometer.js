import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ROW = 26;

export function createOdometer(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let value = 128;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <button type="button" aria-label="Odometer, current value 128. Click or use arrow keys to change it."
      class="flex items-center gap-1 rounded-xl border border-white/12 bg-[#111114] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      ${[100, 10, 1]
        .map(
          (place) =>
            `<span class="relative block h-[26px] w-[18px] overflow-hidden" aria-hidden="true">
              <span data-strip class="absolute inset-x-0 top-0 flex flex-col items-center">
                ${DIGITS.map(
                  (number) =>
                    `<span class="flex h-[26px] items-center justify-center text-[20px] tabular-nums text-white">${number}</span>`,
                ).join("")}
              </span>
            </span>`,
        )
        .join("")}
      <span data-live class="sr-only">128</span>
    </button>`;

  const button = surface.querySelector("button");
  const strips = Array.from(surface.querySelectorAll("[data-strip]"));
  const live = surface.querySelector("[data-live]");
  const places = [100, 10, 1];

  function render() {
    button.setAttribute(
      "aria-label",
      `Odometer, current value ${value}. Click or use arrow keys to change it.`,
    );
    live.textContent = String(value);
    strips.forEach((strip, index) => {
      const digit = Math.floor(value / places[index]) % 10;
      animate(strip, { y: -digit * ROW }, reduce ? { duration: 0 } : springSoft);
    });
  }

  function advance() {
    value = (value + 37) % 1000;
    render();
  }

  button.addEventListener("click", advance);
  button.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    value = (value + 37) % 1000;
    render();
  });
  button.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      value = (value + 1) % 1000;
      render();
    }
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      value = (value - 1 + 1000) % 1000;
      render();
    }
  });

  function setPreview(next) {
    preview = Boolean(next);
    cancelPreview();
    cancelPreview = previewPulse(preview, 900, 2400, (on) => {
      pulse = on;
      if (pulse) {
        value = (value + 37) % 1000;
        render();
      }
    }, reduce);
  }

  setPreview(preview);
  render();

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
