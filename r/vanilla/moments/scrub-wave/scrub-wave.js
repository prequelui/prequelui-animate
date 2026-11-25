import { animate } from "motion";
import {
  applySurface,
  clamp,
  localPoint,
  prefersReducedMotion,
  previewPointer,
} from "./moment-core.js";

const BARS = 24;
const WIDTH = 196;

export function createScrubWave(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let point = { x: WIDTH / 2, y: 45 };
  let dragging = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <div data-track role="slider" tabindex="0" aria-label="Scrub the wave" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" aria-valuetext="Playhead at 50 percent"
      class="relative h-[92px] w-[206px] cursor-ew-resize touch-none overflow-hidden rounded-xl border border-white/10 bg-white/4 outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <div class="absolute inset-x-2 top-1/2 flex h-[58px] -translate-y-1/2 items-center gap-[3px]">
        ${Array.from(
          { length: BARS },
          () =>
            `<span data-bar class="w-[3px] flex-1 rounded-full bg-white" style="height:50px;transform-origin:center"></span>`,
        ).join("")}
      </div>
      <span data-playhead aria-hidden="true" class="absolute inset-y-3 left-0 w-px bg-white"></span>
      <span data-label class="absolute bottom-1.5 left-2 text-[13px] tabular-nums text-white/40">50%</span>
    </div>`;

  const track = surface.querySelector("[data-track]");
  const bars = Array.from(surface.querySelectorAll("[data-bar]"));
  const playhead = surface.querySelector("[data-playhead]");
  const label = surface.querySelector("[data-label]");

  function render() {
    const ratio = clamp(point.x / WIDTH, 0, 1);
    track.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
    track.setAttribute("aria-valuetext", `Playhead at ${Math.round(ratio * 100)} percent`);
    label.textContent = `${Math.round(ratio * 100)}%`;

    bars.forEach((bar, index) => {
      const distance = Math.abs(index / BARS - ratio);
      const closeness = clamp(1 - distance * 5, 0, 1);
      const height = 10 + closeness * 38 + Math.abs(Math.sin(index * 1.3)) * 8;
      animate(
        bar,
        { scaleY: height / 50, opacity: 0.25 + closeness * 0.75 },
        reduce ? { duration: 0 } : { duration: 0.14, ease: "linear" },
      );
    });

    animate(
      playhead,
      { x: ratio * WIDTH },
      reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 },
    );
  }

  function move(event) {
    point = localPoint(event, track);
    render();
  }

  function down(event) {
    dragging = true;
    try {
      track.setPointerCapture(event.pointerId);
    } catch {}
    move(event);
  }

  function drag(event) {
    if (dragging) move(event);
  }

  function up(event) {
    dragging = false;
    try {
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    } catch {}
  }

  function key(event) {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    if (event.key === "Home") {
      point = { ...point, x: 0 };
    } else if (event.key === "End") {
      point = { ...point, x: WIDTH };
    } else {
      const delta = event.key === "ArrowRight" ? 12 : -12;
      point = { ...point, x: clamp(point.x + delta, 0, WIDTH) };
    }
    render();
  }

  track.addEventListener("pointerdown", down);
  track.addEventListener("pointermove", drag);
  track.addEventListener("pointerup", up);
  track.addEventListener("pointercancel", up);
  track.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPointer(preview, WIDTH, 90, (next) => {
      point = next;
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
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", drag);
      track.removeEventListener("pointerup", up);
      track.removeEventListener("pointercancel", up);
      track.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
