<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: String, required: true },
  transition: { type: Object, default: undefined },
  delay: { type: Number, default: 0 },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
});

const DEFAULT_TWEEN = { duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] };

const root = ref(null);
const seen = ref(!props.inView);
const controls = [];
let observer;
let played = false;
let segmenter;

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

const tween = computed(() => props.transition ?? DEFAULT_TWEEN);

const words = computed(() => {
  const step = Number(tween.value.delay ?? 0);
  const parts = props.text.split(/(\s+)/).filter(Boolean);
  let charIndex = 0;
  return parts.map((part, index) => {
    if (/^\s+$/.test(part)) {
      return { key: `space-${index}`, space: true, part };
    }
    return {
      key: `word-${index}`,
      space: false,
      chars: splitGraphemes(part).map((label) => {
        const charDelay = props.delay / 1000 + charIndex++ * step;
        return { label, delay: charDelay };
      }),
    };
  });
});

function stop() {
  while (controls.length) controls.pop()?.stop?.();
}

function reset() {
  if (!root.value) return;
  stop();
  for (const node of root.value.querySelectorAll("[data-char-top]")) {
    node.style.transform = "rotateX(0deg)";
    node.style.opacity = "";
  }
  for (const node of root.value.querySelectorAll("[data-char-bottom]")) {
    node.style.transform = "rotateX(90deg)";
    node.style.opacity = "";
  }
}

function play() {
  if (!seen.value || !root.value) return;
  if (reduce()) {
    played = true;
    for (const node of root.value.querySelectorAll("[data-char-top]")) {
      node.style.transform = "rotateX(90deg)";
    }
    for (const node of root.value.querySelectorAll("[data-char-bottom]")) {
      node.style.transform = "rotateX(0deg)";
    }
    return;
  }
  if (played) return;
  played = true;
  const bases = { ...tween.value, ease: tween.value.ease ?? [0.23, 1, 0.32, 1] };
  for (const node of root.value.querySelectorAll("[data-roll]")) {
    const charDelay = Number(node.dataset.delay ?? 0);
    const top = node.querySelector("[data-char-top]");
    const bottom = node.querySelector("[data-char-bottom]");
    if (top) {
      controls.push(
        animate(top, { rotateX: [0, 90] }, { ...bases, delay: charDelay }),
      );
    }
    if (bottom) {
      controls.push(
        animate(
          bottom,
          { rotateX: [90, 0] },
          { ...bases, delay: charDelay + 0.3 },
        ),
      );
    }
  }
}

onMounted(() => {
  if (!props.inView) {
    play();
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      seen.value = visible;
      if (visible) {
        play();
        if (props.inViewOnce) observer?.disconnect();
      } else if (!props.inViewOnce) {
        played = false;
        reset();
      }
    },
    { threshold: 0.35 },
  );
  if (root.value) observer.observe(root.value);
});

watch(
  () => props.text,
  async () => {
    played = false;
    reset();
    await nextTick();
    if (!props.inView || seen.value) play();
  },
);

onBeforeUnmount(() => {
  observer?.disconnect();
  stop();
});
</script>

<template>
  <span ref="root" data-slot="rolling-text" class="inline">
    <span aria-hidden="true">
      <template v-for="word in words" :key="word.key">
        <span v-if="word.space">{{ word.part }}</span>
        <span v-else class="inline-block whitespace-nowrap">
          <span
            v-for="(char, index) in word.chars"
            :key="`char-${word.key}-${index}`"
            data-roll
            :data-delay="char.delay"
            class="relative inline-block"
            style="perspective: 9999999px; transform-style: preserve-3d"
          >
            <span
              data-char-top
              aria-hidden="true"
              class="absolute inline-block"
              style="
                backface-visibility: hidden;
                transform-origin: 50% 25%;
                transform: rotateX(0deg);
              "
            >{{ char.label === " " ? "\u00A0" : char.label }}</span>
            <span
              data-char-bottom
              aria-hidden="true"
              class="absolute inline-block"
              style="
                backface-visibility: hidden;
                transform-origin: 50% 100%;
                transform: rotateX(90deg);
              "
            >{{ char.label === " " ? "\u00A0" : char.label }}</span>
            <span class="invisible">{{
              char.label === " " ? "\u00A0" : char.label
            }}</span>
          </span>
        </span>
      </template>
    </span>
    <span class="sr-only">{{ text }}</span>
  </span>
</template>
