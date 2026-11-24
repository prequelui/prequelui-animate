import { animate } from "motion";

const DEFAULT_COLOR = "color-mix(in oklab, #f5c542 38%, transparent)";
const DEFAULT_TWEEN = { duration: 2, ease: [0.42, 0, 0.58, 1] };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createHighlightText(root, options = {}) {
  const {
    text = "Highlight",
    delay = 0,
    color = DEFAULT_COLOR,
    inView = false,
    inViewOnce = true,
    transition,
    className = "",
    style,
  } = options;
  const tween = transition ?? DEFAULT_TWEEN;
  const final = {
    ...tween,
    delay: Number(tween.delay ?? 0) + delay / 1000,
  };
  const controls = [];
  let played = false;
  let observer;

  const host = document.createElement("span");
  host.dataset.slot = "highlight-text";
  host.className = `relative inline-block ${className}`.trim();
  Object.assign(host.style, {
    backgroundImage: `linear-gradient(${color}, ${color})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "left center",
    backgroundSize: "0% 100%",
  });
  if (style) Object.assign(host.style, style);
  host.textContent = text;
  root.innerHTML = "";
  root.append(host);

  function play() {
    if (played) return;
    played = true;
    if (reduce()) {
      host.style.backgroundSize = "100% 100%";
      return;
    }
    controls.push(
      animate(
        host,
        { backgroundSize: ["0% 100%", "100% 100%"] },
        final,
      ),
    );
  }

  if (!inView) {
    play();
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          if (inViewOnce) observer?.disconnect();
        } else if (!inViewOnce) {
          played = false;
          for (const control of controls) control.stop?.();
          controls.length = 0;
          host.style.backgroundSize = "0% 100%";
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
  }

  return {
    element: host,
    destroy() {
      observer?.disconnect();
      for (const control of controls) control.stop?.();
      controls.length = 0;
      root.innerHTML = "";
    },
  };
}
