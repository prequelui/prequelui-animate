import { animate } from "motion";

const HOST = 'a, button, [role="button"], [role="link"]';
const BLEED = "0.25em";
const GAP = "0.6em";
const DEFAULT_TWEEN = { duration: 0.25, ease: [0.4, 0, 0.2, 1] };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createSlidingText(root, options = {}) {
  const {
    text = "Sliding",
    direction = "down",
    trigger = "hover",
    transition,
    className = "",
    style,
  } = options;
  const tween = transition ?? DEFAULT_TWEEN;
  const sign = direction === "down" ? 1 : -1;
  let progress = 0;
  let target = 0;
  let control;
  let owner;

  const host = document.createElement("span");
  host.dataset.slot = "sliding-text";
  host.dataset.direction = direction;
  host.dataset.trigger = trigger;
  host.className = `relative inline-block overflow-clip ${className}`.trim();
  Object.assign(host.style, { paddingBlock: BLEED, marginBlock: `calc(-1 * ${BLEED})` });
  if (style) Object.assign(host.style, style);

  const track = document.createElement("span");
  track.dataset.slot = "sliding-text-track";
  track.className = "relative inline-block";
  track.style.transform = "translateY(0%)";

  const copy = document.createElement("span");
  copy.dataset.slot = "sliding-text-copy";
  copy.setAttribute("aria-hidden", "true");
  copy.className = "absolute left-0 w-full";
  copy.style.top = `calc(${-sign * 100}% - ${sign} * ${GAP})`;

  track.textContent = text;
  copy.textContent = text;
  track.append(copy);
  host.append(track);
  root.innerHTML = "";
  root.append(host);

  function apply(value) {
    const lap = sign * (value - Math.floor(value));
    const y = lap === 0 ? "0%" : `calc(${lap * 100}% + ${lap} * ${GAP})`;
    track.style.transform = `translateY(${y})`;
  }

  function slideTo(next) {
    target = next;
    control?.stop?.();
    if (reduce()) {
      progress = next;
      apply(next);
      return;
    }
    const from = progress;
    control = animate(from, next, {
      ...tween,
      onUpdate: (value) => {
        progress = value;
        apply(value);
      },
    });
  }

  function enter(event) {
    if (trigger !== "hover" || event.pointerType === "touch") return;
    slideTo(1);
  }

  function leave(event) {
    if (trigger !== "hover" || event.pointerType === "touch") return;
    slideTo(0);
  }

  function click() {
    if (trigger !== "click") return;
    slideTo(Math.round(target) + 1);
  }

  const parent = host.parentElement;
  owner = parent?.closest(HOST) ?? host;
  owner.addEventListener("pointerenter", enter);
  owner.addEventListener("pointerleave", leave);
  owner.addEventListener("click", click);

  return {
    element: host,
    destroy() {
      control?.stop?.();
      owner.removeEventListener("pointerenter", enter);
      owner.removeEventListener("pointerleave", leave);
      owner.removeEventListener("click", click);
      root.innerHTML = "";
    },
  };
}
