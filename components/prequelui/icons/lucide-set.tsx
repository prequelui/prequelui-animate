"use client";

import * as React from "react";
import {
  motion,
  type SVGMotionProps,
  type Variants,
} from "motion/react";
import {
  useAnimatedIconContext,
  useIconVariants,
  type IconAnimationSet,
  type IconControls,
} from "./core";

export type IconProps = Omit<SVGMotionProps<SVGSVGElement>, "ref"> & {
  size?: number;
};

type FrameProps = IconProps & {
  animations: IconAnimationSet;
  render: (
    variants: Record<string, Variants>,
    controls: IconControls | undefined,
  ) => React.ReactNode;
};

function IconFrame({
  size = 28,
  animations,
  render,
  strokeWidth = 2,
  ...props
}: FrameProps) {
  const context = useAnimatedIconContext();
  const variants = useIconVariants(animations);

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      variants={variants.group}
      initial="initial"
      animate={context?.controls}
      {...props}
    >
      {render(variants, context?.controls)}
    </motion.svg>
  );
}

const bellAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 18, -12, 8, -4, 0],
        transformOrigin: "top center",
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
    clapper: {
      initial: { x: 0 },
      animate: {
        x: [0, -4, 3, -3, 2, 0],
        transition: { duration: 1.1, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function BellIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={bellAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M10.3 21a1.94 1.94 0 0 0 3.4 0"
            variants={v.clapper}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const heartAnimations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.16, 0.96, 1.08, 1],
        transition: { duration: 0.75, ease: "easeInOut" },
      },
    },
    fill: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 0.35, 0],
        transition: { duration: 0.75, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function HeartIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={heartAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
            fill="currentColor"
            stroke="none"
            variants={v.fill}
            initial="initial"
            animate={controls}
          />
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </>
      )}
    />
  );
}

const starAnimations = {
  default: {
    group: {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: [0, -16, 12, -6, 0],
        scale: [1, 1.14, 1],
        transformOrigin: "center",
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
    fill: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 0.4, 0],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function StarIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={starAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01Z"
            fill="currentColor"
            stroke="none"
            variants={v.fill}
            initial="initial"
            animate={controls}
          />
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01Z" />
        </>
      )}
    />
  );
}

