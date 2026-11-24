"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CarouselSlide = { title: string; body: string };
export type CarouselProps = {
  slides?: CarouselSlide[];
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  className?: string;
};

const FALLBACK: CarouselSlide[] = [
  { title: "Springs", body: "Position and size move on springs." },
  { title: "Tweens", body: "Colour and opacity use short tweens." },
  { title: "Reduced motion", body: "Travel is removed, state is kept." },
];

export function Carousel({
  slides = FALLBACK,
  defaultIndex = 0,
  onIndexChange,
  className,
}: CarouselProps) {
  const [index, setIndex] = React.useState(defaultIndex);
  const [drag, setDrag] = React.useState(0);
  const start = React.useRef<number | null>(null);
  const reduce = useReducedMotion();

  const go = (next: number) => {
    const value = Math.min(slides.length - 1, Math.max(0, next));
    setIndex(value);
    onIndexChange?.(value);
  };

  const end = () => {
    if (drag > 60) go(index - 1);
    else if (drag < -60) go(index + 1);
    setDrag(0);
    start.current = null;
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div
        className="relative overflow-hidden rounded-xl border"
        onPointerDown={(event) => {
          start.current = event.clientX;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (start.current === null) return;
          setDrag(event.clientX - start.current);
        }}
        onPointerUp={end}
        onPointerCancel={end}
      >
        <div
          className="flex touch-pan-y"
          style={{
            transform: `translateX(calc(-${index * 100}% + ${drag}px))`,
            transition: start.current === null && !reduce ? "transform 500ms cubic-bezier(0.34,1.2,0.64,1)" : "none",
          }}
        >
          {slides.map((slide) => (
            <article key={slide.title} className="w-full shrink-0 p-6">
              <p className="text-[13px] font-medium">{slide.title}</p>
              <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{slide.body}</p>
            </article>
          ))}
        </div>
        <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
          <button type="button" aria-label="Previous slide" disabled={index === 0} onClick={() => go(index - 1)} className="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40">
            <ChevronLeft className="size-3.5" />
          </button>
          <button type="button" aria-label="Next slide" disabled={index === slides.length - 1} onClick={() => go(index + 1)} className="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40">
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1.5">
          {slides.map((slide, item) => (
            <button key={slide.title} type="button" aria-label={`Go to ${item + 1}`} aria-current={item === index ? "true" : undefined} onClick={() => go(item)} className="flex size-6 items-center justify-center">
              <span className={cn("size-1.5 rounded-full transition-colors", item === index ? "bg-foreground" : "bg-border")} />
            </button>
          ))}
        </div>
        <span className="font-mono text-[13px] tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
