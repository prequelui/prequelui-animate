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
  duration: { type: Number, default: 2000 },
  delay: { type: Number, default: 0 },
  direction: { type: String, default: "up" },
  stagger: { type: Number, default: 0.04 },
  transition: { type: Object, default: undefined },
});

const DEFAULT_TWEEN = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

const root = ref(null);
const index = ref(0);
const onScreen = ref(true);
const pageVisible = ref(true);
let observer;
let timer;
let settleTimer;
let cycled = false;
let controls = [];
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
const texts = computed(() =>
  Array.isArray(props.text) ? props.text : [props.text],
);
const current = computed(() => texts.value[index.value % texts.value.length] ?? "");
const chars = computed(() => splitGraphemes(current.value));
const swap = ref({
  id: 0,
  from: splitGraphemes(current.value),
  to: splitGraphemes(current.value),
  widths: null,
});
const slots = computed(() =>
  Math.max(swap.value.from.length, swap.value.to.length),
);

const animated = computed(() => swap.value.id > 0 && !reduce());

function measure(element, values) {
  if (!element || typeof document === "undefined") return null;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return null;
  const style = getComputedStyle(element);
  context.font = style.font;
  const spacing = Number.parseFloat(style.letterSpacing) || 0;
  return values.map((char) => context.measureText(char).width + spacing);
}

function isAnimatedSlot(position) {
  if (!animated.value) return false;
  const from = swap.value.from[position] ?? "";
  const to = swap.value.to[position] ?? "";
  return from !== to;
}

function clearTimers() {
  clearTimeout(timer);
  clearTimeout(settleTimer);
}

function stopControls() {
  for (const control of controls) control?.stop?.();
  controls = [];
}

function schedule() {
  clearTimeout(timer);
  if (texts.value.length <= 1 || !onScreen.value || !pageVisible.value) return;
  timer = setTimeout(
    () => {
      cycled = true;
      index.value = (index.value + 1) % texts.value.length;
      schedule();
    },
    cycled ? props.duration : props.delay + props.duration,
  );
}

function runSwap() {
  if (!root.value) return;
  const state = swap.value;
  if (reduce()) return;
  stopControls();
  const nodes = Array.from(root.value.querySelectorAll("[data-swap-slot]"));
  let order = 0;
  for (const node of nodes) {
    if (node.dataset.animate !== "true") continue;
    const position = Number(node.dataset.index ?? 0);
    const fromNode = node.querySelector("[data-swap-from]");
    const toNode = node.querySelector("[data-swap-to]");
    const timing = { ...tween.value, delay: order * props.stagger };
    order += 1;
    const sign = props.direction === "up" ? 1 : -1;
    const enter = `${sign * 0.5}em`;
    const exit = `${-sign * 0.5}em`;

    if (state.widths) {
      controls.push(
        animate(
          node,
          {
            width: [
              `${(state.widths.from[position] ?? 0) / 16}rem`,
              `${(state.widths.to[position] ?? 0) / 16}rem`,
            ],
          },
          timing,
        ),
      );
    }

    if (fromNode) {
      controls.push(
        animate(
          fromNode,
          { y: [0, exit], opacity: [1, 0], filter: ["blur(0px)", "blur(2px)"] },
          timing,
        ),
      );
    }
    if (toNode) {
      controls.push(
        animate(
          toNode,
          { y: [enter, 0], opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] },
          timing,
        ),
      );
    }
  }
}

watch(
  chars,
  async (next) => {
    const state = swap.value;
    if (state.to.join("") === next.join("")) return;
    if (reduce()) {
      swap.value = { id: 0, from: next, to: next, widths: null };
      return;
    }
    const fromWidths = measure(root.value, state.to);
    const toWidths = measure(root.value, next);
    swap.value = {
      id: state.id + 1,
      from: state.to,
      to: next,
      widths: fromWidths && toWidths ? { from: fromWidths, to: toWidths } : null,
    };
    await nextTick();
    runSwap();
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      swap.value = {
        id: swap.value.id,
        from: swap.value.to,
        to: swap.value.to,
        widths: null,
      };
    }, 700);
  },
  { flush: "pre" },
);

watch([onScreen, pageVisible], schedule);

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
  clearTimers();
  observer?.disconnect();
  if (typeof document !== "undefined") {
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }
  stopControls();
});
</script>

<template>
  <span
    ref="root"
    data-slot="swapping-text"
    class="inline-block whitespace-pre"
  >
    <span aria-hidden="true" class="inline-flex">
      <template v-for="position in slots" :key="`${swap.id}-${position}`">
        <span
          v-if="!isAnimatedSlot(position - 1)"
          class="inline-block"
        >{{
          (swap.to[position - 1] ?? "") === " "
            ? "\u00A0"
            : (swap.to[position - 1] ?? "")
        }}</span>
        <span
          v-else
          data-swap-slot
          :data-index="position - 1"
          data-animate="true"
          class="relative inline-block"
          :style="{
            width:
              swap.widths && swap.widths.from[position - 1] != null
                ? `${swap.widths.from[position - 1] / 16}rem`
                : undefined,
          }"
        >
          <span
            v-if="swap.from[position - 1]"
            data-swap-from
            class="absolute left-0 top-0"
          >{{
            swap.from[position - 1] === " "
              ? "\u00A0"
              : swap.from[position - 1]
          }}</span>
          <span
            v-if="swap.to[position - 1]"
            data-swap-to
            class="inline-block"
            :style="{
              position: swap.widths ? 'absolute' : 'relative',
              left: 0,
              top: 0,
            }"
          >{{
            swap.to[position - 1] === " "
              ? "\u00A0"
              : swap.to[position - 1]
          }}</span>
        </span>
      </template>
    </span>
    <span class="sr-only">{{ current }}</span>
  </span>
</template>
