"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import {
  useAnimatedIconContext,
  useIconVariants,
  type IconAnimationSet,
  type IconControls,
} from "../core";
import type { IconProps } from "../lucide-set";
import { SET_MOTIONS, type SetMotionName } from "./set-motion";

export type SetPart = {
  tag:
    | "path"
    | "circle"
    | "rect"
    | "line"
    | "polyline"
    | "polygon"
    | "ellipse";
  attrs: Record<string, string | number>;
};

export type SetIconDefinition = {
  name: string;
  category: string;
  viewBox: string;
  mode: "stroke" | "fill";
  strokeWidth: number;
  motion: SetMotionName;
  parts: SetPart[];
  accents: number[];
};

const SHAPES = new Set([
  "path",
  "circle",
  "rect",
  "line",
  "polyline",
  "polygon",
  "ellipse",
]);

function viewBoxSize(viewBox: string) {
  const numbers = viewBox
    .split(/[\s,]+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
  if (numbers.length !== 4 || numbers[2] <= 0) return 24;
  return numbers[2];
}

/*
 * The group recipe runs on the outer <svg>, so its distances are CSS pixels
 * and read the same for every family. Accents run on shapes inside the
 * viewBox: on Phosphor's 256-unit grid, only their x and y need the viewBox
 * factor. Rotation, scale, opacity and path lengths keep their authored
 * values, whatever shape their keyframes take.
 */
function scaleValue(value: unknown, factor: number): unknown {
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "number" ? item * factor : item,
    );
  }
  return typeof value === "number" ? value * factor : value;
}

function scaleTarget(value: unknown, factor: number): unknown {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
      if (key === "transition") {
        next[key] = entry;
      } else if (key === "x" || key === "y") {
        next[key] = scaleValue(entry, factor);
      } else if (entry && typeof entry === "object" && !Array.isArray(entry)) {
        next[key] = scaleTarget(entry, factor);
      } else {
        next[key] = entry;
      }
    }
    return next;
  }
  return value;
}

function scaleVariants(
  variants: Record<string, Variants>,
  factor: number,
): Record<string, Variants> {
  if (factor === 1) return variants;
  const next: Record<string, Variants> = {};
  for (const [part, states] of Object.entries(variants)) {
    next[part] = scaleTarget(states, factor) as Variants;
  }
  return next;
}

function SetIconFrame({
  definition,
  size = 28,
  ...props
}: IconProps & { definition: SetIconDefinition }) {
  const context = useAnimatedIconContext();
  const base = useIconVariants(
    SET_MOTIONS[definition.motion] ?? SET_MOTIONS.pop,
  );
  const factor = React.useMemo(() => {
    const box = viewBoxSize(definition.viewBox);
    return box === 24 ? 1 : box / 24;
  }, [definition.viewBox]);
  const accents = React.useMemo(
    () => scaleVariants(base, factor),
    [base, factor],
  );
  const controls: IconControls | undefined = context?.controls;
  const stroke = definition.mode === "stroke";

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={definition.viewBox}
      fill={stroke ? "none" : "currentColor"}
      stroke={stroke ? "currentColor" : "none"}
      strokeWidth={stroke ? definition.strokeWidth : undefined}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      variants={base.group}
      initial="initial"
      animate={controls}
      data-icon-set={definition.mode}
      {...props}
    >
      {definition.parts.map((part, index) => {
        if (!SHAPES.has(part.tag)) return null;
        const Component = (
          motion as unknown as Record<string, React.ElementType>
        )[part.tag];
        if (!Component) return null;
        const accented = definition.accents.includes(index);
        return (
          <Component
            key={`${definition.name}-${index}`}
            {...part.attrs}
            variants={accented ? accents.accent : undefined}
            initial={accented ? "initial" : undefined}
            animate={accented ? controls : undefined}
          />
        );
      })}
    </motion.svg>
  );
}

export function createSetIcon(definition: SetIconDefinition) {
  function SetIcon({ size = 28, ...props }: IconProps) {
    return <SetIconFrame definition={definition} size={size} {...props} />;
  }
  SetIcon.displayName = `SetIcon(${definition.name})`;
  return SetIcon;
}

export type SetCatalogItem = {
  name: string;
  category: string;
  icon: React.ComponentType<IconProps>;
};

export function catalogOf(
  entries: Array<[string, string, React.ComponentType<IconProps>]>,
): SetCatalogItem[] {
  return entries.map(([name, category, icon]) => ({ name, category, icon }));
}

export type { IconAnimationSet };