const checkAnimations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.08, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
    mark: {
      initial: { pathLength: 1, opacity: 1 },
      animate: {
        pathLength: [0, 1],
        opacity: [0.3, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function CheckIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={checkAnimations}
      {...props}
      render={(v, controls) => (
        <motion.path
          d="M20 6 9 17l-5-5"
          variants={v.mark}
          initial="initial"
          animate={controls}
        />
      )}
    />
  );
}

const searchAnimations = {
  default: {
    group: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, -2.5, 2, 0],
        y: [0, -1.5, 1.5, 0],
        transition: { duration: 0.65, ease: "easeInOut" },
      },
    },
    lens: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.12, 1],
        transition: { duration: 0.65, ease: "easeInOut" },
      },
    },
    handle: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0.2, 1],
        transition: { duration: 0.4, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function SearchIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={searchAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.circle
            cx="11"
            cy="11"
            r="8"
            variants={v.lens}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m21 21-4.3-4.3"
            variants={v.handle}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const slidersAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 7, -7, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      },
    },
    knob1: {
      initial: { x: 0 },
      animate: {
        x: [0, 2.5, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      },
    },
    knob2: {
      initial: { x: 0 },
      animate: {
        x: [0, -2.5, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      },
    },
    knob3: {
      initial: { x: 0 },
      animate: {
        x: [0, 2.5, 0],
        transition: { duration: 0.7, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function SlidersIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={slidersAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <path d="M4 6h16M4 12h16M4 18h16" opacity="0.5" />
          <motion.circle
            cx="9"
            cy="6"
            r="2.4"
            fill="var(--background, #fff)"
            variants={v.knob1}
            initial="initial"
            animate={controls}
          />
          <motion.circle
            cx="15"
            cy="12"
            r="2.4"
            fill="var(--background, #fff)"
            variants={v.knob2}
            initial="initial"
            animate={controls}
          />
          <motion.circle
            cx="8"
            cy="18"
            r="2.4"
            fill="var(--background, #fff)"
            variants={v.knob3}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const playAnimations = {
  default: {
    group: {
      initial: { x: 0, scale: 1 },
      animate: {
        x: [0, 2, 0],
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
    shape: {
      initial: { opacity: 1 },
      animate: {
        opacity: [0.5, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function PlayIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={playAnimations}
      {...props}
      render={(v, controls) => (
        <motion.path
          d="m7 3 13 9-13 9Z"
          variants={v.shape}
          initial="initial"
          animate={controls}
        />
      )}
    />
  );
}

const downloadAnimations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, 3, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    arrow: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 1, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    tray: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0.2, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function DownloadIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={downloadAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M12 3v12"
            variants={v.arrow}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m7 10 5 5 5-5"
            variants={v.arrow}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M5 21h14"
            variants={v.tray}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const uploadAnimations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, -3, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    arrow: {
      initial: { y: 0 },
      animate: {
        y: [0, 2, -1, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    tray: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0.2, 1],
        transition: { duration: 0.5, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function UploadIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={uploadAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M12 21V9"
            variants={v.arrow}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m7 14 5-5 5 5"
            variants={v.arrow}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M5 3h14"
            variants={v.tray}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const mailAnimations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.06, 1],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    flap: {
      initial: { y: 0, pathLength: 1 },
      animate: {
        y: [0, -1.5, 0],
        pathLength: [0.2, 1],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function MailIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={mailAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <rect x="2" y="4" width="20" height="16" rx="2.5" />
          <motion.path
            d="m2 7 10 6 10-6"
            variants={v.flap}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const userAnimations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, -1.5, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    head: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.12, 1],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function UserIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={userAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.circle
            cx="12"
            cy="8"
            r="4"
            variants={v.head}
            initial="initial"
            animate={controls}
          />
          <path d="M4 21a8 8 0 0 1 16 0" />
        </>
      )}
    />
  );
}

const sunAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 40, 0],
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
    core: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.1, 1],
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
    rays: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0.4, 1],
        transition: { duration: 0.7, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function SunIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={sunAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.circle
            cx="12"
            cy="12"
            r="4"
            variants={v.core}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
            variants={v.rays}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const moonAnimations = {
  default: {
    group: {
      initial: { rotate: 0, y: 0 },
      animate: {
        rotate: [0, -18, 0],
        y: [0, 1.5, 0],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
    shade: {
      initial: { opacity: 0.5 },
      animate: {
        opacity: [0.5, 0.9, 0.5],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function MoonIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={moonAnimations}
      {...props}
      render={(v, controls) => (
        <motion.path
          d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"
          variants={v.shade}
          initial="initial"
          animate={controls}
        />
      )}
    />
  );
}

const trashAnimations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, -1.5, 0],
        transition: { duration: 0.55, ease: "easeInOut" },
      },
    },
    lid: {
      initial: { y: 0, rotate: 0 },
      animate: {
        y: [0, -2.5, 0],
        rotate: [0, -8, 0],
        transition: { duration: 0.55, ease: "easeInOut" },
      },
    },
    body: {
      initial: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.94, 1],
        transition: { duration: 0.55, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function TrashIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={trashAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6"
            variants={v.lid}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M10 11v6M14 11v6"
            variants={v.body}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const copyAnimations = {
  default: {
    group: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, -2, 0],
        y: [0, -2, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      },
    },
    front: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, 2, 0],
        y: [0, 2, 0],
        transition: { duration: 0.5, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function CopyIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={copyAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.rect
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            variants={v.front}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const loaderAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 360],
        transition: { duration: 1, ease: "linear" },
      },
    },
  },
  reverse: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -360],
        transition: { duration: 1.2, ease: "linear" },
      },
    },
  },
} satisfies IconAnimationSet;

export function LoaderIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={loaderAnimations}
      {...props}
      render={() => (
        <>
          <path d="M21 12a9 9 0 1 1-6.2-8.56" opacity="0.25" />
          <path d="M21 12a9 9 0 0 0-9-9" />
        </>
      )}
    />
  );
}

const plusAnimations = {
  default: {
    group: {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: [0, 90, 0],
        scale: [1, 1.08, 1],
        transition: { duration: 0.55, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function PlusIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={plusAnimations}
      {...props}
      render={() => <path d="M12 5v14M5 12h14" />}
    />
  );
}

const sparklesAnimations = {
  default: {
    group: {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: [0, 12, -8, 0],
        scale: [1, 1.12, 1],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
    small: {
      initial: { opacity: 0.6, scale: 1 },
      animate: {
        opacity: [0.6, 1, 0.6],
        scale: [1, 1.3, 1],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function SparklesIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={sparklesAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"
            fill="currentColor"
            stroke="none"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M19 3v4M17 5h4M5 17v3M3.5 18.5h3"
            variants={v.small}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const homeAnimations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, -1.5, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    door: {
      initial: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.85, 1],
        transformOrigin: "bottom center",
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function HomeIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={homeAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
          <motion.path
            d="M9 22V12h6v10"
            variants={v.door}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const eyeAnimations = {
  default: {
    group: {
      initial: { scaleY: 1 },
      animate: {
        scaleY: [1, 0.1, 1],
        transformOrigin: "center",
        transition: { duration: 0.65, ease: "easeInOut" },
      },
    },
    pupil: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.6, 1],
        transition: { duration: 0.65, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function EyeIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={eyeAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <motion.circle
            cx="12"
            cy="12"
            r="3"
            variants={v.pupil}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const arrowRightAnimations = {
  default: {
    group: {
      initial: { x: 0 },
      animate: {
        x: [0, 3, 0],
        transition: { duration: 0.55, ease: "easeInOut" },
      },
    },
    head: {
      initial: { x: 0 },
      animate: {
        x: [0, -1, 0],
        transition: { duration: 0.55, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function ArrowRightIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={arrowRightAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M5 12h14"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m12 5 7 7-7 7"
            variants={v.head}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const bookmarkAnimations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    fill: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 0.5, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function BookmarkIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={bookmarkAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"
            fill="currentColor"
            stroke="none"
            variants={v.fill}
            initial="initial"
            animate={controls}
          />
          <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />
        </>
      )}
    />
  );
}

const messageAnimations = {
  default: {
    group: {
      initial: { scale: 1, y: 0 },
      animate: {
        scale: [1, 1.05, 1],
        y: [0, -1.5, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    dots: {
      initial: { opacity: 0.5 },
      animate: {
        opacity: [0.5, 1, 0.5],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function MessageIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={messageAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M8 10h.01M12 10h.01M16 10h.01"
            variants={v.dots}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const zapAnimations = {
  default: {
    group: {
      initial: { scale: 1, rotate: 0 },
      animate: {
        scale: [1, 1.12, 1],
        rotate: [0, -6, 0],
        transition: { duration: 0.55, ease: "easeOut" },
      },
    },
    fill: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 0.45, 0],
        transition: { duration: 0.55, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function ZapIcon({ size = 28, ...props }: IconProps) {
  return (
    <IconFrame
      size={size}
      animations={zapAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13Z"
            fill="currentColor"
            stroke="none"
            variants={v.fill}
            initial="initial"
            animate={controls}
          />
          <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13Z" />
        </>
      )}
    />
  );
}

export const lucideIcons = [
  { name: "bell", category: "Notifications", icon: BellIcon },
  { name: "mail", category: "Notifications", icon: MailIcon },
  { name: "message", category: "Notifications", icon: MessageIcon },
  { name: "heart", category: "People", icon: HeartIcon },
  { name: "star", category: "People", icon: StarIcon },
  { name: "user", category: "People", icon: UserIcon },
  { name: "bookmark", category: "People", icon: BookmarkIcon },
  { name: "check", category: "Actions", icon: CheckIcon },
  { name: "copy", category: "Actions", icon: CopyIcon },
  { name: "trash", category: "Actions", icon: TrashIcon },
  { name: "plus", category: "Actions", icon: PlusIcon },
  { name: "download", category: "Actions", icon: DownloadIcon },
  { name: "upload", category: "Actions", icon: UploadIcon },
  { name: "search", category: "Navigation", icon: SearchIcon },
  { name: "arrow-right", category: "Navigation", icon: ArrowRightIcon },
  { name: "home", category: "Navigation", icon: HomeIcon },
  { name: "play", category: "Media", icon: PlayIcon },
  { name: "eye", category: "Media", icon: EyeIcon },
  { name: "sun", category: "Weather", icon: SunIcon },
  { name: "moon", category: "Weather", icon: MoonIcon },
  { name: "zap", category: "Weather", icon: ZapIcon },
  { name: "sparkles", category: "Magic", icon: SparklesIcon },
  { name: "loader", category: "Status", icon: LoaderIcon },
  { name: "sliders", category: "Settings", icon: SlidersIcon },
] as const;
