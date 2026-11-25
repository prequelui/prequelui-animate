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
    "primary": "oklch(0.62 0.18 330)",
    "primaryDark": "oklch(0.79 0.14 330)",
    "accent": "oklch(0.72 0.16 355)",
    "accentDark": "oklch(0.84 0.13 355)"
  },
  "emoji": {
    "primary": "oklch(0.62 0.22 350)",
    "secondary": "oklch(0.48 0.2 350)",
    "accent": "oklch(0.6 0.2 300)"
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
          "ease": "easeInOut"
        }
      }
    },
    "p2": {
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
          ]
        }
      }
    },
    "p2": {
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
          "duration": 1.5,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {},
    "p1": {
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
          "ease": "easeInOut"
        }
      }
    },
    "p2": {
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

export function PrequelImageIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M5 18l5-5 4 4 3-3 3 3"}
          style={paintHalo("primary")}
          variants={variants.p2}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.rect
        key={`${variant}-p0`}
        className="pi-part"
        x={3}
        y={4}
        width={18}
        height={16}
        rx={2.5}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p1`}
        className="pi-part"
        cx={8.5}
        cy={9}
        r={1.7}
        style={paintPart("accent", true, false, true)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M5 18l5-5 4 4 3-3 3 3"}
        style={paintPart("primary", false, true, true)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={8.4}
          cy={8.48}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 8.4 8.48)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
