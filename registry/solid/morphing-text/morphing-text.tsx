import {
  For,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import { animate } from "motion";

export type MorphingTextTransition = {
  type?: "spring" | "tween" | "inertia" | "keyframes";
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
  duration?: number;
  delay?: number;
  ease?: string | number[];
  opacity?: { duration?: number; ease?: string | number[]; delay?: number };
  filter?: { duration?: number; ease?: string | number[]; delay?: number };
  [key: string]: unknown;
};

export type MorphingTextProps = {
  text: string | string[];
  delay?: number;
  loop?: boolean;
  holdDelay?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  transition?: MorphingTextTransition;
  class?: string;
};

type Letter = { id: string; label: string };

type Leaving = {
  id: string;
  label: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

const EASE = [0.23, 1, 0.32, 1];

const ENTRY: MorphingTextTransition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  opacity: { duration: 0.3, ease: EASE },
  filter: { duration: 0.3, ease: EASE },
};

const EXIT = { duration: 0.15, ease: EASE };

const LAYOUT = { type: "spring" as const, stiffness: 300, damping: 30 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let segmenter: Intl.Segmenter | null | undefined;

function splitGraphemes(value: string) {
  if (segmenter === undefined) {
    segmenter =
      typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
  }
  if (!segmenter) return Array.from(value);
  return Array.from(segmenter.segment(value), (entry) => entry.segment);
}

function matchLetters(
  previous: readonly Letter[],
  labels: readonly string[],
  makeId: () => string,
): Letter[] {
  const rows = previous.length;
  const cols = labels.length;
  const common: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array<number>(cols + 1).fill(0),
  );

  for (let i = rows - 1; i >= 0; i -= 1) {
    for (let j = cols - 1; j >= 0; j -= 1) {
      common[i]![j] =
        previous[i]!.label === labels[j]
          ? common[i + 1]![j + 1]! + 1
          : Math.max(common[i + 1]![j]!, common[i]![j + 1]!);
    }
  }

  const kept = new Map<number, Letter>();
  for (let i = 0, j = 0; i < rows && j < cols; ) {
    if (previous[i]!.label === labels[j]) {
      kept.set(j, previous[i]!);
      i += 1;
      j += 1;
    } else if (common[i + 1]![j]! >= common[i]![j + 1]!) {
      i += 1;
    } else {
      j += 1;
    }
  }

  return labels.map(
    (label, position) => kept.get(position) ?? { id: makeId(), label },
  );
}

export function MorphingText(props: MorphingTextProps) {
  let root: HTMLSpanElement | undefined;
  let track: HTMLSpanElement | undefined;
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let delayTimer: ReturnType<typeof setTimeout> | undefined;
  const controls: Array<ReturnType<typeof animate>> = [];

  const uid = `morph-${createUniqueId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  let counter = 0;
  const makeId = () => `${uid}-${(counter += 1)}`;
  const createLetters = (value: string): Letter[] =>
    splitGraphemes(value).map((label) => ({ id: makeId(), label }));

  const texts = createMemo(() =>
    Array.isArray(props.text) ? props.text : [props.text],
  );
  const initial = texts()[0] ?? "";

  const [index, setIndex] = createSignal(0);
  const [started, setStarted] = createSignal((props.delay ?? 0) === 0);
  const [onScreen, setOnScreen] = createSignal(!(props.inView ?? false));
  const [pageVisible, setPageVisible] = createSignal(true);
  const [shown, setShown] = createSignal(initial);
  const [letters, setLetters] = createSignal<Letter[]>(createLetters(initial));
  const [leaving, setLeaving] = createSignal<Leaving[]>([]);

  const current = createMemo(
    () => texts()[Math.min(index(), texts().length - 1)] ?? "",
  );
  const last = () =>
    props.loop !== true && index() >= texts().length - 1;
  const playing = () =>
    started() &&
    texts().length > 1 &&
    !last() &&
    onScreen() &&
    pageVisible();

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };

  const stopControls = () => {
    while (controls.length) controls.pop()?.stop?.();
  };

  const schedule = () => {
    clearTimer();
    if (!playing()) return;
    timer = setTimeout(() => {
      setIndex((value) => (value + 1) % texts().length);
      schedule();
    }, props.holdDelay ?? 2500);
  };

  const capturePositions = () => {
    const positions = new Map<string, DOMRect>();
    if (!track) return positions;
    for (const node of track.querySelectorAll<HTMLElement>("[data-letter-id]")) {
      positions.set(node.dataset.letterId ?? "", node.getBoundingClientRect());
    }
    return positions;
  };

  const animateLayout = (previous: Map<string, DOMRect>) => {
    if (!track || previous.size === 0) return;
    for (const node of track.querySelectorAll<HTMLElement>("[data-letter-id]")) {
      const id = node.dataset.letterId ?? "";
      const before = previous.get(id);
      if (!before) continue;
      const after = node.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      node.style.transform = `translate(${dx}px, ${dy}px)`;
      controls.push(animate(node, { x: [dx, 0], y: [dy, 0] }, LAYOUT));
    }
  };

  const enterOptions = (step: number) => ({
    ...(props.transition ?? ENTRY),
    delay: step,
    opacity: { duration: 0.3, ease: EASE, delay: step },
    filter: { duration: 0.3, ease: EASE, delay: step },
  });

  const animateLetters = (delays: Map<string, number>) => {
    if (!track || delays.size === 0) return;
    for (const node of track.querySelectorAll<HTMLElement>("[data-letter-id]")) {
      const id = node.dataset.letterId ?? "";
      if (!delays.has(id)) continue;
      const step = delays.get(id) ?? 0;
      node.style.opacity = "0";

      if (reduce()) {
        controls.push(animate(node, { opacity: [0, 1] }, enterOptions(step)));
        continue;
      }

      node.style.transform = "translateY(0.12em)";
      node.style.filter = "blur(6px)";
      controls.push(
        animate(
          node,
          {
            opacity: [0, 1],
            y: ["0.12em", 0],
            filter: ["blur(6px)", "blur(0px)"],
          },
          enterOptions(step),
        ),
      );
    }
  };

  const animateLeaving = (items: Leaving[]) => {
    if (!track || items.length === 0) return;
    for (const item of items) {
      const node = track.querySelector<HTMLElement>(
        `[data-leaving-id="${item.id}"]`,
      );
      if (!node) continue;
      const keyframes = reduce()
        ? { opacity: [1, 0] }
        : { opacity: [1, 0], filter: ["blur(0px)", "blur(6px)"] };
      const animation = animate(node, keyframes, EXIT);
      controls.push(animation);
      const done = () =>
        setLeaving((list) => list.filter((entry) => entry.id !== item.id));
      if (animation.finished) animation.finished.then(done, done);
      else done();
    }
  };

  const transitionTo = (next: string) => {
    const before = capturePositions();
    const previous = letters();
    const previousIds = new Set(previous.map((letter) => letter.id));
    const nextLetters = matchLetters(previous, splitGraphemes(next), makeId);
    const nextIds = new Set(nextLetters.map((letter) => letter.id));
    const exits: Leaving[] = [];
    const rect = track?.getBoundingClientRect();

    if (rect) {
      for (const old of previous) {
        if (nextIds.has(old.id)) continue;
        const node = track?.querySelector<HTMLElement>(
          `[data-letter-id="${old.id}"]`,
        );
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
    }

    const delays = new Map<string, number>();
    let incoming = 0;
    for (const letter of nextLetters) {
      if (previousIds.has(letter.id)) continue;
      delays.set(letter.id, 0.08 + 0.012 * incoming);
      incoming += 1;
    }

    setShown(next);
    setLetters(nextLetters);
    if (exits.length) setLeaving((list) => [...list, ...exits]);

    queueMicrotask(() => {
      animateLayout(before);
      animateLetters(delays);
      animateLeaving(exits);
    });
  };

  const onVisibilityChange = () => {
    setPageVisible(!document.hidden);
  };

  createEffect(
    on(
      current,
      (next) => {
        if (shown() === next) return;
        transitionTo(next);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => texts().join("\u0001"),
      () => {
        clearTimer();
        stopControls();
        setLeaving([]);
        setIndex(0);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => props.delay ?? 0,
      (value) => {
        if (delayTimer) clearTimeout(delayTimer);
        if (value <= 0) {
          setStarted(true);
          return;
        }
        setStarted(false);
        delayTimer = setTimeout(() => setStarted(true), value);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      playing,
      (active) => {
        if (active) schedule();
        else clearTimer();
      },
      { defer: true },
    ),
  );

  onMount(() => {
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (props.inView) {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          setOnScreen(visible);
          if (visible && props.inViewOnce !== false) observer?.disconnect();
        },
        { threshold: 0.35 },
      );
      if (root) observer.observe(root);
    } else {
      setOnScreen(true);
    }

    schedule();
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    clearTimer();
    if (delayTimer) clearTimeout(delayTimer);
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    stopControls();
  });

  return (
    <span
      ref={(node: HTMLSpanElement) => (root = node)}
      data-slot="morphing-text"
      class={`relative inline-flex ${props.class ?? ""}`}
    >
      <span class="sr-only">{current()}</span>
      <span
        ref={(node: HTMLSpanElement) => (track = node)}
        aria-hidden="true"
        class="relative inline-flex"
      >
        <For each={letters()}>
          {(letter) => (
            <span
              data-letter-id={letter.id}
              class="inline-block whitespace-pre will-change-transform"
            >
              {letter.label}
            </span>
          )}
        </For>
        <For each={leaving()}>
          {(item) => (
            <span
              data-leaving-id={item.id}
              class="absolute inline-block whitespace-pre will-change-transform"
              style={{
                left: `${item.left}px`,
                top: `${item.top}px`,
                width: `${item.width}px`,
                height: `${item.height}px`,
              }}
            >
              {item.label}
            </span>
          )}
        </For>
      </span>
    </span>
  );
}
