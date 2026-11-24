import { Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type ShineProps = {
  color?: string;
  opacity?: number;
  delay?: number;
  duration?: number;
  loop?: boolean;
  loopDelay?: number;
  deg?: number;
  enable?: boolean;
  enableOnHover?: boolean;
  enableOnTap?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function Shine(props: ShineProps) {
  let overlay: HTMLSpanElement | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let control: ReturnType<typeof animate> | undefined;

  const [run, setRun] = createSignal(0);
  const [hovered, setHovered] = createSignal(false);
  const [reduced, setReduced] = createSignal(false);

  const active = createMemo(() => props.enable !== false && !reduced());
  const alwaysOn = createMemo(
    () => active() && props.enableOnHover !== true && props.enableOnTap !== true,
  );

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };

  const play = () => setRun((value) => value + 1);

  const scheduleNext = () => {
    clearTimer();
    const on = alwaysOn() || (props.enableOnHover === true && hovered());
    if (!props.loop || !on) return;
    timer = setTimeout(play, props.loopDelay ?? 0);
  };

  const handleEnter = () => {
    if (!active() || props.enableOnHover !== true || alwaysOn()) return;
    setHovered(true);
    play();
  };

  const handleLeave = () => {
    if (!active() || props.enableOnHover !== true || alwaysOn()) return;
    setHovered(false);
    clearTimer();
  };

  const handleDown = () => {
    if (!active() || props.enableOnTap !== true || alwaysOn()) return;
    play();
  };

  createEffect(
    on(
      () => [alwaysOn(), props.loop, props.loopDelay],
      () => {
        clearTimer();
        setRun(alwaysOn() ? 1 : 0);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(run, async (value) => {
      if (!active() || value <= 0) return;
      await Promise.resolve();
      if (!overlay) return;
      control?.stop?.();
      control = animate(
        overlay,
        { x: ["-100%", "100%"], skewX: props.deg ?? -15 },
        {
          duration: (props.duration ?? 1200) / 1000,
          ease: [0.4, 0, 0.2, 1],
          delay: (props.delay ?? 0) / 1000,
        },
      );
      control.finished.then(scheduleNext, scheduleNext);
    }),
  );

  onMount(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setRun(alwaysOn() ? 1 : 0);
  });

  onCleanup(() => {
    clearTimer();
    control?.stop?.();
  });

  return (
    <div
      data-slot="shine"
      class={`relative overflow-hidden ${props.class ?? ""}`}
      style={props.style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onPointerDown={handleDown}
    >
      {props.children}
      <Show when={active() && run() > 0}>
        <span
          ref={(node: HTMLSpanElement) => (overlay = node)}
          aria-hidden="true"
          class="pointer-events-none absolute inset-0 z-10 block h-full w-full"
          style={{
            background: `linear-gradient(to right, transparent, ${props.color ?? "currentColor"}, transparent)`,
            opacity: props.opacity ?? 0.3,
          }}
        />
      </Show>
    </div>
  );
}
