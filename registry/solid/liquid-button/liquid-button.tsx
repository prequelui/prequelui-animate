import { animate } from "motion";
import { createSignal } from "solid-js";
import type { JSX } from "solid-js";

export type LiquidButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  delay?: string;
  fillHeight?: string;
  hoverScale?: number;
  tapScale?: number;
};

export function LiquidButton(props: LiquidButtonProps) {
  let button: HTMLButtonElement | undefined;
  let fill: HTMLSpanElement | undefined;
  const [hovered, setHovered] = createSignal(false);
  const seconds = Number.parseFloat(props.delay ?? "0.3s") || 0.3;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const paint = (next: boolean) => {
    setHovered(next);
    if (!fill) return;
    const active = next && !reduce();
    animate(
      fill,
      { scaleY: active ? 1 : 0.06, opacity: active ? 1 : 0.55 },
      reduce() ? { duration: 0 } : { duration: seconds, ease: [0.25, 0.1, 0.35, 1] },
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
      { scale: hovered() && (props.hoverScale ?? 1) !== 1 ? props.hoverScale! : 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  return (
    <button
      {...props}
      ref={button}
      type="button"
      data-slot="liquid-button"
      class={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-background px-4 text-[13px] font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${props.class ?? ""}`}
      onPointerEnter={() => {
        paint(true);
        if (!button || reduce() || (props.hoverScale ?? 1) === 1) return;
        animate(
          button,
          { scale: props.hoverScale! },
          { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
        );
      }}
      onPointerLeave={() => {
        paint(false);
        release();
      }}
      onFocus={() => paint(true)}
      onBlur={() => paint(false)}
      onPointerDown={press}
      onPointerUp={release}
    >
      <span
        ref={fill}
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 bottom-0 origin-bottom bg-primary"
        style={{ height: hovered() ? "100%" : props.fillHeight ?? "3px", opacity: 0.55 }}
      />
      <span
        class={`relative z-10 transition-colors ${hovered() && !reduce() ? "text-primary-foreground" : "text-foreground"}`}
        style={{ "transition-duration": `${seconds}s` }}
      >
        {props.children}
      </span>
    </button>
  );
}
