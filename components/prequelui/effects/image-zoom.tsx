"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "../motion";
import { clamp, useCoarsePointer } from "./shared";

export type ImageZoomProps = React.ComponentProps<"div"> & {
  children: React.ReactNode;
  zoomScale?: number;
  transition?: Transition;
  zoomOnClick?: boolean;
  zoomOnHover?: boolean;
  disabled?: boolean;
  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
};

export function ImageZoom({
  children,
  zoomScale = 3,
  transition = { type: "spring", stiffness: 200, damping: 28 },
  zoomOnClick = true,
  zoomOnHover = true,
  disabled = false,
  width = "100%",
  height = "100%",
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onClick,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  ...props
}: ImageZoomProps) {
  const [zoomed, setZoomed] = React.useState(false);
  const [origin, setOrigin] = React.useState("50% 50%");
  const ref = React.useRef<HTMLDivElement>(null);
  const coarse = useCoarsePointer();
  const reduce = useReduceMotion();

  const setOriginFromEvent = React.useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ("touches" in event && event.touches[0]) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
      } else if ("clientX" in event) {
        clientX = event.clientX;
        clientY = event.clientY;
      }

      const x = clamp(clientX - rect.left, 0, rect.width);
      const y = clamp(clientY - rect.top, 0, rect.height);
      setOrigin(
        `${rect.width ? (x / rect.width) * 100 : 50}% ${
          rect.height ? (y / rect.height) * 100 : 50
        }%`,
      );
    },
    [],
  );

  const handleEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseEnter?.(event);
    if (disabled || coarse || !zoomOnHover) return;
    setZoomed(true);
  };

  const handleLeave = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseLeave?.(event);
    if (disabled || coarse || !zoomOnHover) return;
    setZoomed(false);
  };

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    onMouseMove?.(event);
    if (disabled || coarse) return;
    setOriginFromEvent(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    if (disabled || !zoomOnClick) return;
    setOriginFromEvent(event);
    setZoomed((current) => !current);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    onTouchStart?.(event);
    if (disabled) return;
    setOriginFromEvent(event);
    if (!zoomOnClick) setZoomed(true);
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    onTouchMove?.(event);
    if (disabled) return;
    setOriginFromEvent(event);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    onTouchEnd?.(event);
    if (disabled) return;
    if (!zoomOnClick) setZoomed(false);
  };

  return (
    <div
      ref={ref}
      role="img"
      data-slot="image-zoom"
      className={cn("relative overflow-hidden", className)}
      style={{
        width,
        height,
        touchAction: "manipulation",
        cursor: disabled ? "default" : zoomed ? "zoom-out" : "zoom-in",
        ...style,
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      {...props}
    >
      <motion.div
        animate={{ scale: disabled || reduce ? 1 : zoomed ? zoomScale : 1 }}
        transition={transition}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformOrigin: origin,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export type ImageProps<T extends React.ElementType = "img"> = {
  objectFit?: React.CSSProperties["objectFit"];
  as?: T;
} & Omit<React.ComponentProps<T>, "as">;

export function Image<T extends React.ElementType = "img">({
  objectFit = "cover",
  as,
  ...props
}: ImageProps<T>) {
  const Component = (as ?? "img") as React.ElementType;
  return (
    <Component
      draggable={false}
      style={{
        width: "100%",
        height: "100%",
        objectFit,
        userSelect: "none",
        pointerEvents: "none",
      }}
      {...props}
    />
  );
}
