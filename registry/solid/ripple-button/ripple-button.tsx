import { animate } from "motion";
import { For, createSignal } from "solid-js";
import type { JSX } from "solid-js";

type Ripple = { id: number; x: number; y: number };

export type RippleButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
  hoverScale?: number;
  tapScale?: number;
};

export function RippleButton(props: RippleButtonProps) {
  let button: HTMLButtonElement | undefined;
  const [ripples, setRipples] = createSignal<Ripple[]>([]);
  let nextId = 0;
  let hovered = false;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const click = (event: MouseEvent) => {
    if (typeof props.onClick === "function") props.onClick(event);
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const id = nextId++;
    setRipples((current) => [
      ...current,
      { id, x: event.clientX - rect.left, y: event.clientY - rect.top },
    ]);
    setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== id));
    }, 600);
  };

  const animateRipple = (node: HTMLSpanElement) => {
    if (reduce()) return;
    animate(
      node,
      { scale: [0, 10], opacity: [0.5, 0] },
      { duration: 0.6, ease: "easeOut" },
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
      { scale: hovered && (props.hoverScale ?? 1) !== 1 ? props.hoverScale! : 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  };

  return (
    <button
      {...props}
      ref={button}
      type={props.type ?? "button"}
      data-slot="ripple-button"
      class={`relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground ${props.class ?? ""}`}
      onClick={click}
      onPointerDown={press}
      onPointerUp={release}
      onPointerEnter={() => {
        hovered = true;
        if ((props.hoverScale ?? 1) !== 1) release();
      }}
      onPointerLeave={() => {
        hovered = false;
        release();
      }}
    >
      {props.children}
      <span aria-hidden="true" class="pointer-events-none absolute inset-0">
        <For each={ripples()}>
          {(ripple) => (
            <span
              ref={animateRipple}
              class="absolute size-5 rounded-full bg-current opacity-50"
              style={{ left: `${ripple.x - 10}px`, top: `${ripple.y - 10}px` }}
            />
          )}
        </For>
      </span>
    </button>
  );
}
