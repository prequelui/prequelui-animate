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
        "scaleY": 1,
        "transformOrigin": "50% 100%"
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
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p2": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
      },
      "animate": {
        "scaleY": [
          0.65,
          1.05,
          1
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeOut",
          "delay": 0.05
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p3": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
      },
      "animate": {
        "scaleY": [
          0.65,
          1.05,
          1
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeOut",
          "delay": 0.1
        },
        "transformOrigin": "50% 100%"
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
        "scaleY": 1,
        "transformOrigin": "50% 100%"
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
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p2": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
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
          ],
          "delay": 0.05
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p3": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
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
          ],
          "delay": 0.1
        },
        "transformOrigin": "50% 100%"
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
        "scaleY": 1,
        "transformOrigin": "50% 100%"
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
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p2": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
      },
      "animate": {
        "scaleY": [
          0.7,
          1.04,
          0.7
        ],
        "transition": {
          "duration": 1.5,
          "ease": "easeInOut",
          "delay": 0.05
        },
        "transformOrigin": "50% 100%"
      }
    },
    "p3": {
      "initial": {
        "scaleY": 1,
        "transformOrigin": "50% 100%"
      },
      "animate": {
        "scaleY": [
          0.7,
          1.04,
          0.7
        ],
        "transition": {
          "duration": 1.5,
          "ease": "easeInOut",
          "delay": 0.1
        },
        "transformOrigin": "50% 100%"
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelChartBarIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M4 20h16"}
          style={paintHalo("primary")}
          variants={variants.p0}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M4 20h16"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        key={`${variant}-p1`}
        className="pi-part"
        x={6}
        y={12}
        width={3}
        height={7}
        rx={1}
        style={paintPart("accent", true, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        key={`${variant}-p2`}
        className="pi-part"
        x={10.5}
        y={8}
        width={3}
        height={11}
        rx={1}
        style={paintPart("accent", true, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.rect
        key={`${variant}-p3`}
        className="pi-part"
        x={15}
        y={4}
        width={3}
        height={15}
        rx={1}
        style={paintPart("primary", true, false, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={15.9}
          cy={8.2}
          rx={1.1}
          ry={0.7}
          transform="rotate(-24 15.9 8.2)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
