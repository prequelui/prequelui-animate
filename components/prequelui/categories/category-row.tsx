"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CategoryPictogram,
  type CategoryPictogramDefinition,
} from "./category-core";

export type CategoryRowItem = {
  definition: CategoryPictogramDefinition;
  label?: string;
  href?: string;
  badge?: string;
  active?: boolean;
};

export type CategoryRowProps = {
  items: CategoryRowItem[];
  size?: number;
  className?: string;
  ariaLabel?: string;
  onSelect?: (item: CategoryRowItem) => void;
};

function gradientOf(definition: CategoryPictogramDefinition) {
  const { light, dark } = definition.palette;
  return `linear-gradient(45deg, light-dark(${light[0]}, ${dark[0]}), light-dark(${light[1]}, ${dark[1]}))`;
}

export function CategoryRow({
  items,
  size = 40,
  className,
  ariaLabel = "Categories",
  onSelect,
}: CategoryRowProps) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const [state, setState] = React.useState({
    left: false,
    right: false,
    overflow: false,
  });

  const measure = React.useCallback(() => {
    const node = scroller.current;
    if (!node) return;
    const max = node.scrollWidth - node.clientWidth;
    setState({
      left: node.scrollLeft > 1,
      right: max - node.scrollLeft > 1,
      overflow: max > 1,
    });
  }, []);

  React.useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    measure();
    node.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      node.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, [measure]);

  const scrollBy = (direction: -1 | 1) => {
    const node = scroller.current;
    if (!node) return;
    const amount = Math.max(240, Math.round(node.clientWidth * 0.7));
    node.scrollBy({
      left: direction * amount,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <nav
      aria-label={ariaLabel}
      className={cn("relative w-full", className)}
      data-category-row=""
    >
      <div
        ref={scroller}
        className="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul className="mx-auto flex w-max min-w-full items-stretch justify-center px-3 py-4">
          {items.map((item, index) => {
            const { definition } = item;
            const label = item.label ?? definition.name;
            const iconActive =
              hovered === definition.slug && !item.active ? true : undefined;
            const content = (
              <>
                <CategoryPictogram
                  definition={definition}
                  size={size}
                  active={item.active ? true : iconActive}
                  className="text-foreground"
                />
                <span
                  data-category-label=""
                  className={cn(
                    "w-full text-center text-[15px] leading-[19px] text-foreground",
                    item.active && "font-medium",
                  )}
                >
                  {label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "pointer-events-none absolute -bottom-[5px] left-1/2 h-0.5 w-6 -translate-x-1/2 origin-center rounded-full bg-background transition-transform duration-100 ease-out",
                    "scale-x-0 group-hover/cat:scale-x-100 group-focus-visible/cat:scale-x-100",
                    item.active && "scale-x-100",
                    "motion-reduce:transition-none",
                  )}
                  style={{ backgroundImage: gradientOf(definition) }}
                />
                {item.badge ? (
                  <span
                    className="absolute -left-1 -top-2 rounded-full px-1.5 py-0.5 text-[13px] font-semibold uppercase leading-none"
                    style={{
                      backgroundImage: gradientOf(definition),
                      color: "light-dark(#ffffff, #171717)",
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </>
            );

            const shared = cn(
              "group/cat relative flex min-w-14 select-none flex-col items-center gap-1 rounded-md py-3 outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background",
              "max-md:py-2.5",
            );

            return (
              <li
                key={definition.slug}
                className="shrink-0 snap-start px-2.5"
                onPointerEnter={() => setHovered(definition.slug)}
                onPointerLeave={() =>
                  setHovered((value) =>
                    value === definition.slug ? null : value,
                  )
                }
              >
                {item.href ? (
                  <a
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={shared}
                    onFocus={() => setHovered(definition.slug)}
                    onBlur={() => setHovered(null)}
                  >
                    {content}
                  </a>
                ) : (
                  <button
                    type="button"
                    aria-current={item.active ? "page" : undefined}
                    onClick={() => onSelect?.(item)}
                    className={shared}
                    onFocus={() => setHovered(definition.slug)}
                    onBlur={() => setHovered(null)}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {state.overflow ? (
        <>
          <button
            type="button"
            aria-label="Scroll categories left"
            tabIndex={state.left ? 0 : -1}
            onClick={() => scrollBy(-1)}
            className={cn(
              "absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground",
              state.left
                ? "translate-x-0 opacity-100"
                : "-translate-x-2 opacity-0 pointer-events-none",
            )}
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            tabIndex={state.right ? 0 : -1}
            onClick={() => scrollBy(1)}
            className={cn(
              "absolute inset-y-0 right-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground",
              state.right
                ? "translate-x-0 opacity-100"
                : "translate-x-2 opacity-0 pointer-events-none",
            )}
          >
            <ChevronRight className="size-4" />
          </button>
        </>
      ) : null}
    </nav>
  );
}
