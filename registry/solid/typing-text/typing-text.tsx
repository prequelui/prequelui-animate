import { animate } from "motion";
import { createMemo, createSignal, onCleanup, onMount } from "solid-js";

export type TypingTextProps = {
  text: string | string[];
  duration?: number;
  delay?: number;
  holdDelay?: number;
  loop?: boolean;
  inView?: boolean;
  inViewOnce?: boolean;
  class?: string;
};

export function TypingText(props: TypingTextProps) {
  let root: HTMLSpanElement | undefined;
  let cursor: HTMLSpanElement | undefined;
  const texts = Array.isArray(props.text) ? props.text : [props.text];
  const segments = texts.map((value) => Array.from(value));
  const [index, setIndex] = createSignal(0);
  const [count, setCount] = createSignal(0);
  const [phase, setPhase] = createSignal("typing");
  let ready = props.delay === 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let observer: IntersectionObserver | undefined;
  let cursorControl: { stop?: () => void } | undefined;
  let started = false;
  const visible = createMemo(() =>
    (segments[index()] ?? []).slice(0, count()).join(""),
  );
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const schedule = () => {
    clearTimeout(timer);
    if (reduce()) {
      const target = props.loop ? 0 : segments.length - 1;
      setIndex(target);
      setCount((segments[target] ?? []).length);
      setPhase("done");
      return;
    }
    if (!ready) {
      timer = setTimeout(() => {
        ready = true;
        schedule();
      }, props.delay ?? 0);
      return;
    }
    if (phase() === "done") return;
    const length = (segments[index()] ?? []).length;
    const isLast = index() === segments.length - 1;
    const duration = props.duration ?? 100;

    if (phase() === "typing") {
      if (count() < length) {
        timer = setTimeout(() => {
          setCount((value) => value + 1);
          schedule();
        }, duration);
      } else if (isLast && !props.loop) {
        setPhase("done");
      } else {
        setPhase("holding");
        timer = setTimeout(schedule, props.holdDelay ?? 1000);
      }
    } else if (phase() === "holding") {
      setPhase("erasing");
      timer = setTimeout(schedule, Math.max(60, duration));
    } else if (phase() === "erasing") {
      if (count() > 0) {
        timer = setTimeout(() => {
          setCount((value) => value - 1);
          schedule();
        }, Math.max(40, duration * 0.55));
      } else {
        setIndex(isLast ? 0 : index() + 1);
        setCount(0);
        setPhase("typing");
        timer = setTimeout(schedule, Math.max(120, duration));
      }
    }
  };

  const start = () => {
    if (started) return;
    started = true;
    if (cursor && !reduce()) {
      cursorControl = animate(
        cursor,
        { opacity: [1, 1, 0, 0] },
        { duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] },
      );
    }
    schedule();
  };

  onMount(() => {
    if (!props.inView) {
      start();
      return;
    }
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      start();
      if (props.inViewOnce !== false) observer?.disconnect();
    });
    if (root) observer.observe(root);
  });

  onCleanup(() => {
    clearTimeout(timer);
    observer?.disconnect();
    cursorControl?.stop?.();
  });

  return (
    <span
      ref={root}
      data-slot="typing-text"
      class={`inline ${props.class ?? ""}`}
    >
      <span class="sr-only">{texts.join(", ")}</span>
      <span aria-hidden="true">{visible()}</span>
      <span
        ref={cursor}
        aria-hidden="true"
        data-slot="typing-text-cursor"
        class="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-foreground"
      />
    </span>
  );
}
