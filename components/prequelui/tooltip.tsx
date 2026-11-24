"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  exitTween,
  tooltipSpring,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

type Side = "top" | "bottom" | "left" | "right";

type ProviderValue = {
  delay: number;
  closeDelay: number;
  warm: () => boolean;
  markClosed: () => void;
};

const TooltipProviderContext = React.createContext<ProviderValue | null>(null);

export function TooltipProvider({
  delay = 180,
  closeDelay = 80,
  warmUp = 300,
  children,
}: {
  delay?: number;
  closeDelay?: number;
  warmUp?: number;
  children?: React.ReactNode;
}) {
  const closedAt = React.useRef(0);
  const value = React.useMemo<ProviderValue>(
    () => ({
      delay,
      closeDelay,
      warm: () => Date.now() - closedAt.current < warmUp,
      markClosed: () => {
        closedAt.current = Date.now();
      },
    }),
    [delay, closeDelay, warmUp],
  );
  return (
    <TooltipProviderContext.Provider value={value}>{children}</TooltipProviderContext.Provider>
  );
}

type TooltipContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: Side;
  sideOffset: number;
};

const TooltipContext = React.createContext<TooltipContextValue | null>(null);

function useTooltip(component: string) {
  const context = React.useContext(TooltipContext);
  if (!context) throw new Error(`${component} must be used inside <Tooltip>.`);
  return context;
}

export type TooltipProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: Side;
  sideOffset?: number;
  delay?: number;
  closeDelay?: number;
  children?: React.ReactNode;
};

export function Tooltip({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  side = "top",
  sideOffset = 8,
  delay,
  closeDelay,
  children,
}: TooltipProps) {
  const provider = React.useContext(TooltipProviderContext);
  const [internal, setInternal] = React.useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : internal;
  const openTimer = React.useRef<number | null>(null);
  const closeTimer = React.useRef<number | null>(null);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInternal(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const clear = () => {
    if (openTimer.current) window.clearTimeout(openTimer.current);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const show = () => {
    clear();
    const base = delay ?? provider?.delay ?? 180;
    const wait = provider?.warm() ? 0 : base;
    openTimer.current = window.setTimeout(() => setOpen(true), wait);
  };

  const hide = () => {
    clear();
    const wait = closeDelay ?? provider?.closeDelay ?? 80;
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      provider?.markClosed();
    }, wait);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") hide();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  React.useEffect(() => clear, []);

  return (
    <TooltipContext.Provider value={{ open, setOpen, side, sideOffset }}>
      <span
        data-slot="tooltip"
        className="relative inline-flex"
        onPointerEnter={show}
        onPointerLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
    </TooltipContext.Provider>
  );
}

export function TooltipTrigger({ children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <span {...props}>{children}</span>;
}

const sideClasses: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2",
  bottom: "top-full left-1/2 -translate-x-1/2",
  left: "right-full top-1/2 -translate-y-1/2",
  right: "left-full top-1/2 -translate-y-1/2",
};

export type TooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  side?: Side;
  sideOffset?: number;
  transition?: Transition;
  exitTransition?: Transition;
};

export function TooltipContent({
  side,
  sideOffset,
  transition,
  exitTransition,
  className,
  children,
  ...props
}: TooltipContentProps) {
  const tooltip = useTooltip("TooltipContent");
  const reduce = useReduceMotion();
  const edge = side ?? tooltip.side;
  const offset = sideOffset ?? tooltip.sideOffset;
  const enter = useTempoTransition(transition ?? tooltipSpring);
  const leave = useTempoTransition(exitTransition ?? exitTween);
  const enterY = edge === "top" ? 6 : edge === "bottom" ? -6 : 0;
  const enterX = edge === "left" ? 6 : edge === "right" ? -6 : 0;

  return (
    <AnimatePresence>
      {tooltip.open ? (
        <span
          className={cn("pointer-events-none absolute z-50", sideClasses[edge])}
          style={
            edge === "top"
              ? { paddingBottom: offset }
              : edge === "bottom"
                ? { paddingTop: offset }
                : edge === "left"
                  ? { paddingRight: offset }
                  : { paddingLeft: offset }
          }
        >
          <motion.span
            role="tooltip"
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.7, y: enterY, x: enterX, filter: "blur(6px)" }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, y: 0, x: 0, filter: "blur(0px)" }
            }
            exit={
              reduce
                ? { opacity: 0, transition: leave }
                : { opacity: 0, scale: 0.9, filter: "blur(4px)", transition: leave }
            }
            transition={reduce ? { duration: 0.2 } : enter}
            className={cn(
              "block whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md",
              className,
            )}
            {...(props as Record<string, unknown>)}
          >
            {children}
          </motion.span>
        </span>
      ) : null}
    </AnimatePresence>
  );
}
