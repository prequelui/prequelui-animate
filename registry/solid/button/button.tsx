import { animate } from "motion";
import type { JSX } from "solid-js";

export type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  hoverScale?: number;
  tapScale?: number;
};

export function Button(props: ButtonProps) {
  let node: HTMLButtonElement | undefined;
  let hovered = false;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const move = (scale: number) => {
    if (!node || reduce()) return;
    animate(
      node,
      { scale },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  return (
    <button
      {...props}
      ref={node}
      data-slot="button"
      type={props.type ?? "button"}
      class={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${props.class ?? ""}`}
      onPointerDown={() => !props.disabled && move(props.tapScale ?? 0.97)}
      onPointerUp={() => move(hovered && (props.hoverScale ?? 1) !== 1 ? props.hoverScale! : 1)}
      onPointerEnter={() => {
        hovered = true;
        if ((props.hoverScale ?? 1) !== 1) move(props.hoverScale!);
      }}
      onPointerLeave={() => {
        hovered = false;
        move(1);
      }}
    >
      {props.children}
    </button>
  );
}
