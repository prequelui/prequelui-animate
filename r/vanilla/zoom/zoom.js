import { animate } from "motion";

const entranceSpring = { type: "spring", stiffness: 200, damping: 20 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createZoom(root, options = {}) {
  const {
    content = "",
    delay = 0,
    initialScale = 0.5,
    scale = 1,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    transition,
    className = "",
  } = options;
  let observer;
  let control;

  root.innerHTML = `<div data-slot="zoom" class="${className}"
    style="${reduce() ? "opacity:0" : `transform:scale(${initialScale})`}">${content}</div>`;
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
    control = animate(
      host,
      reduce() ? { opacity: [0, 1] } : { scale: [initialScale, scale] },
      timing(),
    );
  }

  function reset() {
    control?.stop?.();
    control = animate(
      host,
      reduce() ? { opacity: 0 } : { scale: initialScale },
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
