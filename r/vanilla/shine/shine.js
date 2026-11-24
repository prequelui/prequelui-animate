import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createShine(root, options = {}) {
  const {
    content = "",
    color = "currentColor",
    opacity = 0.3,
    delay = 0,
    duration = 1200,
    loop = false,
    loopDelay = 0,
    deg = -15,
    enable = true,
    enableOnHover = false,
    enableOnTap = false,
    className = "",
  } = options;
  let timer;
  let control;
  let hovered = false;
  let active = enable && !reduce();
  let overlay = null;
  let run = 0;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  root.innerHTML = `<div data-slot="shine" class="relative overflow-hidden ${className}">${content}</div>`;
  const host = root.querySelector("[data-slot]");

  function alwaysOn() {
    return active && !enableOnHover && !enableOnTap;
  }

  function ensureOverlay() {
    if (!active) return;
    if (!overlay) {
      overlay = document.createElement("span");
      overlay.setAttribute("aria-hidden", "true");
      overlay.className =
        "pointer-events-none absolute inset-0 z-10 block h-full w-full";
      overlay.style.background = `linear-gradient(to right, transparent, ${color}, transparent)`;
      overlay.style.opacity = String(opacity);
      host.appendChild(overlay);
    }
  }

  function clearTimer() {
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  function scheduleNext() {
    clearTimer();
    const on = alwaysOn() || (enableOnHover && hovered);
    if (!active || !loop || !on) return;
    timer = setTimeout(play, loopDelay);
  }

  function play() {
    if (!active) return;
    ensureOverlay();
    if (!overlay) return;
    const current = ++run;
    control?.stop?.();
    control = animate(
      overlay,
      { x: ["-100%", "100%"], skewX: deg },
      {
        duration: duration / 1000,
        ease: [0.4, 0, 0.2, 1],
        delay: delay / 1000,
      },
    );
    const done = () => {
      if (current === run) scheduleNext();
    };
    control.finished.then(done, done);
  }

  function stop() {
    clearTimer();
    control?.stop?.();
    control = undefined;
    run += 1;
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }

  function syncMotion() {
    const next = enable && !reduce();
    if (next === active) return;
    active = next;
    if (!active) {
      hovered = false;
      stop();
    } else if (alwaysOn()) {
      play();
    }
  }

  function onEnter() {
    if (!active || !enableOnHover || alwaysOn()) return;
    hovered = true;
    play();
  }
  function onLeave() {
    if (!active || !enableOnHover || alwaysOn()) return;
    hovered = false;
    clearTimer();
  }
  function onDown() {
    if (!active || !enableOnTap || alwaysOn()) return;
    play();
  }

  host.addEventListener("mouseenter", onEnter);
  host.addEventListener("mouseleave", onLeave);
  host.addEventListener("pointerdown", onDown);
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", syncMotion);
  } else {
    motionQuery.addListener?.(syncMotion);
  }

  if (alwaysOn()) play();

  return {
    element: host,
    play,
    destroy() {
      run += 1;
      clearTimer();
      control?.stop?.();
      host.removeEventListener("mouseenter", onEnter);
      host.removeEventListener("mouseleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", syncMotion);
      } else {
        motionQuery.removeListener?.(syncMotion);
      }
      root.innerHTML = "";
    },
  };
}
