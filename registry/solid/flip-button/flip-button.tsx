import { animate } from "motion";
import { createMemo, createSignal } from "solid-js";
import type { JSX } from "solid-js";

export type FlipButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  from?: "top" | "bottom" | "left" | "right";
  tapScale?: number;
  back?: JSX.Element;
};

export function FlipButton(props: FlipButtonProps) {
  let button: HTMLButtonElement | undefined;
  let frontEl: HTMLSpanElement | undefined;
  let backEl: HTMLSpanElement | undefined;
  const [hovered, setHovered] = createSignal(false);
  const vertical = createMemo(() => props.from === "top" || props.from === "bottom");
  const axis = createMemo(() => (vertical() ? "rotateX" : "rotateY"));
  const frontSide = createMemo(() => props.from === "top" || props.from === "left");
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const place = (
    element: HTMLElement | undefined,
    rotate: number,
    offset: string,
    opacity: number,
  ) => {
    if (!element) return;
    const transform: Record<string, string | number> = {
      [axis()]: rotate,
      [vertical() ? "y" : "x"]: offset,
      opacity,
    };
    animate(
      element,
      transform,
      reduce()
        ? { duration: 0 }
        : { type: "spring", stiffness: 280, damping: 20 },
    );
  };

  const apply = (next: boolean) => {
    setHovered(next);
    const active = next && !reduce();
    const outward = frontSide() ? "50%" : "-50%";
    place(frontEl, active ? 90 : 0, active ? outward : "0%", active ? 0 : 1);
    place(
      backEl,
      active ? 0 : 90,
      active ? "0%" : frontSide() ? "-50%" : "50%",
      active ? 1 : 0,
    );
  };

  const press = () => {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: props.tapScale ?? 0.97 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  const release = () => {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  return (
    <button
      {...props}
      ref={button}
      type="button"
      data-slot="flip-button"
      data-from={props.from ?? "top"}
      class={`inline-grid place-items-center rounded-lg text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${props.class ?? ""}`}
      style={{ perspective: "1000px", ...(props.style ?? {}) }}
      onPointerDown={press}
      onPointerUp={release}
      onPointerEnter={() => apply(true)}
      onPointerLeave={() => {
        release();
        apply(false);
      }}
    >
      <span
        ref={frontEl}
        data-slot="flip-button-front"
        class="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-primary-foreground"
        style={{ "grid-area": "1 / 1" }}
      >
        {props.children}
      </span>
      <span
        ref={backEl}
        aria-hidden="true"
        data-slot="flip-button-back"
        class="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-4 text-secondary-foreground"
        style={{ "grid-area": "1 / 1", opacity: hovered() ? 1 : 0 }}
      >
        {props.back ?? props.children}
      </span>
    </button>
  );
}
