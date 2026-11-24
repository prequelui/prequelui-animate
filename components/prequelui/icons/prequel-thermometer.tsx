"use client";

import * as React from "react";
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
    "primary": "oklch(0.6 0.18 15)",
    "primaryDark": "oklch(0.78 0.13 15)",
    "accent": "oklch(0.68 0.13 190)",
    "accentDark": "oklch(0.81 0.1 190)"
  },
  "emoji": {
    "primary": "oklch(0.68 0.2 27)",
    "secondary": "oklch(0.54 0.19 25)",
    "accent": "oklch(0.78 0.14 165)"
  }
};

export const animations = {
  "hover": {
    "group": {
      "initial": {
        "scale": 1
      },
      "animate": {
        "scale": [
          1,
          1.06,
          1
        ],
        "transition": {
          "duration": 0.45,
          "ease": "easeOut"
        }
      }
    },
    "p0": {},
    "p1": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
      },
      "animate": {
        "scaleY": [
          0.65,
          1.05,
          1
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeOut"
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p2": {}
  },
  "tap": {
    "group": {
      "initial": {
        "scale": 1
      },
      "animate": {
        "scale": [
          1,
          0.9,
          1.14,
          0.98,
          1
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
    },
    "p0": {},
    "p1": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
      },
      "animate": {
        "scaleY": [
          0.4,
          1.08,
          1
        ],
        "transition": {
          "duration": 0.55,
          "ease": [
            0.22,
            1,
            0.36,
            1
          ]
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p2": {}
  },
  "loop": {
    "group": {
      "initial": {
        "scale": 1
      },
      "animate": {
        "scale": [
          1,
          1.04,
          1
        ],
        "transition": {
          "duration": 1.5,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {},
    "p1": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
      },
      "animate": {
        "scaleY": [
          0.7,
          1.04,
          0.7
        ],
        "transition": {
          "duration": 1.5,
          "ease": "easeInOut"
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p2": {}
  }
} satisfies IconAnimationSet;

export function PrequelThermometerIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          key={`${variant}-halo2`}
          className="pi-halo"
          data-paint="halo"
          d={"M16 7h2M16 10h2M16 13h2"}
          style={paintHalo("primary")}
          variants={variants.p2}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        key={`${variant}-p1`}
        className="pi-part"
        x={11}
        y={9}
        width={2}
        height={6}
        rx={1}
        style={paintPart("accent", true, false, true)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M16 7h2M16 10h2M16 13h2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={9}
          cy={7.06}
          rx={1.6}
          ry={0.83}
          transform="rotate(-24 9 7.06)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
