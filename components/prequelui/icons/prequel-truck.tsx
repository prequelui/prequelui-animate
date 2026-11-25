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
    "primary": "oklch(0.62 0.14 160)",
    "primaryDark": "oklch(0.8 0.11 160)",
    "accent": "oklch(0.7 0.16 130)",
    "accentDark": "oklch(0.82 0.13 130)"
  },
  "emoji": {
    "primary": "oklch(0.82 0.18 130)",
    "secondary": "oklch(0.66 0.16 130)",
    "accent": "oklch(0.72 0.19 48)"
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

export function PrequelDeliveryTruckIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M14 9h4l3 3v5h-7"}
          style={paintHalo("primary")}
          variants={variants.p1}
          initial="initial"
          animate={controls}
        />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo4`}
          className="pi-halo"
          data-paint="halo"
          d={"M6 10h4"}
          style={paintHalo("primary")}
          variants={variants.p4}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M3 6h11v11H3V6Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M14 9h4l3 3v5h-7"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p2`}
        className="pi-part"
        cx={7}
        cy={19}
        r={1.8}
        style={paintPart("accent", true, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p3`}
        className="pi-part"
        cx={17.5}
        cy={19}
        r={1.8}
        style={paintPart("accent", true, false, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p4`}
        className="pi-part"
        d={"M6 10h4"}
        style={paintPart("primary", false, false, true)}
        variants={variants.p4}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={6.3}
          cy={9.08}
          rx={1.76}
          ry={0.92}
          transform="rotate(-24 6.3 9.08)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
