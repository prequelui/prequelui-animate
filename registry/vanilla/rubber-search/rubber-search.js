import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const MOMENT_NAMES = [
  "Bars Fade",
  "Bloom Toggle",
  "Snap Grid",
  "Card Fan",
  "Gooey Tab Bar",
  "Blocks Scale",
  "Stretch Toggle",
  "Merge Drops",
  "Paper Plane",
  "Detent Dial",
  "Domino Row",
  "Pebble Rating",
  "Jelly Pad",
  "Swipe Confirm",
  "Bookmark",
  "Depth Stack",
  "Menu Morph",
  "Elastic String",
  "Ripple Pad",
  "Worm Dots",
  "Download Ring",
  "Leaf Tabs",
  "Bell Toggle",
  "Ink Switch",
  "Rocker Switch",
  "Scrub Wave",
  "Squash Play",
  "Rubber Search",
  "Odometer",
  "Tide Progress",
  "Eclipse Half",
  "Magnet Grid",
  "Checklist",
  "Flip Coin",
  "Radial Menu",
  "Dot Revolve",
];

export function createRubberSearch(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let focused = false;
  let query = "";
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <label class="relative block w-[214px]">
      <span class="sr-only">Rubber search</span>
      <span data-shell aria-hidden="true" class="absolute inset-1 rounded-full border border-white/15 bg-white/8" style="transform-origin:center"></span>
      <span data-magnifier class="absolute left-3 z-10" style="top:50%;margin-top:-7.5px">
        <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
          <circle cx="6.4" cy="6.4" r="4.6" fill="none" stroke="white" stroke-width="1.5" />
          <path d="m10 10 3.2 3.2" stroke="white" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </span>
      <input data-input type="search" placeholder="Search moments"
        class="relative z-10 h-[44px] w-full bg-transparent pl-9 pr-3 text-[13px] text-white placeholder:text-white/35 focus:outline-none [&::-webkit-search-cancel-button]:hidden" />
      <span data-counter aria-live="polite" class="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[13px] uppercase tracking-[0.14em] text-white/35">Type</span>
    </label>`;

  const shell = surface.querySelector("[data-shell]");
  const magnifier = surface.querySelector("[data-magnifier]");
  const input = surface.querySelector("[data-input]");
  const counter = surface.querySelector("[data-counter]");

  function hits() {
    if (!query) return MOMENT_NAMES.length;
    const needle = query.trim().toLowerCase();
    return MOMENT_NAMES.filter((name) => name.toLowerCase().includes(needle)).length;
  }

  function render() {
    const active = preview ? pulse : focused;
    animate(
      shell,
      {
        scaleX: reduce ? 1 : active ? 1 : 0.84,
        scaleY: active ? 1.06 : 1,
      },
      reduce ? { duration: 0 } : springSoft,
    );
    animate(
      magnifier,
      {
        x: active ? -1 : 0,
        scale: active ? 1.08 : 1,
        rotate: active ? -8 : 0,
      },
      reduce ? { duration: 0 } : springSoft,
    );

    if (query) {
      const count = hits();
      counter.textContent = `${count} ${count === 1 ? "hit" : "hits"}`;
    } else {
      counter.textContent = "Type";
    }
    animate(counter, { opacity: query ? 1 : 0.5 }, { duration: 0 });
  }

  input.addEventListener("focus", () => {
    focused = true;
    render();
  });
  input.addEventListener("blur", () => {
    focused = false;
    render();
  });
  input.addEventListener("input", () => {
    query = input.value;
    render();
  });

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1400, 3000, (on) => {
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
