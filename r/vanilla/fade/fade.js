import { animate } from "motion";

const entranceSpring = { type: "spring", stiffness: 200, damping: 20 };

export function createFade(root, options = {}) {
  const {
    content = "",
    delay = 0,
    initialOpacity = 0,
    opacity = 1,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    transition,
    className = "",
  } = options;
  const from = () => initialOpacity;
  let observer;
  let control;

  root.innerHTML = `<div data-slot="fade" class="${className}"
    style="opacity:${initialOpacity}">${content}</div>`;
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
    control = animate(host, { opacity: [from(), opacity] }, timing());
  }

  function reset() {
    control?.stop?.();
    host.style.opacity = `${initialOpacity}`;
  }

  host.style.opacity = `${initialOpacity}`;
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
