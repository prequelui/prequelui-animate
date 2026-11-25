import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springFast,
} from "./moment-core.js";

const ITEMS = ["Profile", "Settings", "Sign out"];

export function createMenuMorph(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let open = false;
  let pulse = false;
  let shown = false;
  let cancelPreview = () => {};
  let windowHandler = null;

  const surface = applySurface(root, "flex-col justify-start gap-1.5");
  surface.innerHTML = `
    <button type="button" aria-expanded="false" aria-haspopup="menu" aria-label="Toggle the menu"
      class="relative flex size-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/12 bg-[#141417] outline-none focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-bar class="block h-[2px] w-5 rounded-full bg-white"></span>
      <span data-bar class="block h-[2px] w-5 rounded-full bg-white"></span>
      <span data-bar class="block h-[2px] w-5 rounded-full bg-white"></span>
    </button>
    <div data-panel role="menu" aria-label="Account" hidden
      class="w-[142px] overflow-hidden rounded-xl border border-white/10 bg-[#17171b] p-1 shadow-[0_12px_26px_rgba(0,0,0,.4)]"
      style="transform-origin:top">
      ${ITEMS.map(
        (item) =>
          `<button type="button" role="menuitem" tabindex="-1"
            class="flex h-7 w-full items-center rounded-lg px-2.5 text-left text-[13px] text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none">${item}</button>`,
      ).join("")}
    </div>`;

  const trigger = surface.querySelector("button");
  const panel = surface.querySelector("[data-panel]");
  const bars = Array.from(surface.querySelectorAll("[data-bar]"));
  const items = Array.from(panel.querySelectorAll("button"));

  function renderBars() {
    const on = preview ? pulse : open;
    trigger.setAttribute("aria-expanded", String(on));
    animate(
      bars[0],
      reduce ? { rotate: on ? 45 : 0, y: 0 } : { rotate: on ? 45 : 0, y: on ? 7 : 0 },
      reduce ? { duration: 0 } : springFast,
    );
    animate(
      bars[1],
      { opacity: on ? 0 : 1, scaleX: on ? 0.2 : 1 },
      reduce ? { duration: 0 } : springFast,
    );
    animate(
      bars[2],
      reduce ? { rotate: on ? -45 : 0, y: 0 } : { rotate: on ? -45 : 0, y: on ? -7 : 0 },
      reduce ? { duration: 0 } : springFast,
    );
  }

  function showPanel() {
    if (shown) return;
    shown = true;
    panel.hidden = false;
    if (!reduce) {
      panel.style.opacity = "0";
      panel.style.transform = "translateY(-6px) scaleY(0.55)";
    }
    animate(
      panel,
      reduce ? { opacity: 1 } : { opacity: 1, y: 0, scaleY: 1 },
      reduce ? { duration: 0 } : springFast,
    );
  }

  function hidePanel() {
    if (!shown) return;
    shown = false;
    const finish = () => {
      if (!shown) panel.hidden = true;
    };
    animate(
      panel,
      reduce
        ? { opacity: 0 }
        : { opacity: 0, y: -4, scaleY: 0.65 },
      reduce ? { duration: 0 } : springFast,
    );
    window.setTimeout(finish, reduce ? 0 : 220);
  }

  function render(focus = false) {
    const on = preview ? pulse : open;
    renderBars();
    if (on) {
      showPanel();
      if (focus) items[0]?.focus();
    } else {
      hidePanel();
    }
  }

  function close() {
    open = false;
    render();
    trigger.focus();
  }

  function key(event) {
    const enabled = items.filter(Boolean);
    const current = enabled.indexOf(document.activeElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      enabled[(current + step + enabled.length) % enabled.length]?.focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      enabled[0]?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      enabled[enabled.length - 1]?.focus();
    }
  }

  trigger.addEventListener("click", () => {
    open = !open;
    render(open);
    if (open) {
      windowHandler = (event) => {
        if (event.key !== "Escape") return;
        window.removeEventListener("keydown", windowHandler);
        windowHandler = null;
        close();
      };
      window.addEventListener("keydown", windowHandler);
    } else if (windowHandler) {
      window.removeEventListener("keydown", windowHandler);
      windowHandler = null;
    }
  });

  items.forEach((item) => {
    item.addEventListener("click", close);
  });
  panel.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 1300, 2800, (on) => {
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
      if (windowHandler) window.removeEventListener("keydown", windowHandler);
      panel.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
