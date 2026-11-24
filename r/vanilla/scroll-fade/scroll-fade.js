import { animate } from "motion";

const EDGES = ["top", "bottom", "left", "right"];
const VARS = {
  top: "--scroll-fade-top",
  bottom: "--scroll-fade-bottom",
  left: "--scroll-fade-left",
  right: "--scroll-fade-right",
  size: "--scroll-fade-size",
};
const fadeTween = { duration: 0.2, ease: [0.23, 1, 0.32, 1] };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createScrollFade(root, options = {}) {
  const {
    content = "",
    orientation = "vertical",
    size = 40,
    transition,
    enabled = true,
    className = "",
  } = options;
  const values = { top: 0, bottom: 0, left: 0, right: 0 };
  let observer;
  let mutation;
  let control;
  let masked = false;

  const overflow =
    orientation === "horizontal"
      ? "overflow-x:auto;"
      : orientation === "both"
        ? "overflow:auto;"
        : "overflow-y:auto;";

  root.innerHTML = `<div data-slot="scroll-fade" data-orientation="${orientation}"
    class="${className}" style="${overflow}">${content}</div>`;
  const host = root.querySelector("[data-slot]");

  function maskFor() {
    const stop = (edge) => `rgb(0 0 0 / calc(1 - var(${VARS[edge]}, 0)))`;
    const depth = (edge) => `calc(var(${VARS.size}) * min(1, var(${VARS[edge]}, 0) * 1000))`;
    const verticalMask = `linear-gradient(to bottom, ${stop("top")} 0, #000 ${depth("top")}, #000 calc(100% - ${depth("bottom")}), ${stop("bottom")} 100%)`;
    const horizontalMask = `linear-gradient(to right, ${stop("left")} 0, #000 ${depth("left")}, #000 calc(100% - ${depth("right")}), ${stop("right")} 100%)`;
    if (orientation === "horizontal") return horizontalMask;
    if (orientation === "vertical") return verticalMask;
    return `${verticalMask}, ${horizontalMask}`;
  }

  function applyMask(element, mask) {
    if (mask) {
      element.style.setProperty("mask-image", mask);
      element.style.setProperty("-webkit-mask-image", mask);
      element.style.setProperty("mask-composite", "intersect");
      element.style.setProperty("-webkit-mask-composite", "source-in");
    } else {
      for (const property of [
        "mask-image",
        "-webkit-mask-image",
        "mask-composite",
        "-webkit-mask-composite",
      ]) {
        element.style.removeProperty(property);
      }
    }
  }

  function write() {
    let any = false;
    for (const edge of EDGES) {
      const amount = clamp(values[edge], 0, 1);
      if (amount > 0.001) any = true;
      host.style.setProperty(VARS[edge], amount.toFixed(4));
    }
    if (any !== masked) {
      masked = any;
      applyMask(host, any ? maskFor() : null);
    }
  }

  function amount(distance) {
    const ramp = size / 2;
    return ramp > 0 ? clamp(distance / ramp, 0, 1) : distance > 0.5 ? 1 : 0;
  }

  function measure(follow) {
    const targets = { top: 0, bottom: 0, left: 0, right: 0 };
    const verticalAxis = orientation !== "horizontal";
    const horizontalAxis = orientation !== "vertical";

    if (verticalAxis) {
      const max = host.scrollHeight - host.clientHeight;
      if (max > 1) {
        targets.top = amount(host.scrollTop);
        targets.bottom = amount(max - host.scrollTop);
      }
    }

    if (horizontalAxis) {
      const max = host.scrollWidth - host.clientWidth;
      if (max > 1) {
        const fromStart = Math.abs(host.scrollLeft);
        const fromEnd = max - fromStart;
        const rtl = getComputedStyle(host).direction === "rtl";
        targets.left = amount(rtl ? fromEnd : fromStart);
        targets.right = amount(rtl ? fromStart : fromEnd);
      }
    }

    if (follow || reduce()) {
      for (const edge of EDGES) values[edge] = targets[edge];
      write();
    } else {
      control?.stop?.();
      control = animate(values, targets, {
        ...(transition ?? fadeTween),
        onUpdate: write,
      });
    }
  }

  function observeChildren() {
    observer?.disconnect();
    observer = new ResizeObserver(() => measure(false));
    observer.observe(host);
    for (const child of host.children) observer.observe(child);
  }

  function onScroll() {
    measure(true);
  }

  if (enabled) {
    host.style.setProperty(VARS.size, `${size}px`);
    measure(true);
    host.addEventListener("scroll", onScroll, { passive: true });
    observeChildren();
    mutation = new MutationObserver(() => {
      measure(false);
      observeChildren();
    });
    mutation.observe(host, { childList: true, subtree: true });
  }

  return {
    element: host,
    refresh() {
      measure(false);
    },
    destroy() {
      if (enabled) host.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      mutation?.disconnect();
      control?.stop?.();
      applyMask(host, null);
      for (const name of Object.values(VARS)) host.style.removeProperty(name);
      root.innerHTML = "";
    },
  };
}
