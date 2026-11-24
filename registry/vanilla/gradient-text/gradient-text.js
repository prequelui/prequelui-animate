import { animate } from "motion";

const DEFAULT_GRADIENT =
  "linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)";

const DEFAULT_TWEEN = { duration: 50, repeat: Infinity, ease: "linear" };

const reduceQuery = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

const reduce = () => reduceQuery()?.matches ?? false;

function paintLayer(text, gradient) {
  const layer = document.createElement("span");
  Object.assign(layer.style, {
    backgroundImage: gradient,
    color: "transparent",
    backgroundClip: "text",
    webkitBackgroundClip: "text",
    backgroundSize: "700% 100%",
    display: "inline-block",
  });
  layer.textContent = text;
  return layer;
}

export function createGradientText(root, options = {}) {
  const {
    text = "Gradient",
    gradient = DEFAULT_GRADIENT,
    neon = false,
    transition,
    className = "",
    style,
  } = options;
  const tween = transition ?? DEFAULT_TWEEN;
  const controls = [];
  let started = false;
  let inView = false;
  let pageVisible = typeof document === "undefined" ? true : !document.hidden;
  let destroyed = false;

  const host = document.createElement("span");
  host.dataset.slot = "gradient-text";
  host.className = `relative inline-block ${className}`.trim();
  if (style) Object.assign(host.style, style);

  const layers = [paintLayer(text, gradient)];
  if (neon) {
    const glow = paintLayer(text, gradient);
    glow.setAttribute("aria-hidden", "true");
    Object.assign(glow.style, {
      position: "absolute",
      inset: "0",
      mixBlendMode: "plus-lighter",
      filter: "blur(8px)",
    });
    layers.push(glow);
  }
  host.append(...layers);
  root.innerHTML = "";
  root.append(host);

  function start() {
    if (started || destroyed || reduce()) return;
    started = true;
    for (const layer of layers) {
      controls.push(
        animate(
          layer,
          { backgroundPosition: ["0% 0%", "500% 100%"] },
          tween,
        ),
      );
    }
  }

  function update() {
    if (destroyed) return;
    const shouldPlay = inView && pageVisible && !reduce();
    if (!shouldPlay) {
      for (const control of controls) control.pause?.();
      return;
    }
    if (!started) {
      start();
      return;
    }
    for (const control of controls) control.play?.();
  }

  const observer =
    typeof IntersectionObserver === "function"
      ? new IntersectionObserver(
          (entries) => {
            inView = entries.some((entry) => entry.isIntersecting);
            update();
          },
          { threshold: 0 },
        )
      : null;
  observer?.observe(host);

  const query = reduceQuery();
  const onMotionChange = () => update();
  query?.addEventListener?.("change", onMotionChange);
  const onVisibilityChange = () => {
    pageVisible = !document.hidden;
    update();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  return {
    element: host,
    destroy() {
      destroyed = true;
      observer?.disconnect();
      query?.removeEventListener?.("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      for (const control of controls) control.stop?.();
      controls.length = 0;
      root.innerHTML = "";
    },
  };
}
