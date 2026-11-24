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
    "primary": "oklch(0.64 0.16 355)",
    "primaryDark": "oklch(0.81 0.12 355)",
    "accent": "oklch(0.72 0.14 20)",
    "accentDark": "oklch(0.84 0.11 20)"
  },
  "emoji": {
    "primary": "oklch(0.68 0.2 27)",
    "secondary": "oklch(0.54 0.19 25)",
    "accent": "oklch(0.62 0.22 350)"
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
    "p0": {
      "initial": {
        "scale": 1,
        "transformOrigin": "center"
      },
      "animate": {
        "scale": [
          1,
          1.07,
          1
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeOut"
        },
        "transformOrigin": "center"
      }
    },
    "fill": {
      "initial": {
        "opacity": 0
      },
      "animate": {
        "opacity": [
          0,
          0.35,
          0
        ],
        "transition": {
          "duration": 0.6,
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
    "p0": {
      "initial": {
        "scale": 1,
        "transformOrigin": "center"
      },
      "animate": {
        "scale": [
          1,
          0.9,
          1.16,
          0.97,
          1
        ],
        "transition": {
          "duration": 0.65,
          "ease": "easeInOut"
        },
        "transformOrigin": "center"
      }
    },
    "fill": {
      "initial": {
        "opacity": 0
      },
      "animate": {
        "opacity": [
          0,
          0.55,
          0
        ],
        "transition": {
          "duration": 0.85,
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
    "p0": {
      "initial": {
        "scale": 1,
        "transformOrigin": "center"
      },
      "animate": {
        "scale": [
          1,
          1.05,
          1
        ],
        "transition": {
          "duration": 1.4,
          "ease": "easeInOut"
        },
        "transformOrigin": "center"
      }
    },
    "fill": {
      "initial": {
        "opacity": 0
      },
      "animate": {
        "opacity": [
          0,
          0.25,
          0
        ],
        "transition": {
          "duration": 1.8,
          "ease": "easeInOut"
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelStarIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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


      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-flash`}
        className="pi-flash"
        d={"M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9L12 3Z"}
        style={paintFlash()}
        variants={variants.fill}
        initial="initial"
        animate={controls}
      />
      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={8.4}
          cy={7.76}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 8.4 7.76)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
