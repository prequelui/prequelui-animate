import { animate } from "motion";

const SR_ONLY =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0";

const WAVE = {
  x: [0, 5, 0],
  y: [0, -5, 0],
  scale: [1, 1.1, 1],
  rotateY: [0, 15, 0],
  opacity: [1, 0.35, 1],
};

let segmenter;

function splitGraphemes(value) {
  if (segmenter === undefined) {
    segmenter =
      typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
  }
  if (!segmenter) return Array.from(value);
  return Array.from(segmenter.segment(value), (entry) => entry.segment);
}

const reduceQuery = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

const reduce = () => reduceQuery()?.matches ?? false;

export function createShimmeringText(root, options = {}) {
  const {
    text = "Shimmer",
    duration = 1,
    wave = false,
    color = "var(--muted-foreground)",
    shimmeringColor = "var(--foreground)",
    className = "",
    style,
  } = options;
  const chars = splitGraphemes(text);
  const controls = [];
  let started = false;
  let inView = false;
  let pageVisible = typeof document === "undefined" ? true : !document.hidden;
  let destroyed = false;

  const host = document.createElement("span");
  host.dataset.slot = "shimmering-text";
  host.className = `relative inline-block ${className}`.trim();
  host.style.setProperty("--shimmer-color", shimmeringColor);
  host.style.setProperty("--shimmer-base", color);
  Object.assign(host.style, { color, perspective: "500px" });
  if (style) Object.assign(host.style, style);

  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.setAttribute("style", SR_ONLY);
  sr.textContent = text;

  const track = document.createElement("span");
  track.setAttribute("aria-hidden", "true");
  track.className = "inline-block";
  track.style.perspective = "inherit";

  const nodes = chars.map((char) => {
    const node = document.createElement("span");
    node.className = "inline-block whitespace-pre";
    node.style.transformStyle = "preserve-3d";
    node.textContent = char;
    track.append(node);
    return node;
  });

  host.append(sr, track);
  root.innerHTML = "";
  root.append(host);

  function start() {
    if (started || destroyed || reduce()) return;
    started = true;
    const span = duration;
    nodes.forEach((node, index) => {
      controls.push(
        animate(
          node,
          wave ? WAVE : { opacity: [1, 0.35, 1] },
          {
            duration: span,
            repeat: Infinity,
            repeatDelay: chars.length * 0.05,
            delay: (index * span) / Math.max(1, chars.length),
            ease: "easeInOut",
          },
        ),
      );
    });
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
