import { animate } from "motion";
import {
  applySurface,
  clamp,
  localPoint,
  prefersReducedMotion,
  previewPointer,
} from "./moment-core.js";

const DOTS = Array.from({ length: 7 }, (_, index) => index);
const WIDTH = 190;
const HEIGHT = 58;

export function createWormDots(root, options = {}) {
  const reduce = prefersReducedMotion();
  let preview = Boolean(options.preview);
  let point = { x: WIDTH / 2, y: HEIGHT / 2 };
  let dir = 1;
  let lastX = WIDTH / 2;
  let cancelPreview = () => {};

  const surface = applySurface(
    root,
    "overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
  );
  surface.setAttribute("role", "group");
  surface.tabIndex = 0;
  surface.setAttribute("aria-label", "Worm dots, move the pointer or use arrow keys");
  surface.innerHTML = `
    <div data-stage class="relative h-[58px] w-[190px] touch-none">
      ${DOTS.map((index) => {
        const size = 12 - index * 0.65;
        return `<span data-dot class="absolute left-0 top-0 rounded-full bg-white" style="width:${size}px;height:${size}px;opacity:${1 - index * 0.07}">
          ${
            index === 0
              ? `<span class="absolute top-[38%] size-[2px] rounded-full bg-black/70" style="left:28%"></span>
                 <span class="absolute top-[38%] size-[2px] rounded-full bg-black/70" style="right:28%"></span>`
              : ""
          }
        </span>`;
      }).join("")}
    </div>`;

  const stage = surface.querySelector("[data-stage]");
  const dots = Array.from(surface.querySelectorAll("[data-dot]"));

  function render() {
    const headX = clamp(point.x, 18, WIDTH - 18);
    const headY = clamp(point.y, 14, HEIGHT - 14);
    dots.forEach((dot, index) => {
      const size = 12 - index * 0.65;
      const targetX = (reduce ? 64 + index * 11 : headX - index * 12 * dir) - size / 2;
      const targetY = (reduce ? HEIGHT / 2 : headY) - size / 2;
      animate(
        dot,
        { x: targetX, y: targetY },
        reduce
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 680 - index * 70,
              damping: 30 - index * 1.4,
              mass: 1,
            },
      );
    });
  }

  function move(event) {
    const next = localPoint(event, stage);
    const direction = next.x >= lastX ? 1 : -1;
    if (direction !== dir) dir = direction;
    lastX = next.x;
    point = next;
    render();
  }

  function leave() {
    lastX = WIDTH / 2;
    point = { x: WIDTH / 2, y: HEIGHT / 2 };
    render();
  }

  function key(event) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const dx = event.key === "ArrowRight" ? 16 : event.key === "ArrowLeft" ? -16 : 0;
    const dy = event.key === "ArrowDown" ? 10 : event.key === "ArrowUp" ? -10 : 0;
    if (dx !== 0) dir = dx > 0 ? 1 : -1;
    point = {
      x: clamp(point.x + dx, 7, WIDTH - 7),
      y: clamp(point.y + dy, 12, HEIGHT - 12),
    };
    render();
  }

  stage.addEventListener("pointermove", move);
  stage.addEventListener("pointerleave", leave);
  surface.addEventListener("keydown", key);

  function setPreview(value) {
    preview = Boolean(value);
    cancelPreview();
    cancelPreview = previewPointer(
      preview,
      WIDTH,
      HEIGHT,
      (next) => {
        point = next;
        render();
      },
      reduce,
    );
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
