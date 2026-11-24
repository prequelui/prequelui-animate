"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "../motion";

export type ShineProps = React.ComponentProps<"div"> & {
  color?: string;
  opacity?: number;
  delay?: number;
  duration?: number;
  loop?: boolean;
  loopDelay?: number;
  deg?: number;
  enable?: boolean;
  enableOnHover?: boolean;
  enableOnTap?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
};

export function Shine({
  color = "currentColor",
  opacity = 0.3,
  delay = 0,
  duration = 1200,
  loop = false,
  loopDelay = 0,
  deg = -15,
  enable: enableProp = true,
  enableOnHover = false,
  enableOnTap = false,
  asChild = false,
  className,
  style,
  children,
  onMouseEnter,
  onMouseLeave,
  onPointerDown,
  ...props
}: ShineProps) {
  const reduce = useReduceMotion();
  const enable = enableProp && !reduce;
  const alwaysOn = enable && !enableOnHover && !enableOnTap;
  const [run, setRun] = React.useState(alwaysOn ? 1 : 0);
  const [hovered, setHovered] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);

  const play = React.useCallback(() => {
    setRun((current) => current + 1);
  }, []);

  const clearTimer = React.useCallback(() => {
    if (timer.current !== undefined) {
      window.clearTimeout(timer.current);
      timer.current = undefined;
    }
  }, []);

  React.useEffect(() => {
    clearTimer();
    setRun(alwaysOn ? 1 : 0);
  }, [alwaysOn, clearTimer]);

  React.useEffect(() => clearTimer, [clearTimer]);

  const scheduleNext = React.useCallback(() => {
    clearTimer();
    const active = alwaysOn || (enableOnHover && hovered);
    if (!loop || !active) return;
    timer.current = window.setTimeout(play, loopDelay);
  }, [alwaysOn, clearTimer, enableOnHover, hovered, loop, loopDelay, play]);

  const handleEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(event);
    if (!enable || !enableOnHover || alwaysOn) return;
    setHovered(true);
    play();
  };

  const handleLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(event);
    if (!enable || !enableOnHover || alwaysOn) return;
    setHovered(false);
    clearTimer();
  };

  const handleDown = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);
    if (!enable || !enableOnTap || alwaysOn) return;
    play();
  };

  const overlay =
    enable && run > 0 ? (
      <motion.span
        key={run}
        aria-hidden="true"
        initial={{ x: "-100%", skewX: deg }}
        animate={{ x: "100%", skewX: deg }}
        transition={{
          duration: duration / 1000,
          ease: [0.4, 0, 0.2, 1],
          delay: delay / 1000,
        }}
        onAnimationComplete={scheduleNext}
        className="pointer-events-none absolute inset-0 z-10 block h-full w-full"
        style={{
          background: `linear-gradient(to right, transparent, ${color}, transparent)`,
          opacity,
        }}
      />
    ) : null;

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    const childChildren = child.props.children as React.ReactNode;
    const childClassName = String(child.props.className ?? "");
    const childStyle = (child.props.style as React.CSSProperties) ?? {};
    return React.cloneElement(child, {
      ...props,
      "data-slot": "shine",
      className: cn(childClassName, className),
      style: { ...childStyle, position: "relative", overflow: "hidden", ...style },
      onMouseEnter: handleEnter,
      onMouseLeave: handleLeave,
      onPointerDown: handleDown,
      children: (
        <>
          {childChildren}
          {overlay}
        </>
      ),
    });
  }

  return (
    <div
      data-slot="shine"
      className={cn("relative overflow-hidden", className)}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onPointerDown={handleDown}
      {...props}
    >
      {children}
      {overlay}
    </div>
  );
}
