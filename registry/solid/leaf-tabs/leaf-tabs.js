import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewStep,
  springSoft,
} from "./moment-core.js";

const TABS = [
  {
    label: "Spring",
    copy: "A soft curve that settles.",
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" class="size-3.5" aria-hidden="true"><circle cx="7" cy="7" r="1.6" fill="currentColor" stroke="none"/><path d="M7 1.4c1.1 1.9.9 3.5-.1 4.6M12.6 7c-1.9 1.1-3.5.9-4.6-.1M7 12.6c-1.1-1.9-.9-3.5.1-4.6M1.4 7c1.9-1.1 3.5-.9 4.6.1"/></svg>`,
  },
  {
    label: "Summer",
    copy: "Short, warm and direct.",
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" class="size-3.5" aria-hidden="true"><circle cx="7" cy="7" r="2.5"/><path d="M7 1v1.4M7 11.6V13M1 7h1.4M11.6 7H13M2.8 2.8l1 1M10.2 10.2l1 1M11.2 2.8l-1 1M3.8 10.2l-1 1"/></svg>`,
  },
  {
    label: "Autumn",
    copy: "A slower, falling rhythm.",
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" class="size-3.5" aria-hidden="true"><path d="M2.2 11.8C2.2 6.5 6.5 2.2 11.8 2.2c0 5.3-4.3 9.6-9.6 9.6Z"/><path d="M2.6 11.4 8 6" stroke-linecap="round"/></svg>`,
  },
  {
    label: "Winter",
    copy: "Still, quiet and exact.",
    icon: `<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="size-3.5" aria-hidden="true"><path d="M7 1v12M2 3.8l10 6.4M12 3.8 2 10.2"/><path d="m5.2 2.4 1.8 1 1.8-1M5.2 11.6l1.8-1 1.8 1M2.4 5.4l.4 2-1.4 1.4M11.6 8.6l-.4-2 1.4-1.4"/></svg>`,
  },
];

const SLOT = 44;

export function createLeafTabs(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let active = 0;
  let step = 0;
  let lastIndex = -1;
  let cancelPreview = () => {};

  const baseId = `leaf-${Math.random().toString(36).slice(2, 9)}`;

  const surface = applySurface(root, "flex-col gap-0");
  surface.innerHTML = `
    <div data-tablist role="tablist" aria-label="Leaf tabs" class="flex items-end gap-1">
      ${TABS.map(
        (tab, index) =>
          `<button data-tab type="button" role="tab" id="${baseId}-tab-${index}" aria-label="${tab.label}" aria-selected="false" aria-controls="${baseId}-panel" tabindex="-1"
            class="flex h-8 items-center justify-center rounded-tl-[18px] rounded-tr-[18px] rounded-b-[7px] border border-b-0 border-white/10 bg-white/8 text-white/45 outline-none transition-colors hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-white/60"
            style="transform-origin:bottom left;width:${SLOT}px">${tab.icon}</button>`,
      ).join("")}
    </div>
    <div id="${baseId}-panel" role="tabpanel" class="flex h-[58px] w-[188px] flex-col justify-center rounded-xl rounded-tl-none border border-white/10 bg-white/8 px-3">
      <span data-title class="text-[13px] font-medium"></span>
      <span data-copy class="mt-0.5 text-[13px] text-white/45"></span>
    </div>`;

  const tablist = surface.querySelector("[data-tablist]");
  const panel = surface.querySelector('[role="tabpanel"]');
  const tabs = Array.from(surface.querySelectorAll("[data-tab]"));
  const title = surface.querySelector("[data-title]");
  const copy = surface.querySelector("[data-copy]");

  function render() {
    const index = preview ? step : active;
    tabs.forEach((tab, tabIndex) => {
      const selected = index === tabIndex;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      tab.className = `flex h-8 items-center justify-center rounded-tl-[18px] rounded-tr-[18px] rounded-b-[7px] border border-b-0 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/60 ${
        selected
          ? "border-white/20 bg-white text-black shadow-[0_-6px_16px_rgba(0,0,0,.25)]"
          : "border-white/10 bg-white/8 text-white/45 hover:bg-white/12"
      }`;
      animate(
        tab,
        reduce
          ? { y: selected ? -4 : 0, rotate: 0, scale: 1 }
          : {
              y: selected ? -9 : 0,
              rotate: selected ? -5 : 0,
              scale: selected ? 1.03 : 1,
            },
        reduce ? { duration: 0 } : springSoft,
      );
    });

    panel.setAttribute("aria-labelledby", `${baseId}-tab-${index}`);

    if (index !== lastIndex) {
      lastIndex = index;
      title.textContent = TABS[index].label;
      copy.textContent = TABS[index].copy;
      animate(
        title,
        { opacity: [0, 1], x: [4, 0] },
        { duration: reduce ? 0 : 0.18 },
      );
      animate(
        copy,
        { opacity: [0, 1], x: [4, 0] },
        { duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.03 },
      );
    }
  }

  function select(next, focus = false) {
    active = next;
    render();
    if (focus) tabs[next]?.focus();
  }

  function onKey(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select((active + 1) % TABS.length, true);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select((active - 1 + TABS.length) % TABS.length, true);
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(0, true);
    }
    if (event.key === "End") {
      event.preventDefault();
      select(TABS.length - 1, true);
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
  });
  tablist.addEventListener("keydown", onKey);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewStep(preview, TABS.length, 1500, (next) => {
      step = next;
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
      tablist.removeEventListener("keydown", onKey);
      surface.innerHTML = "";
    },
  };
}
