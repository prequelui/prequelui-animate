import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type GradientProps = {
  speed?: number;
  paused?: boolean;
  gradient?: string;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const DEFAULT_GRADIENT =
  "linear-gradient(120deg, #312e81 0%, #6d28d9 24%, #be185d 48%, #c2410c 72%, #0f766e 100%)";

export function Gradient(props: GradientProps) {
  let root: HTMLDivElement | undefined;
  let sheet: HTMLDivElement | undefined;
  let glowOne: HTMLDivElement | undefined;
  let glowTwo: HTMLDivElement | undefined;

  const [inView, setInView] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [reduce, setReduce] = createSignal(false);

  const duration = createMemo(() => 16 / Math.max(0.1, props.speed ?? 1));
  const playing = createMemo(
    () => inView() && pageVisible() && !reduce() && !(props.paused ?? false),
  );

  let observer: IntersectionObserver | undefined;
  let controls: Array<ReturnType<typeof animate>> = [];

  const stopControls = () => {
    for (const control of controls) control?.stop?.();
    controls = [];
  };

  const start = () => {
    stopControls();
    if (!sheet || !glowOne || !glowTwo) return;

    if (!playing()) {
      controls.push(
        animate(
          sheet,
          { backgroundPosition: reduce() ? "35% 50%" : "0% 50%" },
          { duration: 0 },
        ),
      );
      controls.push(animate(glowOne, { x: "-12%", y: "-8%" }, { duration: 0 }));
      controls.push(animate(glowTwo, { x: "10%", y: "12%" }, { duration: 0 }));
      return;
    }

    const span = duration();
    controls.push(
      animate(
        sheet,
        { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
        { duration: span, ease: "easeInOut", repeat: Infinity } as Parameters<typeof animate>[2],
      ),
    );
    controls.push(
      animate(
        glowOne,
        {
          x: ["-12%", "14%", "-12%"],
          y: ["-8%", "10%", "-8%"],
          scale: [1, 1.25, 1],
        },
        { duration: span * 1.6, ease: "easeInOut", repeat: Infinity } as Parameters<typeof animate>[2],
      ),
    );
    controls.push(
      animate(
        glowTwo,
        {
          x: ["10%", "-16%", "10%"],
          y: ["12%", "-10%", "12%"],
          scale: [1.1, 0.9, 1.1],
        },
        { duration: span * 2.1, ease: "easeInOut", repeat: Infinity } as Parameters<typeof animate>[2],
      ),
    );
  };

  onMount(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(media.matches);
    const onMedia = () => setReduce(media.matches);
    media.addEventListener?.("change", onMedia);

    setPageVisible(document.visibilityState !== "hidden");
    const onVisibility = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVisibility);

    observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0 },
    );
    if (root) observer.observe(root);

    onCleanup(() => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMedia);
      stopControls();
    });
  });

  createEffect(() => {
    playing();
    duration();
    start();
  });

  return (
    <div
      ref={root}
      data-slot="gradient-background"
      class={`relative size-full overflow-hidden bg-[#0a0910] ${props.class ?? ""}`}
      style={props.style}
    >
      <div
        ref={sheet}
        aria-hidden="true"
        class="absolute -inset-[35%] opacity-90 blur-[10px]"
        style={{
          "background-image": props.gradient ?? DEFAULT_GRADIENT,
          "background-size": "400% 400%",
          "background-position": reduce() ? "35% 50%" : undefined,
          "will-change": "background-position",
        }}
      />
      <div
        ref={glowOne}
        aria-hidden="true"
        class="absolute left-[8%] top-[4%] size-[70%] rounded-full opacity-70 blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(45,212,191,0.75), transparent 68%)",
          "will-change": "transform",
        }}
      />
      <div
        ref={glowTwo}
        aria-hidden="true"
        class="absolute bottom-[2%] right-[2%] size-[74%] rounded-full opacity-70 blur-[70px]"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.72), transparent 66%)",
          "will-change": "transform",
        }}
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(5,4,10,0.6))]"
      />
      {props.children}
    </div>
  );
}
