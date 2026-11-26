import { animate } from "motion";
import {
  applySurface,
  clamp,
  localPoint,
  prefersReducedMotion,
  previewPointer,
  springSoft,
} from "./moment-core.js";

const SIZE = 6;
const CELL = 28;
const SPAN = SIZE * CELL;

export function createMagnetGrid(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let point = { x: SPAN / 2, y: SPAN / 2 };
  let cancelPreview = () => {};

  const surface = applySurface(
    root,
    "cursor-crosshair rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
  );
  surface.setAttribute("role", "group");
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Magnet grid, move the pointer over the dots");
  surface.innerHTML = `
    <div data-stage class="relative" style="width:${SPAN}px;height:${SPAN}px">
      ${Array.from({ length: SIZE * SIZE }, (_, index) => {
        const column = index % SIZE;
        const row = Math.floor(index / SIZE);
        const x = column * CELL + CELL / 2;
        const y = row * CELL + CELL / 2;
        return `<span data-dot class="absolute size-[5px] rounded-full bg-white" style="left:${x - 2.5}px;top:${y - 2.5}px"></span>`;
      }).join("")}
      <span data-ring aria-hidden="true" class="pointer-events-none absolute rounded-full border border-white/25" style="width:52px;height:52px"></span>
    </div>`;

  const stage = surface.querySelector("[data-stage]");
  const dots = Array.from(surface.querySelectorAll("[data-dot]"));
  const ring = surface.querySelector("[data-ring]");

  if (reduce) {
    animate(ring, { scale: 0, opacity: 0 }, { duration: 0 });
  } else {
    animate(
      ring,
      { scale: [0.9, 1.08, 0.9], opacity: 1 },
      { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
    );
  }

  function render() {
    ring.style.left = `${point.x - 26}px`;
    ring.style.top = `${point.y - 26}px`;
    dots.forEach((dot, index) => {
      const column = index % SIZE;
      const row = Math.floor(index / SIZE);
      const x = column * CELL + CELL / 2;
      const y = row * CELL + CELL / 2;
      const dx = point.x - x;
      const dy = point.y - y;
      const distance = Math.hypot(dx, dy);
      const pull = clamp(1 - distance / 90, 0, 1);
      animate(
        dot,
        reduce
          ? { x: 0, y: 0, scale: 1, opacity: 0.45 }
          : {
              x: dx * pull * 0.34,
              y: dy * pull * 0.34,
              scale: 1 + pull * 1.15,
              opacity: 0.35 + pull * 0.65,
            },
        reduce ? { duration: 0 } : springSoft,
      );
    });
  }

  function move(event) {
    point = localPoint(event, stage);
    render();
  }

  function leave() {
    point = { x: SPAN / 2, y: SPAN / 2 };
    render();
  }

  function key(event) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const delta =
      event.key === "ArrowLeft"
        ? [-CELL, 0]
        : event.key === "ArrowRight"
          ? [CELL, 0]
          : event.key === "ArrowUp"
            ? [0, -CELL]
            : [0, CELL];
    point = {
      x: clamp(point.x + delta[0], 0, SPAN),
      y: clamp(point.y + delta[1], 0, SPAN),
    };
    render();
  }

  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerleave", leave);
  surface.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPointer(preview, SPAN, SPAN, (next) => {
      point = next;
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
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      surface.removeEventListener("keydown", key);
      surface.innerHTML = "";
    },
  };
}
