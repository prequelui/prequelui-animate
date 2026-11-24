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
        "scale": 1
      },
      "animate": {
        "scale": [
          1,
          1.05,
          1
        ],
        "transition": {
          "duration": 0.55,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {},
    "p1": {},
    "p2": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "0% 50%"
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
        "transformOrigin": "0% 50%"
      }
    }
  },
  "tap": {
    "group": {
      "initial": {
        "scale": 1
      },
      "animate": {
        "scale": [
          1,
          1.15,
          1
        ],
        "transition": {
          "duration": 0.5,
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
    "p1": {},
    "p2": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "0% 50%"
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
        "transformOrigin": "0% 50%"
      }
    }
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
          "duration": 1.6,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {},
    "p1": {},
    "p2": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "0% 50%"
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
        "transformOrigin": "0% 50%"
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelBatteryIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M22 11v2"}
          style={paintHalo("primary")}
          variants={variants.p1}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.rect
        key={`${variant}-p0`}
        className="pi-part"
        x={2}
        y={7}
        width={18}
        height={10}
        rx={2.5}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M22 11v2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        key={`${variant}-p2`}
        className="pi-part"
        x={5}
        y={10}
        width={4.5}
        height={4}
        rx={1}
        style={paintPart("accent", true, false, true)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={7.4}
          cy={9.8}
          rx={2}
          ry={1.04}
          transform="rotate(-24 7.4 9.8)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
