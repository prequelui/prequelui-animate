<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  orientation: { type: String, default: "vertical" },
  size: { type: Number, default: 40 },
  transition: { type: Object, default: undefined },
  enabled: { type: Boolean, default: true },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
const values = { top: 0, bottom: 0, left: 0, right: 0 };
const edges = ["top", "bottom", "left", "right"];
const vars = {
  top: "--scroll-fade-top",
  bottom: "--scroll-fade-bottom",
  left: "--scroll-fade-left",
  right: "--scroll-fade-right",
  size: "--scroll-fade-size",
};

let observer;
let mutation;
let control;
let masked = false;
let teardown = () => {};

const overflowStyle = () => {
  if (props.orientation === "horizontal") return { overflowX: "auto" };
  if (props.orientation === "both") return { overflow: "auto" };
  return { overflowY: "auto" };
};

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function maskFor() {
  const stop = (edge) => `rgb(0 0 0 / calc(1 - var(${vars[edge]}, 0)))`;
  const depth = (edge) =>
    `calc(var(${vars.size}) * min(1, var(${vars[edge]}, 0) * 1000))`;
  const vertical = `linear-gradient(to bottom, ${stop("top")} 0, #000 ${depth(
    "top",
  )}, #000 calc(100% - ${depth("bottom")}), ${stop("bottom")} 100%)`;
  const horizontal = `linear-gradient(to right, ${stop("left")} 0, #000 ${depth(
    "left",
  )}, #000 calc(100% - ${depth("right")}), ${stop("right")} 100%)`;

  if (props.orientation === "vertical") return vertical;
  if (props.orientation === "horizontal") return horizontal;
  return `${vertical}, ${horizontal}`;
}

function applyMask(element, mask) {
  if (mask) {
    element.style.setProperty("mask-image", mask);
    element.style.setProperty("-webkit-mask-image", mask);
    element.style.setProperty("mask-composite", "intersect");
    element.style.setProperty("-webkit-mask-composite", "source-in");
  } else {
    for (const property of [
      "mask-image",
      "-webkit-mask-image",
      "mask-composite",
      "-webkit-mask-composite",
    ]) {
      element.style.removeProperty(property);
    }
  }
}

function settleOptions() {
  return props.transition ?? { duration: 0.2, ease: [0.23, 1, 0.32, 1] };
}

function start() {
  const element = root.value;
  if (!element || !props.enabled) return;

  const verticalAxis = props.orientation !== "horizontal";
  const horizontalAxis = props.orientation !== "vertical";
  const mask = maskFor();
  masked = false;

  element.style.setProperty(vars.size, `${props.size}px`);

  const write = () => {
    let any = false;
    for (const edge of edges) {
      const amount = clamp(values[edge], 0, 1);
      if (amount > 0.001) any = true;
      element.style.setProperty(vars[edge], amount.toFixed(4));
    }
    if (any !== masked) {
      masked = any;
      applyMask(element, any ? mask : null);
    }
  };

  const ramp = props.size / 2;
  const amount = (distance) =>
    ramp > 0 ? clamp(distance / ramp, 0, 1) : distance > 0.5 ? 1 : 0;

  const measure = (follow) => {
    const targets = { top: 0, bottom: 0, left: 0, right: 0 };

    if (verticalAxis) {
      const max = element.scrollHeight - element.clientHeight;
      if (max > 1) {
        targets.top = amount(element.scrollTop);
        targets.bottom = amount(max - element.scrollTop);
      }
    }

    if (horizontalAxis) {
      const max = element.scrollWidth - element.clientWidth;
      if (max > 1) {
        const fromStart = Math.abs(element.scrollLeft);
        const fromEnd = max - fromStart;
        const rtl = getComputedStyle(element).direction === "rtl";
        targets.left = amount(rtl ? fromEnd : fromStart);
        targets.right = amount(rtl ? fromStart : fromEnd);
      }
    }

    if (follow || reduce()) {
      for (const edge of edges) values[edge] = targets[edge];
      write();
    } else {
      control?.stop?.();
      control = animate(values, targets, {
        ...settleOptions(),
        onUpdate: write,
      });
    }
  };

  measure(true);

  const onScroll = () => measure(true);
  element.addEventListener("scroll", onScroll, { passive: true });

  observer = new ResizeObserver(() => measure(false));
  observer.observe(element);
  for (const child of element.children) observer.observe(child);

  mutation = new MutationObserver(() => {
    measure(false);
    observer?.disconnect();
    observer = new ResizeObserver(() => measure(false));
    observer.observe(element);
    for (const child of element.children) observer.observe(child);
  });
  mutation.observe(element, { childList: true, subtree: true });

  teardown = () => {
    element.removeEventListener("scroll", onScroll);
    observer?.disconnect();
    mutation?.disconnect();
    control?.stop?.();
    applyMask(element, null);
    for (const name of Object.values(vars)) element.style.removeProperty(name);
    for (const edge of edges) values[edge] = 0;
  };
}

function restart() {
  teardown();
  teardown = () => {};
  nextTick(start);
}

watch(
  () => [props.orientation, props.size, props.enabled, props.transition],
  restart,
);

onMounted(start);

onBeforeUnmount(() => {
  teardown();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="scroll-fade"
    :data-orientation="orientation"
    :style="overflowStyle()"
  >
    <slot />
  </component>
</template>
