"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  pointerScaleX,
  surface,
  useHydratedReducedMotion,
  type MomentProps,
} from "./shared";

const DOTS = Array.from({ length: 6 }, (_, index) => index);
const RADIUS = 42;

function OrbitDot({
  angle,
  index,
  speed,
  reduce,
}: {
  angle: MotionValue<number>;
  index: number;
  speed: number;
  reduce: boolean;
}) {
  const offset = (360 / DOTS.length) * index;
  const x = useTransform(angle, (value) => {
    return Math.cos(((value + offset) * Math.PI) / 180) * (RADIUS + index * 2);
  });
  const y = useTransform(angle, (value) => {
    return Math.sin(((value + offset) * Math.PI) / 180) * (RADIUS + index * 2) * 0.72;
  });
  return (
    <motion.span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 rounded-full bg-white"
      style={{
        x,
        y,
        width: 10 - index * 0.8,
        height: 10 - index * 0.8,
        marginLeft: -(10 - index * 0.8) / 2,
        marginTop: -(10 - index * 0.8) / 2,
        opacity: 1 - index * 0.1,
      }}
      animate={{ scale: reduce ? 1 : [1, 1.25, 1] }}
      transition={{
        duration: 2.4 - speed * 0.2,
        repeat: reduce ? 0 : Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function DotRevolve({ className }: MomentProps) {
  const angle = useMotionValue(0);
  const direction = useRef(1);
  const speedRef = useRef(1);
  const [directionLabel, setDirectionLabel] = useState("CW");
  const [speedLabel, setSpeedLabel] = useState(1);
  const [mounted, setMounted] = useState(false);
  const reduce = useHydratedReducedMotion();
  const dragging = useRef<{ x: number; speed: number; moved: boolean } | null>(null);
  const dragged = useRef(false);

  useEffect(() => setMounted(true), []);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    angle.set(angle.get() + direction.current * speedRef.current * 42 * (delta / 1000));
  });

  const change = () => {
    direction.current *= -1;
    speedRef.current = speedRef.current === 1 ? 1.8 : 1;
    setDirectionLabel(direction.current > 0 ? "CW" : "CCW");
    setSpeedLabel(speedRef.current);
  };

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      speedRef.current = Math.min(3, speedRef.current + 0.3);
      setSpeedLabel(Math.round(speedRef.current * 10) / 10);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      speedRef.current = Math.max(0.2, speedRef.current - 0.3);
      setSpeedLabel(Math.round(speedRef.current * 10) / 10);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      change();
    }
  };

  return (
    <div className={cn(surface, "flex-col gap-2", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label={`Dot revolve, ${directionLabel} at ${speedLabel} times speed. Press Enter to change.`}
        onClick={() => {
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          change();
        }}
        onKeyDown={key}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          dragging.current = {
            x: event.clientX,
            speed: speedRef.current,
            moved: false,
          };
          dragged.current = false;
        }}
        onPointerMove={(event) => {
          if (!dragging.current) return;
          const raw = event.clientX - dragging.current.x;
          if (Math.abs(raw) > 3) {
            dragging.current.moved = true;
            dragged.current = true;
          }
          const scale = pointerScaleX(event.currentTarget);
          const delta = raw / (80 * (scale || 1));
          speedRef.current = Math.max(0.2, Math.min(3, dragging.current.speed + delta));
          setSpeedLabel(Math.round(speedRef.current * 10) / 10);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          dragging.current = null;
        }}
        onPointerCancel={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
          dragging.current = null;
          dragged.current = false;
        }}
        className="relative flex size-[132px] cursor-grab touch-none items-center justify-center rounded-full border border-white/10 bg-[#111114] outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <span className="absolute size-[86px] rounded-full border border-dashed border-white/10" />
        {mounted ? (
          DOTS.map((index) => (
            <OrbitDot
              key={index}
              angle={angle}
              index={index}
              speed={speedLabel}
              reduce={reduce}
            />
          ))
        ) : (
          <span aria-hidden="true" className="absolute inset-0">
            {DOTS.map((index) => {
              const offset = (360 / DOTS.length) * index;
              const size = 10 - index * 0.8;
              const x = (
                Math.cos((offset * Math.PI) / 180) * (RADIUS + index * 2)
              ).toFixed(3);
              const y = (
                Math.sin((offset * Math.PI) / 180) *
                (RADIUS + index * 2) *
                0.72
              ).toFixed(3);
              return (
                <span
                  key={index}
                  className="absolute left-1/2 top-1/2 block rounded-full bg-white"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    marginLeft: `${-size / 2}px`,
                    marginTop: `${-size / 2}px`,
                    opacity: `${(1 - index * 0.1).toFixed(2)}`,
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                />
              );
            })}
          </span>
        )}
        <span className="relative z-10 flex size-8 items-center justify-center rounded-full bg-white text-[13px] font-semibold text-black">
          {directionLabel}
        </span>
      </div>
      <span
        aria-live="polite"
        className="text-[13px] uppercase tracking-[0.18em] text-white/45"
      >
        {speedLabel.toFixed(1)}× orbit · {directionLabel}
      </span>
    </div>
  );
}
