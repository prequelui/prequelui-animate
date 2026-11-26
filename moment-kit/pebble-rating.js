import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewStep,
  springBounce,
} from "./moment-core.js";

const STONES = [
  "46% 54% 58% 42% / 55% 45% 55% 45%",
  "58% 42% 48% 52% / 44% 58% 42% 56%",
  "52% 48% 60% 40% / 48% 52% 48% 52%",
  "44% 56% 46% 54% / 58% 44% 56% 44%",
  "56% 44% 54% 46% / 46% 56% 44% 54%",
];

export function createPebbleRating(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let rating = 3;
  let previewValue = 0;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-4");
  surface.innerHTML = `
    <div role="radiogroup" aria-label="Pebble rating" class="flex items-center gap-2">
      ${STONES.map(
        (shape, index) =>
          `<button type="button" role="radio" aria-checked="false" aria-label="${index + 1} pebble${index === 0 ? "" : "s"}" tabindex="-1"
            class="size-8 bg-white" style="border-radius:${shape}"></button>`,
      ).join("")}
    </div>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">3 of 5</span>`;

  const group = surface.querySelector('[role="radiogroup"]');
  const label = surface.querySelector("[data-label]");
  const pebbles = Array.from(surface.querySelectorAll("button"));

  function render() {
    const value = preview ? previewValue : rating;
    label.textContent = `${value} of 5`;
    pebbles.forEach((pebble, index) => {
      const filled = index < value;
      pebble.setAttribute("aria-checked", String(filled));
      pebble.tabIndex = index === Math.max(0, value - 1) ? 0 : -1;
      animate(
        pebble,
        reduce
          ? { scale: 1, opacity: filled ? 1 : 0.28 }
          : { scale: filled ? 1 : 0.88, opacity: filled ? 1 : 0.28, y: filled ? 0 : 2 },
        reduce ? { duration: 0 } : springBounce,
      );
    });
  }

  function select(next) {
    rating = Math.min(5, Math.max(0, next));
    render();
    pebbles[Math.max(0, rating - 1)]?.focus();
  }

  function key(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      select(rating + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      select(rating - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(1);
    }
    if (event.key === "End") {
      event.preventDefault();
      select(5);
    }
  }

  pebbles.forEach((pebble, index) => {
    pebble.addEventListener("click", () => {
      rating = index + 1;
      render();
    });
    if (!reduce) {
      pebble.addEventListener("pointerdown", () => {
        animate(pebble, { scale: 0.82, scaleY: 0.7 }, springBounce);
      });
      pebble.addEventListener("pointerup", render);
      pebble.addEventListener("pointerleave", render);
    }
  });
  group.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewStep(preview, 6, 1200, (next) => {
      previewValue = next;
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
      group.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
