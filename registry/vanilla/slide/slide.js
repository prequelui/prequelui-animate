import { animate } from "motion";

const entranceSpring = { type: "spring", stiffness: 200, damping: 20 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createSlide(root, options = {}) {
  const {
    content = "",
    delay = 0,
    direction = "up",
    offset = 100,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    transition,
    className = "",
  } = options;
  const vertical = direction === "up" || direction === "down";
  const start = direction === "right" || direction === "down" ? -offset : offset;
  let observer;
  let control;

  root.innerHTML = `<div data-slot="slide" data-direction="${direction}" class="${className}"
    style="${
      reduce()
        ? "opacity:0"
        : vertical
          ? `transform:translateY(${start}px)`
          : `transform:translateX(${start}px)`
    }">${content}</div>`;
  const host = root.querySelector("[data-slot]");

  function timing() {
    const base = transition ?? entranceSpring;
    return {
      ...base,
      delay: Number(base.delay ?? 0) + delay / 1000,
    };
  }

  function play() {
    control?.stop?.();
    if (reduce()) {
      control = animate(host, { opacity: [0, 1] }, timing());
      return;
    }
    control = animate(host, vertical ? { y: [start, 0] } : { x: [start, 0] }, timing());
  }

  function reset() {
    control?.stop?.();
    control = animate(
      host,
      reduce() ? { opacity: 0 } : vertical ? { y: start } : { x: start },
      { duration: 0 },
    );
  }

  if (!inView) {
    play();
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          play();
          if (inViewOnce) observer?.disconnect();
        } else if (!inViewOnce) {
          reset();
        }
      },
      { threshold: 0.35, rootMargin: inViewMargin },
    );
    observer.observe(host);
  }

  return {
    element: host,
    play,
    destroy() {
      observer?.disconnect();
      control?.stop?.();
      root.innerHTML = "";
    },
  };
}
