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
          1.05,
          1
        ],
        "transition": {
          "duration": 0.55,
          "ease": "easeInOut"
        }
      }
    },
    "p0": {
      "initial": {
        "scaleY": 1
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
        }
      }
    },
    "p1": {
      "initial": {
        "scaleY": 1
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
    "p0": {
      "initial": {
        "scaleY": 1
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
        }
      }
    },
    "p1": {
      "initial": {
        "scaleY": 1
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
    "p0": {
      "initial": {
        "scaleY": 1
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
        }
      }
    },
    "p1": {
      "initial": {
        "scaleY": 1
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
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelPauseIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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


      <motion.rect
        key={`${variant}-p0`}
        className="pi-part"
        x={7}
        y={5}
        width={3.5}
        height={14}
        rx={1.5}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        key={`${variant}-p1`}
        className="pi-part"
        x={13.5}
        y={5}
        width={3.5}
        height={14}
        rx={1.5}
        style={paintPart("accent", true, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={8.05}
          cy={8.92}
          rx={1.1}
          ry={0.7}
          transform="rotate(-24 8.05 8.92)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
