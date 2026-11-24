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
    "primary": "oklch(0.62 0.14 235)",
    "primaryDark": "oklch(0.79 0.11 235)",
    "accent": "oklch(0.74 0.16 85)",
    "accentDark": "oklch(0.85 0.13 85)"
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
        "opacity": 1
      },
      "animate": {
        "opacity": [
          1,
          0.4,
          1
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeInOut"
        }
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
        "opacity": 1
      },
      "animate": {
        "opacity": [
          0.3,
          1
        ],
        "transition": {
          "duration": 0.55,
          "ease": "easeOut"
        }
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
        "opacity": 1
      },
      "animate": {
        "opacity": [
          0.6,
          1,
          0.6
        ],
        "transition": {
          "duration": 1.6,
          "ease": "easeInOut"
        }
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

export function PrequelLightningIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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


      <motion.polygon
        key={`${variant}-p0`}
        className="pi-part"
        points={"13,2 5,13 11,13 9,22 19,10 13,10 13,2"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-flash`}
        className="pi-flash"
        d={"M13 2L5 13h6l-2 9 10-12h-6V2Z"}
        style={paintFlash()}
        variants={variants.fill}
        initial="initial"
        animate={controls}
      />
      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={9.2}
          cy={7.6}
          rx={2.24}
          ry={1.16}
          transform="rotate(-24 9.2 7.6)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
