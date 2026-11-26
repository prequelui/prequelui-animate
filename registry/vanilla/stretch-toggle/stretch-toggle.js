import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springFast,
} from "./moment-core.js";

export function createStretchToggle(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let checked = false;
  let pulse = false;
  let stretch = false;
  let timer = 0;
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-4");
  surface.innerHTML = `
    <button type="button" role="switch" aria-checked="false" aria-label="Stretch toggle"
      class="relative h-9 w-[70px] rounded-full p-1 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/50">
      <span data-thumb class="block h-7 w-7 rounded-full bg-white"></span>
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/45">Resting</span>`;

  const button = surface.querySelector("button");
  const thumb = surface.querySelector("[data-thumb]");
  const label = surface.querySelector("[data-label]");

  function render() {
    const on = preview ? pulse : checked;
    button.setAttribute("aria-checked", String(on));
    button.classList.toggle("bg-white", on);
    button.classList.toggle("bg-white/15", !on);
    thumb.classList.toggle("bg-black", on);
    thumb.classList.toggle("bg-white", !on);
    label.textContent = on ? "Stretched" : "Resting";
    animate(
      thumb,
      { x: on ? 34 : 0, scaleX: stretch && !reduce ? 1.12 : 1 },
      reduce ? { duration: 0 } : springFast,
    );
  }

  button.addEventListener("click", () => {
    checked = !checked;
    if (!preview) {
      stretch = true;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        stretch = false;
        render();
      }, 240);
    }
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
      window.clearTimeout(timer);
      surface.innerHTML = "";
    },
  };
}
