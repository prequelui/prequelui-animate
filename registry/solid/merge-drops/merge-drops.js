import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const DROPS = [
  { x: -38, size: 26, tone: "bg-white/80" },
  { x: 0, size: 34, tone: "bg-white" },
  { x: 38, size: 24, tone: "bg-white/60" },
];

export function createMergeDrops(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let merged = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-4");
  surface.innerHTML = `
    <button type="button" aria-pressed="false" aria-label="Merge the drops"
      class="relative flex h-[74px] w-[150px] items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style="filter:contrast(1.35) blur(0.1px)">
      ${DROPS.map(
        (drop) =>
          `<span data-drop class="absolute rounded-full ${drop.tone}" style="width:${drop.size}px;height:${drop.size}px"></span>`,
      ).join("")}
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Three drops</span>`;

  const button = surface.querySelector("button");
  const label = surface.querySelector("[data-label]");
  const drops = Array.from(surface.querySelectorAll("[data-drop]"));

  function render() {
    const joined = preview ? pulse : merged;
    button.setAttribute("aria-pressed", String(joined));
    label.textContent = joined ? "One bead" : "Three drops";
    drops.forEach((drop, index) => {
      const start = DROPS[index].x;
      animate(
        drop,
        reduce
          ? { x: joined ? 0 : start, scale: 1 }
          : { x: joined ? start * 0.16 : start, scale: joined ? 1.12 : 1 },
        reduce ? { duration: 0 } : { ...springSoft, delay: index * 0.02 },
      );
    });
  }

  button.addEventListener("click", () => {
    merged = !merged;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1200, 2600, (on) => {
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
