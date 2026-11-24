import { animate } from "motion";
import { createEffect, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

export type PageTransitionProps = {
  pageKey: string | number;
  duration?: number;
  from?: "top" | "bottom" | "left" | "right";
  fade?: boolean;
  class?: string;
  children?: JSX.Element;
};

export function PageTransition(props: PageTransitionProps) {
  let root: HTMLDivElement | undefined;
  let controls: { stop?: () => void } | undefined;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const hiddenClip = () => {
    switch (props.from) {
      case "bottom":
        return "inset(100% 0 0 0)";
      case "left":
        return "inset(0 100% 0 0)";
      case "right":
        return "inset(0 0 0 100%)";
      default:
        return "inset(0 0 100% 0)";
    }
  };

  const play = () => {
    if (!root) return;
    controls?.stop?.();
    if (reduce()) {
      controls = animate(
        root,
        { opacity: [0, 1] },
        { duration: 0.2, ease: [0.77, 0, 0.175, 1] },
      );
      return;
    }
    controls = animate(
      root,
      {
        clipPath: [hiddenClip(), "inset(0 0 0% 0)"],
        opacity: props.fade === false ? 1 : [0.6, 1],
      },
      { duration: props.duration ?? 0.55, ease: [0.77, 0, 0.175, 1] },
    );
  };

  onMount(play);
  createEffect(on(() => props.pageKey, play, { defer: true }));
  onCleanup(() => controls?.stop?.());

  return (
    <div
      ref={root}
      data-slot="page-transition"
      class={`min-w-0 ${props.class ?? ""}`}
    >
      {props.children}
    </div>
  );
}
