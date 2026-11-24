<script setup>
import { ref } from "vue";
import { animate } from "motion";
import { ChevronDown } from "@lucide/vue";

const props = defineProps({
  items: { type: Array, required: true },
  type: { type: String, default: "single" },
  defaultValue: { type: [String, Array], default: undefined },
  collapsible: { type: Boolean, default: true },
});
const emit = defineEmits(["update:modelValue"]);

const toArray = (value) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

const open = ref(toArray(props.defaultValue));

function toggle(value) {
  const isOpen = open.value.includes(value);
  if (props.type === "single") {
    open.value = isOpen ? (props.collapsible ? [] : open.value) : [value];
  } else {
    open.value = isOpen
      ? open.value.filter((entry) => entry !== value)
      : [...open.value, value];
  }
  emit("update:modelValue", props.type === "single" ? open.value[0] ?? "" : open.value);
}

function isOpen(value) {
  return open.value.includes(value);
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
  el.style.filter = "blur(2px)";
  const height = el.scrollHeight;
  Promise.all([
    animate(
      el,
      { height: ["0px", `${height}px`] },
      { type: "spring", stiffness: 300, damping: 30, bounce: 0 },
    ).finished,
    animate(
      el,
      { opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] },
      { duration: 0.25, ease: [0.215, 0.61, 0.355, 1] },
    ).finished,
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
  Promise.all([
    animate(
      el,
      { height: [el.scrollHeight + "px", "0px"] },
      { type: "spring", stiffness: 300, damping: 30, bounce: 0 },
    ).finished,
    animate(
      el,
      { opacity: [1, 0], filter: ["blur(0px)", "blur(2px)"] },
      { duration: 0.25, ease: [0.215, 0.61, 0.355, 1] },
    ).finished,
  ]).then(done);
}
</script>

<template>
  <div data-slot="accordion" class="w-full">
    <div
      v-for="item in items"
      :key="item.value"
      data-slot="accordion-item"
      :data-state="isOpen(item.value) ? 'open' : 'closed'"
      class="border-b last:border-b-0"
    >
      <button
        type="button"
        :aria-expanded="isOpen(item.value)"
        :aria-controls="`accordion-${item.value}`"
        class="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[13.5px] font-medium outline-none transition-colors focus-visible:text-foreground"
        @click="toggle(item.value)"
      >
        <span>{{ item.title }}</span>
        <ChevronDown
          aria-hidden="true"
          class="size-4 text-muted-foreground transition-transform duration-[350ms] ease-[cubic-bezier(0.215,0.61,0.355,1)]"
          :style="{ transform: isOpen(item.value) ? 'rotate(180deg)' : 'rotate(0deg)' }"
        />
      </button>
      <Transition :css="false" @enter="enter" @leave="leave">
        <div
          v-if="isOpen(item.value)"
          :id="`accordion-${item.value}`"
          role="region"
          class="overflow-hidden"
        >
          <div class="pb-4 pr-6 text-[13px] leading-6 text-muted-foreground">
            {{ item.content }}
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>
