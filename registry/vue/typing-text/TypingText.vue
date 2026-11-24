<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: [String, Array], required: true },
  duration: { type: Number, default: 100 },
  delay: { type: Number, default: 0 },
  holdDelay: { type: Number, default: 1000 },
  loop: { type: Boolean, default: false },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
});

const root = ref(null);
const cursor = ref(null);
const texts = Array.isArray(props.text) ? props.text : [props.text];
const segments = texts.map((value) => Array.from(value));
const index = ref(0);
const count = ref(0);
const phase = ref("typing");
const ready = ref(props.delay === 0);
let timer;
let observer;
let cursorControl;
let started = false;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const visible = computed(() =>
  (segments[index.value] ?? []).slice(0, count.value).join(""),
);

function schedule() {
  clearTimeout(timer);
  if (reduce()) {
    const target = props.loop ? 0 : segments.length - 1;
    index.value = target;
    count.value = (segments[target] ?? []).length;
    phase.value = "done";
    return;
  }
  if (!ready.value) {
    timer = setTimeout(() => {
      ready.value = true;
      schedule();
    }, props.delay);
    return;
  }
  if (phase.value === "done") return;
  const length = (segments[index.value] ?? []).length;
  const isLast = index.value === segments.length - 1;

  if (phase.value === "typing") {
    if (count.value < length) {
      timer = setTimeout(() => {
        count.value += 1;
        schedule();
      }, props.duration);
    } else if (isLast && !props.loop) {
      phase.value = "done";
    } else {
      phase.value = "holding";
      timer = setTimeout(schedule, props.holdDelay);
    }
  } else if (phase.value === "holding") {
    phase.value = "erasing";
    timer = setTimeout(schedule, Math.max(60, props.duration));
  } else if (phase.value === "erasing") {
    if (count.value > 0) {
      timer = setTimeout(() => {
        count.value -= 1;
        schedule();
      }, Math.max(40, props.duration * 0.55));
    } else {
      index.value = isLast ? 0 : index.value + 1;
      count.value = 0;
      phase.value = "typing";
      timer = setTimeout(schedule, Math.max(120, props.duration));
    }
  }
}

function start() {
  if (started) return;
  started = true;
  if (cursor.value && !reduce()) {
    cursorControl = animate(
      cursor.value,
      { opacity: [1, 1, 0, 0] },
      { duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] },
    );
  }
  schedule();
}

onMounted(() => {
  if (!props.inView) {
    start();
    return;
  }
  observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    start();
    if (props.inViewOnce) observer?.disconnect();
  });
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  observer?.disconnect();
  cursorControl?.stop?.();
});
</script>

<template>
  <span ref="root" data-slot="typing-text" class="inline">
    <span class="sr-only">{{ texts.join(", ") }}</span>
    <span aria-hidden="true">{{ visible }}</span>
    <span
      ref="cursor"
      aria-hidden="true"
      data-slot="typing-text-cursor"
      class="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-foreground"
    />
  </span>
</template>
