import { animate } from "motion";
import {
  applySurface,
  clamp,
  localPoint,
  naturalWidth,
  prefersReducedMotion,
  previewPulse,
  springBounce,
} from "./moment-core.js";

const WIDTH = 206;
const HEIGHT = 84;
const MID = HEIGHT / 2;
const LEFT = 18;
const RIGHT = WIDTH - 18;
const CENTER = WIDTH / 2;
const LIMIT = 56;
const VIBRATION = [0, 9, -6, 4, -2, 0];

function stringPath(pull, wobble = 0) {
  const bead = CENTER + pull;
  const bow = 2 + (Math.abs(pull) / LIMIT) * 12;
  const controlY = MID - bow + wobble;
  const leftControl = (LEFT + bead) / 2;
  const rightControl = (bead + RIGHT) / 2;
  return `M ${LEFT} ${MID} Q ${leftControl} ${controlY} ${bead} ${MID} Q ${rightControl} ${controlY} ${RIGHT} ${MID}`;
}

export function createElasticString(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let pull = 0;
  let pulse = false;
  let dragging = false;
  let cancelPreview = () => {};
  let frame = 0;

  const surface = applySurface(root, "flex-col gap-1");
  surface.innerHTML = `
    <div data-band role="slider" tabindex="0" aria-label="Elastic string" aria-valuemin="${-LIMIT}" aria-valuemax="${LIMIT}" aria-valuenow="0"
      class="relative h-[84px] w-[206px] touch-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <svg aria-hidden="true" viewBox="0 0 ${WIDTH} ${HEIGHT}" class="absolute inset-0 size-full overflow-visible">
        <path d="${stringPath(0)}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="10" stroke-linecap="round" />
        <path data-string fill="none" stroke="rgba(255,255,255,.62)" stroke-width="2" stroke-linecap="round" />
        <circle cx="${LEFT}" cy="${MID}" r="4" fill="rgba(255,255,255,.75)" />
        <circle cx="${RIGHT}" cy="${MID}" r="4" fill="rgba(255,255,255,.75)" />
        <circle data-halo cx="${CENTER}" cy="${MID}" r="15" fill="rgba(255,255,255,.12)" />
        <circle data-bead cx="${CENTER}" cy="${MID}" r="8" fill="#ffffff" stroke="rgba(255,255,255,.4)" stroke-width="1" />
      </svg>
    </div>
    <span data-label class="text-[13px] uppercase tracking-[0.2em] text-white/35">Pull the bead</span>`;

  const band = surface.querySelector("[data-band]");
  const string = surface.querySelector("[data-string]");
  const halo = surface.querySelector("[data-halo]");
  const bead = surface.querySelector("[data-bead]");
  const label = surface.querySelector("[data-label]");

  function shownValue() {
    return preview ? (pulse ? 44 : 0) : pull;
  }

  function setPath(value) {
    string.setAttribute("d", stringPath(value));
  }

  function render() {
    const shown = shownValue();
    band.setAttribute("aria-valuenow", String(Math.round(shown)));
    band.setAttribute(
      "aria-valuetext",
      `${Math.round(Math.abs(shown))} pixels ${shown < 0 ? "left" : "right"} of centre`,
    );
    label.textContent =
      Math.round(Math.abs(shown)) === 0
        ? "Pull the bead"
        : `${Math.round(Math.abs(shown))} px`;
    setPath(shown);
    animate(bead, { cx: CENTER + shown }, reduce ? { duration: 0 } : springBounce);
    animate(halo, { cx: CENTER + shown }, reduce ? { duration: 0 } : springBounce);
  }

  function setFromEvent(event) {
    const point = localPoint(event, band);
    pull = clamp(point.x - naturalWidth(band) / 2, -LIMIT, LIMIT);
    render();
  }

  function vibrate() {
    if (reduce) {
      setPath(0);
      return;
    }
    cancelAnimationFrame(frame);
    const start = performance.now();
    const duration = 550;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = clamp((now - start) / duration, 0, 1);
      const position = ease(t) * (VIBRATION.length - 1);
      const index = Math.min(VIBRATION.length - 2, Math.floor(position));
      const blend = position - index;
      const value = VIBRATION[index] + (VIBRATION[index + 1] - VIBRATION[index]) * blend;
      setPath(value);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPath(0);
    };
    frame = requestAnimationFrame(tick);
  }

  function releaseString() {
    dragging = false;
    pull = 0;
    render();
    vibrate();
  }

  function down(event) {
    dragging = true;
    try {
      band.setPointerCapture(event.pointerId);
    } catch {}
    setFromEvent(event);
  }

  function move(event) {
    if (dragging) setFromEvent(event);
  }

  function key(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      pull = clamp(pull + 14, -LIMIT, LIMIT);
      render();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      pull = clamp(pull - 14, -LIMIT, LIMIT);
      render();
    }
    if (event.key === "Home") {
      event.preventDefault();
      pull = -LIMIT;
      render();
    }
    if (event.key === "End") {
      event.preventDefault();
      pull = LIMIT;
      render();
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      releaseString();
    }
  }

  band.addEventListener("pointerdown", down);
  band.addEventListener("pointermove", move);
  band.addEventListener("pointerup", releaseString);
  band.addEventListener("pointercancel", releaseString);
  band.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1100, 2600, (on) => {
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
      cancelAnimationFrame(frame);
      band.removeEventListener("pointerdown", down);
      band.removeEventListener("pointermove", move);
      band.removeEventListener("pointerup", releaseString);
      band.removeEventListener("pointercancel", releaseString);
      band.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
