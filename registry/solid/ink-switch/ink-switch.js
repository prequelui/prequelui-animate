import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const TRACK = 72;
const PAD = 4;
const KNOB = 28;
const INK = TRACK - PAD * 2;

export function createInkSwitch(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let on = false;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-4");
  surface.innerHTML = `
    <button type="button" role="switch" aria-checked="false" aria-label="Ink switch"
      class="relative h-9 w-[72px] overflow-hidden rounded-full border border-white/12 bg-white/5 p-1 outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-ink aria-hidden="true" class="absolute left-1 top-1 h-7 bg-white" style="width:${INK}px;transform-origin:left center"></span>
      ${[0.28, 0.52, 0.74]
        .map(
          (position, index) =>
            `<span data-drop aria-hidden="true" class="absolute size-1 rounded-full bg-black/25" style="left:${position * 100}%;top:50%;margin-top:-2px"></span>`,
        )
        .join("")}
      <span data-knob aria-hidden="true" class="absolute left-1 top-1 size-7 rounded-full shadow-[0_2px_8px_rgba(0,0,0,.35)]"></span>
      <span data-status class="sr-only">Off</span>
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Dry</span>`;

  const button = surface.querySelector("button");
  const ink = surface.querySelector("[data-ink]");
  const knob = surface.querySelector("[data-knob]");
  const status = surface.querySelector("[data-status]");
  const label = surface.querySelector("[data-label]");
  const drops = Array.from(surface.querySelectorAll("[data-drop]"));

  function render() {
    const filled = preview ? pulse : on;
    button.setAttribute("aria-checked", String(filled));
    status.textContent = filled ? "On" : "Off";
    label.textContent = filled ? "Inked" : "Dry";

    animate(
      ink,
      {
        scaleX: filled ? 1 : KNOB / INK,
        borderRadius: reduce ? 16 : filled ? 18 : 48,
      },
      reduce ? { duration: 0 } : springSoft,
    );

    drops.forEach((drop, index) => {
      animate(
        drop,
        reduce
          ? { opacity: 0, scale: 0.4 }
          : {
              opacity: filled ? [0, 0, 0.5] : 0,
              scale: filled ? 1 : 0.4,
            },
        reduce
          ? { duration: 0 }
          : { duration: 0.5, delay: index * 0.06, ease: "easeOut" },
      );
    });

    animate(
      knob,
      {
        x: filled ? KNOB + 8 : 0,
        backgroundColor: filled ? "#111114" : "#ffffff",
      },
      reduce ? { duration: 0 } : springSoft,
    );
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
