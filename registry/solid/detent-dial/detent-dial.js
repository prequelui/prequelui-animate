import { animate } from "motion";
import {
  applySurface,
  prefersReducedMotion,
  previewStep,
  springSnap,
} from "./moment-core.js";

const DETENTS = 8;
const STEP_DEGREES = 360 / DETENTS;

export function createDetentDial(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let step = 1;
  let previewValue = 0;
  let dragging = false;
  let cancelPreview = () => {};

  const surface = applySurface(root, "");
  surface.innerHTML = `
    <div data-dial role="slider" tabindex="0" aria-label="Detent dial" aria-valuemin="0" aria-valuemax="${DETENTS - 1}"
      class="relative flex size-[122px] cursor-grab touch-none items-center justify-center rounded-full border border-white/12 bg-[#111114] outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/50">
      ${Array.from(
        { length: DETENTS },
        (_, index) =>
          `<span aria-hidden="true" class="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full bg-white/30" style="transform:translate(-50%,-50%) rotate(${index * STEP_DEGREES}deg) translateY(-52px)"></span>`,
      ).join("")}
      <span data-needle aria-hidden="true" class="absolute left-1/2 top-1/2 h-[46px] w-[3px] origin-bottom rounded-full bg-white" style="margin-left:-1.5px;margin-top:-46px">
        <span class="absolute -left-[5px] top-0 size-[13px] rounded-full bg-white"></span>
      </span>
      <span data-value class="relative z-10 flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#18181c] text-[13px] tabular-nums text-white/60">2</span>
    </div>`;

  const dial = surface.querySelector("[data-dial]");
  const needle = surface.querySelector("[data-needle]");
  const valueLabel = surface.querySelector("[data-value]");

  function render() {
    const value = preview ? previewValue : step;
    dial.setAttribute("aria-valuenow", String(value));
    dial.setAttribute("aria-valuetext", `Notch ${value + 1} of ${DETENTS}`);
    valueLabel.textContent = String(value + 1);
    animate(
      needle,
      { rotate: value * STEP_DEGREES },
      reduce ? { duration: 0 } : springSnap,
    );
  }

  function angleFromEvent(event) {
    const rect = dial.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const normalised = (angle + 360) % 360;
    return Math.round(normalised / STEP_DEGREES) % DETENTS;
  }

  function down(event) {
    dragging = true;
    try {
      dial.setPointerCapture(event.pointerId);
    } catch {}
    step = angleFromEvent(event);
    render();
  }

  function move(event) {
    if (!dragging) return;
    step = angleFromEvent(event);
    render();
  }

  function up() {
    dragging = false;
  }

  function key(event) {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      step = (step + 1) % DETENTS;
      render();
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      step = (step - 1 + DETENTS) % DETENTS;
      render();
    }
  }

  dial.addEventListener("pointerdown", down);
  dial.addEventListener("pointermove", move);
  dial.addEventListener("pointerup", up);
  dial.addEventListener("pointercancel", up);
  dial.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewStep(preview, DETENTS, 1200, (next) => {
      previewValue = next;
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
      dial.removeEventListener("pointerdown", down);
      dial.removeEventListener("pointermove", move);
      dial.removeEventListener("pointerup", up);
      dial.removeEventListener("pointercancel", up);
      dial.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
