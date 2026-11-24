<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: [String, Array], default: "" },
  texts: { type: [String, Array], default: undefined },
  duration: { type: Number, default: 2000 },
  y: { type: Number, default: -50 },
  delay: { type: Number, default: 0 },
  align: { type: String, default: "start" },
  loop: { type: Boolean, default: true },
  transition: { type: Object, default: undefined },
});

const DEFAULT_TWEEN = { duration: 0.3, ease: [0.23, 1, 0.32, 1] };

const root = ref(null);
const word = ref(null);
const index = ref(0);
const onScreen = ref(true);
const pageVisible = ref(true);
const rotated = ref(false);
let observer;
let timer;
let controls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const tween = computed(() => props.transition ?? DEFAULT_TWEEN);

const list = computed(() => {
  const value = props.texts ?? props.text ?? "";
  const next = Array.isArray(value) ? value : [value];
  return next.length ? next : [""];
});

const unique = computed(() => [...new Set(list.value)]);
const current = computed(() => list.value[index.value % list.value.length] ?? "");
const playing = computed(
  () =>
    onScreen.value &&
    pageVisible.value &&
    (props.loop || index.value < list.value.length - 1),
);

function clearTimer() {
  clearTimeout(timer);
  timer = undefined;
}

function schedule() {
  clearTimer();
  if (!playing.value) return;
  timer = setTimeout(() => {
    rotated.value = true;
    const next = props.loop
      ? (index.value + 1) % list.value.length
      : Math.min(index.value + 1, list.value.length - 1);
    swap(next);
    schedule();
  }, rotated.value ? props.duration : props.delay);
}

function swap(next) {
  const node = word.value;
  const travel = reduce() ? 0 : props.y;

  if (!node) {
    index.value = next;
    return;
  }

  controls?.stop?.();
  controls = animate(
    node,
    { opacity: [1, 0], y: [0, travel] },
    tween.value,
  );

  const finish = () => {
    index.value = next;
    nextTick(() => {
      const entering = word.value;
      if (!entering) return;
      entering.style.opacity = "0";
      entering.style.transform = `translateY(${-travel}px)`;
      controls = animate(
        entering,
        { opacity: [0, 1], y: [-travel, 0] },
        tween.value,
      );
    });
  };

  if (controls?.finished) controls.finished.then(finish).catch(finish);
  else finish();
}

watch(playing, (value) => {
  if (value) schedule();
  else clearTimer();
});

watch(list, () => {
  index.value = 0;
  rotated.value = false;
  schedule();
});

function onVisibilityChange() {
  pageVisible.value = !document.hidden;
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      onScreen.value = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0 },
  );
  if (root.value) observer.observe(root.value);
  onVisibilityChange();
  document.addEventListener("visibilitychange", onVisibilityChange);
  schedule();
});

onBeforeUnmount(() => {
  clearTimer();
  observer?.disconnect();
  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }
  controls?.stop?.();
});
</script>

<template>
  <span
    ref="root"
    data-slot="rotating-text"
    class="relative inline-block overflow-hidden py-1 align-baseline"
  >
    <span class="sr-only">{{ list.join(", ") }}</span>
    <span
      aria-hidden="true"
      class="inline-grid"
      :style="{ justifyItems: align, alignItems: 'baseline' }"
    >
      <span
        v-for="(item, index) in unique"
        :key="`placeholder-${index}`"
        class="invisible whitespace-nowrap"
        style="grid-area: 1 / 1"
      >{{ item }}</span>
      <span :style="{ gridArea: '1 / 1', justifySelf: align }">
        <span ref="word" aria-hidden="true" class="inline-block whitespace-nowrap">{{
          current
        }}</span>
      </span>
    </span>
  </span>
</template>
