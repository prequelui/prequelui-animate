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
    "primary": "oklch(0.6 0.16 290)",
    "primaryDark": "oklch(0.78 0.13 290)",
    "accent": "oklch(0.7 0.15 310)",
    "accentDark": "oklch(0.82 0.12 310)"
  },
  "emoji": {
    "primary": "oklch(0.6 0.2 300)",
    "secondary": "oklch(0.46 0.18 300)",
    "accent": "oklch(0.68 0.2 27)"
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
          1.03,
          1
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeOut"
        }
      }
    },
    "p0": {},
    "p1": {
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
    },
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
        }
      }
    },
    "p0": {},
    "p1": {
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
    },
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
          1.02,
          1
        ],
        "transition": {
          "duration": 1.6,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {},
    "p1": {
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
    },
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
          "ease": "easeInOut"
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelChartPieIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M12 3a9 9 0 1 0 9 9"}
          style={paintHalo("primary")}
          variants={variants.p0}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M12 3a9 9 0 1 0 9 9"}
        style={paintPart("primary", false, false, true)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M12 3a9 9 0 0 1 9 9h-9V3Z"}
        style={paintPart("primary", true, true, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.circle
        key={`${variant}-p2`}
        className="pi-part"
        cx={12}
        cy={12}
        r={1}
        style={paintPart("accent", true, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={17.4}
          cy={8.04}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 17.4 8.04)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
