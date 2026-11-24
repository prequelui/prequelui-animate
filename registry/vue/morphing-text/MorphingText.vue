<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: [String, Array], required: true },
  delay: { type: Number, default: 0 },
  loop: { type: Boolean, default: false },
  holdDelay: { type: Number, default: 2500 },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
  transition: { type: Object, default: undefined },
});

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

const root = ref(null);
const track = ref(null);
const index = ref(0);
const started = ref(props.delay === 0);
const onScreen = ref(!props.inView);
const pageVisible = ref(true);
const shown = ref("");
const letters = ref([]);
const uid = `morph-${Math.random().toString(36).slice(2, 9)}`;
let counter = 0;
let segmenter;
let observer;
let timer;
let delayTimer;
let enterDelays = new Map();
let controls = [];

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

function makeId() {
  counter += 1;
  return `${uid}-${counter}`;
}

function createLetters(value) {
  return splitGraphemes(value).map((label) => ({ id: makeId(), label }));
}

function matchLetters(previous, labels) {
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

const texts = computed(() =>
  Array.isArray(props.text) ? props.text : [props.text],
);
const current = computed(
  () => texts.value[Math.min(index.value, texts.value.length - 1)] ?? "",
);
const last = computed(
  () => !props.loop && index.value >= texts.value.length - 1,
);
const playing = computed(
  () =>
    started.value &&
    texts.value.length > 1 &&
    !last.value &&
    onScreen.value &&
    pageVisible.value,
);

shown.value = current.value;
letters.value = createLetters(current.value);

function stopControls() {
  for (const control of controls) control?.stop?.();
  controls = [];
}

function clearTimer() {
  clearTimeout(timer);
  timer = undefined;
}

function schedule() {
  clearTimer();
  if (!playing.value) return;
  timer = setTimeout(() => {
    index.value = (index.value + 1) % texts.value.length;
    schedule();
  }, props.holdDelay);
}

function capturePositions() {
  const positions = new Map();
  if (!track.value) return positions;
  for (const node of track.value.querySelectorAll("[data-letter-id]")) {
    if (node.dataset.leaving === "true") continue;
    positions.set(node.dataset.letterId, node.getBoundingClientRect());
  }
  return positions;
}

function animateLayout(previous) {
  if (!track.value || !previous.size) return;
  for (const node of track.value.querySelectorAll("[data-letter-id]")) {
    const id = node.dataset.letterId;
    if (node.dataset.leaving === "true") continue;
    const before = previous.get(id);
    if (!before) continue;
    const after = node.getBoundingClientRect();
    const dx = before.left - after.left;
    const dy = before.top - after.top;
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
    node.style.transform = `translate(${dx}px, ${dy}px)`;
    controls.push(animate(node, { x: [dx, 0], y: [dy, 0] }, LAYOUT));
  }
}

function enterOptions(delay) {
  return {
    ...(props.transition ?? ENTRY),
    delay,
    opacity: { duration: 0.3, ease: EASE, delay },
    filter: { duration: 0.3, ease: EASE, delay },
  };
}

function onEnter(node, done) {
  const delay = enterDelays.get(node.dataset.letterId) ?? 0;
  node.style.opacity = "0";
  let keyframes;
  if (reduce()) {
    keyframes = { opacity: [0, 1] };
  } else {
    node.style.transform = "translateY(0.12em)";
    node.style.filter = "blur(6px)";
    keyframes = {
      opacity: [0, 1],
      y: ["0.12em", 0],
      filter: ["blur(6px)", "blur(0px)"],
    };
  }
  const animation = animate(node, keyframes, enterOptions(delay));
  controls.push(animation);
  animation.finished.then(done, done);
}

function onLeave(node, done) {
  const parent = track.value?.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  node.dataset.leaving = "true";
  if (parent) {
    node.style.position = "absolute";
    node.style.left = `${rect.left - parent.left}px`;
    node.style.top = `${rect.top - parent.top}px`;
    node.style.width = `${rect.width}px`;
    node.style.height = `${rect.height}px`;
  }
  const keyframes = reduce()
    ? { opacity: [1, 0] }
    : { opacity: [1, 0], filter: ["blur(0px)", "blur(6px)"] };
  const animation = animate(node, keyframes, EXIT);
  controls.push(animation);
  animation.finished.then(done, done);
}

watch(current, async (next) => {
  if (shown.value === next) return;
  const before = capturePositions();
  const previousIds = new Set(letters.value.map((letter) => letter.id));
  const nextLetters = matchLetters(letters.value, splitGraphemes(next));
  enterDelays = new Map();
  let incoming = 0;
  for (const letter of nextLetters) {
    if (previousIds.has(letter.id)) continue;
    enterDelays.set(letter.id, 0.08 + 0.012 * incoming);
    incoming += 1;
  }
  shown.value = next;
  letters.value = nextLetters;
  await nextTick();
  animateLayout(before);
});

watch(playing, (value) => {
  if (value) schedule();
  else clearTimer();
});

function startDelay(value) {
  clearTimeout(delayTimer);
  if (value <= 0) {
    started.value = true;
    return;
  }
  started.value = false;
  delayTimer = setTimeout(() => {
    started.value = true;
  }, value);
}

watch(
  () => props.delay,
  (value, oldValue) => {
    if (value === oldValue) return;
    startDelay(value);
  },
);

watch(texts, () => {
  index.value = 0;
  stopControls();
});

function onVisibilityChange() {
  pageVisible.value = !document.hidden;
}

onMounted(() => {
  onVisibilityChange();
  document.addEventListener("visibilitychange", onVisibilityChange);

  if (props.inView) {
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        onScreen.value = visible;
        if (visible && props.inViewOnce) observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    if (root.value) observer.observe(root.value);
  }

  if (!started.value) startDelay(props.delay);
  if (playing.value) schedule();
});

onBeforeUnmount(() => {
  clearTimer();
  clearTimeout(delayTimer);
  observer?.disconnect();
  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }
  stopControls();
});
</script>

<template>
  <span ref="root" data-slot="morphing-text" class="relative inline-flex">
    <span class="sr-only">{{ current }}</span>
    <span ref="track" aria-hidden="true" class="relative inline-flex">
      <TransitionGroup
        :css="false"
        @enter="onEnter"
        @leave="onLeave"
      >
        <span
          v-for="letter in letters"
          :key="letter.id"
          :data-letter-id="letter.id"
          class="inline-block whitespace-pre will-change-transform"
        >{{ letter.label }}</span>
      </TransitionGroup>
    </span>
  </span>
</template>
