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
    "primary": "oklch(0.58 0.16 275)",
    "primaryDark": "oklch(0.77 0.13 275)",
    "accent": "oklch(0.7 0.16 250)",
    "accentDark": "oklch(0.82 0.13 250)"
  },
  "emoji": {
    "primary": "oklch(0.6 0.2 300)",
    "secondary": "oklch(0.46 0.18 300)",
    "accent": "oklch(0.78 0.14 165)"
  }
};

export const animations = {
  "hover": {
    "group": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          1.5,
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
        "rotate": 0,
        "transformOrigin": "12px 12px"
      },
      "animate": {
        "rotate": [
          0,
          25,
          0
        ],
        "transition": {
          "duration": 0.55,
          "ease": "easeInOut"
        },
        "transformOrigin": "12px 12px"
      }
    },
    "p1": {}
  },
  "tap": {
    "group": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          5,
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
        "rotate": 0,
        "transformOrigin": "12px 12px"
      },
      "animate": {
        "rotate": [
          0,
          360
        ],
        "transition": {
          "duration": 0.85,
          "ease": [
            0.22,
            1,
            0.36,
            1
          ]
        },
        "transformOrigin": "12px 12px"
      }
    },
    "p1": {}
  },
  "loop": {
    "group": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          2.4,
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
        "rotate": 0,
        "transformOrigin": "12px 12px"
      },
      "animate": {
        "rotate": [
          0,
          360
        ],
        "transition": {
          "duration": 1.8,
          "ease": "easeInOut"
        },
        "transformOrigin": "12px 12px"
      }
    },
    "p1": {}
  }
} satisfies IconAnimationSet;

export function PrequelGitCommitIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M3 12h5.5M15.5 12H21"}
          style={paintHalo("primary")}
          variants={variants.p1}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.circle
        key={`${variant}-p0`}
        className="pi-part"
        cx={12}
        cy={12}
        r={3.5}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M3 12h5.5M15.5 12H21"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={10.6}
          cy={10.46}
          rx={1.12}
          ry={0.7}
          transform="rotate(-24 10.6 10.46)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
