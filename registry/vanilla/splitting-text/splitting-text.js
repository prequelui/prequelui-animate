import { animate } from "motion";

const SR_ONLY =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0";

const DEFAULT_TWEEN = { duration: 0.7, ease: [0.23, 1, 0.32, 1] };
const STEP = { chars: 0.05, words: 0.2, lines: 0.3 };
const OFFSET = 150;

let segmenter;

function splitGraphemes(value) {
  if (segmenter === undefined) {
    segmenter =
      typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
  }
  if (!segmenter) return Array.from(value);
  return Array.from(segmenter.segment(value), (entry) => entry.segment);
}

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function makePiece(content, chars) {
  const piece = document.createElement("span");
  piece.dataset.piece = "";
  piece.className = "inline-block will-change-transform";
  if (chars) piece.style.whiteSpace = "pre";
  piece.style.opacity = "0";
  piece.style.transform = `translateX(${OFFSET}px)`;
  piece.textContent = content;
  return piece;
}

export function createSplittingText(root, options = {}) {
  const {
    text = "",
    type = "chars",
    delay = 0,
    stagger,
    disableAnimation = false,
    inView = false,
    inViewOnce = true,
    transition,
    className = "",
  } = options;
  const tween = transition ?? DEFAULT_TWEEN;
  const isLines = Array.isArray(text);
  const kind = isLines ? "lines" : type;
  const gap = stagger ?? STEP[kind] ?? STEP.chars;
  const label = isLines ? text.join(" ") : text;
  const controls = [];
  let played = false;
  let observer;

  const host = document.createElement("span");
  host.dataset.slot = "splitting-text";
  host.className = `inline ${className}`.trim();

  const visual = document.createElement("span");
  visual.setAttribute("aria-hidden", "true");

  if (isLines) {
    text.forEach((line, index) => {
      visual.append(makePiece(line, false));
      if (index < text.length - 1) visual.append(document.createElement("br"));
    });
  } else if (kind === "words") {
    const words = text.match(/\S+\s*/g) ?? [];
    words.forEach((word) => {
      visual.append(makePiece(word.trim(), false));
      if (/\s$/.test(word)) visual.append(document.createTextNode(" "));
    });
  } else {
    text.split(/(\s+)/).forEach((token) => {
      if (!token) return;
      if (/^\s+$/.test(token)) {
        const space = document.createElement("span");
        space.textContent = token;
        visual.append(space);
        return;
      }
      const word = document.createElement("span");
      word.className = "inline-block whitespace-nowrap";
      for (const char of splitGraphemes(token)) {
        word.append(makePiece(char, true));
      }
      visual.append(word);
    });
  }

  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.setAttribute("style", SR_ONLY);
  sr.textContent = label;

  host.append(visual, sr);
  root.innerHTML = "";
  root.append(host);

  /** @type {HTMLElement[]} */
  const pieces = Array.from(host.querySelectorAll("[data-piece]"));

  function settle() {
    for (const piece of pieces) {
      piece.style.opacity = "1";
      piece.style.transform = "none";
    }
  }

  function reset() {
    if (disableAnimation || reduce()) return;
    for (const control of controls) control.stop?.();
    controls.length = 0;
    for (const piece of pieces) {
      piece.style.opacity = "0";
      piece.style.transform = `translateX(${OFFSET}px)`;
    }
    played = false;
  }

  function play() {
    if (played) return;
    played = true;
    if (disableAnimation || reduce()) {
      settle();
      return;
    }
    pieces.forEach((piece, index) => {
      controls.push(
        animate(
          piece,
          { x: [OFFSET, 0], opacity: [0, 1] },
          {
            ...tween,
            delay: Number(tween.delay ?? 0) + delay / 1000 + index * gap,
          },
        ),
      );
    });
  }

  if (!inView) {
    play();
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          if (inViewOnce) observer?.disconnect();
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
    destroy() {
      observer?.disconnect();
      for (const control of controls) control.stop?.();
      controls.length = 0;
      root.innerHTML = "";
    },
  };
}
