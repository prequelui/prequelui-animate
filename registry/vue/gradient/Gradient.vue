<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const DEFAULT_GRADIENT =
  "linear-gradient(120deg, #312e81 0%, #6d28d9 24%, #be185d 48%, #c2410c 72%, #0f766e 100%)";

const props = defineProps({
  speed: { type: Number, default: 1 },
  paused: { type: Boolean, default: false },
  gradient: { type: String, default: DEFAULT_GRADIENT },
});

const root = ref(null);
const sheet = ref(null);
const glowOne = ref(null);
const glowTwo = ref(null);
const inView = ref(false);
const pageVisible = ref(true);
const reduceMotion = ref(false);

const duration = computed(() => 16 / Math.max(0.1, props.speed));
const playing = computed(
  () => inView.value && pageVisible.value && !reduceMotion.value && !props.paused,
);
const sheetStyle = computed(() => ({
  backgroundImage: props.gradient,
  backgroundSize: "400% 400%",
  backgroundPosition: reduceMotion.value ? "35% 50%" : undefined,
  willChange: "background-position",
}));

let observer;
let media;
let onVisibility;
let onMedia;
let controls = [];

function stopControls() {
  for (const control of controls) control?.stop?.();
  controls = [];
}

function start() {
  stopControls();
  if (!playing.value) {
    controls.push(
      animate(
        sheet.value,
        { backgroundPosition: reduceMotion.value ? "35% 50%" : "0% 50%" },
        { duration: 0 },
      ),
    );
    controls.push(animate(glowOne.value, { x: "-12%", y: "-8%" }, { duration: 0 }));
    controls.push(animate(glowTwo.value, { x: "10%", y: "12%" }, { duration: 0 }));
    return;
  }

  controls.push(
    animate(
      sheet.value,
      { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
      { duration: duration.value, ease: "easeInOut", repeat: Infinity },
    ),
  );
  controls.push(
    animate(
      glowOne.value,
      {
        x: ["-12%", "14%", "-12%"],
        y: ["-8%", "10%", "-8%"],
        scale: [1, 1.25, 1],
      },
      {
        duration: duration.value * 1.6,
        ease: "easeInOut",
        repeat: Infinity,
      },
    ),
  );
  controls.push(
    animate(
      glowTwo.value,
      {
        x: ["10%", "-16%", "10%"],
        y: ["12%", "-10%", "12%"],
        scale: [1.1, 0.9, 1.1],
      },
      {
        duration: duration.value * 2.1,
        ease: "easeInOut",
        repeat: Infinity,
      },
    ),
  );
}

watch(playing, start);
watch(duration, () => {
  if (playing.value) start();
});

onMounted(() => {
  media = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = media.matches;
  onMedia = () => {
    reduceMotion.value = media.matches;
  };
  media.addEventListener?.("change", onMedia);

  pageVisible.value = document.visibilityState !== "hidden";
  onVisibility = () => {
    pageVisible.value = document.visibilityState !== "hidden";
  };
  document.addEventListener("visibilitychange", onVisibility);

  observer = new IntersectionObserver(
    (entries) => {
      inView.value = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0 },
  );
  if (root.value) observer.observe(root.value);

  start();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
  media?.removeEventListener?.("change", onMedia);
  stopControls();
});
</script>

<template>
  <div
    ref="root"
    data-slot="gradient-background"
    class="relative size-full overflow-hidden bg-[#0a0910]"
  >
    <div
      ref="sheet"
      aria-hidden="true"
      class="absolute -inset-[35%] opacity-90 blur-[10px]"
      :style="sheetStyle"
    />
    <div
      ref="glowOne"
      aria-hidden="true"
      class="absolute left-[8%] top-[4%] size-[70%] rounded-full opacity-70 blur-[60px]"
      style="background: radial-gradient(circle, rgba(45,212,191,0.75), transparent 68%); will-change: transform"
    />
    <div
      ref="glowTwo"
      aria-hidden="true"
      class="absolute bottom-[2%] right-[2%] size-[74%] rounded-full opacity-70 blur-[70px]"
      style="background: radial-gradient(circle, rgba(249,115,22,0.72), transparent 66%); will-change: transform"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(5,4,10,0.6))]"
    />
    <slot />
  </div>
</template>
