import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DEFAULT_TWEEN = { duration: 0.3, ease: [0.23, 1, 0.32, 1] };

export function createRotatingText(root, options = {}) {
  const {
    text,
    texts,
    duration = 2000,
    y = -50,
    delay = 0,
    align = "start",
    loop = true,
    transition,
    className = "",
  } = options;
  const value = texts ?? text ?? "";
  const list = (Array.isArray(value) ? value : [value]).slice();
  const items = list.length ? list : [""];
  const unique = [...new Set(items)];
  const tween = transition ?? DEFAULT_TWEEN;
  const justify = align === "center" ? "center" : align === "end" ? "end" : "start";
  let index = 0;
  let rotated = false;
  let timer;
  let observer;
  let onScreen = false;
  let pageVisible = true;
  let control;
  let destroyed = false;

  root.innerHTML = `
    <span data-slot="rotating-text" class="relative inline-block overflow-hidden py-1 align-baseline ${className}">
      <span class="sr-only">${items.join(", ")}</span>
      <span aria-hidden="true" class="inline-grid" style="justify-items:${justify};align-items:baseline">
        ${unique
          .map(
            (item) =>
              `<span class="invisible whitespace-nowrap" style="grid-area:1 / 1">${item}</span>`,
          )
          .join("")}
        <span style="grid-area:1 / 1;justify-self:${justify}">
          <span data-current class="inline-block whitespace-nowrap">${items[0]}</span>
        </span>
      </span>
    </span>`;
  const host = root.querySelector("[data-slot]");
  const current = root.querySelector("[data-current]");

  function playing() {
    return onScreen && pageVisible && (loop || index < items.length - 1);
  }

  function schedule() {
    clearTimeout(timer);
    if (!playing() || destroyed) return;
    timer = setTimeout(() => {
      const travel = reduce() ? 0 : y;
      rotated = true;
      const nextIndex = loop
        ? (index + 1) % items.length
        : Math.min(index + 1, items.length - 1);

      control?.stop?.();
      control = animate(
        current,
        { opacity: 0, y: travel },
        reduce() ? { duration: 0 } : tween,
      );
      control.finished.then(() => {
        if (destroyed) return;
        index = nextIndex;
        current.textContent = items[index % items.length] ?? "";
        current.style.transform = `translateY(${-travel}px)`;
        current.style.opacity = "0";
        control = animate(
          current,
          { opacity: 1, y: 0 },
          reduce() ? { duration: 0 } : tween,
        );
        schedule();
      });
    }, rotated ? duration : delay);
  }

  function onVisibilityChange() {
    pageVisible = !document.hidden;
    schedule();
  }

  observer = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      schedule();
    },
    { threshold: 0.35 },
  );
  observer.observe(host);
  document.addEventListener("visibilitychange", onVisibilityChange);
  pageVisible = !document.hidden;
  schedule();

  return {
    element: host,
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      control?.stop?.();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.innerHTML = "";
    },
  };
}
