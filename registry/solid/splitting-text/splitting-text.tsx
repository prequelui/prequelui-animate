import { animate } from "motion";
import { For, Show, createMemo, onCleanup, onMount } from "solid-js";

export type SplittingTextProps = {
  text: string | string[];
  type?: "chars" | "words" | "lines";
  delay?: number;
  stagger?: number;
  disableAnimation?: boolean;
  inView?: boolean;
  inViewOnce?: boolean;
  class?: string;
};

export function SplittingText(props: SplittingTextProps) {
  let root: HTMLSpanElement | undefined;
  const controls: Array<{ stop?: () => void }> = [];
  let observer: IntersectionObserver | undefined;
  let played = false;
  const lines = createMemo(() => (Array.isArray(props.text) ? props.text : []));
  const words = createMemo(() =>
    Array.isArray(props.text) ? [] : (props.text.match(/\S+/g) ?? []),
  );
  const chars = createMemo(() => (Array.isArray(props.text) ? [] : Array.from(props.text)));
  const label = createMemo(() =>
    Array.isArray(props.text) ? props.text.join(" ") : props.text,
  );
  const gap = createMemo(
    () =>
      props.stagger ||
      (props.type === "words" ? 0.2 : props.type === "lines" ? 0.3 : 0.05),
  );
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const play = () => {
    if (played || !root) return;
    played = true;
    const still = props.disableAnimation || reduce();
    const nodes = Array.from(root.querySelectorAll<HTMLElement>("[data-piece]"));
    nodes.forEach((node, index) => {
      if (still) {
        node.style.opacity = "1";
        node.style.transform = "none";
        return;
      }
      controls.push(
        animate(
          node,
          { x: [150, 0], opacity: [0, 1] },
          {
            duration: 0.7,
            ease: [0.23, 1, 0.32, 1],
            delay: (props.delay ?? 0) / 1000 + index * gap(),
          },
        ),
      );
    });
  };

  onMount(() => {
    if (!props.inView) {
      play();
      return;
    }
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      play();
      if (props.inViewOnce !== false) observer?.disconnect();
    });
    if (root) observer.observe(root);
  });

  onCleanup(() => {
    observer?.disconnect();
    controls.forEach((control) => control.stop?.());
  });

  return (
    <span ref={root} data-slot="splitting-text" class={`inline ${props.class ?? ""}`}>
      <span aria-hidden="true">
        <Show when={lines().length} fallback={
          <Show when={props.type === "words"} fallback={
            <For each={chars()}>
              {(char) => (
                <span
                  data-piece
                  class="inline-block whitespace-pre will-change-transform"
                  style={{ opacity: 0 }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              )}
            </For>
          }>
            <For each={words()}>
              {(word, index) => (
                <>
                  <span
                    data-piece
                    class="inline-block will-change-transform"
                    style={{ opacity: 0 }}
                  >
                    {word}
                  </span>
                  {index() < words().length - 1 ? " " : ""}
                </>
              )}
            </For>
          </Show>
        }>
          <For each={lines()}>
            {(line, index) => (
              <>
                <span
                  data-piece
                  class="inline-block will-change-transform"
                  style={{ opacity: 0 }}
                >
                  {line}
                </span>
                {index() < lines().length - 1 ? <br /> : null}
              </>
            )}
          </For>
        </Show>
      </span>
      <span class="sr-only">{label()}</span>
    </span>
  );
}
