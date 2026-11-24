"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { useTempoTransition } from "../motion";
import { highlightSpring, useCanHover } from "./shared";

type HighlightContextValue = {
  id: string;
  active: string | null;
  setActive: (value: string | null) => void;
  hover: boolean;
  click: boolean;
  disabled: boolean;
  transition: Transition;
  className?: string;
  activeClassName?: string;
  style?: React.CSSProperties;
  canHover: boolean;
};

const HighlightContext = React.createContext<HighlightContextValue | null>(null);

export function useHighlight() {
  const context = React.useContext(HighlightContext);
  if (!context) throw new Error("useHighlight must be used inside Highlight");
  return context;
}

export type HighlightProps = {
  children: React.ReactNode;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  hover?: boolean;
  click?: boolean;
  disabled?: boolean;
  className?: string;
  activeClassName?: string;
  style?: React.CSSProperties;
  transition?: Transition;
};

export function Highlight({
  children,
  value,
  defaultValue = null,
  onValueChange,
  hover = false,
  click = true,
  disabled = false,
  className,
  activeClassName = "bg-background shadow-sm",
  style,
  transition,
}: HighlightProps) {
  const id = React.useId();
  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const controlled = value !== undefined;
  const active = controlled ? value : internal;
  const canHover = useCanHover();
  const spring = useTempoTransition(transition ?? highlightSpring);

  React.useEffect(() => {
    if (defaultValue !== null) setInternal(defaultValue);
  }, [defaultValue]);

  const setActive = React.useCallback(
    (next: string | null) => {
      if (disabled) return;
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    },
    [controlled, disabled, onValueChange],
  );

  const context = React.useMemo<HighlightContextValue>(
    () => ({
      id,
      active,
      setActive,
      hover,
      click,
      disabled,
      transition: spring,
      className,
      activeClassName,
      style,
      canHover,
    }),
    [
      active,
      activeClassName,
      canHover,
      className,
      click,
      disabled,
      hover,
      id,
      setActive,
      spring,
      style,
    ],
  );

  return (
    <HighlightContext.Provider value={context}>
      <div
        data-slot="highlight"
        className={cn("relative", className)}
        style={style}
      >
        {children}
      </div>
    </HighlightContext.Provider>
  );
}

export type HighlightItemProps = {
  children: React.ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
  activeClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onPointerEnter?: React.PointerEventHandler<HTMLDivElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLDivElement>;
};

export function HighlightItem({
  children,
  value,
  disabled,
  className,
  activeClassName,
  onClick,
  onPointerEnter,
  onPointerLeave,
}: HighlightItemProps) {
  const context = useHighlight();
  const isActive = context.active === value;
  const isDisabled = disabled ?? context.disabled;
  const interactiveHover = context.hover && context.canHover;

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (isDisabled) return;
    if (!interactiveHover && context.click) context.setActive(value);
  };

  const handleEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerEnter?.(event);
    if (isDisabled) return;
    if (interactiveHover) context.setActive(value);
  };

  const handleLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    if (isDisabled) return;
    if (interactiveHover && context.active === value) context.setActive(null);
  };

  return (
    <div
      data-slot="highlight-item"
      data-active={isActive ? "true" : "false"}
      data-value={value}
      onClick={handleClick}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      className={cn("relative", className)}
    >
      {isActive && !isDisabled && (
        <motion.span
          aria-hidden="true"
          layoutId={`highlight-surface-${context.id}`}
          transition={context.transition}
          className={cn(
            "pointer-events-none absolute inset-0 z-0",
            activeClassName ?? context.activeClassName,
          )}
          style={context.style}
        />
      )}
      <span className="relative z-[1]">{children}</span>
    </div>
  );
}
