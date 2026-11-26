"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  cn,
  localPoint,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const LAYERS = [
  { tone: "bg-white/25", label: "Layer 3" },
  { tone: "bg-white/55", label: "Layer 2" },
  { tone: "bg-white", label: "Layer 1" },
];

export function DepthStack({ className, preview }: MomentProps) {
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1300, 2800);
  const lifted = preview ? pulse : pinned || hovered;

  const track = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== "mouse") return;
    const node = event.currentTarget;
    const point = localPoint(event, node);
    const width = node.offsetWidth || 1;
    const height = node.offsetHeight || 1;
    setTilt({
      x: (point.x / width - 0.5) * 2,
      y: (point.y / height - 0.5) * 2,
    });
  };

  const reset = () => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className={cn(surface, "flex-col gap-3", className)}>
      <button
        type="button"
        aria-expanded={lifted}
        aria-label="Lift the card stack"
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={reset}
        onPointerMove={track}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => setPinned((value) => !value)}
        className="relative flex h-[104px] w-[158px] items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ perspective: 720 }}
      >
        <motion.div
          aria-hidden="true"
          className="relative flex size-[86px] items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
          animate={
            reduce
              ? { rotateX: 0, rotateY: 0 }
              : {
                  rotateX: lifted ? -12 + tilt.y * 7 : 0,
                  rotateY: lifted ? tilt.x * 12 : 0,
                }
          }
          transition={reduce ? { duration: 0 } : springSoft}
        >
          {LAYERS.map((layer, index) => {
            const depth = LAYERS.length - 1 - index;
            return (
              <motion.span
                key={layer.label}
                className={cn(
                  "absolute size-[84px] rounded-xl border border-black/10 shadow-xl",
                  layer.tone,
                )}
                style={{ transformStyle: "preserve-3d" }}
                animate={
                  reduce
                    ? { y: -depth * 9, z: 0, scale: 1 - depth * 0.03 }
                    : {
                        y: lifted ? -depth * 20 : -depth * 5,
                        z: lifted ? depth * 30 : 0,
                        scale: 1 - depth * 0.03,
                      }
                }
                transition={
                  reduce ? { duration: 0 } : { ...springSoft, delay: index * 0.02 }
                }
              >
                {index === LAYERS.length - 1 ? (
                  <span className="flex size-full items-center justify-center rounded-xl bg-black/5">
                    <span className="text-[13px] uppercase tracking-[0.16em] text-black/55">
                      {lifted ? "Open" : "Stack"}
                    </span>
                  </span>
                ) : null}
              </motion.span>
            );
          })}
        </motion.div>
      </button>
      <span className="text-[13px] uppercase tracking-[0.18em] text-white/40">
        {lifted ? "Lifted" : "Hover or tap"}
      </span>
    </div>
  );
}
