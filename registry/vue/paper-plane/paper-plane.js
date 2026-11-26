import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

export function createPaperPlane(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let pulse = false;
  let flying = false;
  let timer = 0;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <button type="button" aria-label="Send the paper plane"
      class="relative h-[108px] w-[190px] overflow-hidden rounded-xl border border-white/10 bg-[#101013] outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <svg aria-hidden="true" viewBox="0 0 190 108" class="absolute inset-0 size-full">
        <path d="M24 84 C 70 54, 104 38, 158 24" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="1" stroke-dasharray="4 5" />
        <path data-trail d="M24 84 C 70 54, 104 38, 158 24" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="1.5" stroke-dasharray="4 5" />
      </svg>
      <span data-plane class="absolute left-4 top-[78px] block">
        <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden="true">
          <path d="M1 10.5 25 1 17 21l-5.4-7.1L1 10.5Z" fill="white" stroke="white" stroke-width="1" stroke-linejoin="round" />
          <path d="m11.6 13.9 5.2-5.2" stroke="#101013" stroke-width="1" />
        </svg>
      </span>
      <span aria-hidden="true" data-spark class="absolute right-6 top-5 size-1.5 rounded-full bg-white"></span>
      <span data-label class="absolute bottom-2 left-3 text-[13px] uppercase tracking-[0.18em] text-white/35">Tap to send</span>
    </button>`;

  const button = surface.querySelector("button");
  const trail = surface.querySelector("[data-trail]");
  const plane = surface.querySelector("[data-plane]");
  const spark = surface.querySelector("[data-spark]");
  const label = surface.querySelector("[data-label]");

  animate(trail, { pathLength: 0 }, { duration: 0 });

  function render() {
    animate(
      trail,
      { pathLength: flying ? 1 : 0 },
      { duration: reduce ? 0 : 1.1, ease: [0.23, 1, 0.32, 1] },
    );
    animate(
      plane,
      reduce
        ? { x: 0, y: 0, rotate: 0, opacity: 1 }
        : flying
          ? { x: 128, y: -58, rotate: -18, opacity: [1, 1, 0.2] }
          : { x: 0, y: 0, rotate: 0, opacity: 1 },
      reduce ? { duration: 0 } : { duration: 1.15, ease: [0.22, 1, 0.36, 1] },
    );
    animate(
      spark,
      { opacity: flying ? [0, 1, 0] : 0.3, scale: flying ? 1.6 : 1 },
      reduce ? { duration: 0 } : { duration: 1.1 },
    );
    animate(label, { opacity: flying ? 0 : 1 }, { duration: reduce ? 0 : 0.18 });
  }

  function schedule() {
    window.clearTimeout(timer);
    if (!flying) return;
    timer = window.setTimeout(() => {
      flying = false;
      render();
    }, reduce ? 200 : 1600);
  }

  function fly() {
    flying = true;
    schedule();
    render();
  }

  button.addEventListener("click", fly);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1500, 3000, (on) => {
      pulse = on;
      if (preview && pulse) fly();
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
      window.clearTimeout(timer);
      surface.innerHTML = "";
    },
  };
}
