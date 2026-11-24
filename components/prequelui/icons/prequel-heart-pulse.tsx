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
    "primary": "oklch(0.6 0.18 15)",
    "primaryDark": "oklch(0.78 0.13 15)",
    "accent": "oklch(0.68 0.13 190)",
    "accentDark": "oklch(0.81 0.1 190)"
  },
  "emoji": {
    "primary": "oklch(0.68 0.2 27)",
    "secondary": "oklch(0.54 0.19 25)",
    "accent": "oklch(0.78 0.14 165)"
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
        "transformOrigin": "50% 60%"
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
        "transformOrigin": "50% 60%"
      }
    },
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
        "transformOrigin": "50% 60%"
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
        "transformOrigin": "50% 60%"
      }
    },
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
        "transformOrigin": "50% 60%"
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
        "transformOrigin": "50% 60%"
      }
    },
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

export function PrequelHeartPulseIcon({ size = 28, variant: variantProp, ...props }: IconProps) {
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
          d={"M4.5 12h4l1.5-2.5 2.5 5 1.5-2.5h5"}
          style={paintHalo("primary")}
          variants={variants.p1}
          initial="initial"
          animate={controls}
        />
      )}
      <motion.path
        key={`${variant}-p0`}
        className="pi-part"
        d={"M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z"}
        style={paintPart("primary", true, false, false)}
        variants={variants.p0}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-p1`}
        className="pi-part"
        d={"M4.5 12h4l1.5-2.5 2.5 5 1.5-2.5h5"}
        style={paintPart("primary", false, true, true)}
        variants={variants.p1}
        initial="initial"
        animate={controls}
      />
      <motion.path
        key={`${variant}-flash`}
        className="pi-flash"
        d={"M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z"}
        style={paintFlash()}
        variants={variants.fill}
        initial="initial"
        animate={controls}
      />
      {variant === "emoji" && (
        <ellipse
          className="pi-highlight"
          cx={9.75}
          cy={6.68}
          rx={2.4}
          ry={1.25}
          transform="rotate(-24 9.75 6.68)"
          style={paintHighlight()}
        />
      )}
    </motion.svg>
  );
}
