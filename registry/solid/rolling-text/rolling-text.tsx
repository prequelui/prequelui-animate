import {
  For,
  createEffect,
  createMemo,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import { animate } from "motion";

export type RollingTextTransition = {
  type?: "spring" | "tween" | "inertia" | "keyframes";
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  delay?: number;
  ease?: string | number[];
};

export type RollingTextProps = {
  text: string;
  transition?: RollingTextTransition;
  delay?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  class?: string;
};

type Char = { key: string; label: string; delay: number };

type Word =
  | { key: string; space: true; part: string }
  | { key: string; space: false; chars: Char[] };

const DEFAULT_TWEEN: RollingTextTransition = {
  duration: 0.5,
  delay: 0.1,
  ease: [0.23, 1, 0.32, 1],
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function splitGraphemes(value: string) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (entry) => entry.segment);
  }
  return Array.from(value);
}

export function RollingText(props: RollingTextProps) {
  let root: HTMLSpanElement | undefined;
  let observer: IntersectionObserver | undefined;
  let played = false;
  const controls: Array<ReturnType<typeof animate>> = [];

  const tween = () => props.transition ?? DEFAULT_TWEEN;
  const step = () => Number(tween().delay ?? 0);

  const words = createMemo<Word[]>(() => {
    let charIndex = 0;
    return props.text
      .split(/(\s+)/)
      .filter(Boolean)
      .map((part, index) => {
        if (/^\s+$/.test(part)) {
          return { key: `space-${index}`, space: true as const, part };
        }
        return {
          key: `word-${index}`,
          space: false as const,
          chars: splitGraphemes(part).map((label, offset) => {
            const delay = (props.delay ?? 0) / 1000 + charIndex * step();
            charIndex += 1;
            return { key: `char-${index}-${offset}`, label, delay };
          }),
        };
      });
  });

  const stop = () => {
    while (controls.length) controls.pop()?.stop?.();
  };

  const reset = () => {
    if (!root) return;
    stop();
    for (const node of root.querySelectorAll<HTMLElement>("[data-char-top]")) {
      node.style.transform = "rotateX(0deg)";
      node.style.opacity = "";
    }
    for (const node of root.querySelectorAll<HTMLElement>("[data-char-bottom]")) {
      node.style.transform = "rotateX(90deg)";
      node.style.opacity = "";
    }
  };

  const play = () => {
    if (!root || played) return;
    const still = reduce();
    played = true;

    if (still) {
      for (const node of root.querySelectorAll<HTMLElement>("[data-char-top]")) {
        node.style.transform = "rotateX(90deg)";
      }
      for (const node of root.querySelectorAll<HTMLElement>("[data-char-bottom]")) {
        node.style.transform = "rotateX(0deg)";
      }
      return;
    }

    const base = { ...tween(), ease: tween().ease ?? [0.23, 1, 0.32, 1] };
    for (const node of root.querySelectorAll<HTMLElement>("[data-roll]")) {
      const delay = Number(node.dataset.delay ?? 0);
      const top = node.querySelector<HTMLElement>("[data-char-top]");
      const bottom = node.querySelector<HTMLElement>("[data-char-bottom]");
      if (top) {
        controls.push(
          animate(top, { rotateX: [0, 90] }, { ...base, delay }),
        );
      }
      if (bottom) {
        controls.push(
          animate(bottom, { rotateX: [90, 0] }, { ...base, delay: delay + 0.3 }),
        );
      }
    }
  };

  onMount(() => {
    if (!props.inView) {
      play();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        play();
        if (props.inViewOnce !== false) observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
  });

  createEffect(
    on(
      () => props.text,
      () => {
        played = false;
        reset();
        queueMicrotask(play);
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    observer?.disconnect();
    stop();
  });

  return (
    <span
      ref={(node: HTMLSpanElement) => (root = node)}
      data-slot="rolling-text"
      class={`inline ${props.class ?? ""}`}
    >
      <span aria-hidden="true">
        <For each={words()}>
          {(word) => (
            <>
              {word.space ? (
                <span>{word.part}</span>
              ) : (
                <span class="inline-block whitespace-nowrap">
                  <For each={word.chars}>
                    {(char) => (
                      <span
                        data-roll
                        data-delay={char.delay}
                        class="relative inline-block"
                        style={{
                          perspective: "9999999px",
                          "transform-style": "preserve-3d",
                        }}
                      >
                        <span
                          data-char-top
                          aria-hidden="true"
                          class="absolute inline-block"
                          style={{
                            "backface-visibility": "hidden",
                            "transform-origin": "50% 25%",
                            transform: "rotateX(0deg)",
                          }}
                        >
                          {char.label === " " ? "\u00A0" : char.label}
                        </span>
                        <span
                          data-char-bottom
                          aria-hidden="true"
                          class="absolute inline-block"
                          style={{
                            "backface-visibility": "hidden",
                            "transform-origin": "50% 100%",
                            transform: "rotateX(90deg)",
                          }}
                        >
                          {char.label === " " ? "\u00A0" : char.label}
                        </span>
                        <span class="invisible">
                          {char.label === " " ? "\u00A0" : char.label}
                        </span>
                      </span>
                    )}
                  </For>
                </span>
              )}
            </>
          )}
        </For>
      </span>
      <span class="sr-only">{props.text}</span>
    </span>
  );
}
