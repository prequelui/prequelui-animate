import { animate } from "motion";
import {
  applySurface,
  localPoint,
  prefersReducedMotion,
  previewPulse,
  springSoft,
} from "./moment-core.js";

const LAYERS = [
  { tone: "bg-white/25", label: "Layer 3" },
  { tone: "bg-white/55", label: "Layer 2" },
  { tone: "bg-white", label: "Layer 1" },
];

export function createDepthStack(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let pinned = false;
  let hovered = false;
  let pulse = false;
  let tilt = { x: 0, y: 0 };
  let cancelPreview = () => {};

  const surface = applySurface(root, "flex-col gap-3");
  surface.innerHTML = `
    <button type="button" aria-expanded="false" aria-label="Lift the card stack"
      class="relative flex h-[104px] w-[158px] items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      style="perspective:720px">
      <div aria-hidden="true" data-stage class="relative flex size-[86px] items-center justify-center" style="transform-style:preserve-3d">
        ${LAYERS.map(
          (layer, index) =>
            `<span data-layer class="absolute size-[84px] rounded-xl border border-black/10 shadow-xl ${layer.tone}" style="transform-style:preserve-3d">${
              index === LAYERS.length - 1
                ? `<span class="flex size-full items-center justify-center rounded-xl bg-black/5"><span data-inner class="text-[13px] uppercase tracking-[0.16em] text-black/55">Stack</span></span>`
                : ""
            }</span>`,
        ).join("")}
      </div>
    </button>
    <span data-label class="text-[13px] uppercase tracking-[0.18em] text-white/40">Hover or tap</span>`;

  const button = surface.querySelector("button");
  const stage = surface.querySelector("[data-stage]");
  const layers = Array.from(surface.querySelectorAll("[data-layer]"));
  const inner = surface.querySelector("[data-inner]");
  const label = surface.querySelector("[data-label]");

  function lifted() {
    return preview ? pulse : pinned || hovered;
  }

  function render() {
    const open = lifted();
    button.setAttribute("aria-expanded", String(open));
    label.textContent = open ? "Lifted" : "Hover or tap";
    if (inner) inner.textContent = open ? "Open" : "Stack";
    animate(
      stage,
      reduce
        ? { rotateX: 0, rotateY: 0 }
        : {
            rotateX: open ? -12 + tilt.y * 7 : 0,
            rotateY: open ? tilt.x * 12 : 0,
          },
      reduce ? { duration: 0 } : springSoft,
    );
    layers.forEach((layer, index) => {
      const depth = LAYERS.length - 1 - index;
      animate(
        layer,
        reduce
          ? { y: -depth * 9, z: 0, scale: 1 - depth * 0.03 }
          : {
              y: open ? -depth * 20 : -depth * 5,
              z: open ? depth * 30 : 0,
              scale: 1 - depth * 0.03,
            },
        reduce ? { duration: 0 } : { ...springSoft, delay: index * 0.02 },
      );
    });
  }

  function track(event) {
    if (event.pointerType !== "mouse") return;
    const point = localPoint(event, button);
    const width = button.offsetWidth || 1;
    const height = button.offsetHeight || 1;
    tilt = {
      x: (point.x / width - 0.5) * 2,
      y: (point.y / height - 0.5) * 2,
    };
    render();
  }

  function enter() {
    hovered = true;
    render();
  }

  function leave() {
    hovered = false;
    tilt = { x: 0, y: 0 };
    render();
  }

  button.addEventListener("pointerenter", enter);
  button.addEventListener("pointerleave", leave);
  button.addEventListener("pointermove", track);
  button.addEventListener("focus", enter);
  button.addEventListener("blur", () => {
    hovered = false;
    render();
  });
  button.addEventListener("click", () => {
    pinned = !pinned;
    render();
  });

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
      surface.innerHTML = "";
    },
  };
}
