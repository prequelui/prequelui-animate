import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
} from "./moment-core.js";

export function createBellToggle(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let muted = false;
  let pulse = false;
  let swing = 0;
  let shown = false;
  let initial = true;
  let lastShown = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-3");
  surface.innerHTML = `
    <button type="button" role="switch" aria-checked="false" aria-label="Mute the bell"
      class="relative flex h-[86px] w-[98px] items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-wave aria-hidden="true" class="pointer-events-none absolute left-1/2 top-1/2 size-14 rounded-full border border-white/40" style="margin-left:-28px;margin-top:-28px;opacity:0"></span>
      <span data-bell class="relative z-10" style="transform-origin:50% 12%">
        <svg width="38" height="42" viewBox="0 0 38 42" aria-hidden="true">
          <path data-body d="M19 3c-7 0-11 5-11 12v7l-4 6h30l-4-6v-7c0-7-4-12-11-12Z" fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round" />
          <circle data-clapper cx="19" cy="34" r="3" fill="white" />
          <path data-strike d="M10 8 L28 30" stroke="rgba(255,255,255,.75)" stroke-width="2" stroke-linecap="round" style="display:none" />
        </svg>
      </span>
      <span data-badge aria-hidden="true" class="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-white text-[13px] font-bold leading-none text-black" style="opacity:0">×</span>
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Ringing</span>`;

  const button = surface.querySelector("button");
  const wave = surface.querySelector("[data-wave]");
  const bell = surface.querySelector("[data-bell]");
  const body = surface.querySelector("[data-body]");
  const clapper = surface.querySelector("[data-clapper]");
  const strike = surface.querySelector("[data-strike]");
  const badge = surface.querySelector("[data-badge]");
  const label = surface.querySelector("[data-label]");

  function ring() {
    if (reduce) return;
    animate(wave, { scale: [0.7, 1.7], opacity: [0.5, 0] }, { duration: 0.8, ease: "easeOut" });
  }

  function render() {
    shown = preview ? pulse : muted;

    if (initial) {
      initial = false;
      lastShown = shown;
      if (!shown) ring();
    } else if (shown !== lastShown) {
      lastShown = shown;
      if (!reduce) swing += 1;
      if (!shown) ring();
    }

    button.setAttribute("aria-checked", String(shown));
    body.setAttribute("fill", shown ? "rgba(255,255,255,.22)" : "white");
    clapper.setAttribute("fill", shown ? "rgba(255,255,255,.4)" : "white");
    strike.style.display = shown ? "inline" : "none";
    badge.hidden = !shown;
    label.textContent = shown ? "Muted" : "Ringing";

    if (shown) {
      animate(
        badge,
        reduce ? { scale: 1, opacity: 1 } : { scale: [0.4, 1], opacity: [0, 1] },
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 520, damping: 24 },
      );
    }

    animate(
      bell,
      reduce || swing === 0 ? { rotate: 0 } : { rotate: [0, 18, -15, 9, -5, 0] },
      reduce ? { duration: 0 } : { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    );
  }

  button.addEventListener("click", () => {
    muted = !muted;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1000, 2600, (on) => {
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
