import { createMemo, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type SlideDirection = "up" | "down" | "left" | "right";

export type EffectSlide = { direction?: SlideDirection; offset?: number };
export type EffectFade = { initialOpacity?: number; opacity?: number };
export type EffectZoom = { initialScale?: number; scale?: number };
export type EffectBlur = { initialBlur?: number; blur?: number };

export type EffectTransition = {
  type?: "spring" | "tween" | "inertia" | "keyframes";
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
  duration?: number;
  delay?: number;
  ease?: string | number[];
  restDelta?: number;
  restSpeed?: number;
  [key: string]: unknown;
};

export type EffectProps = {
  delay?: number;
  blur?: EffectBlur | boolean;
  slide?: EffectSlide | boolean;
  fade?: EffectFade | boolean;
  zoom?: EffectZoom | boolean;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: EffectTransition;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

type Variant = Record<string, string | number>;
type Keyframes = Record<string, string | number | Array<string | number>>;

const entranceSpring: EffectTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const config = <T,>(value: T | boolean): Partial<T> =>
  typeof value === "object" ? value : {};

export function Effect(props: EffectProps) {
  let root: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const variants = createMemo(() => {
    const hidden: Variant = {};
    const shown: Variant = {};

    if (props.slide && !reduce()) {
      const settings = config<EffectSlide>(props.slide);
      const direction = settings.direction ?? "up";
      const offset = settings.offset ?? 100;
      const axis = direction === "up" || direction === "down" ? "y" : "x";
      hidden[axis] = direction === "right" || direction === "down" ? -offset : offset;
      shown[axis] = 0;
    }

    if (props.fade) {
      const settings = config<EffectFade>(props.fade);
      hidden.opacity = settings.initialOpacity ?? 0;
      shown.opacity = settings.opacity ?? 1;
    }

    if (props.zoom && !reduce()) {
      const settings = config<EffectZoom>(props.zoom);
      hidden.scale = settings.initialScale ?? 0.5;
      shown.scale = settings.scale ?? 1;
    }

    if (props.blur) {
      const settings = config<EffectBlur>(props.blur);
      hidden.filter = `blur(${reduce() ? 0 : (settings.initialBlur ?? 10)}px)`;
      shown.filter = `blur(${settings.blur ?? 0}px)`;
    }

    if (reduce() && (props.slide || props.zoom) && shown.opacity === undefined) {
      const fade = config<EffectFade>(props.fade ?? false);
      hidden.opacity = fade.initialOpacity ?? 0;
      shown.opacity = fade.opacity ?? 1;
    }

    return { hidden, shown };
  });

  const initial = () => {
    const hidden = variants().hidden;
    const style: Variant = {};
    if (hidden.opacity !== undefined) style.opacity = hidden.opacity;
    if (hidden.filter !== undefined) style.filter = hidden.filter;
    const transforms: string[] = [];
    if (hidden.x !== undefined) transforms.push(`translateX(${hidden.x}px)`);
    if (hidden.y !== undefined) transforms.push(`translateY(${hidden.y}px)`);
    if (hidden.scale !== undefined) transforms.push(`scale(${hidden.scale})`);
    if (transforms.length) style.transform = transforms.join(" ");
    return style;
  };

  const options = () => {
    const base = props.transition ?? entranceSpring;
    return {
      ...base,
      delay: Number(base.delay ?? 0) + (props.delay ?? 0) / 1000,
    } as Parameters<typeof animate>[2];
  };

  const play = () => {
    if (!root) return;
    const { hidden, shown } = variants();
    const keyframes: Keyframes = {};
    for (const key of Object.keys(shown)) {
      const to = shown[key]!;
      const from = hidden[key];
      keyframes[key] = from === undefined ? to : [from, to];
    }
    if (!Object.keys(keyframes).length) return;
    controls?.stop?.();
    controls = animate(root, keyframes, options());
  };

  const reset = () => {
    if (!root) return;
    controls?.stop?.();
    controls = animate(root, variants().hidden, { duration: 0 });
  };

  onMount(() => {
    if (!root) return;
    Object.assign(root.style, initial());
    if (!props.inView) {
      play();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          play();
          if (props.inViewOnce !== false) observer?.disconnect();
        } else if (props.inViewOnce === false) {
          reset();
        }
      },
      { threshold: 0.35, rootMargin: props.inViewMargin ?? "0px" },
    );
    observer.observe(root);
  });

  onCleanup(() => {
    observer?.disconnect();
    controls?.stop?.();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="effect"
      class={props.class}
      style={{ ...initial(), ...(props.style ?? {}) }}
    >
      {props.children}
    </div>
  );
}
