import { For, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type StarsProps = {
  speed?: number;
  paused?: boolean;
  starColor?: string;
  factor?: number;
  pointerEvents?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const LAYERS = [
  { count: 1100, size: 1, multiplier: 1, opacity: 0.55 },
  { count: 480, size: 2, multiplier: 2, opacity: 0.75 },
  { count: 220, size: 3, multiplier: 3, opacity: 0.95 },
];

function seeded(index: number, salt = 1) {
  const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function buildShadows(count: number, salt: number) {
  const shadows: string[] = [];
  for (let index = 0; index < count; index++) {
    const x = Math.round((seeded(index + salt * 1000, 1.7) - 0.5) * 2800);
    const y = Math.round((seeded(index + salt * 1000, 2.9) - 0.5) * 2800);
    shadows.push(`${x}px ${y}px`);
  }
  return shadows.join(",");
}

const LAYERS_WITH_SHADOWS = LAYERS.map((layer) => ({
  ...layer,
  shadows: buildShadows(layer.count, layer.multiplier),
}));

export function Stars(props: StarsProps) {
  let root: HTMLDivElement | undefined;
  let parallax: HTMLDivElement | undefined;
  const layerElements: Array<HTMLDivElement | undefined> = [];

  const [inView, setInView] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [reduce, setReduce] = createSignal(false);

  const playing = createMemo(
    () => inView() && pageVisible() && !reduce() && !(props.paused ?? false),
  );

  let observer: IntersectionObserver | undefined;
  let controls: Array<ReturnType<typeof animate>> = [];
  let follow: ReturnType<typeof animate> | undefined;
  const offset = { x: 0, y: 0 };

  const stopControls = () => {
    for (const control of controls) control?.stop?.();
    controls = [];
  };

  const start = () => {
    stopControls();
    const speed = props.speed ?? 50;
    LAYERS_WITH_SHADOWS.forEach((layer, index) => {
      const element = layerElements[index];
      if (!element) return;
      if (!playing()) {
        controls.push(animate(element, { y: 0 }, { duration: 0 }));
        return;
      }
      const span = (50 * layer.multiplier) / Math.max(0.1, speed);
      controls.push(
        animate(
          element,
          { y: [0, -2000] },
          { duration: span, repeat: Infinity, ease: "linear" } as Parameters<typeof animate>[2],
        ),
      );
    });
  };

  const applyOffset = () => {
    if (!parallax) return;
    parallax.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (reduce() || !root) return;
    const rect = root.getBoundingClientRect();
    const factor = props.factor ?? 0.05;
    const x = -(event.clientX - rect.left - rect.width / 2) * factor;
    const y = -(event.clientY - rect.top - rect.height / 2) * factor;
    follow?.stop?.();
    follow = animate(
      offset,
      { x, y },
      {
        type: "spring",
        stiffness: 50,
        damping: 20,
        onUpdate: applyOffset,
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
      stopControls();
      follow?.stop?.();
    });
  });

  createEffect(() => {
    playing();
    props.speed;
    start();
  });

  const starOpacity = (layer: { opacity: number }) =>
    reduce() ? layer.opacity * 0.8 : layer.opacity;

  return (
    <div
      ref={root}
      data-slot="stars-background"
      onPointerMove={onPointerMove}
      class={`relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#17172a_0%,#05050a_75%)] ${props.class ?? ""}`}
      style={props.style}
    >
      <div
        ref={parallax}
        aria-hidden="true"
        class={`absolute inset-0 ${props.pointerEvents === false ? "pointer-events-none" : ""}`}
      >
        <For each={LAYERS_WITH_SHADOWS}>
          {(layer, index) => (
            <div
              ref={(node: HTMLDivElement) => (layerElements[index()] = node)}
              class="absolute left-0 top-0 h-[2000px] w-full"
              style={{ "will-change": "transform" }}
            >
              <div
                class="absolute rounded-full bg-transparent"
                style={{
                  width: `${layer.size}px`,
                  height: `${layer.size}px`,
                  color: props.starColor ?? "#f8fafc",
                  "box-shadow": layer.shadows,
                  opacity: starOpacity(layer),
                }}
              />
              <div
                class="absolute top-[2000px] rounded-full bg-transparent"
                style={{
                  width: `${layer.size}px`,
                  height: `${layer.size}px`,
                  color: props.starColor ?? "#f8fafc",
                  "box-shadow": layer.shadows,
                  opacity: starOpacity(layer),
                }}
              />
            </div>
          )}
        </For>
      </div>
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,10,0.7))]"
      />
      {props.children}
    </div>
  );
}
