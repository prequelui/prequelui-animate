import { animate } from "motion";
import {
  applySurface,
  clamp,
  icon,
  localPoint,
  naturalWidth,
  prefersReducedMotion,
  previewPulse,
  springFast,
} from "./moment-core.js";

const TRACK = 214;
const PAD = 6;
const KNOB = 34;
const TRAVEL = TRACK - PAD * 2 - KNOB;

export function createSwipeConfirm(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let progress = 0;
  let confirmed = false;
  let pulse = false;
  let dragging = false;
  let cancelPreview = () => {};
  let resetTimer = 0;

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <div data-track role="slider" tabindex="0" aria-label="Swipe to confirm" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" aria-valuetext="0%"
      class="relative h-[46px] w-[214px] touch-none overflow-hidden rounded-full border border-white/12 bg-white/8 p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span aria-hidden="true" data-fill class="absolute inset-y-1.5 left-1.5 right-1.5 origin-left rounded-full bg-white/12"></span>
      <span data-label class="pointer-events-none absolute inset-0 flex items-center justify-center pl-4 text-[13px] uppercase tracking-[0.18em] text-white/45">Swipe to confirm</span>
      <span data-knob class="absolute left-1.5 top-1.5 flex size-[34px] items-center justify-center rounded-full bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,.35)]">${icon("chevron")}</span>
    </div>`;

  const track = surface.querySelector("[data-track]");
  const fill = surface.querySelector("[data-fill]");
  const label = surface.querySelector("[data-label]");
  const knob = surface.querySelector("[data-knob]");

  animate(fill, { scaleX: 0.001 }, { duration: 0 });

  function render() {
    const shown = preview ? (pulse ? 100 : 0) : progress;
    const done = preview ? pulse : confirmed;
    track.setAttribute("aria-valuenow", String(shown));
    track.setAttribute("aria-valuetext", done ? "Confirmed" : `${shown}%`);
    label.textContent = done ? "Confirmed" : shown >= 88 ? "Release" : "Swipe to confirm";
    knob.innerHTML = done ? icon("check") : icon("chevron");
    animate(
      fill,
      { scaleX: Math.max(0.001, shown / 100) },
      reduce ? { duration: 0 } : springFast,
    );
    animate(
      knob,
      { x: (shown / 100) * TRAVEL },
      reduce ? { duration: 0 } : springFast,
    );
  }

  function confirm() {
    progress = 100;
    confirmed = true;
    render();
    window.clearTimeout(resetTimer);
    resetTimer = window.setTimeout(() => {
      confirmed = false;
      progress = 0;
      render();
    }, 1100);
  }

  function setFromEvent(event) {
    const point = localPoint(event, track);
    const usable = Math.max(1, naturalWidth(track) - PAD * 2 - KNOB);
    const ratio = clamp((point.x - PAD - KNOB / 2) / usable, 0, 1);
    progress = Math.round(ratio * 100);
    confirmed = false;
    render();
  }

  function down(event) {
    dragging = true;
    try {
      track.setPointerCapture(event.pointerId);
    } catch {}
    setFromEvent(event);
  }

  function move(event) {
    if (dragging) setFromEvent(event);
  }

  function release() {
    if (!dragging) return;
    dragging = false;
    if (progress >= 88) {
      confirm();
      return;
    }
    progress = 0;
    render();
  }

  function key(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      progress = Math.min(100, progress + 25);
      confirmed = false;
      render();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      progress = Math.max(0, progress - 25);
      confirmed = false;
      render();
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (progress >= 75) confirm();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      confirmed = false;
      progress = 0;
      render();
    }
  }

  track.addEventListener("pointerdown", down);
  track.addEventListener("pointermove", move);
  track.addEventListener("pointerup", release);
  track.addEventListener("pointercancel", release);
  track.addEventListener("keydown", key);

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
      window.clearTimeout(resetTimer);
      track.removeEventListener("pointerdown", down);
      track.removeEventListener("pointermove", move);
      track.removeEventListener("pointerup", release);
      track.removeEventListener("pointercancel", release);
      track.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
