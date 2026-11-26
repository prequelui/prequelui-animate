import { animate } from "motion";
import {
  applySurface,
  clamp,
  localPoint,
  prefersReducedMotion,
  previewPointer,
  springSnap,
} from "./moment-core.js";

const SIZE = 5;
const CELL = 32;

export function createSnapGrid(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let point = { x: (SIZE * CELL) / 2, y: (SIZE * CELL) / 2 };
  let cancelPreview = () => {};

  const surface = applySurface(
    root,
    "cursor-crosshair overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
  );
  surface.setAttribute("role", "group");
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Snap grid, use arrow keys to move the magnet");

  const dots = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      dots.push({
        x: column * CELL + CELL / 2,
        y: row * CELL + CELL / 2,
      });
    }
  }

  surface.innerHTML = `
    <div data-plane class="relative" style="width:${SIZE * CELL}px;height:${SIZE * CELL}px">
      ${dots
        .map(
          (dot) =>
            `<span class="absolute size-[6px] rounded-full bg-white" style="left:${dot.x - 3}px;top:${dot.y - 3}px"></span>`,
        )
        .join("")}
      <span aria-hidden="true" data-ring class="absolute left-0 top-0 size-4 rounded-full border border-white/40"></span>
    </div>`;

  const plane = surface.querySelector("[data-plane]");
  const nodes = Array.from(plane.querySelectorAll("span:not([data-ring])"));
  const ring = plane.querySelector("[data-ring]");

  function render() {
    const targetX = Math.round(point.x / CELL) * CELL;
    const targetY = Math.round(point.y / CELL) * CELL;
    nodes.forEach((node, index) => {
      const dot = dots[index];
      const dx = targetX - dot.x;
      const dy = targetY - dot.y;
      const distance = Math.hypot(dx, dy);
      const pull = clamp(1 - distance / (CELL * 2.1), 0, 1);
      animate(
        node,
        reduce
          ? { x: 0, y: 0, scale: 1, opacity: 0.6 }
          : {
              x: dx * pull * 0.28,
              y: dy * pull * 0.28,
              scale: 1 + pull * 0.75,
              opacity: 0.35 + pull * 0.65,
            },
        reduce ? { duration: 0 } : springSnap,
      );
    });
    animate(
      ring,
      { x: targetX - 8, y: targetY - 8, opacity: reduce ? 0 : 1 },
      reduce ? { duration: 0 } : springSnap,
    );
  }

  function move(event) {
    point = localPoint(event, event.currentTarget);
    render();
  }

  function leave() {
    point = { x: (SIZE * CELL) / 2, y: (SIZE * CELL) / 2 };
    render();
  }

  function key(event) {
    const step = event.shiftKey ? CELL * 2 : CELL;
    const moves = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = moves[event.key];
    if (!delta) return;
    event.preventDefault();
    point = {
      x: clamp(point.x + delta[0], 0, SIZE * CELL),
      y: clamp(point.y + delta[1], 0, SIZE * CELL),
    };
    render();
  }

  surface.addEventListener("keydown", key);
  plane.addEventListener("pointermove", move);
  plane.addEventListener("pointerleave", leave);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    if (preview && !reduce) {
      cancelPreview = previewPointer(
        true,
        SIZE * CELL,
        SIZE * CELL,
        (next) => {
          point = next;
          render();
        },
        reduce,
      );
    } else {
      point = { x: (SIZE * CELL) / 2, y: (SIZE * CELL) / 2 };
      render();
    }
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
      plane.removeEventListener("pointermove", move);
      plane.removeEventListener("pointerleave", leave);
      surface.innerHTML = "";
    },
  };
}
