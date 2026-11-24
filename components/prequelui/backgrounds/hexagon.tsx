"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const HEX_CLIP =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export type HexagonBackgroundProps = React.ComponentProps<"div"> & {
  hexagonSize?: number;
  hexagonMargin?: number;
  speed?: number;
};

export function HexagonBackground({
  hexagonSize = 46,
  hexagonMargin = 3,
  speed = 1,
  className,
  children,
  ...props
}: HexagonBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [grid, setGrid] = React.useState({ rows: 0, columns: 0 });

  const width = hexagonSize;
  const height = hexagonSize * 1.1;
  const rowSpacing = height * 0.75 + hexagonMargin;

  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const rows = Math.ceil(rect.height / rowSpacing) + 2;
      const columns = Math.ceil(rect.width / (width + hexagonMargin)) + 2;
      setGrid((current) =>
        current.rows === rows && current.columns === columns
          ? current
          : { rows, columns },
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, [rowSpacing, width, hexagonMargin]);

  return (
    <div
      ref={ref}
      data-slot="hexagon-background"
      className={cn(
        "relative isolate size-full overflow-hidden bg-[#f4f2ee] dark:bg-[#0b0b0f]",
        className,
      )}
      style={{ "--hex-leave": `${1000 / Math.max(0.1, speed)}ms` } as React.CSSProperties}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute left-0 top-0 size-full overflow-hidden [text-rendering:optimizeSpeed]"
      >
        {Array.from({ length: grid.rows }).map((_, row) => (
          <div
            key={row}
            className="flex w-max"
            style={{
              marginTop: row === 0 ? -height / 2 : rowSpacing - height,
              marginLeft: (row % 2 === 0 ? 0 : -width / 2) - width / 2,
            }}
          >
            {Array.from({ length: grid.columns }).map((_, column) => (
              <div
                key={column}
                className="relative shrink-0"
                style={{
                  width,
                  height,
                  marginLeft: hexagonMargin,
                }}
              >
                <div
                  className="absolute inset-0 bg-foreground/[0.10] transition-colors [transition-duration:var(--hex-leave)] [clip-path:var(--hex-clip)] hover:bg-foreground/[0.22] hover:[transition-duration:0ms] dark:bg-foreground/[0.14] dark:hover:bg-foreground/[0.30]"
                  style={{ "--hex-clip": HEX_CLIP } as React.CSSProperties}
                />
                <div
                  className="absolute bg-[#f4f2ee] transition-colors [transition-duration:var(--hex-leave)] [clip-path:var(--hex-clip)] hover:bg-foreground/[0.06] hover:[transition-duration:0ms] dark:bg-[#0b0b0f] dark:hover:bg-foreground/[0.12]"
                  style={
                    {
                      inset: hexagonMargin,
                      "--hex-clip": HEX_CLIP,
                    } as React.CSSProperties
                  }
                />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(244,242,238,0.55))] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,11,15,0.65))]" />
      {children}
    </div>
  );
}
