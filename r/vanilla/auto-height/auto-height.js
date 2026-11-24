import { animate } from "motion";

const heightSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  bounce: 0,
  restDelta: 0.01,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createAutoHeight(root, options = {}) {
  const {
    content = "",
    includeParentBox = true,
    includeSelfBox = false,
    extra = {},
    transition,
    wrapperClassName = "",
    className = "",
  } = options;
  let observer;
  let frame = 0;
  let control;

  root.innerHTML = `
    <div data-slot="auto-height" class="${className}" style="overflow:hidden">
      <div data-content class="w-full ${wrapperClassName}">${content}</div>
    </div>`;
  const host = root.querySelector("[data-slot]");
  const inner = root.querySelector("[data-content]");

  function measure() {
    const base = inner.getBoundingClientRect().height;
    let supplement = 0;
    if (includeParentBox && inner.parentElement) {
      const box = inner.parentElement.getBoundingClientRect();
      const childrenHeight = Array.from(inner.parentElement.children).reduce(
        (total, child) => total + child.getBoundingClientRect().height,
        0,
      );
      supplement = Math.max(0, box.height - childrenHeight);
    }
    if (includeSelfBox) {
      const style = getComputedStyle(inner);
      supplement +=
        (parseFloat(style.paddingTop) || 0) +
        (parseFloat(style.paddingBottom) || 0) +
        (parseFloat(style.borderTopWidth) || 0) +
        (parseFloat(style.borderBottomWidth) || 0);
    }
    const dpr = window.devicePixelRatio || 1;
    return Math.ceil((base + supplement) * dpr) / dpr;
  }

  function refresh(instant = false) {
    const next = measure();
    control?.stop?.();
    control = animate(
      host,
      { height: `${next}px`, ...extra },
      instant || reduce() ? { duration: 0 } : transition ?? heightSpring,
    );
  }

  refresh(true);
  observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => refresh(false));
  });
  observer.observe(inner);
  if (includeParentBox && inner.parentElement) observer.observe(inner.parentElement);

  return {
    element: host,
    refresh,
    destroy() {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      control?.stop?.();
      root.innerHTML = "";
    },
  };
}
