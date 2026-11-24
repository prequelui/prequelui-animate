import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createParticles(root, options = {}) {
  const {
    content = "",
    animate: animated = true,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    trigger = 0,
    side = "top",
    align = "center",
    count = 6,
    radius = 30,
    spread = 360,
    duration = 0.8,
    holdDelay = 0.05,
    sideOffset = 0,
    alignOffset = 0,
    delay = 0,
    size = 4,
    color = "currentColor",
    transition,
    className = "",
    onReady,
  } = options;
  const vertical = side === "top" || side === "bottom";
  const alignPercent = align === "start" ? "0%" : align === "end" ? "100%" : "50%";
  const top = vertical
    ? side === "top"
      ? `calc(0% - ${sideOffset}px)`
      : `calc(100% + ${sideOffset}px)`
    : `calc(${alignPercent} + ${alignOffset}px)`;
  const left = vertical
    ? `calc(${alignPercent} + ${alignOffset}px)`
    : side === "left"
      ? `calc(0% - ${sideOffset}px)`
      : `calc(100% + ${sideOffset}px)`;

  root.innerHTML = `
    <div data-slot="particles" class="relative ${className}">
      ${content}
      <div data-layer aria-hidden="true" class="pointer-events-none absolute inset-0 z-10"></div>
    </div>`;
  const host = root.querySelector("[data-slot]");
  const layer = root.querySelector("[data-layer]");
  let observer;
  let timer;
  let generation = 0;
  let controls = [];
  let onScreen = !inView;
  let pendingBurst = false;

  function stopControls() {
    for (const control of controls) control?.stop?.();
    controls = [];
  }

  function burst() {
    if (!animated || !onScreen || reduce()) return;
    generation += 1;
    stopControls();
    clearTimeout(timer);
    layer.innerHTML = "";
    const dots = Array.from({ length: count }, () => {
      const dot = document.createElement("span");
      dot.className = "pointer-events-none absolute rounded-full";
      dot.style.cssText = `top:${top};left:${left};width:${size}px;height:${size}px;margin-left:${-size / 2}px;margin-top:${-size / 2}px;background:${color};`;
      layer.appendChild(dot);
      return dot;
    });

    queueMicrotask(() => {
      const fullCircle = spread % 360 === 0;
      const step = ((spread * Math.PI) / 180) / Math.max(1, fullCircle ? count : count - 1);
      dots.forEach((node, index) => {
        const angle = index * step;
        const x = Math.round(Math.cos(angle) * radius * 100) / 100;
        const y = Math.round(Math.sin(angle) * radius * 100) / 100;
        controls.push(
          animate(
            node,
            { x: [0, x], y: [0, y], scale: [0, 1, 0], opacity: [0, 1, 0] },
            {
              duration,
              delay: delay + index * holdDelay,
              ease: "easeOut",
              ...(transition ?? {}),
            },
          ),
        );
      });
      const total = (duration + delay + holdDelay * (count - 1)) * 1000;
      clearTimeout(timer);
      timer = setTimeout(() => {
        layer.innerHTML = "";
      }, total + 80);
    });
  }

  if (inView) {
    pendingBurst = trigger > 0;
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        onScreen = visible;
        if (visible && pendingBurst) {
          pendingBurst = false;
          burst();
        }
        if (visible && inViewOnce) observer?.disconnect();
      },
      { threshold: 0.35, rootMargin: inViewMargin },
    );
    observer.observe(host);
  } else if (trigger > 0) {
    burst();
  }

  onReady?.({ burst });

  return {
    element: host,
    burst,
    setTrigger(value) {
      if (value > 0) burst();
    },
    destroy() {
      observer?.disconnect();
      clearTimeout(timer);
      stopControls();
      root.innerHTML = "";
    },
  };
}
