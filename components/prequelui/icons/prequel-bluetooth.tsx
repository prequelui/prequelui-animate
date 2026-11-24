"use client";

import { motion, type SVGMotionProps } from "motion/react";
import {
  useAnimatedIconContext,
  useIconVariants,
  type IconAnimationSet,
} from "./core";
import {
  useIconPaint,
  type IconPaletteBundle,
  type IconVariant,
} from "./style";

export type IconProps = Omit<SVGMotionProps<SVGSVGElement>, "ref"> & {
  size?: number;
  variant?: IconVariant;
};

const palette: IconPaletteBundle = {
  "color": {
    "primary": "oklch(0.64 0.12 195)",
    "primaryDark": "oklch(0.8 0.1 195)",
    "accent": "oklch(0.68 0.14 170)",
    "accentDark": "oklch(0.8 0.12 170)"
  },
  "emoji": {
    "primary": "oklch(0.78 0.14 165)",
    "secondary": "oklch(0.62 0.13 165)",
    "accent": "oklch(0.74 0.13 232)"
  }
};

export const animations = {
  "hover": {
    "group": {
      "initial": {
        "rotate": 0
      },
      "animate": {
        "rotate": [
          0,
          18,
          0
        ],
        "transition": {
          "duration": 0.55,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {}
  },
  "tap": {
    "group": {
      "initial": {
        "rotate": 0
      },
      "animate": {
        "rotate": [
          0,
          180,
          360
        ],
        "transition": {
          "duration": 0.8,
          "ease": [
            0.22,
            1,
            0.36,
            1
          ]
        }
      }
    },
    "p0": {}
  },
  "loop": {
    "group": {
      "initial": {
        "rotate": 0
      },
      "animate": {
        "rotate": [
          0,
          360
        ],
        "transition": {
          "duration": 1.8,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {}
  }
} satisfies IconAnimationSet;

export function PrequelBluetoothIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
  const context = useAnimatedIconContext();
  const variants = useIconVariants(animations);
  const controls = context?.controls;
  const {
    variant,
    weight,
    part: paintPart,
    halo: paintHalo,
    flash: paintFlash,
    sticker: paintSticker,
    highlight: paintHighlight,
  } = useIconPaint(palette, variantProp);

  // Generated icons use a subset of these painters; marking them keeps the
  // file buildable in projects that enable noUnusedLocals.
  void paintPart;
  void paintHalo;
  void paintFlash;
  void paintSticker;
  void paintHighlight;

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-icon-style={variant}
      data-icon-weight={weight}
      variants={variants.group}
      initial="initial"
      animate={controls}
      {...props}
    >
      {variant === "emoji" && (
        <rect className="pi-sticker" x={2} y={2} width={20} height={20} rx={7} style={paintSticker()} />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo0`}
          className="pi-halo"
          data-paint="halo"
          d={"M7 7l10 10-5 5V2l5 5L7 17"}
          style={paintHalo("primary")}
          variants={variants.p0}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M7 7l10 10-5 5V2l5 5L7 17"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />


    </motion.svg>
  );
}
