import { animate } from "motion";

const defaultSpring = { type: "spring", stiffness: 300, damping: 25, mass: 0.5 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createTilt(root, options = {}) {
  const {
    content = "",
    maxTilt = 10,
    perspective = 800,
    transition,
    className = "",
  } = options;
  let control;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  root.innerHTML = `<div data-slot="tilt"
    class="will-change-transform ${className}" style="transform-style:preserve-3d">${content}</div>`;
  const host = root.querySelector("[data-slot]");
  const spring = transition ?? defaultSpring;

  function move(event) {
    if (reduce()) return;
    const rect = host.getBoundingClientRect();
    const px = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
    const py = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
    control?.stop?.();
    control = animate(
      host,
      {
        rotateX: -(py * 2 - 1) * maxTilt,
        rotateY: (px * 2 - 1) * maxTilt,
        transformPerspective: perspective,
      },
      spring,
    );
  }

  function leave() {
    control?.stop?.();
    control = animate(
      host,
      { rotateX: 0, rotateY: 0, transformPerspective: perspective },
      spring,
    );
  }

  function onMotionPreference() {
    if (!reduce()) return;
    control?.stop?.();
    control = animate(
      host,
      { rotateX: 0, rotateY: 0, transformPerspective: perspective },
      { duration: 0 },
    );
  }

  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", leave);
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", onMotionPreference);
  } else {
    motionQuery.addListener?.(onMotionPreference);
  }
  control = animate(
    host,
    { rotateX: 0, rotateY: 0, transformPerspective: perspective },
    { duration: 0 },
  );

  return {
    element: host,
    destroy() {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", onMotionPreference);
      } else {
        motionQuery.removeListener?.(onMotionPreference);
      }
      control?.stop?.();
      root.innerHTML = "";
    },
  };
}
