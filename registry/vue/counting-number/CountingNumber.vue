<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  number: { type: Number, required: true },
  fromNumber: { type: Number, default: 0 },
  padStart: { type: Boolean, default: false },
  decimalPlaces: { type: Number, default: 0 },
  decimalSeparator: { type: String, default: "." },
  thousandSeparator: { type: String, default: undefined },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
  delay: { type: Number, default: 0 },
  initiallyStable: { type: Boolean, default: false },
  transition: { type: Object, default: undefined },
});
const emit = defineEmits(["completed"]);

const countSpring = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

const root = ref(null);
const visual = ref(null);
const seen = ref(!props.inView);
const state = { value: props.initiallyStable ? props.number : props.fromNumber };
let observer;
let timer;
let controls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatNumber(value, options) {
  const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
  const fixed = Math.abs(value).toFixed(decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  const padded = integer.padStart(padLength, "0");
  const grouped =
    thousandSeparator === undefined
      ? padded
      : padded.replace(/\B(?=(\d{3})+$)/g, thousandSeparator);
  return fraction
    ? `${sign}${grouped}${decimalSeparator}${fraction}`
    : `${sign}${grouped}`;
}

const format = computed(() => ({
  decimals: props.decimalPlaces,
  decimalSeparator: props.decimalSeparator,
  thousandSeparator: props.thousandSeparator,
  padLength: props.padStart
    ? Math.floor(Math.abs(props.number)).toString().length
    : 0,
}));

const finalText = computed(() => formatNumber(props.number, format.value));

function write(value) {
  if (visual.value) visual.value.textContent = formatNumber(value, format.value);
}

function spring() {
  return props.transition ?? countSpring;
}

function run() {
  if (!seen.value) return;
  clearTimeout(timer);
  controls?.stop?.();
  if (reduce()) {
    state.value = props.number;
    write(state.value);
    emit("completed");
    return;
  }
  timer = setTimeout(() => {
    controls = animate(state, { value: props.number }, {
      ...spring(),
      onUpdate: () => write(state.value),
      onComplete: () => emit("completed"),
    });
  }, props.delay);
}

onMounted(() => {
  write(state.value);
  if (!props.inView) {
    seen.value = true;
    run();
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      seen.value = visible;
      if (!visible) return;
      run();
      if (props.inViewOnce) observer?.disconnect();
    },
    { threshold: 0.35 },
  );
  if (root.value) observer.observe(root.value);
});

watch(() => props.number, () => {
  if (seen.value) run();
});

watch(format, () => write(state.value));

onBeforeUnmount(() => {
  clearTimeout(timer);
  controls?.stop?.();
  observer?.disconnect();
});
</script>

<template>
  <span ref="root" data-slot="counting-number" class="inline-block tabular-nums">
    <span ref="visual" aria-hidden="true" />
    <span class="sr-only">{{ finalText }}</span>
  </span>
</template>
