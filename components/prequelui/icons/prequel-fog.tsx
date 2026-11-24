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
    "p1": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -1.5,
          0
        ],
        "transition": {
          "duration": 0.45,
          "ease": "easeOut"
        }
      }
    },
    "p2": {
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
          "ease": "easeOut",
          "delay": 0.05
        }
      }
    },
    "p3": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -1.5,
          0
        ],
        "transition": {
          "duration": 0.45,
          "ease": "easeOut",
          "delay": 0.1
        }
      }
    }
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
    "p1": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -3,
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
    },
    "p2": {
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
          ],
          "delay": 0.05
        }
      }
    },
    "p3": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -3,
          0
        ],
        "transition": {
          "duration": 0.55,
          "ease": [
            0.22,
            1,
            0.36,
            1
          ],
          "delay": 0.1
        }
      }
    }
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
    "p1": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
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
    "p2": {
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
          "ease": "easeInOut",
          "delay": 0.05
        }
      }
    },
    "p3": {
      "initial": {
        "x": 0
      },
      "animate": {
        "x": [
          0,
          -1.5,
          0
        ],
        "transition": {
          "duration": 1.4,
          "ease": "easeInOut",
          "delay": 0.1
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelFogIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          key={`${variant}-halo1`}
          className="pi-halo"
          data-paint="halo"
          d={"M4 15h16"}
          style={paintHalo("primary")}
          variants={variants.p1}
          initial="initial"
          animate={controls}
        />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo2`}
          className="pi-halo"
          data-paint="halo"
          d={"M6 18h12"}
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
          d={"M4 21h10"}
          style={paintHalo("primary")}
          variants={variants.p3}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M6.5 11h10a3.2 3.2 0 0 0 .4-6.4A5 5 0 0 0 7.4 4 3.8 3.8 0 0 0 6.5 11Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M4 15h16"}
        style={paintPart("primary", false, false, true)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M6 18h12"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p3`}
        className="pi-part"
        d={"M4 21h10"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={7.71}
          cy={3.5}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 7.71 3.5)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
