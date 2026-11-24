import { animate } from "motion";
import { Github, Star } from "lucide-solid";
import { For, createSignal, onCleanup, onMount } from "solid-js";

export type GitHubStarsButtonProps = {
  username?: string;
  repo?: string;
  value?: number;
  delay?: number;
  inView?: boolean;
  class?: string;
  onClick?: (event: MouseEvent) => void;
};

export function GitHubStarsButton(props: GitHubStarsButtonProps) {
  let root: HTMLButtonElement | undefined;
  let starEl: HTMLSpanElement | undefined;
  let particles: HTMLSpanElement | undefined;
  const [starred, setStarred] = createSignal(false);
  const [burst, setBurst] = createSignal(0);
  const initialReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [count, setCount] = createSignal(initialReduced ? (props.value ?? 0) : 0);
  let started = false;
  let observer: IntersectionObserver | undefined;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const startCount = () => {
    if (started) return;
    started = true;
    if (reduce()) {
      setCount(props.value ?? 0);
      return;
    }
    animate(0, props.value ?? 0, {
      type: "spring",
      stiffness: 90,
      damping: 50,
      delay: (props.delay ?? 0) / 1000,
      onUpdate: (latest) => setCount(Math.round(latest)),
    });
  };

  onMount(() => {
    if (!props.inView) {
      startCount();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startCount();
          observer?.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    if (root) observer.observe(root);
  });

  onCleanup(() => observer?.disconnect());

  const toggle = (event: MouseEvent) => {
    props.onClick?.(event);
    const next = !starred();
    setStarred(next);
    setCount((current) => current + (next ? 1 : -1));
    setBurst((current) => current + 1);
    if (reduce()) return;
    if (starEl) {
      animate(
        starEl,
        { scale: [1, 1.35, 1], rotate: [0, 12, 0] },
        { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
      );
    }
    const nodes = particles ? Array.from(particles.children) : [];
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      animate(
        node,
        {
          opacity: [1, 0],
          x: [0, Math.cos(angle) * 26],
          y: [0, Math.sin(angle) * 26],
          scale: [1, 0.35],
        },
        { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
      );
    });
  };

  return (
    <button
      ref={root}
      type="button"
      data-slot="github-stars-button"
      aria-label={`Star ${props.username ?? "prequelui"}/${props.repo ?? "prequelui-animate"} on GitHub`}
      class={`relative inline-flex h-9 items-center gap-2 overflow-visible rounded-lg border bg-background px-3 text-[13px] font-medium ${props.class ?? ""}`}
      onClick={toggle}
    >
      <Github class="size-4" aria-hidden="true" />
      <span>Star</span>
      <span class="h-4 w-px bg-border" aria-hidden="true" />
      <span class="relative flex items-center gap-1 tabular-nums text-muted-foreground">
        <span ref={starEl} class="inline-flex">
          <Star
            class={`size-3.5 transition-colors duration-300 ${starred() ? "fill-[#f5b301] text-[#f5b301]" : "text-muted-foreground"}`}
          />
        </span>
        {count().toLocaleString("en-US")}
      </span>
      <span
        ref={particles}
        class="pointer-events-none absolute right-3 top-1/2"
        aria-hidden="true"
      >
        <For each={Array.from({ length: 6 })}>
          {() => (
            <span class="absolute size-1 rounded-full bg-[#f5b301] opacity-0" />
          )}
        </For>
      </span>
    </button>
  );
}
