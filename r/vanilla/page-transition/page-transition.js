import { animate } from "motion";

export function createPageTransition(root, options = {}) {
  const {
    content = "",
    duration = 0.55,
    from = "top",
    fade = true,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let controls;
  let key = 0;

  root.innerHTML = `<div data-slot="page-transition" class="min-w-0 ${className}">${content}</div>`;
  const host = root.querySelector("[data-slot]");

  function hiddenClip() {
    if (from === "bottom") return "inset(100% 0 0 0)";
    if (from === "left") return "inset(0 100% 0 0)";
    if (from === "right") return "inset(0 0 0 100%)";
    return "inset(0 0 100% 0)";
  }

  function play() {
    controls?.stop?.();
    if (reduce()) {
      controls = animate(
        host,
        { opacity: [0, 1] },
        { duration: 0.2, ease: [0.77, 0, 0.175, 1] },
      );
      return;
    }
    controls = animate(
      host,
      {
        clipPath: [hiddenClip(), "inset(0 0 0% 0)"],
        opacity: fade ? [0.6, 1] : 1,
      },
      { duration, ease: [0.77, 0, 0.175, 1] },
    );
  }

  play();

  return {
    element: host,
    play,
    setPage(next = ++key) {
      key = next;
      play();
    },
    destroy() {
      controls?.stop?.();
      root.innerHTML = "";
    },
  };
}
