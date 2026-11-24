import { animate } from "motion";
import { onCleanup, onMount } from "solid-js";

export type HighlightTextProps = {
  text: string;
  delay?: number;
  color?: string;
  inView?: boolean;
  inViewOnce?: boolean;
  class?: string;
};

export function HighlightText(props: HighlightTextProps) {
  let root: HTMLSpanElement | undefined;
  const controls: Array<{ stop?: () => void }> = [];
  let observer: IntersectionObserver | undefined;
  let played = false;
  const color = () =>
    props.color ?? "color-mix(in oklab, #f5c542 38%, transparent)";
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = () => {
    if (played || !root) return;
    played = true;
    if (reduce()) {
      root.style.backgroundSize = "100% 100%";
      return;
    }
    controls.push(
      animate(
        root,
        { backgroundSize: ["0% 100%", "100% 100%"] },
        { duration: 2, ease: [0.42, 0, 0.58, 1], delay: (props.delay ?? 0) / 1000 },
      ),
    );
  };

  onMount(() => {
    if (!props.inView) {
      play();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          if (props.inViewOnce !== false) observer?.disconnect();
        } else if (props.inViewOnce === false) {
          played = false;
          if (root) root.style.backgroundSize = "0% 100%";
        }
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
  });

  onCleanup(() => {
    observer?.disconnect();
    controls.forEach((control) => control.stop?.());
  });

  return (
    <span
      ref={root}
      data-slot="highlight-text"
      class={`relative inline-block ${props.class ?? ""}`}
      style={{
        "background-image": `linear-gradient(${color()}, ${color()})`,
        "background-repeat": "no-repeat",
        "background-position": "left center",
        "background-size": "0% 100%",
      }}
    >
      {props.text}
    </span>
  );
}
