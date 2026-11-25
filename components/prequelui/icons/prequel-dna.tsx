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
    "primary": "oklch(0.56 0.1 225)",
    "primaryDark": "oklch(0.78 0.08 225)",
    "accent": "oklch(0.66 0.13 200)",
    "accentDark": "oklch(0.8 0.1 200)"
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
          "ease": "easeInOut"
        }
      }
    },
    "p3": {
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
          "delay": 0.05
        }
      }
    },
    "p4": {
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
          "delay": 0.1
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
          ]
        }
      }
    },
    "p3": {
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
          "delay": 0.05
        }
      }
    },
    "p4": {
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
          "delay": 0.1
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
          "ease": "easeInOut"
        }
      }
    },
    "p3": {
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
          "delay": 0.05
        }
      }
    },
    "p4": {
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
          "delay": 0.1
        }
      }
    }
  }
} satisfies IconAnimationSet;

export function PrequelDnaIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
      {variant === "emoji" && (
        <rect className="pi-sticker" x={2} y={2} width={20} height={20} rx={7} style={paintSticker()} />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo0`}
          className="pi-halo"
          data-paint="halo"
          d={"M7 3c0 5 10 5 10 9s-10 4-10 9"}
          style={paintHalo("primary")}
          variants={variants.p0}
          initial="initial"
          animate={controls}
        />
      )}
      {(variant === "duotone" || variant === "emoji") && (
        <motion.path
          key={`${variant}-halo1`}
          className="pi-halo"
          data-paint="halo"
          d={"M17 3c0 5-10 5-10 9s10 4 10 9"}
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
          d={"M8.4 7h7.2"}
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
          d={"M8.4 12h7.2"}
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
          d={"M8.4 17h7.2"}
          style={paintHalo("primary")}
          variants={variants.p4}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M7 3c0 5 10 5 10 9s-10 4-10 9"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M17 3c0 5-10 5-10 9s10 4 10 9"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p2`}
        className="pi-part"
        d={"M8.4 7h7.2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p2}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p3`}
        className="pi-part"
        d={"M8.4 12h7.2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p3}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p4`}
        className="pi-part"
        d={"M8.4 17h7.2"}
        style={paintPart("primary", false, false, false)}
        variants={variants.p4}
        initial="initial"
        animate={controls}
      />


    </motion.svg>
  );
}
