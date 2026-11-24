const WIPE_DURATION = 700;
const WIPE_EASING = "ease-in-out";
const WIPE_TYPE = "prequel-theme-wipe";

const WIPE_STYLE =
  "::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}" +
  `:root:active-view-transition-type(${WIPE_TYPE}) body, :root:active-view-transition-type(${WIPE_TYPE}) body *{view-transition-name:none !important;}`;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const systemResolved = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

function clipKeyframes(direction) {
  switch (direction) {
    case "rtl":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "ttb":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "btt":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    case "ltr":
    default:
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
  }
}

export function createThemeToggler(root, options = {}) {
  const {
    theme = "light",
    resolvedTheme = "light",
    setTheme,
    direction = "ltr",
    onImmediateChange,
    tempo = 1,
    content = "",
  } = options;
  const rate = Math.max(0.4, tempo);
  let current = { effective: theme, resolved: resolvedTheme };

  root.innerHTML = `
    <span data-slot="theme-toggler" style="display:contents">${content}</span>
    <style>${WIPE_STYLE}</style>`;
  const host = root.querySelector("[data-slot]");

  function applyTheme(next) {
    setTheme?.(next);
  }

  function startWipe(update) {
    if (typeof document === "undefined") return null;
    const start = document.startViewTransition;
    if (!start) return null;
    try {
      return start.call(document, { update, types: [WIPE_TYPE] });
    } catch {
      return start.call(document, update);
    }
  }

  function toggleTheme(next) {
    const resolved = next === "system" ? systemResolved() : next;
    current = { effective: next, resolved };
    onImmediateChange?.(next);

    if (next === "system" && resolved === resolvedTheme) {
      applyTheme(next);
      return;
    }

    if (reduce()) {
      applyTheme(next);
      return;
    }

    const transition = startWipe(() => {
      document.documentElement.classList.toggle("dark", resolved === "dark");
    });

    if (!transition) {
      applyTheme(next);
      return;
    }

    const [fromClip, toClip] = clipKeyframes(direction);
    transition.ready.then(() => {
      document.documentElement
        .animate(
          { clipPath: [fromClip, toClip] },
          {
            duration: WIPE_DURATION * rate,
            easing: WIPE_EASING,
            pseudoElement: "::view-transition-new(root)",
          },
        )
        .finished.finally(() => applyTheme(next));
    });
  }

  return {
    element: host,
    toggleTheme,
    get state() {
      return { ...current };
    },
    destroy() {
      root.innerHTML = "";
    },
  };
}
