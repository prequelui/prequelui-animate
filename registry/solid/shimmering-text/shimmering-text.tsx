import { animate } from "motion";
import { For, onCleanup, onMount } from "solid-js";

export type ShimmeringTextProps = {
  text: string;
  duration?: number;
  wave?: boolean;
  color?: string;
  shimmeringColor?: string;
  class?: string;
};

export function ShimmeringText(props: ShimmeringTextProps) {
  let root: HTMLSpanElement | undefined;
  let track: HTMLSpanElement | undefined;
  const controls: Array<{ stop?: () => void }> = [];
  let observer: IntersectionObserver | undefined;
  const chars = () => Array.from(props.text ?? "");
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = () => {
    if (reduce() || !track) return;
    const nodes = Array.from(track.children);
    const duration = props.duration ?? 1;
    nodes.forEach((node, index) => {
      controls.push(
        animate(
          node,
          {
            ...(props.wave
              ? { x: [0, 5, 0], y: [0, -5, 0], scale: [1, 1.1, 1], rotateY: [0, 15, 0] }
              : {}),
            opacity: [1, 0.35, 1],
          },
          {
            duration,
            repeat: Infinity,
            repeatDelay: nodes.length * 0.05,
            delay: (index * duration) / Math.max(1, nodes.length),
            ease: "easeInOut",
          },
        ),
      );
    });
  };

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      play();
      observer?.disconnect();
    });
    if (root) observer.observe(root);
  });

  onCleanup(() => {
    observer?.disconnect();
    controls.forEach((control) => control.stop?.());
  });

  return (
    <span
      ref={root}
      data-slot="shimmering-text"
      class={`relative inline-block ${props.class ?? ""}`}
      style={{
        "--shimmer-color": props.shimmeringColor ?? "var(--foreground)",
        "--shimmer-base": props.color ?? "var(--muted-foreground)",
        color: props.color ?? "var(--muted-foreground)",
        perspective: "500px",
      }}
    >
      <span class="sr-only">{props.text}</span>
      <span ref={track} aria-hidden="true" class="inline-block" style={{ perspective: "inherit" }}>
        <For each={chars()}>
          {(char) => (
            <span class="inline-block whitespace-pre" style={{ "transform-style": "preserve-3d" }}>
              {char}
            </span>
          )}
        </For>
      </span>
    </span>
  );
}
