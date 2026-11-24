import { animate } from "motion";

export function createCursor(root, options = {}) {
  const {
    content = "Move your pointer here",
    label = "",
    dotSize = 12,
    labelGap = 14,
    hideNative = true,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let inside = false;

  root.innerHTML = `
    <div data-slot="cursor" class="relative ${hideNative ? "cursor-none" : ""} ${className}">
      ${content}
      <span data-dot aria-hidden="true" data-slot="cursor-dot"
        class="pointer-events-none absolute left-0 top-0 z-50 rounded-full bg-foreground"
        style="width:${dotSize}px;height:${dotSize}px;opacity:0"></span>
      ${
        label
          ? `<span data-tip aria-hidden="true" data-slot="cursor-label"
        class="pointer-events-none absolute left-0 top-0 z-50 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[13px] font-medium text-background"
        style="opacity:0">${label}</span>`
          : ""
      }
    </div>`;
  const host = root.querySelector("[data-slot]");
  const dot = root.querySelector("[data-dot]");
  const tip = root.querySelector("[data-tip]");

  function show() {
    inside = true;
    const options = reduce()
      ? { duration: 0 }
      : { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 };
    animate(dot, { scale: [0, 1], opacity: [0, 1] }, options);
    if (tip) {
      animate(
        tip,
        { scale: [0.8, 1], opacity: [0, 1] },
        reduce()
          ? { duration: 0 }
          : { type: "spring", stiffness: 550, damping: 46.9, restSpeed: 10 },
      );
    }
  }

  function hide() {
    inside = false;
    const options = reduce()
      ? { duration: 0 }
      : { type: "spring", stiffness: 550, damping: 46.9, restSpeed: 10 };
    animate(dot, { scale: 0, opacity: 0 }, options);
    if (tip) animate(tip, { scale: 0.8, opacity: 0 }, options);
  }

  function move(event) {
    const rect = host.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    dot.style.transform = `translate3d(${x - dotSize / 2}px, ${y - dotSize / 2}px, 0)`;
    if (tip) {
      animate(
        tip,
        { x: x + labelGap, y: y + labelGap - 8 },
        reduce()
          ? { duration: 0 }
          : { type: "spring", stiffness: 500, damping: 50, bounce: 0 },
      );
    }
  }

  host.addEventListener("pointermove", move);
  host.addEventListener("pointerenter", show);
  host.addEventListener("pointerleave", hide);

  return {
    element: host,
    get inside() { return inside; },
    destroy() {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerenter", show);
      host.removeEventListener("pointerleave", hide);
      root.innerHTML = "";
    },
  };
}
