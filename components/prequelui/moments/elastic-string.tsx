"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  clamp,
  cn,
  localPoint,
  naturalWidth,
  springBounce,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const WIDTH = 206;
const HEIGHT = 84;
const MID = HEIGHT / 2;
const LEFT = 18;
const RIGHT = WIDTH - 18;
const CENTER = WIDTH / 2;
const LIMIT = 56;

function stringPath(pull: number, wobble = 0) {
  const bead = CENTER + pull;
  const bow = 2 + (Math.abs(pull) / LIMIT) * 12;
  const controlY = MID - bow + wobble;
  const leftControl = (LEFT + bead) / 2;
  const rightControl = (bead + RIGHT) / 2;
  return `M ${LEFT} ${MID} Q ${leftControl} ${controlY} ${bead} ${MID} Q ${rightControl} ${controlY} ${RIGHT} ${MID}`;
}

const VIBRATION = [0, 9, -6, 4, -2, 0];

export function ElasticString({ className, preview }: MomentProps) {
  const [pull, setPull] = useState(0);
  const [release, setRelease] = useState(0);
  const dragging = useRef(false);
  const band = useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1100, 2600);
  const shown = preview ? (pulse ? 44 : 0) : pull;

  const setFromEvent = (event: React.PointerEvent) => {
    const node = band.current;
    if (!node) return;
    const point = localPoint(event, node);
    setPull(clamp(point.x - naturalWidth(node) / 2, -LIMIT, LIMIT));
  };

  const releaseString = () => {
    dragging.current = false;
    setPull(0);
    setRelease((value) => value + 1);
  };

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setPull((value) => clamp(value + 14, -LIMIT, LIMIT));
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setPull((value) => clamp(value - 14, -LIMIT, LIMIT));
    }
    if (event.key === "Home") {
      event.preventDefault();
      setPull(-LIMIT);
    }
    if (event.key === "End") {
      event.preventDefault();
      setPull(LIMIT);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      releaseString();
    }
  };

  const restPath = stringPath(shown, 0);
  const pathAnimate =
    reduce || release === 0
      ? { d: restPath }
      : { d: VIBRATION.map((wobble) => stringPath(0, wobble)) };

  return (
    <div className={cn(surface, "flex-col gap-1", className)}>
      <div
        ref={band}
        role="slider"
        tabIndex={0}
        aria-label="Elastic string"
        aria-valuemin={-LIMIT}
        aria-valuemax={LIMIT}
        aria-valuenow={Math.round(shown)}
        aria-valuetext={`${Math.round(Math.abs(shown))} pixels ${
          shown < 0 ? "left" : "right"
        } of centre`}
        onKeyDown={key}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromEvent(event);
        }}
        onPointerMove={(event) => {
          if (dragging.current) setFromEvent(event);
        }}
        onPointerUp={releaseString}
        onPointerCancel={releaseString}
        className="relative h-[84px] w-[206px] touch-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="absolute inset-0 size-full overflow-visible"
        >
          <path
            d={stringPath(0, 0)}
            fill="none"
            stroke="rgba(255,255,255,.08)"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <motion.path
            key={`string-${release}`}
            fill="none"
            stroke="rgba(255,255,255,.62)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={release === 0 ? false : { d: stringPath(0, 0) }}
            animate={pathAnimate}
            transition={
              reduce
                ? { duration: 0 }
                : release === 0
                  ? { duration: 0.12, ease: "easeOut" }
                  : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
            }
          />
          <circle cx={LEFT} cy={MID} r="4" fill="rgba(255,255,255,.75)" />
          <circle cx={RIGHT} cy={MID} r="4" fill="rgba(255,255,255,.75)" />
          <motion.circle
            aria-hidden="true"
            cx={CENTER}
            cy={MID}
            r="15"
            fill="rgba(255,255,255,.12)"
            initial={false}
            animate={{ cx: CENTER + shown }}
            transition={reduce ? { duration: 0 } : springBounce}
          />
          <motion.circle
            cx={CENTER}
            cy={MID}
            r="8"
            fill="#ffffff"
            stroke="rgba(255,255,255,.4)"
            strokeWidth="1"
            initial={false}
            animate={{ cx: CENTER + shown }}
            transition={reduce ? { duration: 0 } : springBounce}
          />
        </svg>
      </div>
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/35">
        {Math.round(Math.abs(shown)) === 0 ? "Pull the bead" : `${Math.round(Math.abs(shown))} px`}
      </span>
    </div>
  );
}
