import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewStep,
  springFast,
} from "./moment-core.js";

const TABS = ["Home", "Search", "Saved", "You"];
const SLOT = 48;

export function createGooeyTabBar(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let active = 0;
  let step = 0;
  let cancelPreview = () => {};

  const surface = applySurface(
    root,
    "rounded-2xl border border-white/10 bg-[#141417] p-1.5",
  );
  surface.setAttribute("role", "tablist");
  surface.setAttribute("aria-label", "Gooey tabs");
  surface.tabIndex = 0;
  surface.innerHTML = `
    <div class="relative flex" style="width:${SLOT * TABS.length}px">
      <span aria-hidden="true" data-indicator class="absolute top-0 h-9 rounded-xl bg-white" style="width:${SLOT - 8}px"></span>
      <span aria-hidden="true" data-glow class="absolute top-1 h-7 rounded-full bg-white/35 blur-[6px]" style="width:${SLOT - 20}px"></span>
      ${TABS.map(
        (tab, index) =>
          `<button type="button" role="tab" aria-selected="false" tabindex="-1"
            class="relative z-10 flex h-9 items-center justify-center text-[13px] font-medium transition-colors text-white/55"
            style="width:${SLOT}px">${tab}</button>`,
      ).join("")}
    </div>`;

  const indicator = surface.querySelector("[data-indicator]");
  const glow = surface.querySelector("[data-glow]");
  const buttons = Array.from(surface.querySelectorAll("button"));

  function render(focus = false) {
    const index = preview ? step : active;
    buttons.forEach((button, buttonIndex) => {
      const selected = index === buttonIndex;
      button.setAttribute("aria-selected", String(selected));
      button.tabIndex = selected ? 0 : -1;
      button.classList.toggle("text-black", selected);
      button.classList.toggle("text-white/55", !selected);
    });
    animate(
      indicator,
      { x: index * SLOT + 4 },
      reduce ? { duration: 0 } : springFast,
    );
    animate(
      glow,
      { x: index * SLOT + 10, scaleX: reduce ? 1 : [1, 1.35, 1] },
      reduce
        ? { duration: 0 }
        : {
            x: springFast,
            scaleX: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
          },
    );
    if (focus) buttons[index]?.focus();
  }

  function select(next) {
    active = next;
    render(true);
  }

  function key(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select((active + 1) % TABS.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select((active - 1 + TABS.length) % TABS.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      select(TABS.length - 1);
    }
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      active = index;
      render();
    });
  });
  surface.addEventListener("keydown", key);

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
      surface.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
