"use client";

import * as React from "react";
import {
  MotionConfig,
  useInView as useMotionInView,
  type Transition,
} from "motion/react";
import { useHydratedReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

const TempoContext = React.createContext(1);

export function PrequelMotionProvider({
  tempo = 1,
  children,
}: {
  tempo?: number;
  children: React.ReactNode;
}) {
  const value = React.useMemo(() => Math.max(0.4, tempo), [tempo]);
  return (
    <TempoContext.Provider value={value}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </TempoContext.Provider>
  );
}

export function useTempo() {
  return React.useContext(TempoContext);
}

const TIME_KEYS = [
  "duration",
  "visualDuration",
  "delay",
  "repeatDelay",
  "delayChildren",
] as const;

function scaleValue(transition: Transition, tempo: number): Transition {
  if (tempo === 1 || !transition || typeof transition !== "object") {
    return transition;
  }
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(transition)) {
    if (typeof value === "number" && (TIME_KEYS as readonly string[]).includes(key)) {
      next[key] = value * tempo;
    } else if (typeof value === "number" && key === "stiffness") {
      next[key] = value / (tempo * tempo);
    } else if (typeof value === "number" && key === "damping") {
      next[key] = value / tempo;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      next[key] = scaleValue(value as Transition, tempo);
    } else {
      next[key] = value;
    }
  }
  return next as Transition;
}

export function useTempoTransition(transition: Transition) {
  const tempo = useTempo();
  return React.useMemo(
    () => scaleValue(transition, tempo),
    [tempo, JSON.stringify(transition)],
  );
}

export function useReduceMotion() {
  return useHydratedReducedMotion();
}

export function usePageVisible() {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  return visible;
}

export function useMounted() {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useSeen(
  ref: React.RefObject<Element | null>,
  enabled = true,
  once = true,
) {
  const inView = useMotionInView(ref, { once, amount: 0.35 });
  return enabled ? inView : true;
}

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
  ref?: React.Ref<HTMLElement>;
};

export function Slot({ children, ...props }: SlotProps) {
  if (!React.isValidElement<Record<string, unknown>>(children)) {
    return null;
  }
  const child = children as React.ReactElement<Record<string, unknown>>;
  const childProps = child.props;
  return React.cloneElement(child, {
    ...props,
    ...childProps,
    className: cn(
      String(props.className ?? ""),
      String(childProps.className ?? ""),
    ),
    style: {
      ...((props.style as React.CSSProperties) ?? {}),
      ...((childProps.style as React.CSSProperties) ?? {}),
    },
  } as Record<string, unknown>);
}

export function srOnlyStyle(): React.CSSProperties {
  return {
    position: "absolute",
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  };
}

let segmenter: Intl.Segmenter | null | undefined;

export function splitGraphemes(text: string): string[] {
  if (segmenter === undefined) {
    segmenter =
      typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
  }
  if (!segmenter) return Array.from(text);
  return Array.from(segmenter.segment(text), (entry) => entry.segment);
}

export const easeOut = [0.23, 1, 0.32, 1] as const;
export const easeSoft = [0.215, 0.61, 0.355, 1] as const;
export const easeInOut = [0.77, 0, 0.175, 1] as const;
export const easeEnter = [0.25, 0.1, 0.35, 1] as const;
export const easeLeave = [0, 0, 0.58, 1] as const;
export const easeResize = [0.4, 0, 0.1, 1] as const;
export const easeAway = [0.33, 0.17, 0.67, 0.5] as const;

export const pressSpring: Transition = {
  type: "spring",
  stiffness: 550,
  damping: 30,
  restSpeed: 10,
};

export const selectionSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const highlightSpring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 40,
};

export const popSpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 29,
};

export const tooltipSpring: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 31,
};

export const dialogSpring: Transition = {
  type: "spring",
  stiffness: 150,
  damping: 25,
};

export const toastSpring: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 24,
};

export const heightSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  bounce: 0,
  restDelta: 0.01,
};

export const progressSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 35,
  restDelta: 0.01,
  restSpeed: 0.1,
};

export const scrollSpring: Transition = {
  type: "spring",
  stiffness: 250,
  damping: 40,
  bounce: 0,
};

export const avatarSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 17,
};

export const pinnedSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 25,
  mass: 0.8,
};

export const thumbSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
};

export const checkSpring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 24,
};

export const cursorEntry: Transition = {
  type: "spring",
  stiffness: 550,
  damping: 30,
  restSpeed: 10,
};

export const cursorExit: Transition = {
  type: "spring",
  stiffness: 550,
  damping: 46.9,
  restSpeed: 10,
};

export const cursorLabel: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 50,
  bounce: 0,
};

export const swapTween: Transition = {
  duration: 0.15,
  ease: easeOut,
};

export const overlayTween: Transition = {
  duration: 0.4,
  ease: easeSoft,
};

export const disclosureTween: Transition = {
  duration: 0.35,
  ease: easeSoft,
};

export const menuTween: Transition = {
  duration: 0.22,
  ease: easeSoft,
};

export const panelOutTween: Transition = {
  duration: 0.15,
  ease: easeLeave,
};

export const panelInTween: Transition = {
  duration: 0.3,
  ease: easeEnter,
};

export const panelHeightTween: Transition = {
  duration: 0.45,
  ease: easeResize,
};

export const exitTween: Transition = {
  duration: 0.2,
  ease: easeAway,
};

export const faceSpring: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 20,
};

export const blurIcon = "blur(2px)";

export function flipTransform(side: "top" | "bottom" | "left" | "right") {
  const rotate =
    side === "top"
      ? "rotateX(-20deg)"
      : side === "bottom"
        ? "rotateX(20deg)"
        : side === "left"
          ? "rotateY(20deg)"
          : "rotateY(-20deg)";
  return `perspective(500px) ${rotate} scale(0.8)`;
}

export function uprightTransform(side: "top" | "bottom" | "left" | "right") {
  const rotate = side === "left" || side === "right" ? "rotateY(0deg)" : "rotateX(0deg)";
  return `perspective(500px) ${rotate} scale(1)`;
}
