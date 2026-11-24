import { animate } from "motion";
import { For, createSignal } from "solid-js";
import type { JSX } from "solid-js";

export type IconButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: number;
  count?: number;
  distance?: number;
};

export function IconButton(props: IconButtonProps) {
  let button: HTMLButtonElement | undefined;
  let particles: HTMLSpanElement | undefined;
  const [bursts, setBursts] = createSignal(0);
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const burst = (event: MouseEvent) => {
    if (typeof props.onClick === "function") props.onClick(event);
    if (reduce()) return;
    setBursts((current) => current + 1);
    const nodes = particles ? Array.from(particles.children) : [];
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      animate(
        node,
        {
          opacity: [1, 0],
          x: [0, Math.cos(angle) * (props.distance ?? 24)],
          y: [0, Math.sin(angle) * (props.distance ?? 24)],
          scale: [1, 0.2],
        },
        { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
      );
    });
  };

  const press = () => {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: 0.97 },
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
      data-slot="icon-button"
      class={`relative inline-flex size-10 items-center justify-center rounded-lg border bg-background p-0 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${props.class ?? ""}`}
      onPointerDown={press}
      onPointerUp={release}
      onPointerLeave={release}
      onClick={burst}
    >
      {props.children}
      <span
        ref={particles}
        data-slot="icon-button-particles"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0"
      >
        <For each={Array.from({ length: props.count ?? 8 })}>
          {() => (
            <span
              class="absolute left-1/2 top-1/2 rounded-full bg-current opacity-0"
              style={{
                width: `${props.size ?? 4}px`,
                height: `${props.size ?? 4}px`,
              }}
            />
          )}
        </For>
      </span>
    </button>
  );
}
