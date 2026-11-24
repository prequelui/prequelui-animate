<script setup>
import { computed, ref, watch } from "vue";
import { animate } from "motion";
import { ChevronDown } from "@lucide/vue";

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  trigger: { type: String, default: "Show details" },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultOpen);
watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) internal.value = value;
  },
);
const value = computed(() => (props.modelValue === undefined ? internal.value : props.modelValue));

function toggle() {
  const next = !value.value;
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function enter(el, done) {
  if (reduce()) {
    animate(el, { opacity: [0, 1] }, { duration: 0.2 }).finished.then(done);
    return;
  }
  el.style.overflow = "hidden";
  el.style.height = "0px";
  el.style.opacity = "0";
  const height = el.scrollHeight;
  Promise.all([
    animate(el, { height: ["0px", `${height}px`] }, { duration: 0.45, ease: [0.4, 0, 0.1, 1] }).finished,
    animate(el, { opacity: [0, 1] }, { duration: 0.3, ease: [0.23, 1, 0.32, 1] }).finished,
  ]).then(() => {
    el.style.height = "auto";
    done();
  });
}

function leave(el, done) {
  if (reduce()) {
    animate(el, { opacity: [1, 0] }, { duration: 0.2 }).finished.then(done);
    return;
  }
  el.style.overflow = "hidden";
  el.style.height = `${el.scrollHeight}px`;
  animate(el, { height: [`${el.scrollHeight}px`, "0px"], opacity: [1, 0] }, { duration: 0.3, ease: [0, 0, 0.58, 1] }).finished.then(done);
}
</script>

<template>
  <div data-slot="collapsible" class="w-full">
    <button
      type="button"
      :aria-expanded="value"
      aria-controls="collapsible-panel"
      class="flex w-full items-center justify-between gap-4 py-3 text-left text-[13.5px] font-medium outline-none"
      @click="toggle"
    >
      <span>{{ trigger }}</span>
      <ChevronDown
        aria-hidden="true"
        class="size-4 text-muted-foreground transition-transform duration-[450ms] ease-[cubic-bezier(0.4,0,0.1,1)]"
        :style="{ transform: value ? 'rotate(180deg)' : 'rotate(0deg)' }"
      />
    </button>
    <Transition :css="false" @enter="enter" @leave="leave">
      <div v-if="value" id="collapsible-panel" role="region" class="overflow-hidden">
        <div class="pb-3 text-[13px] leading-6 text-muted-foreground">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>
