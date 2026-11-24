import { animate } from "motion";
import type { JSX } from "solid-js";

export type SpringProps = {
  stiffness?: number;
  damping?: number;
  elastic?: number;
  snapBack?: boolean;
  pressScale?: number;
  class?: string;
  children?: JSX.Element;
};

export function Spring(props: SpringProps) {
  let root: HTMLDivElement | undefined;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;
  const pressScale = () => props.pressScale ?? 1.06;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const down = (event: PointerEvent) => {
    if (reduce() || !root || event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    lastX = 0;
    lastY = 0;
    root.setPointerCapture?.(event.pointerId);
    root.style.cursor = "grabbing";
    animate(
      root,
      { scale: pressScale() },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  const move = (event: PointerEvent) => {
    if (!dragging || !root) return;
    lastX = (event.clientX - startX) * (props.elastic ?? 0.7);
    lastY = (event.clientY - startY) * (props.elastic ?? 0.7);
    root.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) scale(${pressScale()})`;
  };

  const up = () => {
    if (!dragging || !root) return;
    dragging = false;
    root.style.cursor = "grab";
    if (props.snapBack === false) return;
    animate(
      root,
      { x: [lastX, 0], y: [lastY, 0], scale: 1 },
      {
        type: "spring",
        stiffness: props.stiffness ?? 200,
        damping: props.damping ?? 16,
      },
    ).finished.then(() => {
      if (root) root.style.transform = "none";
    });
  };

  return (
    <div
      ref={root}
      data-slot="spring"
      class={`cursor-grab touch-none select-none active:cursor-grabbing ${props.class ?? ""}`}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
    >
      {props.children}
    </div>
  );
}
