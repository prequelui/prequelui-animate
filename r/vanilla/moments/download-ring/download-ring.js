import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DOWNLOAD_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-6" aria-hidden="true"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>`;
const CHECK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" class="size-6" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`;

export function createDownloadRing(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let progress = 0;
  let done = false;
  let pulse = false;
  let interval = 0;
  let resetTimer = 0;
  let lastBusy = false;
  let lastDone = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <button type="button" aria-label="Start the download" aria-busy="false"
      class="group relative flex size-[104px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <svg aria-hidden="true" viewBox="0 0 80 80" class="absolute inset-0 size-full -rotate-90">
        <circle cx="40" cy="40" r="${RADIUS}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="3" />
        <circle data-ring cx="40" cy="40" r="${RADIUS}" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" />
      </svg>
      <span data-halo aria-hidden="true" class="absolute inset-2 rounded-full border border-white/10"></span>
      <span data-glyph class="relative z-10 flex items-center justify-center text-white">
        <span data-download>${DOWNLOAD_ICON}</span>
        <span data-check hidden>${CHECK_ICON}</span>
      </span>
      <span data-percent class="absolute bottom-0.5 text-[13px] tabular-nums text-white/45">0%</span>
    </button>`;

  const button = surface.querySelector("button");
  const ring = surface.querySelector("[data-ring]");
  const halo = surface.querySelector("[data-halo]");
  const glyph = surface.querySelector("[data-glyph]");
  const download = surface.querySelector("[data-download]");
  const check = surface.querySelector("[data-check]");
  const percent = surface.querySelector("[data-percent]");

  ring.style.strokeDasharray = String(CIRCUMFERENCE);
  ring.style.strokeDashoffset = String(CIRCUMFERENCE);

  function render() {
    const busy = progress > 0 && !done;
    button.setAttribute("aria-label", done ? "Download complete" : "Start the download");
    button.setAttribute("aria-busy", String(busy));
    animate(
      ring,
      {
        strokeDashoffset:
          CIRCUMFERENCE *
          (1 - (reduce ? (progress > 0 ? 1 : 0) : progress / 100)),
      },
      { duration: reduce ? 0 : 0.18, ease: "linear" },
    );

    if (busy !== lastBusy) {
      lastBusy = busy;
      if (reduce) {
        animate(halo, { opacity: 0.3, scale: 1 }, { duration: 0 });
      } else if (busy) {
        animate(
          halo,
          { opacity: [0.15, 0.45, 0.15], scale: [1, 1.06, 1] },
          { duration: 1.2, repeat: Infinity, ease: "easeInOut" },
        );
      } else {
        animate(halo, { opacity: 0.2, scale: 1 }, { duration: 0 });
      }
    }

    if (done !== lastDone) {
      lastDone = done;
      if (done && !reduce) {
        animate(
          glyph,
          { scale: [0.6, 1.14, 1], opacity: 1 },
          { duration: 0.34, ease: [0.22, 1, 0.36, 1] },
        );
      } else {
        animate(glyph, { scale: 1, opacity: 1 }, { duration: 0 });
      }
    }

    download.hidden = done;
    check.hidden = !done;
    percent.hidden = done;
    percent.textContent = String(Math.round(reduce && progress > 0 ? 100 : progress));
    animate(
      download,
      { y: reduce ? 0 : Math.min(8, progress * 0.1) },
      { type: "spring", stiffness: 320, damping: 24 },
    );
  }

  function finish() {
    window.clearInterval(interval);
    interval = 0;
    done = true;
    render();
    resetTimer = window.setTimeout(() => {
      done = false;
      progress = 0;
      resetTimer = 0;
      render();
    }, 1200);
  }

  function start() {
    if (done) return;
    window.clearInterval(interval);
    window.clearTimeout(resetTimer);
    resetTimer = 0;
    progress = 0;
    done = false;
    render();
    if (reduce) {
      progress = 100;
      finish();
      return;
    }
    interval = window.setInterval(() => {
      progress = Math.min(100, progress + 2.4);
      if (progress >= 100) {
        progress = 100;
        finish();
      } else {
        render();
      }
    }, 32);
  }

  button.addEventListener("click", start);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1700, 3200, (on) => {
      pulse = on;
      if (pulse) start();
    }, reduce);
  }

  setPreview(preview);
  render();

  return {
    update(next = {}) {
      if (next.preview !== undefined && Boolean(next.preview) !== preview) {
        setPreview(next.preview);
      }
    },
    destroy() {
      cancelPreview();
      window.clearInterval(interval);
      window.clearTimeout(resetTimer);
      button.removeEventListener("click", start);
      surface.innerHTML = "";
    },
  };
}
