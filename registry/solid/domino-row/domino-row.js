import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

const TILES = Array.from({ length: 8 }, (_, index) => index);

export function createDominoRow(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let fallen = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-4");
  surface.innerHTML = `
    <button type="button" aria-pressed="false" aria-label="Topple the dominoes"
      class="flex h-[92px] w-[188px] items-end justify-center gap-[7px] outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      ${TILES.map(
        () =>
          `<span data-tile class="block h-[62px] w-[11px] origin-bottom rounded-[2px] border border-white/20 bg-white/90"></span>`,
      ).join("")}
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Standing</span>`;

  const button = surface.querySelector("button");
  const label = surface.querySelector("[data-label]");
  const tiles = Array.from(surface.querySelectorAll("[data-tile]"));

  function render() {
    const down = preview ? pulse : fallen;
    button.setAttribute("aria-pressed", String(down));
    label.textContent = down ? "Falling" : "Standing";
    tiles.forEach((tile, index) => {
      animate(
        tile,
        { rotate: down ? 76 : 0 },
        reduce
          ? { duration: 0 }
          : {
              duration: 0.32,
              ease: [0.4, 0, 0.9, 0.5],
              delay: down ? index * 0.075 : (TILES.length - index) * 0.045,
            },
      );
    });
  }

  button.addEventListener("click", () => {
    fallen = !fallen;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1500, 3000, (on) => {
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
