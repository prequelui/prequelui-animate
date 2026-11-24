"use client";

import * as React from "react";
import {
  motion,
  type Variants,
} from "motion/react";
import {
  useAnimatedIconContext,
  useIconVariants,
  type IconAnimationSet,
  type IconControls,
} from "./core";
import type { IconProps } from "./lucide-set";

type FrameProps = IconProps & {
  animations: IconAnimationSet;
  render: (
    variants: Record<string, Variants>,
    controls: IconControls | undefined,
  ) => React.ReactNode;
};

function Frame({
  size = 28,
  animations,
  render,
  strokeWidth = 1.6,
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
        rotate: [0, -14, 10, -6, 0],
        transformOrigin: "50% 15%",
        transition: { duration: 0.85, ease: "easeInOut" },
      },
    },
    clapper: {
      initial: { y: 0 },
      animate: {
        y: [0, 2, -1, 0],
        transition: { duration: 0.85, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function RoundBellIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={bellAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <path d="M5 17c0-4.5 1-7.5 7-7.5s7 3 7 7.5" />
          <motion.path
            d="M4 17h16M10 20h4"
            variants={v.clapper}
            initial="initial"
            animate={controls}
          />
          <motion.circle
            cx="12"
            cy="5.5"
            r="1.5"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const cloudAnimations = {
  default: {
    group: {
      initial: { x: 0, y: 0 },
      animate: {
        x: [0, 1.5, 0],
        y: [0, -1, 0],
        transition: { duration: 1.1, ease: "easeInOut" },
      },
    },
    drop: {
      initial: { y: 0, opacity: 0.5 },
      animate: {
        y: [0, 2.5, 0],
        opacity: [0.5, 1, 0.5],
        transition: { duration: 1.1, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function CloudIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={cloudAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <path d="M7 18a4.5 4.5 0 0 1-.5-9A6 6 0 0 1 18 8.5 4 4 0 0 1 18 18Z" />
          <motion.path
            d="M9 21v-1M13 21v-1M17 21v-1"
            variants={v.drop}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const lockAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -6, 6, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    shackle: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    keyhole: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.25, 1],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function LockIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={lockAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M8 9V7a4 4 0 0 1 8 0v2"
            variants={v.shackle}
            initial="initial"
            animate={controls}
          />
          <rect x="4.5" y="9" width="15" height="12" rx="3" />
          <motion.path
            d="M12 13v3"
            variants={v.keyhole}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const globeAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 12, -6, 0],
        transition: { duration: 1, ease: "easeInOut" },
      },
    },
    meridian: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0.2, 1],
        transition: { duration: 0.9, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function GlobeIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={globeAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <circle cx="12" cy="12" r="9" />
          <motion.ellipse
            cx="12"
            cy="12"
            rx="4"
            ry="9"
            variants={v.meridian}
            initial="initial"
            animate={controls}
          />
          <path d="M3 12h18" opacity="0.5" />
        </>
      )}
    />
  );
}

const compassAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 60, -20, 0],
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
    needle: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, -45, 20, 0],
        transformOrigin: "center",
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function CompassIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={compassAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.circle
            cx="12"
            cy="12"
            r="9"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m15.5 8.5-2 5-5 2 2-5Z"
            variants={v.needle}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const cameraAnimations = {
  default: {
    group: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 1.05, 1],
        transition: { duration: 0.55, ease: "easeOut" },
      },
    },
    flash: {
      initial: { opacity: 0, scale: 0.6 },
      animate: {
        opacity: [0, 1, 0],
        scale: [0.6, 1.2, 0.6],
        transition: { duration: 0.55, ease: "easeOut" },
      },
    },
    lens: {
      initial: { scale: 1 },
      animate: {
        scale: [1, 0.82, 1],
        transition: { duration: 0.55, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function CameraIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={cameraAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M4 8h2.5l1.5-2h8l1.5 2H20a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 8Z"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <motion.circle
            cx="12"
            cy="13.5"
            r="3.5"
            variants={v.lens}
            initial="initial"
            animate={controls}
          />
          <motion.circle
            cx="19"
            cy="10.5"
            r="1.1"
            fill="currentColor"
            stroke="none"
            variants={v.flash}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const rocketAnimations = {
  default: {
    group: {
      initial: { y: 0, rotate: 0 },
      animate: {
        y: [0, -2.5, 0],
        rotate: [0, 4, 0],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
    flame: {
      initial: { scaleY: 0.6, opacity: 0.5 },
      animate: {
        scaleY: [0.6, 1.4, 0.6],
        opacity: [0.5, 1, 0.5],
        transformOrigin: "top center",
        transition: { duration: 0.45, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function RocketIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={rocketAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M12 3c3.5 2 5 5.5 5 9l-2 4H9l-2-4c0-3.5 1.5-7 5-9Z"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <circle cx="12" cy="9.5" r="1.8" />
          <motion.path
            d="M9.5 16c-1.5 1-2 3-2 5 2 0 4-.5 5-2M14.5 16c1.5 1 2 3 2 5-2 0-4-.5-5-2"
            variants={v.flame}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const giftAnimations = {
  default: {
    group: {
      initial: { rotate: 0, scale: 1 },
      animate: {
        rotate: [0, -6, 6, 0],
        scale: [1, 1.06, 1],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
    bow: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function GiftIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={giftAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <rect x="4" y="9" width="16" height="12" rx="2" />
          <path d="M4 13h16M12 9v12" opacity="0.5" />
          <motion.path
            d="M12 9C9 9 7 7.5 7 5.5 7 4 8 3 9.5 3 11.5 3 12 6 12 9Zm0 0c3 0 5-1.5 5-3.5C17 4 16 3 14.5 3 12.5 3 12 6 12 9Z"
            variants={v.bow}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const leafAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 10, -5, 0],
        transformOrigin: "bottom left",
        transition: { duration: 1, ease: "easeInOut" },
      },
    },
    vein: {
      initial: { pathLength: 1 },
      animate: {
        pathLength: [0.1, 1],
        transition: { duration: 0.8, ease: "easeOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function LeafIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={leafAnimations}
      {...props}
      render={(v, controls) => (
        <motion.g
          variants={v.group}
          initial="initial"
          animate={controls}
          style={{ transformOrigin: "5px 19px" }}
        >
          <path d="M5 19C5 10 11 4 21 4c0 10-6 16-15 16Z" />
          <motion.path
            d="M5 19 15 9"
            variants={v.vein}
            initial="initial"
            animate={controls}
          />
        </motion.g>
      )}
    />
  );
}

const flameAnimations = {
  default: {
    group: {
      initial: { scaleY: 1, y: 0 },
      animate: {
        scaleY: [1, 1.08, 0.97, 1],
        y: [0, -1, 0],
        transformOrigin: "bottom center",
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
    inner: {
      initial: { opacity: 0.4 },
      animate: {
        opacity: [0.4, 0.9, 0.4],
        transition: { duration: 0.9, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function FlameIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={flameAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="M12 3c1 4 5 5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-5 0 2 1 3 2 3 0-3 0-5 1-7Z"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="M12 12c.8 1.4 2 2 2 3.5a2 2 0 0 1-4 0c0-1 .8-2 2-3.5Z"
            variants={v.inner}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const clockAnimations = {
  default: {
    group: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 0, 0],
        transition: { duration: 0.1 },
      },
    },
    hour: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 40, 0],
        transformOrigin: "12px 12px",
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
    minute: {
      initial: { rotate: 0 },
      animate: {
        rotate: [0, 180, 360],
        transformOrigin: "12px 12px",
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
  },
} satisfies IconAnimationSet;

export function ClockIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={clockAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <circle cx="12" cy="12" r="9" />
          <motion.path
            d="M12 12V7.5"
            variants={v.hour}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m12 12 4 2"
            variants={v.minute}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

const layersAnimations = {
  default: {
    group: {
      initial: { y: 0 },
      animate: {
        y: [0, -2, 0],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    top: {
      initial: { y: 0, scale: 1 },
      animate: {
        y: [0, -2, 0],
        scale: [1, 1.06, 1],
        transition: { duration: 0.6, ease: "easeInOut" },
      },
    },
    middle: {
      initial: { y: 0 },
      animate: {
        y: [0, -1, 0],
        transition: { duration: 0.6, ease: "easeInOut", delay: 0.05 },
      },
    },
  },
} satisfies IconAnimationSet;

export function LayersIcon({ size = 28, ...props }: IconProps) {
  return (
    <Frame
      size={size}
      animations={layersAnimations}
      {...props}
      render={(v, controls) => (
        <>
          <motion.path
            d="m12 3 8 4.5-8 4.5-8-4.5Z"
            fill="currentColor"
            fillOpacity="0.12"
            variants={v.top}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m4 12 8 4.5 8-4.5"
            variants={v.middle}
            initial="initial"
            animate={controls}
          />
          <motion.path
            d="m4 16.5 8 4.5 8-4.5"
            variants={v.group}
            initial="initial"
            animate={controls}
          />
        </>
      )}
    />
  );
}

export const hugeIcons = [
  { name: "rounded-bell", category: "Notifications", icon: RoundBellIcon },
  { name: "cloud", category: "Weather", icon: CloudIcon },
  { name: "flame", category: "Weather", icon: FlameIcon },
  { name: "leaf", category: "Nature", icon: LeafIcon },
  { name: "lock", category: "Security", icon: LockIcon },
  { name: "globe", category: "Navigation", icon: GlobeIcon },
  { name: "compass", category: "Navigation", icon: CompassIcon },
  { name: "camera", category: "Media", icon: CameraIcon },
  { name: "rocket", category: "Magic", icon: RocketIcon },
  { name: "gift", category: "Magic", icon: GiftIcon },
  { name: "clock", category: "Time", icon: ClockIcon },
  { name: "layers", category: "Files", icon: LayersIcon },
] as const;
