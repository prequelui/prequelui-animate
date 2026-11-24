import { For, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

export type MarqueeProps = {
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  fade?: boolean;
  gap?: number;
  repeat?: number;
  itemClassName?: string;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Marquee(props: MarqueeProps) {
  let root: HTMLDivElement | undefined;
  let track: HTMLDivElement | undefined;
  let first: HTMLDivElement | undefined;
  let observer: ResizeObserver | undefined;
  let mutation: MutationObserver | undefined;
  let raf = 0;
  let last = 0;
  let position = 0;
  let span = 0;

  const [paused, setPaused] = createSignal(false);
  const [ready, setReady] = createSignal(false);
  const extras: HTMLDivElement[] = [];

  const copies = createMemo(() => Math.max(2, Math.round(props.repeat ?? 2)));
  const gap = () => props.gap ?? 32;

  const apply = () => {
    if (track) track.style.transform = `translate3d(${position}px, 0, 0)`;
  };

  const cloneContent = () => {
    if (!first) return;
    for (const node of extras) {
      node.replaceChildren();
      for (const child of Array.from(first.childNodes)) {
        node.appendChild(child.cloneNode(true));
      }
    }
  };

  const measure = () => {
    if (!first) return;
    cloneContent();
    const width = first.scrollWidth + gap();
    span = width;
    if (props.reverse) position = -width;
    setReady(width > 0);
    apply();
  };

  const tick = (now: number) => {
    if (!last) last = now;
    const delta = Math.min(now - last, 64);
    last = now;
    const speed = props.speed ?? 42;

    if (!reduce() && !paused() && ready() && speed > 0) {
      const direction = props.reverse ? 1 : -1;
      let next = position + (direction * speed * delta) / 1000;
      if (span > 0) {
        if (!props.reverse && next <= -span) next += span;
        if (props.reverse && next >= 0) next -= span;
        position = next;
        apply();
      }
    }

    raf = requestAnimationFrame(tick);
  };

  onMount(() => {
    measure();
    if (first) {
      observer = new ResizeObserver(measure);
      observer.observe(first);
      mutation = new MutationObserver(measure);
      mutation.observe(first, { childList: true, subtree: true, characterData: true });
    }
    raf = requestAnimationFrame(tick);
  });

  createEffect(
    on(
      () => [gap(), props.reverse, copies()],
      () => queueMicrotask(measure),
      { defer: true },
    ),
  );

  onCleanup(() => {
    if (typeof window === "undefined") return;
    cancelAnimationFrame(raf);
    observer?.disconnect();
    mutation?.disconnect();
  });

  const mask = () =>
    props.fade === false
      ? {}
      : {
          "mask-image":
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          "-webkit-mask-image":
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        };

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="marquee"
      class={`relative overflow-hidden ${props.class ?? ""}`}
      style={{ ...mask(), ...(props.style ?? {}) }}
      onPointerEnter={() => {
        if (props.pauseOnHover !== false) setPaused(true);
      }}
      onPointerLeave={() => {
        if (props.pauseOnHover !== false) setPaused(false);
      }}
    >
      <div
        ref={(node: HTMLDivElement) => (track = node)}
        class="flex w-max items-center will-change-transform"
        style={{ gap: `${gap()}px` }}
        data-paused={paused() ? "true" : undefined}
      >
        <div
          ref={(node: HTMLDivElement) => (first = node)}
          class={`flex shrink-0 items-center ${props.itemClassName ?? ""}`}
          style={{ gap: `${gap()}px` }}
        >
          {props.children}
        </div>
        <For each={Array.from({ length: Math.max(0, copies() - 1) }, (_, index) => index)}>
          {(_item: number, index: () => number) => (
            <div
              ref={(node: HTMLDivElement) => {
                extras[index()] = node;
              }}
              aria-hidden="true"
              class={`flex shrink-0 items-center ${props.itemClassName ?? ""}`}
              style={{ gap: `${gap()}px` }}
            />
          )}
        </For>
      </div>
    </div>
  );
}
