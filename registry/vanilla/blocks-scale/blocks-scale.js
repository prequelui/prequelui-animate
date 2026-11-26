import { animate } from "motion";
import {
  applySurface,
  clamp,
  localPoint,
  prefersReducedMotion,
  previewPointer,
  springSoft,
} from "./moment-core.js";

const SIZE = 4;
const CELL = 34;
const BLOCK = CELL - 6;

export function createBlocksScale(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let point = { x: (SIZE * CELL) / 2, y: (SIZE * CELL) / 2 };
  let cancelPreview = () => {};

  const surface = applySurface(
    root,
    "cursor-crosshair rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
  );
  surface.setAttribute("role", "group");
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Blocks scale, move the pointer over the grid");
  surface.innerHTML = `
    <div data-grid class="grid gap-[6px]" style="grid-template-columns:repeat(${SIZE}, ${BLOCK}px)">
      ${Array.from(
        { length: SIZE * SIZE },
        () =>
          `<span class="block rounded-[6px] bg-white" style="width:${BLOCK}px;height:${BLOCK}px"></span>`,
      ).join("")}
    </div>`;

  const grid = surface.querySelector("[data-grid]");
  const blocks = Array.from(grid.querySelectorAll("span"));

  function render() {
    blocks.forEach((block, index) => {
      const column = index % SIZE;
      const row = Math.floor(index / SIZE);
      const x = column * CELL + CELL / 2;
      const y = row * CELL + CELL / 2;
      const distance = Math.hypot(point.x - x, point.y - y);
      const closeness = clamp(1 - distance / 90, 0, 1);
      animate(
        block,
        reduce
          ? { scale: 1, opacity: 0.4 }
          : { scale: 1 + closeness * 0.42, opacity: 0.3 + closeness * 0.7 },
        reduce ? { duration: 0 } : springSoft,
      );
    });
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
    const moves = {
      ArrowLeft: [-CELL, 0],
      ArrowRight: [CELL, 0],
      ArrowUp: [0, -CELL],
      ArrowDown: [0, CELL],
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
  grid.addEventListener("pointermove", move);
  grid.addEventListener("pointerleave", leave);

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
      grid.removeEventListener("pointermove", move);
      grid.removeEventListener("pointerleave", leave);
      surface.innerHTML = "";
    },
  };
}
