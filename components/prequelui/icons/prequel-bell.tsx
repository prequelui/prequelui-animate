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
    "primary": "oklch(0.68 0.17 50)",
    "primaryDark": "oklch(0.83 0.13 50)",
    "accent": "oklch(0.62 0.18 25)",
    "accentDark": "oklch(0.78 0.14 25)"
  },
  "emoji": {
    "primary": "oklch(0.68 0.2 27)",
    "secondary": "oklch(0.54 0.19 25)",
    "accent": "oklch(0.82 0.16 85)"
  }
};

export const animations = {
  "hover": {
    "group": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "top center"
      },
      "animate": {
        "rotate": [
          0,
          -6,
          5,
          -3,
          0
        ],
        "transition": {
          "duration": 0.6,
          "ease": "easeInOut"
        },
        "transformOrigin": "top center"
      }
    },
    "p0": {},
    "p1": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -2.5,
          2.5,
          -1.5,
          0
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeInOut"
        }
      }
    }
  },
  "tap": {
    "group": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "top center"
      },
      "animate": {
        "rotate": [
          0,
          -14,
          12,
          -8,
          4,
          0
        ],
        "transition": {
          "duration": 0.95,
          "ease": "easeInOut"
        },
        "transformOrigin": "top center"
      }
    },
    "p0": {},
    "p1": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -4,
          4,
          -3,
          2,
          0
        ],
        "transition": {
          "duration": 0.75,
          "ease": "easeInOut"
        }
      }
    }
  },
  "loop": {
    "group": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "top center"
      },
      "animate": {
        "rotate": [
          0,
          -4,
          4,
          0
        ],
        "transition": {
          "duration": 1.6,
          "ease": "easeInOut"
        },
        "transformOrigin": "top center"
      }
    },
    "p0": {},
    "p1": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -2,
          2,
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

export function PrequelBellIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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

      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo1`}
          className="pi-halo"
          data-paint="halo"
          d={"M10 20a2 2 0 0 0 4 0"}
          style={paintHalo("primary")}
          variants={variants.p1}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M6 9a6 6 0 0 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M10 20a2 2 0 0 0 4 0"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={10}
          cy={6.64}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 10 6.64)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
