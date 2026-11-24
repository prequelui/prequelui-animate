"use client";

import * as React from "react";
import { useHydratedReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export type CategoryPictogramPart = {
  d: string;
  fill?: boolean;
  width?: number;
  opacity?: number;
  transform?: string;
};

export type CategoryPictogramMotion = {
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
};

export type CategoryPictogramDefinition = {
  slug: string;
  name: string;
  group: string;
  theme: string;
  keywords: string[];
  description: string;
  motion: string;
  ink: CategoryPictogramPart[];
  accent: CategoryPictogramPart[];
  palette: { light: [string, string]; dark: [string, string] };
  motionConfig: {
    main: CategoryPictogramMotion;
    accent: CategoryPictogramMotion;
  };
};

export type CategoryPictogramProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  definition: CategoryPictogramDefinition;
  size?: number;
  active?: boolean;
  animateOnHover?: boolean;
  label?: string;
};

const BASE = { x: 0, y: 0, rotate: 0, scale: 1 };
const PICTURE_EASE = "cubic-bezier(0.34, 1.3, 0.64, 1)";

/*
 * The artwork is authored in a 1024 grid with generous padding so the accents
 * can breathe. Displayed in a 40 px slot, that padding made the glyph read like
 * a 20 px icon. Scaling the art around the centre brings the visual keyline to
 * the measured 28-30 px while the stroke is counter-scaled to stay hairline.
 */
const ART_SCALE = 1.32;
const ART_TRANSFORM = `translate(512 512) scale(${ART_SCALE}) translate(-512 -512)`;
const INK_STROKE = 23;
/* The reference builds its keylines as filled bands, which read a touch
   heavier than a 0.9 px stroke. A small optical boost keeps the same presence
   without leaving the hairline family. */
const STROKE_BOOST = 1.12;

function targetOf(
  base: CategoryPictogramMotion,
  motion: CategoryPictogramMotion | undefined,
): CategoryPictogramMotion {
  return { ...base, ...(motion ?? {}) };
}

function escapeXml(value: string | number) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function categoryGradient(
  definition: CategoryPictogramDefinition,
  id: string,
) {
  const { light, dark } = definition.palette;
  return `<linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop stop-color="light-dark(${light[0]}, ${dark[0]})"/><stop offset="1" stop-color="light-dark(${light[1]}, ${dark[1]})"/></linearGradient>`;
}

function accentMarkup(part: CategoryPictogramPart, gradientId: string) {
  return `<path d="${escapeXml(part.d)}"${part.transform ? ` transform="${escapeXml(part.transform)}"` : ""} fill="url(#${gradientId})"${part.opacity !== undefined ? ` opacity="${part.opacity}"` : ""}/>`;
}

function inkMarkup(part: CategoryPictogramPart) {
  const transform = part.transform ? ` transform="${escapeXml(part.transform)}"` : "";
  if (part.fill) {
    return `<path d="${escapeXml(part.d)}"${transform} fill="currentColor" fill-rule="evenodd"${part.opacity !== undefined ? ` opacity="${part.opacity}"` : ""}/>`;
  }
  const width = ((part.width ?? INK_STROKE) * STROKE_BOOST) / ART_SCALE;
  return `<path d="${escapeXml(part.d)}"${transform} fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${part.opacity !== undefined ? ` opacity="${part.opacity}"` : ""}/>`;
}

export function buildCategorySvg(
  definition: CategoryPictogramDefinition,
  size = 40,
) {
  const gradientId = `cat-${definition.slug}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024" fill="none" style="color-scheme: light dark" aria-hidden="true"><defs>${categoryGradient(definition, gradientId)}</defs><g transform="${ART_TRANSFORM}"><g>${definition.accent.map((part) => accentMarkup(part, gradientId)).join("")}</g><g>${definition.ink.map(inkMarkup).join("")}</g></g></svg>`;
}

export function CategoryPictogram({
  definition,
  size = 40,
  active,
  animateOnHover = true,
  label,
  className,
  onPointerEnter,
  onPointerLeave,
  ...props
}: CategoryPictogramProps) {
  const reactId = React.useId();
  const gradientId = `cat-${definition.slug}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const reduce = useHydratedReducedMotion();
  const [hovered, setHovered] = React.useState(false);
  const isActive =
    !!animateOnHover && !reduce && (active === undefined ? hovered : active);
  const { light, dark } = definition.palette;

  const mainTarget = targetOf(BASE, isActive ? definition.motionConfig.main : undefined);
  const accentTarget = targetOf(
    BASE,
    isActive ? definition.motionConfig.accent : undefined,
  );
  const transformOf = (target: CategoryPictogramMotion) =>
    `translate3d(${target.x ?? 0}px, ${target.y ?? 0}px, 0) rotate(${target.rotate ?? 0}deg) scale(${target.scale ?? 1})`;
  const transition = reduce
    ? "none"
    : `transform 520ms ${PICTURE_EASE}`;

  const accessibility = label
    ? { role: "img" as const, "aria-label": label }
    : { "aria-hidden": true as const };

  return (
    <span
      {...props}
      data-category-pictogram-host=""
      data-active={active && animateOnHover ? "true" : undefined}
      className={cn("inline-flex shrink-0 items-center justify-center", className)}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (animateOnHover) setHovered(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setHovered(false);
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 1024 1024"
        fill="none"
        data-category-pictogram={definition.slug}
        data-category-motion={definition.motion}
        {...accessibility}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
            <stop stopColor={`light-dark(${light[0]}, ${dark[0]})`} />
            <stop offset="1" stopColor={`light-dark(${light[1]}, ${dark[1]})`} />
          </linearGradient>
        </defs>
        <g transform={ART_TRANSFORM}>
          <g
            data-category-accents=""
            fill={`url(#${gradientId})`}
            style={{
              transform: transformOf(accentTarget),
              transition,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            {definition.accent.map((part, index) => (
              <path
                key={`a${index}`}
                d={part.d}
                transform={part.transform}
                opacity={part.opacity}
              />
            ))}
          </g>
          <g
            data-category-ink=""
            style={{
              transform: transformOf(mainTarget),
              transition,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            {definition.ink.map((part, index) =>
              part.fill ? (
                <path
                  key={`i${index}`}
                  d={part.d}
                  transform={part.transform}
                  fill="currentColor"
                  fillRule="evenodd"
                  opacity={part.opacity}
                />
              ) : (
                <path
                  key={`i${index}`}
                  d={part.d}
                  transform={part.transform}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={
                    ((part.width ?? INK_STROKE) * STROKE_BOOST) / ART_SCALE
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={part.opacity}
                />
              ),
            )}
          </g>
        </g>
      </svg>
    </span>
  );
}
