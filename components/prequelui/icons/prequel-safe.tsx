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
    "primary": "oklch(0.58 0.14 168)",
    "primaryDark": "oklch(0.77 0.11 168)",
    "accent": "oklch(0.72 0.15 85)",
    "accentDark": "oklch(0.84 0.12 85)"
  },
  "emoji": {
    "primary": "oklch(0.78 0.14 165)",
    "secondary": "oklch(0.62 0.13 165)",
    "accent": "oklch(0.82 0.16 85)"
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
    "p2": {},
    "p3": {
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
    "p2": {},
    "p3": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          3,
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
    "p2": {},
    "p3": {
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
          "duration": 1.4,
          "ease": "easeInOut"
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelSafeIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M12 9.2v2.8l2 1"}
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
          d={"M17 9h1.5M17 12h1.5M17 15h1.5"}
          style={paintHalo("primary")}
          variants={variants.p3}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.rect
        key={`${variant}-p0`}
        className="pi-part"
        x={3}
        y={3}
        width={18}
        height={18}
        rx={2.5}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p1`}
        className="pi-part"
        cx={12}
        cy={12}
        r={4.2}
        style={paintPart("accent", true, false, true)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M12 9.2v2.8l2 1"}
        style={paintPart("primary", false, false, true)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p3`}
        className="pi-part"
        d={"M17 9h1.5M17 12h1.5M17 15h1.5"}
        style={paintPart("primary", false, false, true)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={8.4}
          cy={8.04}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 8.4 8.04)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
