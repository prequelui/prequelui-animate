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
    "p1": {},
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
    "p4": {
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
    "p1": {},
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
    "p4": {
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
    "p1": {},
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
    "p4": {
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
    }
  }
} satisfies IconAnimationSet;

export function PrequelBugIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M9 9V7a3 3 0 0 1 6 0v2"}
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
          d={"M4 12h3M17 12h3"}
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
          d={"M5 18l2-2M19 18l-2-2"}
          style={paintHalo("primary")}
          variants={variants.p3}
          initial="initial"
          animate={controls}
        />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo4`}
          className="pi-halo"
          data-paint="halo"
          d={"M5 6l2 2M19 6l-2 2"}
          style={paintHalo("primary")}
          variants={variants.p4}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M8 9h8v5a4 4 0 0 1-8 0V9Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M9 9V7a3 3 0 0 1 6 0v2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M4 12h3M17 12h3"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p3`}
        className="pi-part"
        d={"M5 18l2-2M19 18l-2-2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p4`}
        className="pi-part"
        d={"M5 6l2 2M19 6l-2 2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p4}
        initial="initial"
        animate={controls}
      />

      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={7.6}
          cy={11.52}
          rx={1.8}
          ry={0.94}
          transform="rotate(-24 7.6 11.52)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
