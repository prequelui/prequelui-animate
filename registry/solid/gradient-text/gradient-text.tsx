import { animate } from "motion";
import { Show, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

export type GradientTextProps = {
  text: string;
  gradient?: string;
  neon?: boolean;
  class?: string;
};

export function GradientText(props: GradientTextProps) {
  let root: HTMLSpanElement | undefined;
  let layer: HTMLSpanElement | undefined;
  let glow: HTMLSpanElement | undefined;
  const controls: Array<{ stop?: () => void }> = [];
  let observer: IntersectionObserver | undefined;

  const gradient = () =>
    props.gradient ??
    "linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)";
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = () => {
    if (reduce()) return;
    for (const node of [layer, glow]) {
      if (!node) continue;
      controls.push(
        animate(
          node,
          { backgroundPosition: ["0% 0%", "500% 100%"] },
          { duration: 50, repeat: Infinity, ease: "linear" },
        ),
      );
    }
  };

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play();
        observer?.disconnect();
      }
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
      data-slot="gradient-text"
      class={`relative inline-block ${props.class ?? ""}`}
    >
      <span
        ref={layer}
        class="inline-block bg-clip-text text-transparent"
        style={{ "background-image": gradient(), "background-size": "700% 100%" }}
      >
        {props.text}
      </span>
      <Show when={props.neon}>
        <span
          ref={glow}
          aria-hidden="true"
          class="absolute inset-0 inline-block bg-clip-text text-transparent"
          style={{
            "background-image": gradient(),
            "background-size": "700% 100%",
            "mix-blend-mode": "plus-lighter",
            filter: "blur(8px)",
          }}
        >
          {props.text}
        </span>
      </Show>
    </span>
  );
}
