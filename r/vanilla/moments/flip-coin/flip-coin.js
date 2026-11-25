import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

export function createFlipCoin(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let heads = true;
  let flips = 0;
  let pulse = false;
  let previous = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-3");
  surface.innerHTML = `
    <button type="button" aria-label="Coin showing heads, flip it"
      class="flex size-[92px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style="perspective:700px">
      <span data-coin class="relative block size-[62px]" style="transform-style:preserve-3d">
        <span class="absolute inset-0 flex items-center justify-center rounded-full border border-white/25 bg-white text-[20px] font-semibold text-black shadow-[0_10px_24px_rgba(0,0,0,.4)]" style="backface-visibility:hidden">H</span>
        <span class="absolute inset-0 flex items-center justify-center rounded-full border border-white/20 bg-[#1a1a1f] text-[20px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,.4)]" style="backface-visibility:hidden;transform:rotateY(180deg)">T</span>
      </span>
    </button>
    <span data-label aria-live="polite" class="text-[13px] uppercase tracking-[0.18em] text-white/45">Heads</span>`;

  const button = surface.querySelector("button");
  const coin = surface.querySelector("[data-coin]");
  const label = surface.querySelector("[data-label]");

  function render() {
    const rotation = (heads ? 0 : 180) + flips * 720;
    button.setAttribute(
      "aria-label",
      `Coin showing ${heads ? "heads" : "tails"}, flip it`,
    );
    label.textContent = heads ? "Heads" : "Tails";
    animate(
      coin,
      { rotateY: rotation, y: reduce ? 0 : [0, -18, 0] },
      reduce
        ? { duration: 0 }
        : {
            rotateY: { type: "spring", stiffness: 120, damping: 16 },
            y: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
          },
    );
  }

  function flip() {
    heads = !heads;
    flips += 1;
    render();
  }

  button.addEventListener("click", flip);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1400, 3000, (on) => {
      pulse = on;
      if (preview && pulse && !previous) {
        heads = !heads;
        flips += 1;
      }
      previous = pulse;
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
      button.removeEventListener("click", flip);
      surface.innerHTML = "";
    },
  };
}
