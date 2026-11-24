<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  delay: { type: Number, default: 0 },
  blur: { type: [Boolean, Object], default: false },
  slide: { type: [Boolean, Object], default: false },
  fade: { type: [Boolean, Object], default: false },
  zoom: { type: [Boolean, Object], default: false },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
  inViewMargin: { type: String, default: "0px" },
  transition: { type: Object, default: undefined },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
let observer;
let controls;

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function config(value) {
  return typeof value === "object" ? value : {};
}

const variants = computed(() => {
  const hidden = {};
  const shown = {};

  if (props.slide && !reduce()) {
    const settings = config(props.slide);
    const direction = settings.direction ?? "up";
    const offset = settings.offset ?? 100;
    const axis = direction === "up" || direction === "down" ? "y" : "x";
    hidden[axis] = direction === "right" || direction === "down" ? -offset : offset;
    shown[axis] = 0;
  }

  if (props.fade) {
    const settings = config(props.fade);
    hidden.opacity = settings.initialOpacity ?? 0;
    shown.opacity = settings.opacity ?? 1;
  }

  if (props.zoom && !reduce()) {
    const settings = config(props.zoom);
    hidden.scale = settings.initialScale ?? 0.5;
    shown.scale = settings.scale ?? 1;
  }

  if (props.blur) {
    const settings = config(props.blur);
    hidden.filter = `blur(${reduce() ? 0 : (settings.initialBlur ?? 10)}px)`;
    shown.filter = `blur(${settings.blur ?? 0}px)`;
  }

  if (reduce() && (props.slide || props.zoom) && shown.opacity === undefined) {
    hidden.opacity = config(props.fade).initialOpacity ?? 0;
    shown.opacity = config(props.fade).opacity ?? 1;
  }

  return { hidden, shown };
});

const initialStyle = computed(() => {
  const hidden = variants.value.hidden;
  const style = {};
  if (hidden.opacity !== undefined) style.opacity = hidden.opacity;
  if (hidden.filter !== undefined) style.filter = hidden.filter;
  const transforms = [];
  if (hidden.x !== undefined) transforms.push(`translateX(${hidden.x}px)`);
  if (hidden.y !== undefined) transforms.push(`translateY(${hidden.y}px)`);
  if (hidden.scale !== undefined) transforms.push(`scale(${hidden.scale})`);
  if (transforms.length) style.transform = transforms.join(" ");
  return style;
});

function options() {
  const base = props.transition ?? {
    type: "spring",
    stiffness: 200,
    damping: 20,
  };
  return {
    ...base,
    delay: (base.delay ?? 0) + props.delay / 1000,
  };
}

function play() {
  if (!root.value) return;
  const { hidden, shown } = variants.value;
  const keyframes = {};
  for (const key of Object.keys(shown)) {
    keyframes[key] =
      hidden[key] === undefined ? shown[key] : [hidden[key], shown[key]];
  }
  if (!Object.keys(keyframes).length) return;
  controls?.stop?.();
  controls = animate(root.value, keyframes, options());
}

function reset() {
  if (!root.value) return;
  controls?.stop?.();
  controls = animate(root.value, variants.value.hidden, { duration: 0 });
}

onMounted(() => {
  if (!props.inView) {
    play();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        play();
        if (props.inViewOnce) observer?.disconnect();
      } else if (!props.inViewOnce) {
        reset();
      }
    },
    { threshold: 0.35, rootMargin: props.inViewMargin },
  );
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  controls?.stop?.();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="effect"
    :style="initialStyle"
  >
    <slot />
  </component>
</template>
