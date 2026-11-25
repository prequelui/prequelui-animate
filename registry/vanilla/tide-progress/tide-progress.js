import { animate } from "motion";
import {
  applySurface,
  clamp,
  localPoint,
  naturalWidth,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const HEIGHT = 86;
const WAVE = 32;

export function createTideProgress(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let level = 38;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <div data-track role="progressbar" tabindex="0" aria-label="Tide progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="38" aria-valuetext="38 percent"
      class="relative h-[86px] w-[206px] overflow-hidden rounded-xl border border-white/12 bg-white/4 outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <div data-fill class="absolute inset-0 bg-white/25"></div>
      <div data-drift class="absolute inset-x-0 top-0 h-8">
        <div data-wave class="absolute inset-0" style="background:repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,.55) 6px 9px);mask-image:linear-gradient(to bottom, black, transparent);-webkit-mask-image:linear-gradient(to bottom, black, transparent)"></div>
      </div>
      <span data-label class="absolute bottom-2 left-3 text-[13px] uppercase tracking-[0.16em] text-white/50">Tide 38%</span>
    </div>`;

  const track = surface.querySelector("[data-track]");
  const fill = surface.querySelector("[data-fill]");
  const drift = surface.querySelector("[data-drift]");
  const wave = surface.querySelector("[data-wave]");
  const label = surface.querySelector("[data-label]");

  if (reduce) {
    animate(drift, { x: 0 }, { duration: 0 });
  } else {
    animate(drift, { x: [0, -18, 0] }, { duration: 3.2, repeat: Infinity, ease: "easeInOut" });
  }

  function render() {
    const shown = preview ? (pulse ? 92 : 28) : level;
    track.setAttribute("aria-valuenow", String(Math.round(shown)));
    track.setAttribute("aria-valuetext", `${Math.round(shown)} percent`);
    label.textContent = `Tide ${Math.round(shown)}%`;
    animate(
      fill,
      { clipPath: `inset(${100 - shown}% 0 0 0)` },
      reduce ? { duration: 0 } : springSoft,
    );
    animate(
      wave,
      { y: (HEIGHT * (100 - shown)) / 100 - WAVE / 2 },
      reduce ? { duration: 0 } : springSoft,
    );
  }

  function move(event) {
    const point = localPoint(event, track);
    level = clamp((point.x / Math.max(1, naturalWidth(track))) * 100, 4, 100);
    render();
  }

  function key(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      level = Math.min(100, level + 8);
      render();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      level = Math.max(4, level - 8);
      render();
    }
  }

  track.addEventListener("pointermove", move);
  track.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1600, 3200, (on) => {
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
      track.removeEventListener("pointermove", move);
      track.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
