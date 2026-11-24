"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import {
  blurIcon,
  swapTween,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

export type ThemeSelection = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeSelection;
  resolvedTheme: ResolvedTheme;
  next: ThemeSelection;
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

const DEFAULT_MODES: ThemeSelection[] = ["light", "dark", "system"];

function nextTheme(
  theme: ThemeSelection,
  resolved: ResolvedTheme,
  modes: ThemeSelection[],
): ThemeSelection {
  let index = modes.indexOf(theme);
  if (index === -1) index = modes.indexOf(resolved);
  if (index === -1) return modes[0] ?? resolved;
  return modes[(index + 1) % modes.length]!;
}

export type ThemeTogglerButtonProps = ButtonProps & {
  theme: ThemeSelection;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeSelection) => void;
  modes?: ThemeSelection[];
};

export function ThemeTogglerButton({
  theme,
  resolvedTheme,
  setTheme,
  modes = DEFAULT_MODES,
  onClick,
  className,
  ...props
}: ThemeTogglerButtonProps) {
  const next = nextTheme(theme, resolvedTheme, modes);
  const value = React.useMemo(
    () => ({ theme, resolvedTheme, next }),
    [next, resolvedTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <Button
        data-slot="theme-toggler-button"
        data-theme={theme}
        aria-label={`Switch to ${next} theme`}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) setTheme(next);
        }}
        className={cn("border bg-background text-foreground hover:bg-accent", className)}
        {...props}
      />
    </ThemeContext.Provider>
  );
}

export type ThemeTogglerButtonIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  light: React.ReactNode;
  dark: React.ReactNode;
  system?: React.ReactNode;
  rotate?: number;
  transition?: Transition;
};

export function ThemeTogglerButtonIcon({
  light,
  dark,
  system,
  rotate = 90,
  transition,
  className,
  ...props
}: ThemeTogglerButtonIconProps) {
  const context = React.useContext(ThemeContext);
  const reduce = useReduceMotion();
  const tween = useTempoTransition(transition ?? swapTween);
  const key = context?.theme ?? "light";
  const content = key === "system" ? system ?? light : key === "dark" ? dark : light;
  const hidden = reduce
    ? { opacity: 0, filter: blurIcon }
    : { opacity: 0, scale: 0.5, rotate: -rotate, filter: blurIcon };
  const shown = reduce
    ? { opacity: 1, filter: "blur(0px)" }
    : { opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)" };

  return (
    <span
      data-slot="theme-toggler-button-icon"
      className={cn("relative inline-flex size-4 items-center justify-center", className)}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={key}
          aria-hidden="true"
          initial={hidden}
          animate={shown}
          exit={hidden}
          transition={reduce ? { duration: 0.15 } : tween}
          className="absolute inset-0 inline-flex items-center justify-center"
        >
          {content}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function useThemeTogglerButton() {
  const value = React.useContext(ThemeContext);
  if (!value) throw new Error("useThemeTogglerButton must be used inside ThemeTogglerButton");
  return value;
}
