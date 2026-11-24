"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { avatarSpring, popSpring, useReduceMotion } from "./motion";

type AvatarContextValue = {
  hovered: number | null;
  activate: (index: number, element: HTMLElement) => void;
  registerLabel: (index: number, label: string) => void;
  labels: React.MutableRefObject<Record<number, string>>;
  invert: boolean;
};

const AvatarContext = React.createContext<AvatarContextValue | null>(null);

function useAvatarGroup(component: string) {
  const context = React.useContext(AvatarContext);
  if (!context) throw new Error(`${component} must be used inside <AvatarGroup>.`);
  return context;
}

export type AvatarGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  invertOverlap?: boolean;
  tooltipSideOffset?: number;
};

export function AvatarGroup({
  invertOverlap = false,
  tooltipSideOffset = 8,
  className,
  children,
  ...props
}: AvatarGroupProps) {
  const [hovered, setHovered] = React.useState<number | null>(null);
  const [center, setCenter] = React.useState(0);
  const labels = React.useRef<Record<number, string>>({});
  const reduce = useReduceMotion();

  const activate = React.useCallback((index: number, element: HTMLElement) => {
    const group = element.parentElement?.parentElement;
    if (group) {
      const groupRect = group.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      setCenter(rect.left - groupRect.left + rect.width / 2);
    }
    setHovered(index);
  }, []);

  const registerLabel = React.useCallback((index: number, label: string) => {
    labels.current[index] = label;
  }, []);

  const items = React.Children.toArray(children).map((child, index) =>
    React.isValidElement(child)
      ? React.cloneElement(child as React.ReactElement<{ index?: number }>, { index })
      : child,
  );

  return (
    <AvatarContext.Provider value={{ hovered, activate, registerLabel, labels, invert: invertOverlap }}>
      <div
        data-slot="avatar-group"
        className={cn("relative inline-flex items-end", className)}
        onPointerLeave={() => setHovered(null)}
        {...props}
      >
        <div className="flex -space-x-3">{items}</div>
        <AnimatePresence>
          {hovered !== null ? (
            <motion.span
              key="avatar-tooltip"
              role="tooltip"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9, filter: "blur(4px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0, transition: { duration: 0.12 } } : { opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
              transition={popSpring}
              style={{
                left: center,
                bottom: `calc(100% + ${tooltipSideOffset}px)`,
                translate: "-50% 0",
              }}
              className="pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md"
            >
              {labels.current[hovered] ?? ""}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </div>
    </AvatarContext.Provider>
  );
}

export type AvatarGroupItemProps = React.HTMLAttributes<HTMLSpanElement> & {
  name: string;
  src?: string;
  index?: number;
};

export function AvatarGroupItem({
  name,
  src,
  index = 0,
  className,
  children,
  ...props
}: AvatarGroupItemProps) {
  const group = useAvatarGroup("AvatarGroupItem");
  const reduce = useReduceMotion();
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    group.registerLabel(index, name);
  }, [group, index, name]);

  return (
    <motion.span
      ref={ref}
      role="img"
      aria-label={name}
      tabIndex={0}
      onPointerEnter={() => ref.current && group.activate(index, ref.current)}
      onFocus={() => ref.current && group.activate(index, ref.current)}
      onPointerLeave={() => undefined}
      onBlur={() => undefined}
      animate={{ y: group.hovered === index && !reduce ? "-30%" : 0 }}
      transition={avatarSpring}
      style={{
        zIndex: group.invert ? 20 - index : index,
      }}
      className={cn(
        "relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br from-rose-300 to-orange-200 text-[13px] font-medium text-black/70 outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      {...(props as Record<string, unknown>)}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        children ?? name.slice(0, 1)
      )}
    </motion.span>
  );
}
