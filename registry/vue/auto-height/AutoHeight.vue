<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  includeParentBox: { type: Boolean, default: true },
  includeSelfBox: { type: Boolean, default: false },
  animate: { type: Object, default: undefined },
  transition: { type: Object, default: undefined },
  wrapperClassName: { type: String, default: "" },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
const content = ref(null);
const height = ref(0);
let observer;
let frame;
let controls;

const spring = () =>
  props.transition ?? {
    type: "spring",
    stiffness: 300,
    damping: 30,
    bounce: 0,
    restDelta: 0.01,
  };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function measure() {
  const el = content.value;
  if (!el) return 0;

  const base = el.getBoundingClientRect().height;
  let extra = 0;

  if (props.includeParentBox && el.parentElement) {
    const box = el.parentElement.getBoundingClientRect();
    const inner = Array.from(el.parentElement.children).reduce(
      (total, child) => total + child.getBoundingClientRect().height,
      0,
    );
    extra = Math.max(0, box.height - inner);
  }

  if (props.includeSelfBox) {
    const style = getComputedStyle(el);
    extra +=
      (parseFloat(style.paddingTop) || 0) +
      (parseFloat(style.paddingBottom) || 0) +
      (parseFloat(style.borderTopWidth) || 0) +
      (parseFloat(style.borderBottomWidth) || 0);
  }

  const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  return Math.ceil((base + extra) * dpr) / dpr;
}

function commit(next, instant) {
  height.value = next;
  if (!root.value) return;
  controls?.stop?.();
  controls = animate(
    root.value,
    { height: `${next}px`, ...(props.animate ?? {}) },
    instant || reduce() ? { duration: 0 } : spring(),
  );
}

async function refresh(instant = false) {
  await nextTick();
  const next = measure();
  if (!next && !height.value) {
    height.value = next;
    return;
  }
  commit(next, instant);
}

onMounted(() => {
  refresh(true);

  observer = new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => refresh(false));
  });

  if (content.value) observer.observe(content.value);
  if (props.includeParentBox && content.value?.parentElement) {
    observer.observe(content.value.parentElement);
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  controls?.stop?.();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="auto-height"
    :style="{
      overflow: 'hidden',
      height: height ? `${height}px` : undefined,
    }"
  >
    <div ref="content" :class="['w-full', wrapperClassName]">
      <slot />
    </div>
  </component>
</template>
