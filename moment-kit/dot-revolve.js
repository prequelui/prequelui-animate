import { animate } from "motion";
import {
  applySurface,
  clamp,
  pointerScaleX,
  prefersReducedMotion,
} from "./moment-core.js";

const DOTS = Array.from({ length: 6 }, (_, index) => index);
const RADIUS = 42;

export function createDotRevolve(root, options = {}) {
  const reduce = prefersReducedMotion();
  let angle = 0;
  let direction = 1;
  let speed = 1;
  let dragging = null;
  let dragged = false;
  let frame = 0;
  let lastTime = 0;

  const surface = applySurface(root, "flex-col gap-2");
  surface.innerHTML = `
    <div data-orbit role="button" tabindex="0" aria-label="Dot revolve, CW at 1 times speed. Press Enter to change."
      class="relative flex size-[132px] cursor-grab touch-none items-center justify-center rounded-full border border-white/10 bg-[#111114] outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/50">
      <span class="absolute size-[86px] rounded-full border border-dashed border-white/10"></span>
      ${DOTS.map((index) => {
        const offset = (360 / DOTS.length) * index;
        const size = 10 - index * 0.8;
        const x = Math.cos((offset * Math.PI) / 180) * (RADIUS + index * 2);
        const y = Math.sin((offset * Math.PI) / 180) * (RADIUS + index * 2) * 0.72;
        return `<span data-dot class="absolute left-1/2 top-1/2 block rounded-full" style="width:${size}px;height:${size}px;margin-left:${-size / 2}px;margin-top:${-size / 2}px;opacity:${(1 - index * 0.1).toFixed(2)};transform:translate(${x.toFixed(3)}px,${y.toFixed(3)}px)">
          <span data-core class="block size-full rounded-full bg-white"></span>
        </span>`;
      }).join("")}
      <span data-center class="relative z-10 flex size-8 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-black">CW</span>
    </div>
    <span data-status aria-live="polite" class="text-[13px] uppercase tracking-[0.18em] text-white/45">1.0× orbit · CW</span>`;

  const orbit = surface.querySelector("[data-orbit]");
  const dots = Array.from(surface.querySelectorAll("[data-dot]"));
  const cores = Array.from(surface.querySelectorAll("[data-core]"));
  const center = surface.querySelector("[data-center]");
  const status = surface.querySelector("[data-status]");

  function directionLabel() {
    return direction > 0 ? "CW" : "CCW";
  }

  function syncLabels() {
    const rounded = Math.round(speed * 10) / 10;
    center.textContent = directionLabel();
    status.textContent = `${rounded.toFixed(1)}× orbit · ${directionLabel()}`;
    orbit.setAttribute(
      "aria-label",
      `Dot revolve, ${directionLabel()} at ${rounded} times speed. Press Enter to change.`,
    );
  }

  function position() {
    dots.forEach((dot, index) => {
      const offset = (360 / DOTS.length) * index;
      const x = Math.cos(((angle + offset) * Math.PI) / 180) * (RADIUS + index * 2);
      const y =
        Math.sin(((angle + offset) * Math.PI) / 180) *
        (RADIUS + index * 2) *
        0.72;
      dot.style.transform = `translate(${x.toFixed(3)}px,${y.toFixed(3)}px)`;
    });
  }

  function animateScales() {
    const duration = Math.max(0.4, 2.4 - speed * 0.2);
    cores.forEach((core) => {
      animate(
        core,
        { scale: reduce ? 1 : [1, 1.25, 1] },
        { duration: reduce ? 0 : duration, repeat: reduce ? 0 : Infinity, ease: "easeInOut" },
      );
    });
  }

  function tick(time) {
    if (!lastTime) lastTime = time;
    const delta = Math.min(64, time - lastTime);
    lastTime = time;
    angle += direction * speed * 42 * (delta / 1000);
    position();
    frame = requestAnimationFrame(tick);
  }

  function change() {
    direction *= -1;
    speed = speed === 1 ? 1.8 : 1;
    syncLabels();
    animateScales();
  }

  function onKey(event) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      speed = Math.min(3, speed + 0.3);
      syncLabels();
      animateScales();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      speed = Math.max(0.2, speed - 0.3);
      syncLabels();
      animateScales();
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      change();
    }
  }

  orbit.addEventListener("keydown", onKey);
  orbit.addEventListener("click", () => {
    if (dragged) {
      dragged = false;
      return;
    }
    change();
  });
  orbit.addEventListener("pointerdown", (event) => {
    try {
      orbit.setPointerCapture(event.pointerId);
    } catch {}
    dragging = { x: event.clientX, speed };
    dragged = false;
  });
  orbit.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    const raw = event.clientX - dragging.x;
    if (Math.abs(raw) > 3) {
      dragging.moved = true;
      dragged = true;
    }
    const scale = pointerScaleX(orbit);
    const delta = raw / (80 * (scale || 1));
    speed = clamp(dragging.speed + delta, 0.2, 3);
    syncLabels();
    animateScales();
  });
  const release = (event) => {
    try {
      if (orbit.hasPointerCapture(event.pointerId)) {
        orbit.releasePointerCapture(event.pointerId);
      }
    } catch {}
    dragging = null;
  };
  orbit.addEventListener("pointerup", release);
  orbit.addEventListener("pointercancel", (event) => {
    release(event);
    dragged = false;
  });

  syncLabels();
  animateScales();
  position();
  if (!reduce) frame = requestAnimationFrame(tick);

  return {
    update() {},
    destroy() {
      cancelAnimationFrame(frame);
      surface.innerHTML = "";
    },
  };
}
