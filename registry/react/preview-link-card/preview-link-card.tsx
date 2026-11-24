"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export type PreviewLinkCardProps = {
  href?: string;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  image?: string;
  delay?: number;
  closeDelay?: number;
};

const enter = { duration: 0.25, ease: [0.23, 1, 0.32, 1] } as const;
const leave = { duration: 0.15, ease: [0, 0, 0.58, 1] } as const;

export function PreviewLinkCard({
  href = "https://prequelui.dev",
  trigger = "prequelui.dev",
  title = "PrequelUI Animate",
  description = "Motion for the primitives you already use.",
  image,
  delay = 200,
  closeDelay = 150,
}: PreviewLinkCardProps) {
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();
  const enterTimer = React.useRef<number | undefined>(undefined);
  const leaveTimer = React.useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(leaveTimer.current);
    enterTimer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(enterTimer.current);
    leaveTimer.current = window.setTimeout(() => setOpen(false), closeDelay);
  };

  React.useEffect(
    () => () => {
      window.clearTimeout(enterTimer.current);
      window.clearTimeout(leaveTimer.current);
    },
    [],
  );

  return (
    <span
      className="relative inline-block"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        onClick={(event) => event.preventDefault()}
        className="inline-flex items-center gap-1 text-[13px] font-medium underline decoration-border underline-offset-4"
      >
        {trigger}
        <ArrowUpRight className="size-3.5" />
      </a>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97, filter: "blur(6px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, y: 6, scale: 0.98, filter: "blur(4px)", transition: leave }
            }
            transition={reduce ? { duration: 0.2 } : enter}
            className="absolute left-1/2 top-8 z-40 w-[260px] -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-xl"
          >
            {image ? (
              <img src={image} alt="" className="h-[92px] w-full object-cover" />
            ) : (
              <div className="h-[92px] bg-[radial-gradient(circle_at_30%_20%,#f6c7ae,transparent_60%),linear-gradient(135deg,#efe9df,#dbe7e2)] dark:bg-[radial-gradient(circle_at_30%_20%,#3a2b2b,transparent_60%),linear-gradient(135deg,#1a1a1a,#101816)]" />
            )}
            <div className="p-3">
              <p className="text-[13px] font-medium">{title}</p>
              <p className="mt-1 text-[13px] leading-5 text-muted-foreground">{description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
