<script setup>
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps({
  theme: { type: String, default: "light" },
  resolvedTheme: { type: String, default: "light" },
  setTheme: { type: Function, default: undefined },
  direction: { type: String, default: "ltr" },
  onImmediateChange: { type: Function, default: undefined },
  tempo: { type: Number, default: 1 },
});

const emit = defineEmits(["update:theme", "immediateChange"]);

const WIPE_DURATION = 700;
const WIPE_EASING = "ease-in-out";
const WIPE_TYPE = "prequel-theme-wipe";
const WIPE_STYLE =
  "::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}" +
  `:root:active-view-transition-type(${WIPE_TYPE}) body, :root:active-view-transition-type(${WIPE_TYPE}) body *{view-transition-name:none !important;}`;

const PLACEHOLDER = { effective: "system", resolved: "light" };
const mounted = ref(false);
const current = ref({
  effective: props.theme,
  resolved: props.resolvedTheme,
});

const tempo = computed(() => Math.max(0.4, props.tempo));
const wipeDuration = computed(() => WIPE_DURATION * tempo.value);
const state = computed(() => (mounted.value ? current.value : PLACEHOLDER));

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function systemResolved() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function clipKeyframes(direction) {
  switch (direction) {
    case "rtl":
      return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
    case "ttb":
      return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
    case "btt":
      return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
    case "ltr":
    default:
      return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
  }
}

function startWipe(update) {
  if (typeof document === "undefined" || !document.startViewTransition) {
    return null;
  }
  try {
    return document.startViewTransition({ update, types: [WIPE_TYPE] });
  } catch {
    return document.startViewTransition(update);
  }
}

function applyTheme(next) {
  if (typeof props.setTheme === "function") props.setTheme(next);
  emit("update:theme", next);
}

function toggleTheme(next) {
  const resolved = next === "system" ? systemResolved() : next;
  current.value = { effective: next, resolved };
  if (typeof props.onImmediateChange === "function") {
    props.onImmediateChange(next);
  }
  emit("immediateChange", next);

  if (next === "system" && resolved === props.resolvedTheme) {
    applyTheme(next);
    return;
  }

  if (reduce()) {
    current.value = { effective: next, resolved };
    applyTheme(next);
    return;
  }

  const transition = startWipe(() => {
    current.value = { effective: next, resolved };
    document.documentElement.classList.toggle("dark", resolved === "dark");
  });

  if (!transition) {
    current.value = { effective: next, resolved };
    applyTheme(next);
    return;
  }

  const [fromClip, toClip] = clipKeyframes(props.direction);
  void transition.ready.then(() => {
    document.documentElement
      .animate(
        { clipPath: [fromClip, toClip] },
        {
          duration: wipeDuration.value,
          easing: WIPE_EASING,
          pseudoElement: "::view-transition-new(root)",
        },
      )
      .finished.finally(() => applyTheme(next));
  });
}

watch(
  () => [props.theme, props.resolvedTheme],
  () => {
    current.value = {
      effective: props.theme,
      resolved: props.resolvedTheme,
    };
  },
);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <span data-slot="theme-toggler" style="display: contents">
    <slot
      :effective="state.effective"
      :resolved="state.resolved"
      :toggleTheme="toggleTheme"
    />
  </span>
  <component :is="'style'">{{ WIPE_STYLE }}</component>
</template>
