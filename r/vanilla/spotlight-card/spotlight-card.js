import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createSpotlightCard(root, options = {}) {
  const {
    content = "",
    color = "rgba(255,255,255,0.16)",
    size = 280,
    intensity = 1,
    alwaysOn = false,
    className = "",
  } = options;
  let follow;
  let fade;
  let active = alwaysOn;
  const state = { x: 0, y: 0 };
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

  root.innerHTML = `
    <div data-slot="spotlight-card"
      class="relative isolate overflow-hidden rounded-xl border bg-card text-card-foreground ${className}">
      <span data-light aria-hidden="true" data-slot="spotlight-card-light"
        class="pointer-events-none absolute -inset-px z-0 rounded-[inherit]"
        style="opacity:0"></span>
      <span aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_38%)]"></span>
      <div class="relative z-10">${content}</div>
    </div>`;
  const host = root.querySelector("[data-slot]");
  const light = root.querySelector("[data-light]");

  function paint() {
    light.style.background = `radial-gradient(${size}px circle at ${state.x}px ${state.y}px, ${color}, transparent 68%)`;
  }

  function moveTo(x, y) {
    follow?.stop?.();
    follow = animate(
      state,
      { x, y },
      {
        type: "spring",
        stiffness: 260,
        damping: 34,
        mass: 0.5,
        onUpdate: paint,
      },
    );
  }

  function update(event) {
    const rect = host.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top);
  }

  function updateOpacity() {
    fade?.stop?.();
    const target = active && !reduce() ? intensity : alwaysOn ? intensity : 0;
    fade = animate(
      light,
      { opacity: target },
      { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
    );
  }

  function onPointerMove(event) {
    if (event.pointerType === "touch") return;
    update(event);
  }
  function onPointerEnter(event) {
    if (reduce() || event.pointerType === "touch") return;
    update(event);
    active = true;
    updateOpacity();
  }
  function onPointerLeave() {
    if (alwaysOn) return;
    active = false;
    updateOpacity();
  }

  function onMotionPreference() {
    if (reduce()) {
      follow?.stop?.();
      active = false;
    }
    updateOpacity();
  }

  host.addEventListener("pointermove", onPointerMove);
  host.addEventListener("pointerenter", onPointerEnter);
  host.addEventListener("pointerleave", onPointerLeave);
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", onMotionPreference);
  } else {
    motionQuery.addListener?.(onMotionPreference);
  }

  if (alwaysOn) {
    const rect = host.getBoundingClientRect();
    state.x = rect.width / 2;
    state.y = rect.height / 2;
  }
  paint();
  updateOpacity();

  return {
    element: host,
    destroy() {
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerenter", onPointerEnter);
      host.removeEventListener("pointerleave", onPointerLeave);
      if (typeof motionQuery.removeEventListener === "function") {
        motionQuery.removeEventListener("change", onMotionPreference);
      } else {
        motionQuery.removeListener?.(onMotionPreference);
      }
      follow?.stop?.();
      fade?.stop?.();
      root.innerHTML = "";
    },
  };
}
