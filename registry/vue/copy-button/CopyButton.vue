<script setup>
import { computed, onBeforeUnmount, ref } from "vue";
import { animate } from "motion";
import { Check, Copy } from "@lucide/vue";

const props = defineProps({
  content: { type: String, required: true },
  copied: { type: Boolean, default: null },
  defaultCopied: { type: Boolean, default: false },
  delay: { type: Number, default: 3000 },
});
const emit = defineEmits(["copied-change", "click"]);

const button = ref(null);
const inner = ref(props.defaultCopied);
const isCopied = computed(() =>
  props.copied == null ? inner.value : props.copied,
);
let timer;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function press() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: 0.97 },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

function release() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: 1 },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

onBeforeUnmount(() => clearTimeout(timer));

function setCopied(value) {
  if (props.copied == null) inner.value = value;
  emit("copied-change", value, props.content);
}

function handleClick(event) {
  emit("click", event);
  if (event.defaultPrevented || !props.content || isCopied.value) return;
  const done = () => {
    setCopied(true);
    clearTimeout(timer);
    timer = setTimeout(() => setCopied(false), props.delay);
  };
  if (navigator.clipboard) navigator.clipboard.writeText(props.content).then(done, done);
  else done();
}
</script>

<template>
  <button
    ref="button"
    type="button"
    data-slot="copy-button"
    :data-copied="isCopied ? '' : undefined"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    @click="handleClick"
    @pointerdown="press"
    @pointerup="release"
    @pointerleave="release"
  >
    <span data-slot="copy-button-icon" class="relative inline-flex size-4 items-center justify-center">
      <Copy
        aria-hidden="true"
        class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        :class="isCopied ? 'scale-50 opacity-0 blur-[2px]' : 'scale-100 opacity-100 blur-0'"
      />
      <Check
        aria-hidden="true"
        class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        :class="isCopied ? 'scale-100 opacity-100 blur-0' : 'scale-50 opacity-0 blur-[2px]'"
      />
    </span>
    <slot>{{ isCopied ? "Copied" : "Copy" }}</slot>
  </button>
</template>
