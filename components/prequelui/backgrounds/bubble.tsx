"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useBackgroundPlayback } from "./shared";

export type BubbleColors = {
  first?: string;
  second?: string;
  third?: string;
  fourth?: string;
  fifth?: string;
  sixth?: string;
};

export type BubbleBackgroundProps = React.ComponentProps<"div"> & {
  interactive?: boolean;
  speed?: number;
  paused?: boolean;
  colors?: BubbleColors;
  transition?: Transition;
};

const DEFAULTS: Required<BubbleColors> = {
  first: "#6366f1",
  second: "#a855f7",
  third: "#22d3ee",
  fourth: "#f472b6",
  fifth: "#f59e0b",
  sixth: "#34d399",
};

function loop(
  playing: boolean,
  keyframes: TargetAndTransition,
  rest: TargetAndTransition,
  transition: Transition,
) {
  return playing
    ? { animate: keyframes, transition }
    : { animate: rest, transition: { duration: 0 } };
}

export function BubbleBackground({
  interactive = false,
  speed = 1,
  paused = false,
  colors,
  transition,
  className,
  children,
  ...props
}: BubbleBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;
  const filterId = `bubble-goo-${React.useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const palette = { ...DEFAULTS, ...colors };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  React.useEffect(() => {
    if (!interactive || reduce) return;
    const element = ref.current;
    if (!element) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect();
        mouseX.set(event.clientX - (rect.left + rect.width / 2));
        mouseY.set(event.clientY - (rect.top + rect.height / 2));
      });
    };
    element.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      element.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [interactive, mouseX, mouseY, reduce]);

  const rate = Math.max(0.2, speed);
  const base = transition ?? {};

  return (
    <div
      ref={ref}
      data-slot="bubble-background"
      className={cn(
        "relative size-full overflow-hidden bg-[linear-gradient(135deg,#12111a,#1d1830_45%,#0f172a)]",
        className,
      )}
      style={
        {
          "--bubble-first": palette.first,
          "--bubble-second": palette.second,
          "--bubble-third": palette.third,
          "--bubble-fourth": palette.fourth,
          "--bubble-fifth": palette.fifth,
          "--bubble-sixth": palette.sixth,
          ...props.style,
        } as React.CSSProperties
      }
      {...props}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute size-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [filter:var(--bubble-filter)]"
        style={{ "--bubble-filter": `url(#${filterId}) blur(38px)` } as React.CSSProperties}
      >
        <motion.div
          {...loop(
            playing,
            { y: [-46, 46, -46] },
            { y: -46 },
            { duration: 30 / rate, ease: "easeInOut", repeat: Infinity, ...base },
          )}
          className="absolute left-[8%] top-[8%] size-[86%] rounded-full mix-blend-hard-light opacity-90"
          style={{
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--bubble-first) 80%, transparent) 0%, transparent 58%)",
            willChange: "transform",
          }}
        />
        <motion.div
          {...loop(
            playing,
            { rotate: [0, 360] },
            { rotate: reduce ? 90 : 0 },
            { duration: 20 / rate, ease: "linear", repeat: Infinity, ...base },
          )}
          className="absolute inset-0 flex origin-[calc(50%-380px)] items-center justify-center"
        >
          <div
            className="size-[80%] rounded-full mix-blend-hard-light"
            style={{
              background:
                "radial-gradient(circle at center, color-mix(in oklab, var(--bubble-second) 80%, transparent) 0%, transparent 58%)",
            }}
          />
        </motion.div>
        <motion.div
          {...loop(
            playing,
            { rotate: [0, -360] },
            { rotate: reduce ? 180 : 0 },
            { duration: 40 / rate, ease: "linear", repeat: Infinity, ...base },
          )}
          className="absolute inset-0 flex origin-[calc(50%+400px)] items-center justify-center"
        >
          <div
            className="absolute left-[calc(50%-460px)] top-[calc(50%+180px)] size-[80%] rounded-full mix-blend-hard-light"
            style={{
              background:
                "radial-gradient(circle at center, color-mix(in oklab, var(--bubble-third) 80%, transparent) 0%, transparent 58%)",
            }}
          />
        </motion.div>
        <motion.div
          {...loop(
            playing,
            { x: [-46, 46, -46] },
            { x: -46 },
            { duration: 40 / rate, ease: "easeInOut", repeat: Infinity, ...base },
          )}
          className="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-70 mix-blend-hard-light"
          style={{
            background:
              "radial-gradient(circle at center, color-mix(in oklab, var(--bubble-fourth) 80%, transparent) 0%, transparent 58%)",
            willChange: "transform",
          }}
        />
        <motion.div
          {...loop(
            playing,
            { rotate: [0, 360] },
            { rotate: reduce ? 45 : 0 },
            { duration: 24 / rate, ease: "linear", repeat: Infinity, ...base },
          )}
          className="absolute inset-0 flex origin-[calc(50%-760px)_calc(50%+180px)] items-center justify-center"
        >
          <div
            className="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-hard-light opacity-80"
            style={{
              background:
                "radial-gradient(circle at center, color-mix(in oklab, var(--bubble-fifth) 80%, transparent) 0%, transparent 58%)",
            }}
          />
        </motion.div>
        {interactive && (
          <motion.div
            className="absolute size-full rounded-full opacity-70 mix-blend-hard-light"
            style={{
              x: spring,
              y: springY,
              background:
                "radial-gradient(circle at center, color-mix(in oklab, var(--bubble-sixth) 80%, transparent) 0%, transparent 58%)",
              willChange: "transform",
            }}
          />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,4,8,0.55))]" />
      {children}
    </div>
  );
}
