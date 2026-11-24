import { createEffect, createSignal, on, onMount } from "solid-js";
import type { JSX } from "solid-js";

export type ThemeSelection = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type ThemeWipeDirection = "btt" | "ttb" | "ltr" | "rtl";

export type ThemeTogglerRenderState = {
  resolved: ResolvedTheme;
  effective: ThemeSelection;
  toggleTheme: (theme: ThemeSelection) => void;
};

export type ThemeTogglerProps = {
  theme: ThemeSelection;
  resolvedTheme: ResolvedTheme;
  setTheme?: (theme: ThemeSelection) => void;
  direction?: ThemeWipeDirection;
  onImmediateChange?: (theme: ThemeSelection) => void;
  tempo?: number;
  children?: JSX.Element | ((state: ThemeTogglerRenderState) => JSX.Element);
};

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type DocumentWithTransitions = Document & {
  startViewTransition?: (
    arg: (() => void) | { update: () => void; types?: string[] },
  ) => ViewTransitionLike;
};

type Preview = { effective: ThemeSelection; resolved: ResolvedTheme };

const WIPE_DURATION = 700;
const WIPE_EASING = "ease-in-out";
const WIPE_TYPE = "prequel-theme-wipe";

const WIPE_STYLE =
  "::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}" +
  `:root:active-view-transition-type(${WIPE_TYPE}) body, :root:active-view-transition-type(${WIPE_TYPE}) body *{view-transition-name:none !important;}`;

const PLACEHOLDER: Preview = { effective: "system", resolved: "light" };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const systemResolved = (): ResolvedTheme => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const clipKeyframes = (direction: ThemeWipeDirection): [string, string] => {
  switch (direction) {
    case "rtl":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "ttb":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "btt":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    case "ltr":
    default:
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
  }
};

export function ThemeToggler(props: ThemeTogglerProps) {
  const [mounted, setMounted] = createSignal(false);
  const [current, setCurrent] = createSignal<Preview>({
    effective: props.theme,
    resolved: props.resolvedTheme,
  });

  const tempo = () => Math.max(0.4, props.tempo ?? 1);
  const state = () => (mounted() ? current() : PLACEHOLDER);

  const applyTheme = (next: ThemeSelection) => props.setTheme?.(next);

  const startWipe = (update: () => void): ViewTransitionLike | null => {
    if (typeof document === "undefined") return null;
    const documentWithTransitions = document as DocumentWithTransitions;
    const start = documentWithTransitions.startViewTransition;
    if (!start) return null;
    try {
      return start.call(documentWithTransitions, {
        update,
        types: [WIPE_TYPE],
      });
    } catch {
      return start.call(documentWithTransitions, update);
    }
  };

  const toggleTheme = (next: ThemeSelection) => {
    const resolved = next === "system" ? systemResolved() : next;
    setCurrent({ effective: next, resolved });
    props.onImmediateChange?.(next);

    if (next === "system" && resolved === props.resolvedTheme) {
      applyTheme(next);
      return;
    }

    if (reduce()) {
      setCurrent({ effective: next, resolved });
      applyTheme(next);
      return;
    }

    const transition = startWipe(() => {
      setCurrent({ effective: next, resolved });
      document.documentElement.classList.toggle("dark", resolved === "dark");
    });

    if (!transition) {
      setCurrent({ effective: next, resolved });
      applyTheme(next);
      return;
    }

    const [fromClip, toClip] = clipKeyframes(props.direction ?? "ltr");
    void transition.ready.then(() => {
      document.documentElement
        .animate(
          { clipPath: [fromClip, toClip] },
          {
            duration: WIPE_DURATION * tempo(),
            easing: WIPE_EASING,
            pseudoElement: "::view-transition-new(root)",
          } as KeyframeAnimationOptions & { pseudoElement: string },
        )
        .finished.finally(() => applyTheme(next));
    });
  };

  createEffect(
    on(
      () => [props.theme, props.resolvedTheme],
      () => {
        setCurrent({ effective: props.theme, resolved: props.resolvedTheme });
      },
      { defer: true },
    ),
  );

  onMount(() => setMounted(true));

  const content = () => {
    const children = props.children;
    if (typeof children === "function") {
      return children({
        effective: state().effective,
        resolved: state().resolved,
        toggleTheme,
      });
    }
    return children as JSX.Element;
  };

  return (
    <>
      <span data-slot="theme-toggler" style={{ display: "contents" }}>
        {content()}
      </span>
      <style>{WIPE_STYLE}</style>
    </>
  );
}
