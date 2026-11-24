"use client";

import * as React from "react";
import type { IconVariant, IconWeight, IconRole } from "@/lib/icon-styles";

export type { IconVariant, IconWeight, IconRole } from "@/lib/icon-styles";
export {
  ICON_VARIANTS,
  ICON_VARIANT_LABELS,
  ICON_VARIANT_SUFFIX,
  isIconVariant,
} from "@/lib/icon-styles";

export type IconPalette = {
  primary: string;
  primaryDark: string;
  accent: string;
  accentDark: string;
};

export type IconEmojiPalette = {
  primary: string;
  secondary: string;
  accent: string;
};

export type IconPaletteBundle = {
  color: IconPalette;
  emoji: IconEmojiPalette;
};

type IconPaintStyle = React.CSSProperties;

export type IconPaintApi = {
  variant: IconVariant;
  weight: IconWeight;
  part: (
    role: IconRole,
    closed: boolean,
    draw?: boolean,
    inside?: boolean,
  ) => IconPaintStyle;
  halo: (role: IconRole) => IconPaintStyle;
  flash: () => IconPaintStyle;
  sticker: () => IconPaintStyle;
  highlight: () => IconPaintStyle;
};

type IconStyleContextValue = {
  variant?: IconVariant;
  weight?: IconWeight;
};

const IconStyleContext = React.createContext<IconStyleContextValue>({});

export function IconStyleProvider({
  variant,
  weight,
  children,
}: {
  variant?: IconVariant;
  weight?: IconWeight;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => ({ variant, weight }), [variant, weight]);
  return (
    <IconStyleContext.Provider value={value}>{children}</IconStyleContext.Provider>
  );
}

export function useIconStyle() {
  return React.useContext(IconStyleContext);
}

function lightDark(light: string, dark: string) {
  return `light-dark(${light}, ${dark})`;
}

const INK = "light-dark(oklch(0.28 0.02 80 / 0.7), oklch(0.92 0.02 80 / 0.55))";

const OUTLINE_WIDTH: Record<IconWeight, number> = {
  light: 1.75,
  regular: 2,
  bold: 2.6,
};

const SOLID_WIDTH: Record<IconWeight, number> = {
  light: 2.4,
  regular: 2.8,
  bold: 3.2,
};

const EMOJI_WIDTH: Record<IconWeight, number> = {
  light: 2.3,
  regular: 2.6,
  bold: 3,
};

export function useIconPaint(
  palette?: IconPaletteBundle,
  localVariant?: IconVariant,
  localWeight?: IconWeight,
): IconPaintApi {
  const context = React.useContext(IconStyleContext);
  const variant = context.variant ?? localVariant ?? "outline";
  const weight = context.weight ?? localWeight ?? "regular";

  return React.useMemo(() => {
    const stroke = OUTLINE_WIDTH[weight];
    const solidOpen = SOLID_WIDTH[weight];
    const emojiStroke = EMOJI_WIDTH[weight];

    const primary = palette
      ? lightDark(palette.color.primary, palette.color.primaryDark)
      : "currentColor";
    const accent = palette
      ? lightDark(palette.color.accent, palette.color.accentDark)
      : "currentColor";
    const tint = `color-mix(in oklab, ${primary} var(--pi-tint, 22%), transparent)`;
    const emoji = palette?.emoji;
    const emojiPrimary = emoji?.primary ?? "currentColor";
    const emojiSecondary = emoji?.secondary ?? "currentColor";
    const emojiAccent = emoji?.accent ?? "currentColor";

    function part(
      role: IconRole,
      closed: boolean,
      draw = false,
      isInside = false,
    ): IconPaintStyle {
      if (variant === "solid") {
        if (isInside) {
          const cutout =
            "var(--pi-cutout, light-dark(oklch(1 0 0), oklch(0.145 0 0)))";
          return closed
            ? { fill: cutout, stroke: cutout, strokeWidth: draw ? stroke : 1 }
            : { fill: "none", stroke: cutout, strokeWidth: stroke };
        }
        if (closed) {
          return {
            fill: "currentColor",
            fillRule: "evenodd",
            stroke: "currentColor",
            strokeWidth: draw ? stroke : 1,
          };
        }
        return { fill: "none", stroke: "currentColor", strokeWidth: solidOpen };
      }

      if (variant === "duotone") {
        if (closed) {
          return {
            fill: "currentColor",
            fillOpacity: "var(--pi-secondary, 0.2)",
            fillRule: "evenodd",
            stroke: "currentColor",
            strokeWidth: stroke,
          };
        }
        return { fill: "none", stroke: "currentColor", strokeWidth: stroke };
      }

      if (variant === "color") {
        const tone = role === "accent" ? accent : primary;
        return {
          fill: closed ? tint : "none",
          fillRule: "evenodd",
          stroke: tone,
          strokeWidth: stroke,
        };
      }

      if (variant === "emoji") {
        if (closed) {
          return {
            fill: role === "accent" ? emojiAccent : emojiPrimary,
            fillRule: "evenodd",
            stroke: INK,
            strokeWidth: emojiStroke,
          };
        }
        return {
          fill: "none",
          stroke: role === "accent" ? emojiAccent : emojiPrimary,
          strokeWidth: emojiStroke,
        };
      }

      return { fill: "none", stroke: "currentColor", strokeWidth: stroke };
    }

    function halo(role: IconRole): IconPaintStyle {
      if (variant === "emoji") {
        return {
          fill: "none",
          stroke: INK,
          strokeWidth: emojiStroke + 1.6,
        };
      }
      if (variant === "duotone") {
        return {
          fill: "none",
          stroke: role === "accent" ? accent : primary,
          strokeOpacity: "var(--pi-secondary, 0.2)",
          strokeWidth: stroke + 4,
        };
      }
      return { display: "none" };
    }

    function flash(): IconPaintStyle {
      if (variant === "color") return { fill: primary };
      if (variant === "emoji") return { fill: emojiPrimary };
      if (variant === "duotone") {
        return {
          fill: "currentColor",
          fillOpacity: "var(--pi-secondary, 0.2)",
        };
      }
      return { fill: "currentColor" };
    }

    function sticker(): IconPaintStyle {
      if (!emoji) return { display: "none" };
      return {
        fill: emojiSecondary,
        fillOpacity: 0.26,
        stroke: INK,
        strokeOpacity: 0.22,
        strokeWidth: 1.2,
      };
    }

    function highlight(): IconPaintStyle {
      return {
        fill: "oklch(1 0 0)",
        fillOpacity: "var(--pi-highlight, 0.22)",
        stroke: "none",
      };
    }

    return {
      variant,
      weight,
      part,
      halo,
      flash,
      sticker,
      highlight,
    };
  }, [palette, variant, weight]);
}
