"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useReduceMotion } from "../motion";
import { useMounted } from "./shared";

export type ClickVariant = "ripple" | "ring" | "crosshair" | "burst" | "particles";

type ClickItem = {
  id: number;
  x: number;
  y: number;
  variant: ClickVariant;
  color: string;
  size: number;
  duration: number;
};

export type ClickProps = {
  children?: React.ReactNode;
  variant?: ClickVariant;
  color?: string;
  size?: number;
  duration?: number;
  disabled?: boolean;
  scope?: React.RefObject<HTMLElement | null>;
};

export function Click({
  children,
  variant = "ring",
  color = "currentColor",
  size = 100,
  duration = 400,
  disabled = false,
  scope,
}: ClickProps) {
  const [items, setItems] = React.useState<ClickItem[]>([]);
  const nextId = React.useRef(0);
  const timers = React.useRef(new Set<number>());
  const mounted = useMounted();
  const reduce = useReduceMotion();

  React.useEffect(() => {
    if (disabled || reduce) return;
    const target: HTMLElement | Document = scope?.current ?? document;
    const isDocument = target instanceof Document;

    const onPointerUp = (event: PointerEvent) => {
      if (!isDocument) {
        const rect = (target as HTMLElement).getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          return;
        }
      }

      const id = nextId.current++;
      setItems((current) => [
        ...current,
        {
          id,
          x: event.clientX,
          y: event.clientY,
          variant,
          color,
          size,
          duration,
        },
      ]);

      const timer = window.setTimeout(() => {
        timers.current.delete(timer);
        setItems((current) => current.filter((item) => item.id !== id));
      }, duration + 320);
      timers.current.add(timer);
    };

    target.addEventListener("pointerup", onPointerUp as EventListener, {
      passive: true,
    });
    return () =>
      target.removeEventListener("pointerup", onPointerUp as EventListener);
  }, [color, disabled, duration, reduce, scope, size, variant]);

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <>
      <span data-slot="click" style={{ display: "contents" }}>
        {children}
      </span>
      {mounted
        ? createPortal(
            <div
              aria-hidden="true"
              style={{
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                zIndex: 9999,
              }}
            >
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <ClickEffect key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

const easeOut: Transition = { duration: 0.4, ease: "easeOut" };

function ClickEffect({ item }: { item: ClickItem }) {
  if (item.variant === "ripple") return <Ripple item={item} />;
  if (item.variant === "ring") return <Ring item={item} />;
  if (item.variant === "crosshair") return <Crosshair item={item} />;
  if (item.variant === "burst") return <Burst item={item} />;
  return <Particles item={item} />;
}

function Ripple({ item }: { item: ClickItem }) {
  return (
    <motion.span
      initial={{ opacity: 0.9, scale: 0.2 }}
      animate={{ opacity: 0, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ...easeOut, duration: item.duration / 1000 }}
      style={{
        position: "fixed",
        left: item.x - item.size / 2,
        top: item.y - item.size / 2,
        width: item.size,
        height: item.size,
        borderRadius: 9999,
        background: item.color,
        boxShadow: `inset 0 0 0 2px ${item.color}`,
      }}
    />
  );
}

function Ring({ item }: { item: ClickItem }) {
  const radiusEnd = Math.max(item.size / 1.5, 50);
  const radiusStart = Math.max(radiusEnd * 0.2, 12);
  const strokeStart = Math.max(radiusEnd * 0.05, 2.5);
  const duration = item.duration / 1000;

  return (
    <motion.svg
      style={{
        position: "fixed",
        left: item.x - radiusEnd / 2,
        top: item.y - radiusEnd / 2,
        width: radiusEnd,
        height: radiusEnd,
        overflow: "visible",
      }}
      viewBox={`0 0 ${radiusEnd} ${radiusEnd}`}
    >
      <motion.circle
        cx={radiusEnd / 2}
        cy={radiusEnd / 2}
        fill="none"
        stroke={item.color}
        strokeLinecap="round"
        initial={{ r: radiusStart, strokeWidth: strokeStart }}
        animate={{ r: radiusEnd, strokeWidth: 0 }}
        transition={{ duration, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function Crosshair({ item }: { item: ClickItem }) {
  const duration = item.duration / 1000;
  const distance = Math.max(item.size * 0.65, 56);
  const gap = Math.max(item.size * 0.05, 3);
  const lengthStart = Math.max(item.size * 0.26, 16);
  const lengthEnd = Math.max(lengthStart * 0.55, 6);
  const strokeWidth = Math.max(item.size * 0.065, 2);
  const half = distance + gap + lengthStart;
  const box = half * 2;
  const center = half;
  const directions = [
    [1, 0],
    [-1, 0],
    [0, -1],
    [0, 1],
  ] as const;

  return (
    <motion.svg
      style={{
        position: "fixed",
        left: item.x - half,
        top: item.y - half,
        width: box,
        height: box,
        overflow: "visible",
        rotate: -25,
      }}
      viewBox={`0 0 ${box} ${box}`}
    >
      {directions.map(([dx, dy], index) => (
        <motion.line
          key={index}
          x1={center + dx * gap}
          y1={center + dy * gap}
          x2={center + dx * (gap + lengthStart)}
          y2={center + dy * (gap + lengthStart)}
          stroke={item.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 1, scale: 1 }}
          animate={{
            x1: center + dx * distance,
            y1: center + dy * distance,
            x2: center + dx * (distance + lengthEnd),
            y2: center + dy * (distance + lengthEnd),
            pathLength: 0,
            scale: 0,
          }}
          transition={{ duration, ease: [0, 0, 0.7, 1] }}
        />
      ))}
    </motion.svg>
  );
}

function Burst({ item }: { item: ClickItem }) {
  const duration = item.duration / 1000;
  const start = Math.max(item.size * 0.4, 36);
  const end = Math.max(item.size * 0.65, 56);
  const lengthStart = Math.max(item.size * 0.2, 14);
  const lengthEnd = Math.max(lengthStart * 0.5, 6);
  const strokeWidth = Math.max(item.size * 0.05, 1.5);
  const half = end + lengthStart;
  const box = half * 2;
  const center = half;
  const count = 8;

  return (
    <motion.svg
      style={{
        position: "fixed",
        left: item.x - half,
        top: item.y - half,
        width: box,
        height: box,
        overflow: "visible",
      }}
      viewBox={`0 0 ${box} ${box}`}
    >
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const ux = Math.cos(angle);
        const uy = Math.sin(angle);
        const x0 = center + ux * start;
        const y0 = center + uy * start;
        const x1 = center + ux * end;
        const y1 = center + uy * end;

        return (
          <motion.line
            key={index}
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{
              x1: x0 - (ux * lengthStart) / 2,
              y1: y0 - (uy * lengthStart) / 2,
              x2: x0 + (ux * lengthStart) / 2,
              y2: y0 + (uy * lengthStart) / 2,
              opacity: 1,
            }}
            animate={{
              x1: x1 - (ux * lengthEnd) / 2,
              y1: y1 - (uy * lengthEnd) / 2,
              x2: x1 + (ux * lengthEnd) / 2,
              y2: y1 + (uy * lengthEnd) / 2,
              opacity: [1, 1, 0],
            }}
            transition={{ duration, ease: "easeInOut" }}
          />
        );
      })}
    </motion.svg>
  );
}

function Particles({ item }: { item: ClickItem }) {
  const duration = item.duration / 1000;
  const count = 8;
  const radius = item.size * 0.35;
  const dot = Math.max(item.size * 0.025, 2.5);
  const half = radius + dot * 2;
  const box = half * 2;

  return (
    <div
      style={{
        position: "fixed",
        left: item.x - half,
        top: item.y - half,
        width: box,
        height: box,
        overflow: "visible",
      }}
    >
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / count) * Math.PI * 2;
        return (
          <motion.span
            key={index}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: dot,
              height: dot,
              marginLeft: -dot / 2,
              marginTop: -dot / 2,
              borderRadius: 9999,
              background: item.color,
            }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration,
              delay: index * duration * 0.06,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
