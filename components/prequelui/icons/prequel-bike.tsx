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
    "p0": {},
    "p1": {},
    "p2": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "11px 15px"
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
        "transformOrigin": "11px 15px"
      }
    },
    "p3": {},
    "p4": {}
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
    "p0": {},
    "p1": {},
    "p2": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "11px 15px"
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
        "transformOrigin": "11px 15px"
      }
    },
    "p3": {},
    "p4": {}
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
    "p0": {},
    "p1": {},
    "p2": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "11px 15px"
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
        "transformOrigin": "11px 15px"
      }
    },
    "p3": {},
    "p4": {}
  }
} satisfies IconAnimationSet;

export function PrequelBikeIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          key={`${variant}-halo2`}
          className="pi-halo"
          data-paint="halo"
          d={"M6 17l4-6h4l4 6"}
          style={paintHalo("primary")}
          variants={variants.p2}
          initial="initial"
          animate={controls}
        />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo3`}
          className="pi-halo"
          data-paint="halo"
          d={"M10 11h3a1 1 0 0 1 0 2h-3"}
          style={paintHalo("primary")}
          variants={variants.p3}
          initial="initial"
          animate={controls}
        />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo4`}
          className="pi-halo"
          data-paint="halo"
          d={"M9.5 11l2 6"}
          style={paintHalo("primary")}
          variants={variants.p4}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.circle
        key={`${variant}-p0`}
        className="pi-part"
        cx={6}
        cy={17}
        r={3.5}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p1`}
        className="pi-part"
        cx={18}
        cy={17}
        r={3.5}
        style={paintPart("accent", true, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M6 17l4-6h4l4 6"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p3`}
        className="pi-part"
        d={"M10 11h3a1 1 0 0 1 0 2h-3"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p4`}
        className="pi-part"
        d={"M9.5 11l2 6"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p4}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={4.6}
          cy={15.46}
          rx={1.12}
          ry={0.7}
          transform="rotate(-24 4.6 15.46)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
