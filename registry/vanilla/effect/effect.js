import { animate } from "motion";

const entranceSpring = { type: "spring", stiffness: 200, damping: 20 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const config = (value) => (value && typeof value === "object" ? value : {});

export function createEffect(root, options = {}) {
  const {
    content = "",
    delay = 0,
    blur = false,
    slide = false,
    fade = false,
    zoom = false,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    transition,
    className = "",
  } = options;
  let observer;
  let control;

  function variants() {
    const hidden = {};
    const shown = {};

    if (slide && !reduce()) {
      const settings = config(slide);
      const direction = settings.direction ?? "up";
      const offset = settings.offset ?? 100;
      const axis = direction === "up" || direction === "down" ? "y" : "x";
      hidden[axis] = direction === "right" || direction === "down" ? -offset : offset;
      shown[axis] = 0;
    }

    if (fade) {
      const settings = config(fade);
      hidden.opacity = settings.initialOpacity ?? 0;
      shown.opacity = settings.opacity ?? 1;
    }

    if (zoom && !reduce()) {
      const settings = config(zoom);
      hidden.scale = settings.initialScale ?? 0.5;
      shown.scale = settings.scale ?? 1;
    }

    if (blur) {
      const settings = config(blur);
      hidden.filter = `blur(${reduce() ? 0 : (settings.initialBlur ?? 10)}px)`;
      shown.filter = `blur(${settings.blur ?? 0}px)`;
    }

    if (reduce() && (slide || zoom) && shown.opacity === undefined) {
      const settings = config(fade ?? false);
      hidden.opacity = settings.initialOpacity ?? 0;
      shown.opacity = settings.opacity ?? 1;
    }

    return { hidden, shown };
  }

  function initialStyle() {
    const { hidden } = variants();
    let style = "";
    if (hidden.opacity !== undefined) style += `opacity:${hidden.opacity};`;
    if (hidden.filter !== undefined) style += `filter:${hidden.filter};`;
    const transforms = [];
    if (hidden.x !== undefined) transforms.push(`translateX(${hidden.x}px)`);
    if (hidden.y !== undefined) transforms.push(`translateY(${hidden.y}px)`);
    if (hidden.scale !== undefined) transforms.push(`scale(${hidden.scale})`);
    if (transforms.length) style += `transform:${transforms.join(" ")};`;
    return style;
  }

  root.innerHTML = `<div data-slot="effect" class="${className}" style="${initialStyle()}">${content}</div>`;
  const host = root.querySelector("[data-slot]");

  function timing() {
    const base = transition ?? entranceSpring;
    return {
      ...base,
      delay: Number(base.delay ?? 0) + delay / 1000,
    };
  }

  function play() {
    const { hidden, shown } = variants();
    const keyframes = {};
    for (const key of Object.keys(shown)) {
      const to = shown[key];
      const from = hidden[key];
      keyframes[key] = from === undefined ? to : [from, to];
    }
    if (!Object.keys(keyframes).length) return;
    control?.stop?.();
    control = animate(host, keyframes, timing());
  }

  function reset() {
    control?.stop?.();
    control = animate(host, variants().hidden, { duration: 0 });
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
