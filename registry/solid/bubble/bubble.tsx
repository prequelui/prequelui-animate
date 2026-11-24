import { createEffect, createMemo, createSignal, createUniqueId, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type BubbleColors = {
  first?: string;
  second?: string;
  third?: string;
  fourth?: string;
  fifth?: string;
  sixth?: string;
};

export type BubbleProps = {
  interactive?: boolean;
  speed?: number;
  paused?: boolean;
  colors?: BubbleColors;
  transition?: Record<string, unknown>;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const DEFAULTS: Required<BubbleColors> = {
  first: "#6366f1",
  second: "#a855f7",
  third: "#22d3ee",
  fourth: "#f472b6",
  fifth: "#f59e0b",
  sixth: "#34d399",
};

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Bubble(props: BubbleProps) {
  let root: HTMLDivElement | undefined;
  let blobOne: HTMLDivElement | undefined;
  let blobTwo: HTMLDivElement | undefined;
  let blobThree: HTMLDivElement | undefined;
  let blobFour: HTMLDivElement | undefined;
  let blobFive: HTMLDivElement | undefined;
  let blobSix: HTMLDivElement | undefined;

  const filterId = `bubble-goo-${createUniqueId().replace(/[^a-zA-Z0-9-]/g, "")}`;

  const [inView, setInView] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [reduce, setReduce] = createSignal(false);

  const palette = createMemo(() => ({ ...DEFAULTS, ...(props.colors ?? {}) }));
  const rate = createMemo(() => Math.max(0.2, props.speed ?? 1));
  const playing = createMemo(
    () => inView() && pageVisible() && !reduce() && !(props.paused ?? false),
  );

  let observer: IntersectionObserver | undefined;
  let controls: Array<ReturnType<typeof animate>> = [];
  let follow: ReturnType<typeof animate> | undefined;
  const pointer = { x: 0, y: 0 };

  const background = (name: keyof BubbleColors) =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-${name}) 80%, transparent) 0%, transparent 58%)`;

  const stopLoops = () => {
    for (const control of controls) control?.stop?.();
    controls = [];
  };

  const snap = (element: HTMLElement | undefined, values: Record<string, number>) => {
    if (!element) return;
    controls.push(animate(element, values, { duration: 0 }));
  };

  const start = () => {
    stopLoops();
    if (!playing()) {
      snap(blobOne, { y: -46 });
      snap(blobTwo, { rotate: reduce() ? 90 : 0 });
      snap(blobThree, { rotate: reduce() ? 180 : 0 });
      snap(blobFour, { x: -46 });
      snap(blobFive, { rotate: reduce() ? 45 : 0 });
      return;
    }

    const base = props.transition ?? {};
    const duration = rate();

    controls.push(
      animate(
        blobOne!,
        { y: [-46, 46, -46] },
        { duration: 30 / duration, ease: "easeInOut", repeat: Infinity, ...base } as Parameters<typeof animate>[2],
      ),
    );
    controls.push(
      animate(
        blobTwo!,
        { rotate: [0, 360] },
        { duration: 20 / duration, ease: "linear", repeat: Infinity, ...base } as Parameters<typeof animate>[2],
      ),
    );
    controls.push(
      animate(
        blobThree!,
        { rotate: [0, -360] },
        { duration: 40 / duration, ease: "linear", repeat: Infinity, ...base } as Parameters<typeof animate>[2],
      ),
    );
    controls.push(
      animate(
        blobFour!,
        { x: [-46, 46, -46] },
        { duration: 40 / duration, ease: "easeInOut", repeat: Infinity, ...base } as Parameters<typeof animate>[2],
      ),
    );
    controls.push(
      animate(
        blobFive!,
        { rotate: [0, 360] },
        { duration: 24 / duration, ease: "linear", repeat: Infinity, ...base } as Parameters<typeof animate>[2],
      ),
    );
  };

  const applyPointer = () => {
    if (!blobSix) return;
    blobSix.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!(props.interactive ?? false) || reduce() || !root) return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    follow?.stop?.();
    follow = animate(
      pointer,
      { x, y },
      {
        type: "spring",
        stiffness: 100,
        damping: 20,
        onUpdate: applyPointer,
      } as Parameters<typeof animate>[2],
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
      stopLoops();
      follow?.stop?.();
    });
  });

  createEffect(() => {
    playing();
    rate();
    props.transition;
    start();
  });

  return (
    <div
      ref={root}
      data-slot="bubble-background"
      class={`relative size-full overflow-hidden bg-[linear-gradient(135deg,#12111a,#1d1830_45%,#0f172a)] ${props.class ?? ""}`}
      style={{
        "--bubble-first": palette().first,
        "--bubble-second": palette().second,
        "--bubble-third": palette().third,
        "--bubble-fourth": palette().fourth,
        "--bubble-fifth": palette().fifth,
        "--bubble-sixth": palette().sixth,
        ...(props.style ?? {}),
      }}
      onPointerMove={onPointerMove}
    >
      <svg aria-hidden="true" class="pointer-events-none absolute size-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0"
        style={{ filter: `url(#${filterId}) blur(38px)` }}
      >
        <div
          ref={blobOne}
          class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-90 mix-blend-hard-light"
          style={{ background: background("first"), "will-change": "transform" }}
        />
        <div
          ref={blobTwo}
          class="absolute inset-0 flex origin-[calc(50%-380px)] items-center justify-center"
        >
          <div
            class="size-[80%] rounded-full mix-blend-hard-light"
            style={{ background: background("second") }}
          />
        </div>
        <div
          ref={blobThree}
          class="absolute inset-0 flex origin-[calc(50%+400px)] items-center justify-center"
        >
          <div
            class="absolute left-[calc(50%-460px)] top-[calc(50%+180px)] size-[80%] rounded-full mix-blend-hard-light"
            style={{ background: background("third") }}
          />
        </div>
        <div
          ref={blobFour}
          class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-70 mix-blend-hard-light"
          style={{ background: background("fourth"), "will-change": "transform" }}
        />
        <div
          ref={blobFive}
          class="absolute inset-0 flex origin-[calc(50%-760px)_calc(50%+180px)] items-center justify-center"
        >
          <div
            class="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 mix-blend-hard-light"
            style={{ background: background("fifth") }}
          />
        </div>
        {props.interactive ? (
          <div
            ref={blobSix}
            class="absolute size-full rounded-full opacity-70 mix-blend-hard-light"
            style={{ background: background("sixth"), "will-change": "transform" }}
          />
        ) : null}
      </div>

      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,4,8,0.55))]" />
      {props.children}
    </div>
  );
}
