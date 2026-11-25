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
    "primary": "oklch(0.56 0.1 225)",
    "primaryDark": "oklch(0.78 0.08 225)",
    "accent": "oklch(0.66 0.13 200)",
    "accentDark": "oklch(0.8 0.1 200)"
  },
  "emoji": {
    "primary": "oklch(0.74 0.13 232)",
    "secondary": "oklch(0.58 0.13 232)",
    "accent": "oklch(0.82 0.16 85)"
  }
};

export const animations = {
  "hover": {
    "group": {
      "initial": {
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -1.5,
          0
        ],
        "transition": {
          "duration": 0.45,
          "ease": "easeOut"
        }
      }
    },
    "p0": {
      "initial": {
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -1.5,
          0
        ],
        "transition": {
          "duration": 0.45,
          "ease": "easeOut"
        }
      }
    }
  },
  "tap": {
    "group": {
      "initial": {
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -5,
          0
        ],
        "transition": {
          "duration": 0.6,
          "ease": [
            0.22,
            1,
            0.36,
            1
          ]
        }
      }
    },
    "p0": {
      "initial": {
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -4,
          0
        ],
        "transition": {
          "duration": 0.55,
          "ease": [
            0.22,
            1,
            0.36,
            1
          ]
        }
      }
    }
  },
  "loop": {
    "group": {
      "initial": {
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -2.4,
          0
        ],
        "transition": {
          "duration": 1.5,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {
      "initial": {
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -2,
          0
        ],
        "transition": {
          "duration": 1.4,
          "ease": "easeInOut"
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelPlaneIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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


      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M12 2c1 0 2 1.5 2 3.5V9l7 4v2l-7-2v4l2 2v2l-4-1-4 1v-2l2-2v-4l-7 2v-2l7-4V5.5C10 3.5 11 2 12 2Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={8.4}
          cy={7.32}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 8.4 7.32)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
