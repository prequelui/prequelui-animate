import { animate } from "motion";

const EASE = [0.23, 1, 0.32, 1];

const ENTRY = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  opacity: { duration: 0.3, ease: EASE },
  filter: { duration: 0.3, ease: EASE },
};

const EXIT = { duration: 0.15, ease: EASE };

const LAYOUT = { type: "spring", stiffness: 300, damping: 30 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let segmenter;
let uid = 0;

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

function matchLetters(previous, labels, makeId) {
  const rows = previous.length;
  const cols = labels.length;
  const common = Array.from({ length: rows + 1 }, () =>
    new Array(cols + 1).fill(0),
  );

  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      common[i][j] =
        previous[i].label === labels[j]
          ? common[i + 1][j + 1] + 1
          : Math.max(common[i + 1][j], common[i][j + 1]);
    }
  }

  const kept = new Map();
  for (let i = 0, j = 0; i < rows && j < cols; ) {
    if (previous[i].label === labels[j]) {
      kept.set(j, previous[i]);
      i += 1;
      j += 1;
    } else if (common[i + 1][j] >= common[i][j + 1]) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return labels.map(
    (label, position) => kept.get(position) ?? { id: makeId(), label },
  );
}

export function createMorphingText(root, options = {}) {
  const {
    text = "",
    delay = 0,
    loop = false,
    holdDelay = 2500,
    inView = false,
    inViewOnce = true,
    transition,
    className = "",
  } = options;
  const texts = (Array.isArray(text) ? text : [text]).slice();
  const uidBase = ++uid;
  let counter = 0;
  const makeId = () => `morph-${uidBase}-${(counter += 1)}`;
  const createLetters = (value) =>
    splitGraphemes(value).map((label) => ({ id: makeId(), label }));

  let index = 0;
  let shown = texts[0] ?? "";
  let letters = createLetters(shown);
  let leaving = [];
  let started = delay === 0;
  let onScreen = !inView;
  let pageVisible = true;
  let timer;
  let delayTimer;
  let observer;
  const controls = [];
  let destroyed = false;

  root.innerHTML = `
    <span data-slot="morphing-text" class="relative inline-flex ${className}">
      <span data-label class="sr-only"></span>
      <span data-track aria-hidden="true" class="relative inline-flex"></span>
    </span>`;
  const host = root.querySelector("[data-slot]");
  const label = root.querySelector("[data-label]");
  const track = root.querySelector("[data-track]");

  function stopControls() {
    while (controls.length) controls.pop()?.stop?.();
  }

  function render() {
    label.textContent = texts[Math.min(index, texts.length - 1)] ?? "";
    const parts = letters.map(
      (letter) =>
        `<span data-letter-id="${letter.id}" class="inline-block whitespace-pre will-change-transform">${letter.label}</span>`,
    );
    const ghosts = leaving.map(
      (item) =>
        `<span data-leaving-id="${item.id}" class="absolute inline-block whitespace-pre will-change-transform"
          style="left:${item.left}px;top:${item.top}px;width:${item.width}px;height:${item.height}px">${item.label}</span>`,
    );
    track.innerHTML = parts.join("") + ghosts.join("");
  }

  function capturePositions() {
    const positions = new Map();
    track.querySelectorAll("[data-letter-id]").forEach((node) => {
      positions.set(node.dataset.letterId ?? "", node.getBoundingClientRect());
    });
    return positions;
  }

  function animateLayout(previous) {
    if (previous.size === 0) return;
    track.querySelectorAll("[data-letter-id]").forEach((node) => {
      const before = previous.get(node.dataset.letterId ?? "");
      if (!before) return;
      const after = node.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) return;
      node.style.transform = `translate(${dx}px, ${dy}px)`;
      controls.push(animate(node, { x: [dx, 0], y: [dy, 0] }, LAYOUT));
    });
  }

  function enterOptions(step) {
    return {
      ...(transition ?? ENTRY),
      delay: step,
      opacity: { duration: 0.3, ease: EASE, delay: step },
      filter: { duration: 0.3, ease: EASE, delay: step },
    };
  }

  function animateLetters(delays) {
    if (delays.size === 0) return;
    track.querySelectorAll("[data-letter-id]").forEach((node) => {
      const id = node.dataset.letterId ?? "";
      if (!delays.has(id)) return;
      const step = delays.get(id) ?? 0;
      node.style.opacity = "0";
      if (reduce()) {
        controls.push(animate(node, { opacity: [0, 1] }, enterOptions(step)));
        return;
      }
      node.style.transform = "translateY(0.12em)";
      node.style.filter = "blur(6px)";
      controls.push(
        animate(
          node,
          {
            opacity: [0, 1],
            y: ["0.12em", "0px"],
            filter: ["blur(6px)", "blur(0px)"],
          },
          enterOptions(step),
        ),
      );
    });
  }

  function animateLeaving(items) {
    for (const item of items) {
      const node = track.querySelector(`[data-leaving-id="${item.id}"]`);
      if (!node) continue;
      const keyframes = reduce()
        ? { opacity: [1, 0] }
        : { opacity: [1, 0], filter: ["blur(0px)", "blur(6px)"] };
      const animation = animate(node, keyframes, EXIT);
      controls.push(animation);
      const done = () => {
        leaving = leaving.filter((entry) => entry.id !== item.id);
        render();
      };
      if (animation.finished) animation.finished.then(done, done);
      else done();
    }
  }

  function transitionTo(next) {
    const before = capturePositions();
    const previous = letters;
    const previousIds = new Set(previous.map((letter) => letter.id));
    const nextLetters = matchLetters(previous, splitGraphemes(next), makeId);
    const nextIds = new Set(nextLetters.map((letter) => letter.id));
    const exits = [];
    const rect = track.getBoundingClientRect();

    for (const old of previous) {
      if (nextIds.has(old.id)) continue;
      const node = track.querySelector(`[data-letter-id="${old.id}"]`);
      if (!node) continue;
      const box = node.getBoundingClientRect();
      exits.push({
        id: old.id,
        label: old.label,
        left: box.left - rect.left,
        top: box.top - rect.top,
        width: box.width,
        height: box.height,
      });
    }

    const delays = new Map();
    let incoming = 0;
    for (const letter of nextLetters) {
      if (previousIds.has(letter.id)) continue;
      delays.set(letter.id, 0.08 + 0.012 * incoming);
      incoming += 1;
    }

    shown = next;
    letters = nextLetters;
    if (exits.length) leaving = [...leaving, ...exits];
    render();

    queueMicrotask(() => {
      if (destroyed) return;
      animateLayout(before);
      animateLetters(delays);
      animateLeaving(exits);
    });
  }

  function current() {
    return texts[Math.min(index, texts.length - 1)] ?? "";
  }

  function last() {
    return !loop && index >= texts.length - 1;
  }

  function playing() {
    return started && texts.length > 1 && !last() && onScreen && pageVisible;
  }

  function clearTimer() {
    if (timer) clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    clearTimer();
    if (!playing()) return;
    timer = setTimeout(() => {
      index = (index + 1) % texts.length;
      const next = current();
      if (shown !== next) transitionTo(next);
      else render();
      schedule();
    }, holdDelay);
  }

  function onVisibilityChange() {
    pageVisible = !document.hidden;
    schedule();
  }

  document.addEventListener("visibilitychange", onVisibilityChange);
  pageVisible = !document.hidden;

  if (delay > 0) {
    delayTimer = setTimeout(() => {
      started = true;
      schedule();
    }, delay);
  }

  if (inView) {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        onScreen = visible;
        if (visible && inViewOnce) observer?.disconnect();
        schedule();
      },
      { threshold: 0.35 },
    );
    observer.observe(host);
  } else {
    onScreen = true;
  }

  render();
  schedule();

  return {
    element: host,
    destroy() {
      destroyed = true;
      clearTimer();
      if (delayTimer) clearTimeout(delayTimer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopControls();
      root.innerHTML = "";
    },
  };
}
