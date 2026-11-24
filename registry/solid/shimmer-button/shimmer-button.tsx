import { animate } from "motion";
import { Show, createSignal, onCleanup } from "solid-js";
import type { JSX } from "solid-js";

export type ShimmerButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  shimmerColor?: string;
  shimmerDuration?: number;
  shimmerDelay?: number;
  shimmer?: boolean;
  tapScale?: number;
};

export function ShimmerButton(props: ShimmerButtonProps) {
  let button: HTMLButtonElement | undefined;
  let beam: HTMLSpanElement | undefined;
  const [run, setRun] = createSignal(0);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  onCleanup(() => clearTimeout(timer));

  const play = (delay = props.shimmerDelay ?? 60) => {
    if (props.shimmer === false || reduce()) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      setRun((current) => current + 1);
      if (!beam) return;
      animate(
        beam,
        { x: ["-180%", "260%"], skewX: -14, opacity: [0, 1, 1, 0] },
        {
          duration: (props.shimmerDuration ?? 900) / 1000,
          ease: [0.33, 0, 0.2, 1],
          times: [0, 0.16, 0.72, 1],
        },
      );
    }, delay);
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
      type={props.type ?? "button"}
      data-slot="shimmer-button"
      class={`relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${props.class ?? ""}`}
      onPointerEnter={(event) => {
        if (typeof props.onPointerEnter === "function") props.onPointerEnter(event);
        if (event.pointerType !== "touch") play();
      }}
      onClick={(event) => {
        if (typeof props.onClick === "function") props.onClick(event);
        play(0);
      }}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
    >
      <Show when={run() > 0}>
        <span
          ref={beam}
          aria-hidden="true"
          data-slot="shimmer-button-beam"
          class="pointer-events-none absolute inset-y-0 left-0 z-0 w-[52%] opacity-0"
          style={{
            background: `linear-gradient(105deg, transparent 0%, ${props.shimmerColor ?? "color-mix(in oklab, var(--primary-foreground) 55%, transparent)"} 50%, transparent 100%)`,
          }}
        />
      </Show>
      <span class="relative z-10 inline-flex items-center gap-2">{props.children}</span>
    </button>
  );
}
