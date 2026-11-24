import { animate } from "motion";

const LAYERS = [
  { count: 1100, size: 1, multiplier: 1, opacity: 0.55 },
  { count: 480, size: 2, multiplier: 2, opacity: 0.75 },
  { count: 220, size: 3, multiplier: 3, opacity: 0.95 },
];

function seeded(index, salt = 1) {
  const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function buildShadows(count, salt) {
  const shadows = [];
  for (let index = 0; index < count; index += 1) {
    const x = Math.round((seeded(index + salt * 1000, 1.7) - 0.5) * 2800);
    const y = Math.round((seeded(index + salt * 1000, 2.9) - 0.5) * 2800);
    shadows.push(`${x}px ${y}px`);
  }
  return shadows.join(",");
}

const LAYERS_WITH_SHADOWS = LAYERS.map((layer) => ({
  ...layer,
  shadows: buildShadows(layer.count, layer.multiplier),
}));

export function createStars(root, options = {}) {
  const {
    content = "",
    speed = 50,
    paused = false,
    starColor = "#f8fafc",
    factor = 0.05,
    pointerEvents = true,
    className = "",
  } = options;
  let inView = false;
  let pageVisible = true;
  let reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const controls = [];
  let follow;
  let observer;
  const offset = { x: 0, y: 0 };

  const layers = LAYERS_WITH_SHADOWS.map(
    (layer) => `
      <div data-layer class="absolute left-0 top-0 h-[2000px] w-full" style="will-change:transform">
        <div class="absolute rounded-full bg-transparent"
          style="width:${layer.size}px;height:${layer.size}px;color:${starColor};box-shadow:${layer.shadows};opacity:${reduce ? layer.opacity * 0.8 : layer.opacity}"></div>
        <div class="absolute top-[2000px] rounded-full bg-transparent"
          style="width:${layer.size}px;height:${layer.size}px;color:${starColor};box-shadow:${layer.shadows};opacity:${reduce ? layer.opacity * 0.8 : layer.opacity}"></div>
      </div>`,
  ).join("");

  root.innerHTML = `
    <div data-slot="stars-background"
      class="relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#17172a_0%,#05050a_75%)] ${className}">
      <div data-parallax aria-hidden="true" class="absolute inset-0 ${pointerEvents === false ? "pointer-events-none" : ""}">
        ${layers}
      </div>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,10,0.7))]"></div>
      ${content}
    </div>`;
  const host = root.querySelector("[data-slot]");
  const parallax = root.querySelector("[data-parallax]");
  const layerNodes = Array.from(root.querySelectorAll("[data-layer]"));

  function playing() {
    return inView && pageVisible && !reduce && !paused;
  }

  function stopControls() {
    while (controls.length) controls.pop()?.stop?.();
  }

  function start() {
    stopControls();
    LAYERS_WITH_SHADOWS.forEach((layer, index) => {
      const element = layerNodes[index];
      if (!element) return;
      if (!playing()) {
        controls.push(animate(element, { y: 0 }, { duration: 0 }));
        return;
      }
      const span = (50 * layer.multiplier) / Math.max(0.1, speed);
      controls.push(
        animate(
          element,
          { y: [0, -2000] },
          { duration: span, repeat: Infinity, ease: "linear" },
        ),
      );
    });
  }

  function applyOffset() {
    parallax.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
  }

  function onPointerMove(event) {
    if (reduce) return;
    const rect = host.getBoundingClientRect();
    const x = -(event.clientX - rect.left - rect.width / 2) * factor;
    const y = -(event.clientY - rect.top - rect.height / 2) * factor;
    follow?.stop?.();
    follow = animate(offset, { x, y }, {
      type: "spring",
      stiffness: 50,
      damping: 20,
      onUpdate: applyOffset,
    });
  }

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMedia = () => {
    reduce = media.matches;
    layerNodes.forEach((node, index) => {
      const opacity = reduce
        ? LAYERS_WITH_SHADOWS[index].opacity * 0.8
        : LAYERS_WITH_SHADOWS[index].opacity;
      node.querySelectorAll("div").forEach((dot) => {
        dot.style.opacity = String(opacity);
      });
    });
    start();
  };
  media.addEventListener?.("change", onMedia);
  pageVisible = document.visibilityState !== "hidden";
  const onVisibility = () => {
    pageVisible = document.visibilityState !== "hidden";
    start();
  };
  document.addEventListener("visibilitychange", onVisibility);
  observer = new IntersectionObserver(
    (entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      start();
    },
    { threshold: 0 },
  );
  observer.observe(host);
  if (pointerEvents !== false) host.addEventListener("pointermove", onPointerMove);
  start();

  return {
    element: host,
    destroy() {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMedia);
      if (pointerEvents !== false) host.removeEventListener("pointermove", onPointerMove);
      stopControls();
      follow?.stop?.();
      root.innerHTML = "";
    },
  };
}
