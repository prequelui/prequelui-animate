import { animate } from "motion";

const defaultTransition = { type: "spring", stiffness: 200, damping: 28 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createImageZoom(root, options = {}) {
  const {
    content = "",
    zoomScale = 3,
    transition,
    zoomOnClick = true,
    zoomOnHover = true,
    disabled = false,
    width = "100%",
    height = "100%",
    className = "",
  } = options;
  let zoomed = false;
  let origin = "50% 50%";
  let control;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  root.innerHTML = `
    <div data-slot="image-zoom" role="img"
      class="relative overflow-hidden ${className}"
      style="width:${typeof width === "number" ? `${width}px` : width};height:${typeof height === "number" ? `${height}px` : height};touch-action:manipulation;cursor:${disabled ? "default" : "zoom-in"}">
      <div data-inner style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:${origin};will-change:transform">${content}</div>
    </div>`;
  const host = root.querySelector("[data-slot]");
  const inner = root.querySelector("[data-inner]");

  function setOriginFromEvent(event) {
    const rect = host.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;
    if ("touches" in event && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ("clientX" in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    }
    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    origin = `${rect.width ? (x / rect.width) * 100 : 50}% ${
      rect.height ? (y / rect.height) * 100 : 50
    }%`;
    inner.style.transformOrigin = origin;
  }

  function scale() {
    control?.stop?.();
    control = animate(
      inner,
      { scale: disabled || reduce() ? 1 : zoomed ? zoomScale : 1 },
      transition ?? defaultTransition,
    );
    host.style.cursor = disabled ? "default" : zoomed ? "zoom-out" : "zoom-in";
  }

  function apply() {
    scale();
  }

  function onEnter() {
    if (disabled || coarse || !zoomOnHover) return;
    zoomed = true;
    apply();
  }
  function onLeave() {
    if (disabled || coarse || !zoomOnHover) return;
    zoomed = false;
    apply();
  }
  function onMove(event) {
    if (disabled || coarse) return;
    setOriginFromEvent(event);
  }
  function onClick(event) {
    if (disabled || !zoomOnClick) return;
    setOriginFromEvent(event);
    zoomed = !zoomed;
    apply();
  }
  function onTouchStart(event) {
    if (disabled) return;
    setOriginFromEvent(event);
    if (!zoomOnClick) {
      zoomed = true;
      apply();
    }
  }
  function onTouchMove(event) {
    if (disabled) return;
    setOriginFromEvent(event);
  }
  function onTouchEnd() {
    if (disabled) return;
    if (!zoomOnClick) {
      zoomed = false;
      apply();
    }
  }

  host.addEventListener("mouseenter", onEnter);
  host.addEventListener("mouseleave", onLeave);
  host.addEventListener("mousemove", onMove);
  host.addEventListener("click", onClick);
  host.addEventListener("touchstart", onTouchStart, { passive: true });
  host.addEventListener("touchmove", onTouchMove, { passive: true });
  host.addEventListener("touchend", onTouchEnd);

  return {
    element: host,
    destroy() {
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("click", onClick);
      host.removeEventListener("touchstart", onTouchStart);
      host.removeEventListener("touchmove", onTouchMove);
      host.removeEventListener("touchend", onTouchEnd);
      control?.stop?.();
      root.innerHTML = "";
    },
  };
}
