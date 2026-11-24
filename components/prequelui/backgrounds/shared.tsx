"use client";

import * as React from "react";
import { useInView } from "motion/react";
import { usePageVisible, useReduceMotion } from "../motion";

export function useBackgroundPlayback(ref: React.RefObject<Element | null>) {
  const inView = useInView(ref);
  const pageVisible = usePageVisible();
  const reduce = useReduceMotion();
  return {
    inView,
    pageVisible,
    reduce,
    playing: inView && pageVisible && !reduce,
  };
}

export function seeded(index: number, salt = 1) {
  const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function useIsDark(ref: React.RefObject<Element | null>) {
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const read = () =>
      setDark(
        element.classList.contains("dark") ||
          document.documentElement.classList.contains("dark"),
      );
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => observer.disconnect();
  }, [ref]);

  return dark;
}

export function useCanvasSize(
  containerRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onChange: () => void,
) {
  const changeRef = React.useRef(onChange);
  changeRef.current = onChange;

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      const width = Math.max(1, Math.round(rect.width * dpr));
      const height = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      changeRef.current();
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, containerRef]);
}
