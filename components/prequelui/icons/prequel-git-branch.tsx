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
        "opacity": 1,
        "scale": 1
      },
      "animate": {
        "opacity": [
          1,
          0.55,
          1
        ],
        "scale": [
          1,
          1.06,
          1
        ],
        "transition": {
          "duration": 0.55,
          "ease": "easeInOut",
          "delay": 0.06
        }
      }
    },
    "p3": {
      "initial": {
        "pathLength": 1,
        "opacity": 1
      },
      "animate": {
        "pathLength": [
          0,
          1
        ],
        "opacity": [
          0.35,
          1
        ],
        "transition": {
          "duration": 0.65,
          "ease": "easeInOut"
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
        "opacity": 1,
        "scale": 1
      },
      "animate": {
        "opacity": [
          1,
          0.4,
          1
        ],
        "scale": [
          1,
          1.14,
          1
        ],
        "transition": {
          "duration": 0.55,
          "ease": [
            0.22,
            1,
            0.36,
            1
          ],
          "delay": 0.06
        }
      }
    },
    "p3": {
      "initial": {
        "pathLength": 1,
        "opacity": 1
      },
      "animate": {
        "pathLength": [
          0,
          1
        ],
        "opacity": [
          0.35,
          1
        ],
        "transition": {
          "duration": 0.8,
          "ease": "easeInOut"
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
          "duration": 1.6,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {},
    "p1": {},
    "p2": {
      "initial": {
        "opacity": 1,
        "scale": 1
      },
      "animate": {
        "opacity": [
          1,
          0.55,
          1
        ],
        "scale": [
          1,
          1.05,
          1
        ],
        "transition": {
          "duration": 1.5,
          "ease": "easeInOut",
          "delay": 0.06
        }
      }
    },
    "p3": {
      "initial": {
        "pathLength": 1,
        "opacity": 1
      },
      "animate": {
        "pathLength": [
          1,
          0.15,
          1
        ],
        "opacity": [
          1,
          0.6,
          1
        ],
        "transition": {
          "duration": 1.7,
          "ease": "easeInOut"
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelGitBranchIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          key={`${variant}-halo3`}
          className="pi-halo"
          data-paint="halo"
          d={"M18 8.5v2a4 4 0 0 1-4 4H6"}
          style={paintHalo("primary")}
          variants={variants.p3}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.circle
        key={`${variant}-p0`}
        className="pi-part"
        cx={6}
        cy={6}
        r={2.3}
        style={paintPart("accent", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p1`}
        className="pi-part"
        cx={6}
        cy={18}
        r={2.3}
        style={paintPart("primary", true, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p2`}
        className="pi-part"
        cx={18}
        cy={6}
        r={2.3}
        style={paintPart("accent", true, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p3`}
        className="pi-part"
        d={"M18 8.5v2a4 4 0 0 1-4 4H6"}
        style={paintPart("primary", false, true, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={5.08}
          cy={16.99}
          rx={1.1}
          ry={0.7}
          transform="rotate(-24 5.08 16.99)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
