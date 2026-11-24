import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createScrollingNumber(root, options = {}) {
  const {
    number = 0,
    fromNumber = 0,
    step = 1,
    itemsSize = 30,
    sideItemsCount = 2,
    inView = false,
    inViewOnce = true,
    delay = 0,
    transition,
    onCompleted,
    className = "",
  } = options;
  const size = Math.max(1, step);
  const from = Math.round(fromNumber / size) * size;
  const to = Math.round(number / size) * size;
  const direction = to >= from ? 1 : -1;
  const count = Math.abs(Math.round((to - from) / size)) + 1;
  const values = Array.from({ length: count }, (_, index) => from + index * size * direction);
  const targetIndex = values.length - 1;
  const height = itemsSize * (1 + sideItemsCount * 2);
  const initialY = sideItemsCount * itemsSize;
  const finalY = (sideItemsCount - targetIndex) * itemsSize;

  root.innerHTML = `
    <div data-slot="scrolling-number" class="relative isolate inline-block overflow-hidden rounded-lg ${className}"
      style="height:${height}px;mask-image:linear-gradient(to bottom,transparent,black 24%,black 76%,transparent);-webkit-mask-image:linear-gradient(to bottom,transparent,black 24%,black 76%,transparent)">
      <div aria-hidden="true" class="pointer-events-none absolute inset-x-1 top-1/2 z-10 -translate-y-1/2 rounded-md border bg-foreground/[0.06] dark:bg-background/20"
        style="height:${itemsSize}px"></div>
      <div data-band aria-hidden="true" class="relative flex flex-col" style="transform:translate3d(0,${initialY}px,0)">
        ${values
          .map(
            (value) => `<div class="flex shrink-0 items-center justify-center font-medium tabular-nums ${
              value === number ? "text-foreground" : "text-muted-foreground/50"
            }" style="height:${itemsSize}px">${value.toLocaleString("en-US")}</div>`,
          )
          .join("")}
      </div>
      <span class="sr-only">${number.toLocaleString("en-US")}</span>
    </div>`;

  const host = root.querySelector("[data-slot]");
  const band = root.querySelector("[data-band]");
  let observer;
  let timer;
  let control;
  let started = false;

  function play() {
    if (started) return;
    started = true;
    if (reduce()) {
      band.style.transform = `translate3d(0,${finalY}px,0)`;
      onCompleted?.();
      return;
    }
    timer = setTimeout(() => {
      control = animate(
        band,
        { y: [initialY, finalY] },
        {
          ...(transition ?? {}),
          type: "spring",
          stiffness: transition?.stiffness ?? 90,
          damping: transition?.damping ?? 30,
          restDelta: 0.001,
          restSpeed: 0.01,
        },
      );
      control.finished.then(() => onCompleted?.());
    }, delay);
  }

  if (inView) {
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        play();
        if (inViewOnce) observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
  } else {
    play();
  }

  return {
    element: host,
    destroy() {
      clearTimeout(timer);
      observer?.disconnect();
      control?.stop?.();
      root.innerHTML = "";
    },
  };
}
