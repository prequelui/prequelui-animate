<script setup>
import { onBeforeUnmount, ref } from "vue";

const props = defineProps({
  trigger: { type: String, default: "Hover me" },
  content: { type: String, default: "Saved just now" },
  side: { type: String, default: "top" },
  delay: { type: Number, default: 180 },
  closeDelay: { type: Number, default: 80 },
});

let uid = 0;
const store = (globalThis.__prequelTip = globalThis.__prequelTip ?? { open: new Set(), cooledAt: 0 });
const openTips = store.open;
const id = Symbol(`tooltip-${++uid}`);
const open = ref(false);
const instant = ref(false);
let openTimer;
let closeTimer;

const sides = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

function show() {
  clearTimeout(closeTimer);
  clearTimeout(openTimer);
  const warm = openTips.size > 0 || Date.now() - store.cooledAt < 300;
  instant.value = warm;
  openTimer = setTimeout(
    () => {
      openTips.add(id);
      open.value = true;
    },
    warm ? 0 : props.delay,
  );
}
function hide() {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    openTips.delete(id);
    if (openTips.size === 0) store.cooledAt = Date.now();
    open.value = false;
    instant.value = false;
  }, props.closeDelay);
}
onBeforeUnmount(() => {
  clearTimeout(openTimer);
  clearTimeout(closeTimer);
  openTips.delete(id);
});
</script>

<template>
  <span class="relative inline-flex" @pointerenter="show" @pointerleave="hide" @focusin="show" @focusout="hide">
    <button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">
      {{ trigger }}
    </button>
    <Transition name="tip">
      <span
        v-if="open"
        role="tooltip"
        class="pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md"
        :class="sides[side]"
      >
        {{ content }}
      </span>
    </Transition>
  </span>
</template>

<style>
.tip-enter-active { animation: tip-in 320ms cubic-bezier(0.23, 1, 0.32, 1) both; }
.tip-leave-active { animation: tip-out 130ms cubic-bezier(0, 0, 0.58, 1) both; }
@keyframes tip-in { from { opacity: 0; transform: scale(0.7); filter: blur(6px); } }
@keyframes tip-out { to { opacity: 0; transform: scale(0.9); filter: blur(4px); } }
@media (prefers-reduced-motion: reduce) {
  .tip-enter-active, .tip-leave-active { animation: tip-fade 200ms linear both; }
  @keyframes tip-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
