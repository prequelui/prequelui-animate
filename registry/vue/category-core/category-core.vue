<script>
let categoryUid = 0;
</script>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  definition: { type: Object, required: true },
  size: { type: Number, default: 40 },
  active: { type: Boolean, default: undefined },
  animateOnHover: { type: Boolean, default: true },
  label: { type: String, default: "" },
  className: { type: String, default: "" },
});

const BASE = { x: 0, y: 0, rotate: 0, scale: 1 };
const PICTURE_EASE = "cubic-bezier(0.34, 1.3, 0.64, 1)";
const ART_SCALE = 1.32;
const ART_TRANSFORM = `translate(512 512) scale(${ART_SCALE}) translate(-512 -512)`;
const INK_STROKE = 23;
const STROKE_BOOST = 1.12;

const gradientId = `cat-${props.definition.slug}-${categoryUid++}`;

const reduce = ref(false);
const hovered = ref(false);
let media = null;
const onChange = () => {
  reduce.value = media ? media.matches : false;
};

onMounted(() => {
  if (typeof window === "undefined" || !window.matchMedia) return;
  media = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduce.value = media.matches;
  media.addEventListener?.("change", onChange);
});

onBeforeUnmount(() => {
  media?.removeEventListener?.("change", onChange);
});

const isActive = computed(
  () =>
    !!props.animateOnHover &&
    !reduce.value &&
    (props.active === undefined ? hovered.value : props.active),
);

function targetOf(base, motion) {
  return { ...base, ...(motion ?? {}) };
}

const mainTarget = computed(() =>
  targetOf(BASE, isActive.value ? props.definition.motionConfig.main : undefined),
);
const accentTarget = computed(() =>
  targetOf(BASE, isActive.value ? props.definition.motionConfig.accent : undefined),
);

function transformOf(target) {
  return `translate3d(${target.x ?? 0}px, ${target.y ?? 0}px, 0) rotate(${target.rotate ?? 0}deg) scale(${target.scale ?? 1})`;
}

const transition = computed(() =>
  reduce.value ? "none" : `transform 520ms ${PICTURE_EASE}`,
);

const accentStyle = computed(
  () =>
    `transform:${transformOf(accentTarget.value)};transition:${transition.value};transform-box:fill-box;transform-origin:center`,
);
const inkStyle = computed(
  () =>
    `transform:${transformOf(mainTarget.value)};transition:${transition.value};transform-box:fill-box;transform-origin:center`,
);

function inkWidth(part) {
  return ((part.width ?? INK_STROKE) * STROKE_BOOST) / ART_SCALE;
}

function gradientStop(index) {
  const stop = index === 0 ? props.definition.palette.light[0] : props.definition.palette.light[1];
  const dark = index === 0 ? props.definition.palette.dark[0] : props.definition.palette.dark[1];
  return `light-dark(${stop}, ${dark})`;
}

function enter() {
  if (props.animateOnHover) hovered.value = true;
}

function leave() {
  hovered.value = false;
}
</script>

<template>
  <span
    data-category-pictogram-host=""
    :data-active="active && animateOnHover ? 'true' : undefined"
    :class="['inline-flex shrink-0 items-center justify-center', props.className]"
    @pointerenter="enter"
    @pointerleave="leave"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="size"
      :height="size"
      viewBox="0 0 1024 1024"
      fill="none"
      :data-category-pictogram="definition.slug"
      :data-category-motion="definition.motion"
      :role="label ? 'img' : undefined"
      :aria-label="label || undefined"
      :aria-hidden="label ? undefined : true"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="1" x2="1" y2="0">
          <stop :stop-color="gradientStop(0)" />
          <stop offset="1" :stop-color="gradientStop(1)" />
        </linearGradient>
      </defs>
      <g :transform="ART_TRANSFORM">
        <g
          data-category-accents=""
          :fill="`url(#${gradientId})`"
          :style="accentStyle"
        >
          <path
            v-for="(part, index) in definition.accent"
            :key="`a${index}`"
            :d="part.d"
            :transform="part.transform"
            :opacity="part.opacity"
          />
        </g>
        <g data-category-ink="" :style="inkStyle">
          <path
            v-for="(part, index) in definition.ink"
            :key="`i${index}`"
            :d="part.d"
            :transform="part.transform"
            :fill="part.fill ? 'currentColor' : 'none'"
            :fill-rule="part.fill ? 'evenodd' : undefined"
            :stroke="part.fill ? undefined : 'currentColor'"
            :stroke-width="part.fill ? undefined : inkWidth(part)"
            stroke-linecap="round"
            stroke-linejoin="round"
            :opacity="part.opacity"
          />
        </g>
      </g>
    </svg>
  </span>
</template>
