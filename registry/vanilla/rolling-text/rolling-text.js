import { animate } from "motion";

const DEFAULT_TWEEN = {
  duration: 0.5,
  delay: 0.1,
  ease: [0.23, 1, 0.32, 1],
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function splitGraphemes(value) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (entry) => entry.segment);
  }
  return Array.from(value);
}

const display = (value) => (value === " " ? "&nbsp;" : value);

export function createRollingText(root, options = {}) {
  const {
    text = "",
    transition,
    delay = 0,
    inView = false,
    inViewOnce = true,
    className = "",
  } = options;
  const tween = transition ?? DEFAULT_TWEEN;
  const step = Number(tween.delay ?? 0);
  let charIndex = 0;
  let observer;
  let played = false;
  let destroyed = false;
  const controls = [];

  const words = text
    .split(/(\s+)/)
    .filter(Boolean)
    .map((part, index) => {
      if (/^\s+$/.test(part)) return { space: true, part };
      return {
        space: false,
        chars: splitGraphemes(part).map((label, offset) => {
          const charDelay = delay / 1000 + charIndex * step;
          charIndex += 1;
          return { key: `char-${index}-${offset}`, label, delay: charDelay };
        }),
      };
    });

  const inner = words
    .map((word) => {
      if (word.space) return `<span>${word.part}</span>`;
      return `<span class="inline-block whitespace-nowrap">${word.chars
        .map(
          (char) => `
        <span data-roll data-delay="${char.delay}" class="relative inline-block"
          style="perspective:9999999px;transform-style:preserve-3d">
          <span data-char-top aria-hidden="true" class="absolute inline-block"
            style="backface-visibility:hidden;transform-origin:50% 25%;transform:rotateX(0deg)">${display(char.label)}</span>
          <span data-char-bottom aria-hidden="true" class="absolute inline-block"
            style="backface-visibility:hidden;transform-origin:50% 100%;transform:rotateX(90deg)">${display(char.label)}</span>
          <span class="invisible">${display(char.label)}</span>
        </span>`,
        )
        .join("")}</span>`;
    })
    .join("");

  root.innerHTML = `
    <span data-slot="rolling-text" class="inline ${className}">
      <span aria-hidden="true">${inner}</span>
      <span class="sr-only">${text}</span>
    </span>`;
  const host = root.querySelector("[data-slot]");

  function stop() {
    while (controls.length) controls.pop()?.stop?.();
  }

  function reset() {
    stop();
    host.querySelectorAll("[data-char-top]").forEach((node) => {
      node.style.transform = "rotateX(0deg)";
      node.style.opacity = "";
    });
    host.querySelectorAll("[data-char-bottom]").forEach((node) => {
      node.style.transform = "rotateX(90deg)";
      node.style.opacity = "";
    });
  }

  function play() {
    if (played || destroyed) return;
    if (reduce()) {
      played = true;
      host.querySelectorAll("[data-char-top]").forEach((node) => {
        node.style.transform = "rotateX(90deg)";
      });
      host.querySelectorAll("[data-char-bottom]").forEach((node) => {
        node.style.transform = "rotateX(0deg)";
      });
      return;
    }
    played = true;
    const base = { ...tween, ease: tween.ease ?? [0.23, 1, 0.32, 1] };
    host.querySelectorAll("[data-roll]").forEach((node) => {
      const delay = Number(node.dataset.delay ?? 0);
      const top = node.querySelector("[data-char-top]");
      const bottom = node.querySelector("[data-char-bottom]");
      if (top) controls.push(animate(top, { rotateX: [0, 90] }, { ...base, delay }));
      if (bottom) {
        controls.push(
          animate(bottom, { rotateX: [90, 0] }, { ...base, delay: delay + 0.3 }),
        );
      }
    });
  }

  if (reduce() || !inView) {
    play();
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
        } else if (!inViewOnce) {
          reset();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
  }

  return {
    element: host,
    play,
    replay() {
      played = false;
      reset();
      queueMicrotask(play);
    },
    destroy() {
      destroyed = true;
      observer?.disconnect();
      stop();
      root.innerHTML = "";
    },
  };
}
