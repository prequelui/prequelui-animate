import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const BARS = [38, 62, 78, 48, 88, 66, 34];

export function createBarsFade(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let pressed = false;
  let pulse = false;
  let timer = 0;
  let cancelPreview = () => {};

  const surface = applySurface(
    root,
    "cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
  );
  surface.setAttribute("role", "button");
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Play the bars fade");
  surface.innerHTML = `
    <div class="flex h-[76px] items-center gap-[7px]">
      ${BARS.map(
        (height) =>
          `<span class="block w-[9px] rounded-full bg-current" style="height:${height}px"></span>`,
      ).join("")}
    </div>`;

  const bars = Array.from(surface.querySelectorAll("span"));

  function render() {
    const lit = pressed || pulse;
    bars.forEach((bar, index) => {
      animate(
        bar,
        reduce
          ? { opacity: 1, scaleY: 1 }
          : { opacity: lit ? 1 : 0.28, scaleY: lit ? 1 : 0.42 },
        reduce
          ? { duration: 0 }
          : { ...springSoft, delay: lit ? index * 0.045 : index * 0.02 },
      );
    });
  }

  function play() {
    pressed = true;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      pressed = false;
      render();
    }, 820);
    render();
  }

  function onKey(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      play();
    }
  }

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPulse(preview, 820, 2500, (on) => {
      pulse = on;
      render();
    }, reduce);
    render();
  }

  surface.addEventListener("click", play);
  surface.addEventListener("keydown", onKey);
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
      surface.removeEventListener("click", play);
      surface.removeEventListener("keydown", onKey);
      surface.innerHTML = "";
    },
  };
}
