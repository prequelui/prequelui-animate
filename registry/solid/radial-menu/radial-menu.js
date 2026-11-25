import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springBounce,
} from "./moment-core.js";

const ITEMS = [
  {
    label: "Edit",
    angle: -90,
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true"><path d="m9.4 2.2 2.4 2.4-7 7H2.4V9.2Z"/><path d="m8.4 3.2 2.4 2.4"/></svg>`,
  },
  {
    label: "Copy",
    angle: -30,
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" class="size-3.5" aria-hidden="true"><rect x="5" y="5" width="7" height="7" rx="1.4"/><path d="M9 5V3.2c0-.7-.5-1.2-1.2-1.2H3.2c-.7 0-1.2.5-1.2 1.2v4.6c0 .7.5 1.2 1.2 1.2H5"/></svg>`,
  },
  {
    label: "Share",
    angle: 30,
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="size-3.5" aria-hidden="true"><circle cx="10.6" cy="3" r="1.7"/><circle cx="3.4" cy="7" r="1.7"/><circle cx="10.6" cy="11" r="1.7"/><path d="m4.9 6.2 4-2.4M4.9 7.8l4 2.4"/></svg>`,
  },
  {
    label: "Tag",
    angle: 90,
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" class="size-3.5" aria-hidden="true"><path d="M2 2h5.2L13 7.8 7.8 13 2 7.2Z"/><circle cx="4.7" cy="4.7" r="1" fill="currentColor" stroke="none"/></svg>`,
  },
  {
    label: "Move",
    angle: 150,
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true"><path d="M7 1v12M1 7h12M4.8 3.2 7 1l2.2 2.2M4.8 10.8 7 13l2.2-2.2M3.2 4.8 1 7l2.2 2.2M10.8 4.8 13 7l-2.2 2.2"/></svg>`,
  },
  {
    label: "Hide",
    angle: 210,
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5" aria-hidden="true"><path d="M1.2 7S3.4 3.2 7 3.2 12.8 7 12.8 7 10.6 10.8 7 10.8 1.2 7 1.2 7Z"/><circle cx="7" cy="7" r="1.7"/><path d="m2 12 10-10"/></svg>`,
  },
];

const RADIUS = 48;

export function createRadialMenu(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let open = false;
  let chosen = null;
  let pulse = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-2");
  surface.innerHTML = `
    <div data-stage class="relative flex size-[148px] items-center justify-center">
      <div role="menu" aria-label="Moment actions" class="absolute inset-0">
        ${ITEMS.map(
          (item, index) =>
            `<button data-item data-label="${item.label}" type="button" role="menuitem" tabindex="-1" aria-hidden="true" aria-label="${item.label}"
              class="absolute left-1/2 top-1/2 -ml-[17px] -mt-[17px] flex size-[34px] items-center justify-center rounded-full border border-white/12 bg-[#1c1c21] text-white/70 outline-none hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white/60"
              style="pointer-events:none;opacity:0">${item.icon}</button>`,
        ).join("")}
      </div>
      <button data-trigger type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Open the radial menu"
        class="relative z-10 flex size-[46px] items-center justify-center rounded-full bg-white text-black outline-none focus-visible:ring-2 focus-visible:ring-black/40">
        <span data-line class="block h-[2px] w-4 rounded-full bg-black"></span>
        <span data-line class="absolute block h-[2px] w-4 rounded-full bg-black"></span>
      </button>
    </div>
    <span data-status aria-live="polite" class="text-[13px] uppercase tracking-[0.18em] text-white/45">Actions</span>`;

  const stage = surface.querySelector("[data-stage]");
  const trigger = surface.querySelector("[data-trigger]");
  const items = Array.from(surface.querySelectorAll("[data-item]"));
  const lines = Array.from(surface.querySelectorAll("[data-line]"));
  const status = surface.querySelector("[data-status]");

  function render() {
    const shown = preview ? pulse : open;
    trigger.setAttribute("aria-expanded", String(shown));
    trigger.setAttribute("aria-label", shown ? "Close the radial menu" : "Open the radial menu");
    status.textContent = chosen ?? (shown ? "Choose" : "Actions");

    lines[0] && animate(
      lines[0],
      { rotate: shown ? 45 : 0, y: shown ? 0 : -3 },
      reduce ? { duration: 0 } : springBounce,
    );
    lines[1] && animate(
      lines[1],
      { rotate: shown ? -45 : 0, y: shown ? 0 : 3 },
      reduce ? { duration: 0 } : springBounce,
    );

    items.forEach((item, index) => {
      const radians = (ITEMS[index].angle * Math.PI) / 180;
      const x = Math.cos(radians) * RADIUS;
      const y = Math.sin(radians) * RADIUS;
      item.setAttribute("aria-hidden", String(!shown));
      item.tabIndex = shown ? 0 : -1;
      item.style.pointerEvents = shown ? "auto" : "none";
      animate(
        item,
        {
          x: shown ? x : 0,
          y: shown ? y : 0,
          scale: shown ? 1 : reduce ? 0.4 : 0,
          opacity: shown ? 1 : 0,
        },
        reduce
          ? { duration: 0 }
          : { ...springBounce, delay: shown ? index * 0.025 : 0 },
      );
    });
  }

  function close(returnFocus) {
    open = false;
    render();
    if (returnFocus) trigger.focus();
  }

  trigger.addEventListener("click", () => {
    open = !open;
    render();
    if (open) items[0]?.focus();
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      chosen = item.dataset.label ?? null;
      close(true);
    });
  });

  stage.addEventListener("keydown", (event) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) return;
    event.preventDefault();
    const current = items.findIndex((node) => node === document.activeElement);
    const next = (current + (forward ? 1 : -1) + ITEMS.length) % ITEMS.length;
    items[next]?.focus();
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
