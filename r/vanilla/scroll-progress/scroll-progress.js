import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const scrollSpring = { type: "spring", stiffness: 250, damping: 40, bounce: 0 };

export function createScrollProgress(root, options = {}) {
  const { container = null, barClassName = "", className = "" } = options;
  let control;
  let lastValue = 0;

  root.innerHTML = `
    <div role="progressbar" aria-label="Scroll progress" data-slot="scroll-progress"
      class="h-1 w-full overflow-hidden bg-accent ${className}">
      <div data-bar class="h-full origin-left bg-foreground ${barClassName}" style="transform:scaleX(0)"></div>
    </div>`;
  const host = root.querySelector("[data-slot]");
  const bar = root.querySelector("[data-bar]");

  function target() {
    if (!container) return null;
    return typeof container === "string" ? document.querySelector(container) : container;
  }

  function read() {
    const node = target();
    let value;
    if (node) {
      const max = node.scrollHeight - node.clientHeight;
      value = max > 0 ? Math.min(1, Math.max(0, node.scrollTop / max)) : 0;
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      value = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    }
    if (Math.abs(value - lastValue) < 0.0005) return;
    lastValue = value;
    control?.stop?.();
    if (reduce()) {
      bar.style.transform = `scaleX(${value})`;
      return;
    }
    control = animate(bar, { scaleX: value }, scrollSpring);
  }

  const scrollTarget = target() ?? window;
  scrollTarget.addEventListener("scroll", read, { passive: true });
  window.addEventListener("resize", read);
  read();

  return {
    element: host,
    read,
    destroy() {
      control?.stop?.();
      scrollTarget.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      root.innerHTML = "";
    },
  };
}
