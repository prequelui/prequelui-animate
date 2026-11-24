import { onCleanup, onMount } from "solid-js";
import { animate } from "motion";

export type ScrollProgressProps = {
  target?: HTMLElement | (() => HTMLElement | null) | null;
  barClass?: string;
  class?: string;
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function ScrollProgress(props: ScrollProgressProps) {
  let bar: HTMLDivElement | undefined;
  let controls: ReturnType<typeof animate> | undefined;
  let scroller: EventTarget | undefined;
  let resizeHandler: (() => void) | undefined;

  const resolveTarget = (): HTMLElement | null => {
    const node = props.target;
    if (!node) return null;
    return typeof node === "function" ? node() : node;
  };

  const read = () => {
    if (!bar || typeof window === "undefined") return;
    const element = resolveTarget();
    let value = 0;

    if (element && typeof element.scrollHeight === "number") {
      const max = element.scrollHeight - element.clientHeight;
      value = max > 0 ? clamp(element.scrollTop / max) : 0;
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      value = max > 0 ? clamp(window.scrollY / max) : 0;
    }

    controls?.stop?.();
    if (reduce()) {
      bar.style.transform = `scaleX(${value})`;
      return;
    }
    controls = animate(
      bar,
      { scaleX: value },
      { type: "spring", stiffness: 250, damping: 40, bounce: 0 },
    );
  };

  onMount(() => {
    scroller = resolveTarget() ?? window;
    read();
    scroller.addEventListener("scroll", read, { passive: true });
    resizeHandler = () => read();
    window.addEventListener("resize", resizeHandler);
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    controls?.stop?.();
    scroller?.removeEventListener("scroll", read);
    if (resizeHandler) window.removeEventListener("resize", resizeHandler);
  });

  return (
    <div
      role="progressbar"
      aria-label="Scroll progress"
      data-slot="scroll-progress"
      class={`h-1 w-full overflow-hidden bg-accent ${props.class ?? ""}`}
    >
      <div
        ref={(node: HTMLDivElement) => (bar = node)}
        class={`h-full origin-left bg-foreground ${props.barClass ?? ""}`}
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
