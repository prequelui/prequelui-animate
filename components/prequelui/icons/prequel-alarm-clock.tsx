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
    "primary": "oklch(0.68 0.14 75)",
    "primaryDark": "oklch(0.82 0.11 75)",
    "accent": "oklch(0.62 0.16 40)",
    "accentDark": "oklch(0.76 0.13 40)"
  },
  "emoji": {
    "primary": "oklch(0.82 0.16 85)",
    "secondary": "oklch(0.66 0.15 80)",
    "accent": "oklch(0.72 0.19 48)"
  }
};

export const animations = {
  "hover": {
    "group": {
      "initial": {
        "rotate": 0
      },
      "animate": {
        "rotate": [
          0,
          -5,
          4,
          -2,
          0
        ],
        "transition": {
          "duration": 0.5,
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
          -2.5,
          2.5,
          -1.5,
          0
        ],
        "transition": {
          "duration": 0.5,
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
          -2.5,
          2.5,
          -1.5,
          0
        ],
        "transition": {
          "duration": 0.5,
          "ease": "easeInOut"
        }
      }
    },
    "p3": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "12px 13px"
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
        "transformOrigin": "12px 13px"
      }
    }
  },
  "tap": {
    "group": {
      "initial": {
        "rotate": 0
      },
      "animate": {
        "rotate": [
          0,
          -11,
          10,
          -6,
          3,
          0
        ],
        "transition": {
          "duration": 0.8,
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
          -4,
          4,
          -3,
          2,
          0
        ],
        "transition": {
          "duration": 0.75,
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
          -4,
          4,
          -3,
          2,
          0
        ],
        "transition": {
          "duration": 0.75,
          "ease": "easeInOut"
        }
      }
    },
    "p3": {
      "initial": {
        "rotate": 0,
        "transformOrigin": "12px 13px"
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
        "transformOrigin": "12px 13px"
      }
    }
  },
  "loop": {
    "group": {
      "initial": {
        "rotate": 0
      },
      "animate": {
        "rotate": [
          0,
          -3,
          3,
          0
        ],
        "transition": {
          "duration": 1.4,
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
          -2,
          2,
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
          -2,
          2,
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
        "rotate": 0,
        "transformOrigin": "12px 13px"
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
        "transformOrigin": "12px 13px"
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelAlarmClockIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M4 4l3 2M20 4l-3 2"}
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
          d={"M6 21l-1 1M18 21l1 1"}
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
          d={"M12 9v4l2 2"}
          style={paintHalo("primary")}
          variants={variants.p3}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.circle
        key={`${variant}-p0`}
        className="pi-part"
        cx={12}
        cy={13}
        r={8}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M4 4l3 2M20 4l-3 2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M6 21l-1 1M18 21l1 1"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p3`}
        className="pi-part"
        d={"M12 9v4l2 2"}
        style={paintPart("primary", false, false, true)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={8.8}
          cy={9.48}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 8.8 9.48)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
