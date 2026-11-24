import { animate } from "motion";
import { For, onCleanup, onMount } from "solid-js";

export type MotionGridProps = {
  count?: number;
  columns?: number;
  dotSize?: number;
  gap?: number;
  speed?: number;
  stagger?: number;
  pauseOnHover?: boolean;
  class?: string;
};

export function MotionGrid(props: MotionGridProps) {
  let root: HTMLDivElement | undefined;
  const controls: Array<{ stop?: () => void }> = [];
  const columns = () => props.columns ?? 7;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = () => {
    controls.length = 0;
    if (!root || reduce()) return;
    const nodes = Array.from(root.children) as HTMLElement[];
    nodes.forEach((node, index) => {
      const row = Math.floor(index / columns());
      const column = index % columns();
      controls.push(
        animate(
          node,
          { scale: [0.65, 1, 0.65], opacity: [0.3, 1, 0.3] },
          {
            duration: props.speed ?? 1.4,
            repeat: Infinity,
            delay: (row + column) * (props.stagger ?? 0.07),
            ease: "easeInOut",
          },
        ),
      );
    });
  };

  const pause = () => {
    if (props.pauseOnHover === false || !root) return;
    controls.forEach((control) => control.stop?.());
    Array.from(root.children).forEach((node) => {
      const element = node as HTMLElement;
      element.style.opacity = "0.35";
      element.style.transform = "scale(1)";
    });
  };

  onMount(play);
  onCleanup(() => controls.forEach((control) => control.stop?.()));

  return (
    <div
      ref={root}
      data-slot="motion-grid"
      aria-hidden="true"
      class={`grid w-fit ${props.class ?? ""}`}
      style={{
        "grid-template-columns": `repeat(${columns()}, minmax(0, 1fr))`,
        gap: `${props.gap ?? 10}px`,
      }}
      onPointerEnter={pause}
      onPointerLeave={play}
    >
      <For each={Array.from({ length: props.count ?? 35 })}>
        {() => (
          <span
            class="rounded-full bg-foreground"
            style={{
              width: `${props.dotSize ?? 8}px`,
              height: `${props.dotSize ?? 8}px`,
              opacity: 0.55,
            }}
          />
        )}
      </For>
    </div>
  );
}
