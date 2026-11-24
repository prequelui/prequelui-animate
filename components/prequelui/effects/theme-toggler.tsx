"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { useReduceMotion, useTempo } from "../motion";
import { useMounted } from "./shared";

export type ThemeSelection = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type ThemeWipeDirection = "btt" | "ttb" | "ltr" | "rtl";

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};

type DocumentWithTransitions = Document & {
  startViewTransition?: (
    arg:
      | (() => void)
      | { update: () => void; types?: string[] },
  ) => ViewTransitionLike;
};

function systemResolved(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function clipKeyframes(direction: ThemeWipeDirection): [string, string] {
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
}

const WIPE_DURATION = 700;
const WIPE_EASING = "ease-in-out";
const WIPE_TYPE = "prequel-theme-wipe";

const WIPE_STYLE =
  "::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}" +
  `:root:active-view-transition-type(${WIPE_TYPE}) body, :root:active-view-transition-type(${WIPE_TYPE}) body *{view-transition-name:none !important;}`;

function startWipe(update: () => void): ViewTransitionLike | null {
  const documentWithTransitions = document as DocumentWithTransitions;
  if (!documentWithTransitions.startViewTransition) return null;
  try {
    return documentWithTransitions.startViewTransition({
      update,
      types: [WIPE_TYPE],
    });
  } catch {
    return documentWithTransitions.startViewTransition(update);
  }
}

export type ThemeTogglerRenderState = {
  resolved: ResolvedTheme;
  effective: ThemeSelection;
  toggleTheme: (theme: ThemeSelection) => void;
};

export type ThemeTogglerProps = {
  theme: ThemeSelection;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeSelection) => void;
  direction?: ThemeWipeDirection;
  onImmediateChange?: (theme: ThemeSelection) => void;
  children?:
    | React.ReactNode
    | ((state: ThemeTogglerRenderState) => React.ReactNode);
};

type Preview = { effective: ThemeSelection; resolved: ResolvedTheme } | null;

const PLACEHOLDER = {
  effective: "system" as ThemeSelection,
  resolved: "light" as ResolvedTheme,
};

export function ThemeToggler({
  theme,
  resolvedTheme,
  setTheme,
  direction = "ltr",
  onImmediateChange,
  children,
}: ThemeTogglerProps) {
  const mounted = useMounted();
  const reduce = useReduceMotion();
  const tempo = useTempo();
  const wipeDuration = WIPE_DURATION * tempo;
  const [preview, setPreview] = React.useState<Preview>(null);
  const [current, setCurrent] = React.useState<{
    effective: ThemeSelection;
    resolved: ResolvedTheme;
  }>({ effective: theme, resolved: resolvedTheme });

  React.useEffect(() => {
    setCurrent({ effective: theme, resolved: resolvedTheme });
  }, [theme, resolvedTheme]);

  React.useEffect(() => {
    if (
      preview &&
      theme === preview.effective &&
      resolvedTheme === preview.resolved
    ) {
      setPreview(null);
    }
  }, [preview, resolvedTheme, theme]);

  const [fromClip, toClip] = clipKeyframes(direction);

  const toggleTheme = React.useCallback(
    (next: ThemeSelection) => {
      const resolved = next === "system" ? systemResolved() : next;
      setCurrent({ effective: next, resolved });
      onImmediateChange?.(next);

      if (next === "system" && resolved === resolvedTheme) {
        setTheme(next);
        return;
      }

      if (reduce) {
        flushSync(() => setPreview({ effective: next, resolved }));
        setTheme(next);
        return;
      }

      const transition = startWipe(() => {
        flushSync(() => {
          setPreview({ effective: next, resolved });
          document.documentElement.classList.toggle("dark", resolved === "dark");
        });
      });

      if (!transition) {
        setPreview({ effective: next, resolved });
        setTheme(next);
        return;
      }

      void transition.ready.then(() => {
        document.documentElement
          .animate(
            { clipPath: [fromClip, toClip] },
            {
              duration: wipeDuration,
              easing: WIPE_EASING,
              pseudoElement: "::view-transition-new(root)",
            },
          )
          .finished.finally(() => setTheme(next));
      });
    },
    [
      fromClip,
      onImmediateChange,
      reduce,
      resolvedTheme,
      setTheme,
      toClip,
      wipeDuration,
    ],
  );

  const state = mounted ? current : PLACEHOLDER;

  return (
    <>
      <span data-slot="theme-toggler" style={{ display: "contents" }}>
        {typeof children === "function"
          ? children({
              effective: state.effective,
              resolved: state.resolved,
              toggleTheme,
            })
          : children}
      </span>
      <style>{WIPE_STYLE}</style>
    </>
  );
}
