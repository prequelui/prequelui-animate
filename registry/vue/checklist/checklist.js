import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewStep,
  springSoft,
} from "./moment-core.js";

const ITEMS = ["Sketch the gesture", "Tune the spring", "Check reduced motion"];

export function createChecklist(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let done = [];
  let step = 0;
  let cancelPreview = () => {};

  const surface = applySurface(
    root,
    "flex-col items-stretch justify-center gap-1.5 px-3",
  );
  surface.innerHTML = ITEMS.map(
    (item, index) =>
      `<button type="button" role="checkbox" aria-checked="false"
        class="group flex h-[30px] w-[190px] items-center gap-2.5 rounded-lg px-1 text-left outline-none transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/40">
        <span data-box class="relative flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border border-white/25 bg-transparent transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <path data-check d="M2.4 6.2 4.9 8.7 9.7 3.4" fill="none" stroke="#111114" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        <span class="relative min-w-0 flex-1 truncate text-[13px] text-white/70">
          ${item}
          <span data-strike aria-hidden="true" class="absolute left-0 top-1/2 h-px bg-white/60" style="transform-origin:left center"></span>
        </span>
      </button>`,
  ).join("");

  const buttons = Array.from(surface.querySelectorAll("button"));
  const checks = Array.from(surface.querySelectorAll("[data-check]"));
  const boxes = Array.from(surface.querySelectorAll("[data-box]"));
  const strikes = Array.from(surface.querySelectorAll("[data-strike]"));

  checks.forEach((path) => {
    animate(path, { pathLength: 0, opacity: 0 }, { duration: 0 });
  });
  strikes.forEach((strike) => {
    animate(strike, { scaleX: 0 }, { duration: 0 });
  });

  function render() {
    const checked = preview
      ? ITEMS.map((_, index) => index).filter((index) => index < step)
      : done;
    buttons.forEach((button, index) => {
      const on = checked.includes(index);
      button.setAttribute("aria-checked", String(on));
      boxes[index].className = `relative flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
        on ? "border-white bg-white" : "border-white/25 bg-transparent"
      }`;
      animate(
        checks[index],
        { pathLength: on ? 1 : 0, opacity: on ? 1 : 0 },
        reduce ? { duration: 0 } : { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
      );
      animate(
        strikes[index],
        { scaleX: on ? 1 : 0 },
        reduce ? { duration: 0 } : springSoft,
      );
    });
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      done = done.includes(index)
        ? done.filter((entry) => entry !== index)
        : [...done, index];
      render();
    });
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewStep(preview, ITEMS.length + 1, 1100, (next) => {
      step = next;
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
