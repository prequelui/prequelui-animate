import { animate } from "motion";

const defaultSpring = { type: "spring", stiffness: 100, damping: 10, mass: 0.5 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createMagnetic(root, options = {}) {
  const {
    content = "",
    strength = 0.5,
    range = 120,
    springOptions,
    onlyOnHover = false,
    disableOnTouch = true,
    className = "",
  } = options;
  let control;
  let hovering = false;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const enabled = () => !reduce() && (canHover || disableOnTouch === false);

  root.innerHTML = `<div data-slot="magnetic" class="inline-block ${className}">${content}</div>`;
  const host = root.querySelector("[data-slot]");

  function reset() {
    control?.stop?.();
    control = animate(host, { x: 0, y: 0 }, springOptions ?? defaultSpring);
  }

  function compute(event) {
    const rect = host.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    if (distance <= range) {
      const factor = (1 - distance / range) * strength;
      control?.stop?.();
      control = animate(
        host,
        { x: dx * factor, y: dy * factor },
        springOptions ?? defaultSpring,
      );
    } else {
      reset();
    }
  }

  function onWindowMove(event) {
    if (!enabled() || onlyOnHover) return;
    compute(event);
  }

  function onEnter() {
    hovering = true;
  }
  function onMove(event) {
    if (enabled() && onlyOnHover && hovering) compute(event);
  }
  function onLeave() {
    hovering = false;
    reset();
  }

  function onMotionPreference() {
    if (reduce()) reset();
  }

  if (!onlyOnHover) window.addEventListener("mousemove", onWindowMove, { passive: true });
  host.addEventListener("pointerenter", onEnter);
  host.addEventListener("pointermove", onMove);
  host.addEventListener("pointerleave", onLeave);
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", onMotionPreference);
  } else {
    motionQuery.addListener?.(onMotionPreference);
  }

  return {
    element: host,
    destroy() {
      window.removeEventListener("mousemove", onWindowMove);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", onMotionPreference);
      } else {
        motionQuery.removeListener?.(onMotionPreference);
      }
      control?.stop?.();
      root.innerHTML = "";
    },
  };
}
