"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import { useReduceMotion } from "./motion";

type IconButtonContextValue = { bursts: number };

const IconButtonContext = React.createContext<IconButtonContextValue | null>(null);

export type IconButtonProps = ButtonProps;

export function IconButton({ onClick, className, ...props }: IconButtonProps) {
  const [bursts, setBursts] = React.useState(0);

  return (
    <IconButtonContext.Provider value={{ bursts }}>
      <Button
        data-slot="icon-button"
        onClick={(event) => {
          onClick?.(event);
          setBursts((value) => value + 1);
        }}
        className={cn(
          "relative size-10 border bg-background p-0 text-foreground hover:bg-accent",
          className,
        )}
        {...props}
      />
    </IconButtonContext.Provider>
  );
}

export type IconButtonParticlesProps = {
  size?: number;
  count?: number;
  distance?: number;
  className?: string;
};

export function IconButtonParticles({
  size = 4,
  count = 8,
  distance = 24,
  className,
}: IconButtonParticlesProps) {
  const context = React.useContext(IconButtonContext);
  const reduce = useReduceMotion();
  const bursts = context?.bursts ?? 0;

  return (
    <span
      data-slot="icon-button-particles"
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.span
          key={`${bursts}-${index}`}
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.8 }}
          animate={
            bursts === 0 || reduce
              ? { opacity: 0 }
              : {
                  opacity: [1, 0],
                  x: Math.cos((index / count) * Math.PI * 2) * distance,
                  y: Math.sin((index / count) * Math.PI * 2) * distance,
                  scale: 0.2,
                }
          }
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          className="absolute left-1/2 top-1/2 rounded-full bg-current"
          style={{ width: size, height: size }}
        />
      ))}
    </span>
  );
}

export function useIconButton() {
  const value = React.useContext(IconButtonContext);
  if (!value) throw new Error("useIconButton must be used inside IconButton");
  return value;
}
