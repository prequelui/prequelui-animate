<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, onUpdated, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  number: { type: Number, required: true },
  fromNumber: { type: Number, default: undefined },
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
const emit = defineEmits(["number-change", "completed"]);

const rollerSpring = { stiffness: 200, damping: 20, mass: 0.4 };
const countSpring = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

const factor = Math.pow(10, props.decimalPlaces);
const counting = props.fromNumber !== undefined;
const initialValue = props.initiallyStable
  ? props.number
  : props.fromNumber ?? 0;

const root = ref(null);
const seen = ref(!props.inView);
const layout = ref({
  length: Math.floor(Math.abs(toUnits(initialValue)) / factor).toString().length,
  negative: toUnits(initialValue) < 0,
});

let unitsValue = toUnits(initialValue);
let valueState = { value: initialValue };
const rollers = new Map();
let observer;
let timer;
let countControls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function toUnits(value) {
  return Math.round(value * factor);
}

function digitAt(units, place) {
  return Math.floor(Math.abs(units) / place) % 10;
}

function formatNumber(value, options) {
  const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
  const fixed = Math.abs(value).toFixed(decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  let int = integer.padStart(padLength, "0");
  if (thousandSeparator !== undefined) {
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }
  return fraction
    ? `${sign}${int}${decimalSeparator}${fraction}`
    : `${sign}${int}`;
}

const shownLength = computed(() => {
  const target = Math.floor(Math.abs(props.number)).toString().length;
  return props.padStart ? Math.max(target, layout.value.length) : layout.value.length;
});

const intPlaces = computed(() =>
  Array.from(
    { length: Math.max(1, shownLength.value) },
    (_, index) => Math.pow(10, shownLength.value - index - 1) * factor,
  ),
);

const decimalPlacesList = computed(() =>
  Array.from(
    { length: props.decimalPlaces },
    (_, index) => Math.pow(10, props.decimalPlaces - index - 1),
  ),
);

const format = computed(() => ({
  decimals: props.decimalPlaces,
  decimalSeparator: props.decimalSeparator,
  thousandSeparator: props.thousandSeparator,
  padLength: props.padStart ? shownLength.value : 0,
}));

const finalText = computed(() => formatNumber(props.number, format.value));

function digitStyle(place, digit) {
  const current = ((digitAt(unitsValue, place) % 10) + 10) % 10;
  let offset = (10 + digit - current) % 10;
  if (offset > 5) offset -= 10;
  return { transform: `translateY(${offset * 100}%)` };
}

function paint(element, position) {
  if (!element) return;
  const current = ((position % 10) + 10) % 10;
  element.querySelectorAll("[data-digit]").forEach((node) => {
    const digit = Number(node.getAttribute("data-digit"));
    let offset = (10 + digit - current) % 10;
    if (offset > 5) offset -= 10;
    node.style.transform = `translateY(${offset * 100}%)`;
  });
}

function syncRollers(moving) {
  if (!root.value) return;
  const alive = new Set();
  root.value.querySelectorAll("[data-roller]").forEach((element) => {
    const key = element.getAttribute("data-roller");
    if (!key) return;
    alive.add(key);
    const place = Number(element.getAttribute("data-place"));
    const target = digitAt(unitsValue, place);
    let roller = rollers.get(key);
    if (!roller) {
      roller = { position: target, target, controls: null, element };
      rollers.set(key, roller);
      paint(element, target);
      return;
    }
    roller.element = element;
    if (roller.target === target) {
      paint(element, roller.position);
      return;
    }
    roller.target = target;
    if (!moving || reduce()) {
      roller.controls?.stop?.();
      roller.controls = null;
      roller.position = target;
      paint(element, target);
      return;
    }
    roller.controls?.stop?.();
    roller.controls = animate(roller, { position: target }, {
      type: "spring",
      ...(props.transition ?? rollerSpring),
      onUpdate: () => paint(roller.element, roller.position),
    });
  });
  for (const key of rollers.keys()) {
    if (!alive.has(key)) rollers.delete(key);
  }
}

function commit(units) {
  unitsValue = units;
  const length = Math.floor(Math.abs(units) / factor).toString().length;
  const negative = units < 0;
  if (layout.value.length !== length || layout.value.negative !== negative) {
    layout.value = { length, negative };
    nextTick(() => syncRollers(true));
  } else {
    syncRollers(true);
  }
  emit("number-change", units / factor);
}

function run() {
  if (!seen.value) {
    if (!counting && !props.initiallyStable) commit(toUnits(0));
    return;
  }
  clearTimeout(timer);
  countControls?.stop?.();
  if (reduce()) {
    commit(toUnits(props.number));
    emit("completed");
    return;
  }
  timer = setTimeout(() => {
    if (counting) {
      countControls = animate(valueState, { value: props.number }, {
        ...countSpring,
        onUpdate: () => commit(toUnits(valueState.value)),
        onComplete: () => emit("completed"),
      });
    } else {
      commit(toUnits(props.number));
      emit("completed");
    }
  }, props.delay);
}

onMounted(() => {
  nextTick(() => syncRollers(false));
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

onUpdated(() => syncRollers(true));

watch(() => props.number, () => {
  if (seen.value) run();
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  countControls?.stop?.();
  observer?.disconnect();
  for (const roller of rollers.values()) roller.controls?.stop?.();
  rollers.clear();
});
</script>

<template>
  <span ref="root" data-slot="sliding-number" class="inline-flex items-center tabular-nums">
    <span class="sr-only">{{ finalText }}</span>
    <span v-if="layout.negative" aria-hidden="true" class="mr-1">-</span>
    <template v-for="(place, index) in intPlaces" :key="`int-${place}`">
      <span
        :data-roller="`int-${place}`"
        :data-place="place"
        data-slot="sliding-number-roller"
        class="relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums"
      >
        <span class="invisible">0</span>
        <span
          v-for="digit in 10"
          :key="digit - 1"
          :data-digit="digit - 1"
          aria-hidden="true"
          data-slot="sliding-number-digit"
          class="absolute inset-0 flex items-center justify-center"
          :style="digitStyle(place, digit - 1)"
        >
          {{ digit - 1 }}
        </span>
      </span>
      <span
        v-if="thousandSeparator !== undefined && intPlaces.length - index - 1 > 0 && (intPlaces.length - index - 1) % 3 === 0"
        aria-hidden="true"
      >
        {{ thousandSeparator }}
      </span>
    </template>
    <template v-if="decimalPlaces > 0">
      <span aria-hidden="true">{{ decimalSeparator }}</span>
      <span
        v-for="place in decimalPlacesList"
        :key="`dec-${place}`"
        :data-roller="`dec-${place}`"
        :data-place="place"
        data-slot="sliding-number-roller"
        class="relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums"
      >
        <span class="invisible">0</span>
        <span
          v-for="digit in 10"
          :key="digit - 1"
          :data-digit="digit - 1"
          aria-hidden="true"
          data-slot="sliding-number-digit"
          class="absolute inset-0 flex items-center justify-center"
          :style="digitStyle(place, digit - 1)"
        >
          {{ digit - 1 }}
        </span>
      </span>
    </template>
  </span>
</template>
