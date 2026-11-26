import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const CARDS = [
  { face: "A", tone: "bg-white text-black" },
  { face: "K", tone: "bg-white/85 text-black" },
  { face: "Q", tone: "bg-white/70 text-black" },
  { face: "J", tone: "bg-white/55 text-black" },
  { face: "10", tone: "bg-white/40 text-black" },
];

export function createCardFan(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let open = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-3");
  surface.innerHTML = `
    <button type="button" aria-pressed="false" aria-label="Fan the card deck"
      class="group relative h-[92px] w-[184px] outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      ${CARDS.map(
        (card, index) =>
          `<span data-card class="absolute bottom-0 left-1/2 h-[74px] w-[50px] origin-bottom rounded-lg border border-black/10 shadow-lg ${card.tone}" style="margin-left:-25px">
            <span class="absolute left-1.5 top-1 text-[13px] font-semibold">${card.face}</span>
            <span class="absolute inset-0 flex items-center justify-center text-[16px]">${index % 2 === 0 ? "♠" : "♦"}</span>
          </span>`,
      ).join("")}
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Deck</span>`;

  const button = surface.querySelector("button");
  const label = surface.querySelector("[data-label]");
  const cards = Array.from(surface.querySelectorAll("[data-card]"));
  const middle = (CARDS.length - 1) / 2;

  function render() {
    const fanned = preview ? pulse : open;
    button.setAttribute("aria-pressed", String(fanned));
    label.textContent = fanned ? "Fan" : "Deck";
    cards.forEach((card, index) => {
      const offset = index - middle;
      animate(
        card,
        reduce
          ? { x: offset * 20, y: 0, rotate: offset * 6 }
          : {
              x: fanned ? offset * 30 : offset * 3,
              y: fanned ? -Math.abs(offset) * 2 : -index * 1.5,
              rotate: fanned ? offset * 15 : offset * 4,
            },
        reduce ? { duration: 0 } : { ...springSoft, delay: index * 0.025 },
      );
    });
  }

  button.addEventListener("click", () => {
    open = !open;
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
