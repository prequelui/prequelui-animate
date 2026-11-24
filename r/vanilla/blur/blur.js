import { animate } from "motion";

const entranceSpring = { type: "spring", stiffness: 200, damping: 20 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createBlur(root, options = {}) {
  const {
    content = "",
    delay = 0,
    initialBlur = 10,
    blur = 0,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    transition,
    className = "",
  } = options;
  const start = () => (reduce() ? 0 : initialBlur);
  let observer;
  let control;

  root.innerHTML = `<div data-slot="blur" class="${className}"
    style="filter:blur(${start()}px)">${content}</div>`;
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
      { filter: [`blur(${start()}px)`, `blur(${blur}px)`] },
      timing(),
    );
  }

  function reset() {
    control?.stop?.();
    host.style.filter = `blur(${start()}px)`;
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
