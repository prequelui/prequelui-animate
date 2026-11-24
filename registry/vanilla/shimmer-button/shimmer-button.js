import { animate } from "motion";

export function createShimmerButton(root, options = {}) {
  const {
    label = "Shimmer",
    shimmerColor = "color-mix(in oklab, var(--primary-foreground) 55%, transparent)",
    shimmerDuration = 900,
    shimmerDelay = 60,
    shimmer = true,
    tapScale = 0.97,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer;

  root.innerHTML = `
    <button type="button" data-slot="shimmer-button"
      class="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}">
      <span data-beam aria-hidden="true" data-slot="shimmer-button-beam"
        class="pointer-events-none absolute inset-y-0 left-0 z-0 w-[52%] opacity-0"
        style="background:linear-gradient(105deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)"></span>
      <span class="relative z-10 inline-flex items-center gap-2">${label}</span>
    </button>`;
  const button = root.querySelector("button");
  const beam = root.querySelector("[data-beam]");

  function play(delay = shimmerDelay) {
    if (!shimmer || reduce()) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      animate(
        beam,
        { x: ["-180%", "260%"], skewX: -14, opacity: [0, 1, 1, 0] },
        {
          duration: shimmerDuration / 1000,
          ease: [0.33, 0, 0.2, 1],
          times: [0, 0.16, 0.72, 1],
        },
      );
    }, delay);
  }

  function press() {
    if (reduce()) return;
    animate(
      button,
      { scale: tapScale },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  function release() {
    if (reduce()) return;
    animate(
      button,
      { scale: 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  button.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "touch") play();
  });
  button.addEventListener("click", () => play(0));
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);

  return {
    element: button,
    play,
    destroy() {
      clearTimeout(timer);
      root.innerHTML = "";
    },
  };
}
