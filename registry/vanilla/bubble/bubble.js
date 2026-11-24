import { animate } from "motion";

const DEFAULTS = {
  first: "#6366f1",
  second: "#a855f7",
  third: "#22d3ee",
  fourth: "#f472b6",
  fifth: "#f59e0b",
  sixth: "#34d399",
};

const reduceMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let uid = 0;

export function createBubble(root, options = {}) {
  const {
    content = "",
    interactive = false,
    speed = 1,
    paused = false,
    colors,
    transition,
    className = "",
  } = options;
  const palette = { ...DEFAULTS, ...(colors ?? {}) };
  const rate = Math.max(0.2, speed);
  const filterId = `bubble-goo-${++uid}`;
  let inView = false;
  let pageVisible = true;
  let reduce = reduceMotion();
  const controls = [];
  let follow;
  let pointerFrame = 0;
  const pointer = { x: 0, y: 0 };
  let observer;

  const background = (name) =>
    `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-${name}) 80%, transparent) 0%, transparent 58%)`;

  root.innerHTML = `
    <div data-slot="bubble-background"
      class="relative size-full overflow-hidden bg-[linear-gradient(135deg,#12111a,#1d1830_45%,#0f172a)] ${className}"
      style="--bubble-first:${palette.first};--bubble-second:${palette.second};--bubble-third:${palette.third};--bubble-fourth:${palette.fourth};--bubble-fifth:${palette.fifth};--bubble-sixth:${palette.sixth}">
      <svg aria-hidden="true" class="pointer-events-none absolute size-0">
        <defs>
          <filter id="${filterId}">
            <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div aria-hidden="true" class="pointer-events-none absolute inset-0" style="filter:url(#${filterId}) blur(38px)">
        <div data-blob="one" class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-90 mix-blend-hard-light"
          style="background:${background("first")};will-change:transform"></div>
        <div data-blob="two" class="absolute inset-0 flex origin-[calc(50%-380px)] items-center justify-center">
          <div class="size-[80%] rounded-full mix-blend-hard-light" style="background:${background("second")}"></div>
        </div>
        <div data-blob="three" class="absolute inset-0 flex origin-[calc(50%+400px)] items-center justify-center">
          <div class="absolute left-[calc(50%-460px)] top-[calc(50%+180px)] size-[80%] rounded-full mix-blend-hard-light"
            style="background:${background("third")}"></div>
        </div>
        <div data-blob="four" class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-70 mix-blend-hard-light"
          style="background:${background("fourth")};will-change:transform"></div>
        <div data-blob="five" class="absolute inset-0 flex origin-[calc(50%-760px)_calc(50%+180px)] items-center justify-center">
          <div class="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 mix-blend-hard-light"
            style="background:${background("fifth")}"></div>
        </div>
        ${
          interactive
            ? `<div data-blob="six" class="absolute size-full rounded-full opacity-70 mix-blend-hard-light"
          style="background:${background("sixth")};will-change:transform"></div>`
            : ""
        }
      </div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,4,8,0.55))]"></div>
      ${content}
    </div>`;
  const host = root.querySelector("[data-slot]");
  const blobs = {
    one: root.querySelector('[data-blob="one"]'),
    two: root.querySelector('[data-blob="two"]'),
    three: root.querySelector('[data-blob="three"]'),
    four: root.querySelector('[data-blob="four"]'),
    five: root.querySelector('[data-blob="five"]'),
    six: root.querySelector('[data-blob="six"]'),
  };

  function playing() {
    return inView && pageVisible && !reduce && !paused;
  }

  function stopLoops() {
    while (controls.length) controls.pop()?.stop?.();
  }

  function snap(element, values) {
    if (!element) return;
    controls.push(animate(element, values, { duration: 0 }));
  }

  function start() {
    stopLoops();
    if (!playing()) {
      snap(blobs.one, { y: -46 });
      snap(blobs.two, { rotate: reduce ? 90 : 0 });
      snap(blobs.three, { rotate: reduce ? 180 : 0 });
      snap(blobs.four, { x: -46 });
      snap(blobs.five, { rotate: reduce ? 45 : 0 });
      return;
    }
    const base = transition ?? {};
    const duration = rate;
    controls.push(
      animate(blobs.one, { y: [-46, 46, -46] }, { duration: 30 / duration, ease: "easeInOut", repeat: Infinity, ...base }),
    );
    controls.push(
      animate(blobs.two, { rotate: [0, 360] }, { duration: 20 / duration, ease: "linear", repeat: Infinity, ...base }),
    );
    controls.push(
      animate(blobs.three, { rotate: [0, -360] }, { duration: 40 / duration, ease: "linear", repeat: Infinity, ...base }),
    );
    controls.push(
      animate(blobs.four, { x: [-46, 46, -46] }, { duration: 40 / duration, ease: "easeInOut", repeat: Infinity, ...base }),
    );
    controls.push(
      animate(blobs.five, { rotate: [0, 360] }, { duration: 24 / duration, ease: "linear", repeat: Infinity, ...base }),
    );
  }

  function applyPointer() {
    if (!blobs.six) return;
    blobs.six.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
  }

  function onPointerMove(event) {
    if (!interactive || reduce) return;
    cancelAnimationFrame(pointerFrame);
    pointerFrame = requestAnimationFrame(() => {
      const rect = host.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      follow?.stop?.();
      follow = animate(pointer, { x, y }, {
        type: "spring",
        stiffness: 100,
        damping: 20,
        onUpdate: applyPointer,
      });
    });
  }

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const onMedia = () => {
    reduce = media.matches;
    start();
  };
  media.addEventListener?.("change", onMedia);
  pageVisible = document.visibilityState !== "hidden";
  const onVisibility = () => {
    pageVisible = document.visibilityState !== "hidden";
    start();
  };
  document.addEventListener("visibilitychange", onVisibility);
  observer = new IntersectionObserver(
    (entries) => {
      inView = entries.some((entry) => entry.isIntersecting);
      start();
    },
    { threshold: 0 },
  );
  observer.observe(host);
  if (interactive) host.addEventListener("pointermove", onPointerMove);

  return {
    element: host,
    destroy() {
      cancelAnimationFrame(pointerFrame);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMedia);
      if (interactive) host.removeEventListener("pointermove", onPointerMove);
      stopLoops();
      follow?.stop?.();
      root.innerHTML = "";
    },
  };
}
