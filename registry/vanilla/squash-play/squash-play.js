import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

const PLAY_GLYPH =
  '<span class="block h-0 w-0" style="border-top:11px solid transparent;border-bottom:11px solid transparent;border-left:17px solid black;margin-left:4px"></span>';
const PAUSE_GLYPH =
  '<span class="block h-5 w-[5px] rounded-full bg-black"></span><span class="block h-5 w-[5px] rounded-full bg-black"></span>';

export function createSquashPlay(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let playing = false;
  let squash = 0;
  let lastSquash = 0;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-3");
  surface.innerHTML = `
    <button type="button" aria-pressed="false" aria-label="Play"
      class="flex size-[88px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-disc class="flex size-[74px] items-center justify-center bg-white text-black" style="border-radius:37px">
        <span data-glyph class="flex items-center gap-[5px]">${PLAY_GLYPH}</span>
      </span>
    </button>
    <span data-label aria-live="polite" class="text-[13px] uppercase tracking-[0.18em] text-white/45">Paused</span>`;

  const button = surface.querySelector("button");
  const disc = surface.querySelector("[data-disc]");
  const glyph = surface.querySelector("[data-glyph]");
  const label = surface.querySelector("[data-label]");

  function render() {
    const active = preview ? pulse : playing;
    button.setAttribute("aria-pressed", String(active));
    button.setAttribute("aria-label", active ? "Pause" : "Play");
    glyph.innerHTML = active ? PAUSE_GLYPH : PLAY_GLYPH;
    label.textContent = active ? "Playing" : "Paused";

    if (squash !== lastSquash) {
      lastSquash = squash;
      if (reduce || squash === 0) {
        animate(
          disc,
          { scale: 1, rotate: 0, borderRadius: active ? 20 : 37 },
          { duration: 0 },
        );
      } else {
        animate(
          disc,
          {
            scale: [1, 0.78, 1.06, 1],
            rotate: [0, -3, 2, 0],
            borderRadius: active ? 20 : 37,
          },
          { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        );
      }
    } else {
      animate(
        disc,
        { borderRadius: active ? 20 : 37 },
        { duration: reduce ? 0 : 0.2 },
      );
    }
  }

  function press() {
    playing = !playing;
    if (!reduce) squash += 1;
    render();
  }

  button.addEventListener("click", press);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1200, 2700, (on) => {
      pulse = on;
      if (pulse) squash += 1;
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
      button.removeEventListener("click", press);
      surface.innerHTML = "";
    },
  };
}
