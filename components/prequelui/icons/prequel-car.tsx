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
          -2,
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
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -2,
          0
        ],
        "transition": {
          "duration": 0.45,
          "ease": "easeOut"
        }
      }
    },
    "p3": {
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
          "duration": 0.45,
          "ease": "easeOut"
        }
      }
    },
    "p4": {}
  },
  "tap": {
    "group": {
      "initial": {
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -6,
          0
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
        "y": 0
      },
      "animate": {
        "y": [
          0,
          -4,
          0
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
    "p3": {
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
    "p4": {}
  },
  "loop": {
    "group": {
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
    },
    "p0": {},
    "p1": {},
    "p2": {
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
          "duration": 1.4,
          "ease": "easeInOut"
        }
      }
    },
    "p3": {
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
          "duration": 1.4,
          "ease": "easeInOut"
        }
      }
    },
    "p4": {}
  }
} satisfies IconAnimationSet;

export function PrequelCarIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          key={`${variant}-halo0`}
          className="pi-halo"
          data-paint="halo"
          d={"M5 16l1.5-6.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16"}
          style={paintHalo("primary")}
          variants={variants.p0}
          initial="initial"
          animate={controls}
        />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo4`}
          className="pi-halo"
          data-paint="halo"
          d={"M8 12h8"}
          style={paintHalo("primary")}
          variants={variants.p4}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M5 16l1.5-6.5A2 2 0 0 1 8.4 8h7.2a2 2 0 0 1 1.9 1.5L19 16"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        key={`${variant}-p1`}
        className="pi-part"
        x={3}
        y={15}
        width={18}
        height={3.5}
        rx={1.5}
        style={paintPart("primary", true, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p2`}
        className="pi-part"
        cx={7.5}
        cy={19.5}
        r={1.7}
        style={paintPart("accent", true, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p3`}
        className="pi-part"
        cx={16.5}
        cy={19.5}
        r={1.7}
        style={paintPart("accent", true, false, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p4`}
        className="pi-part"
        d={"M8 12h8"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p4}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={8.4}
          cy={15.98}
          rx={1.1}
          ry={0.7}
          transform="rotate(-24 8.4 15.98)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
