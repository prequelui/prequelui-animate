<script setup>
import { onBeforeUnmount, ref } from "vue";

defineProps({
  trigger: { type: String, default: "@prequelui" },
  title: { type: String, default: "PrequelUI Animate" },
  description: { type: String, default: "Animated primitives for interfaces that already have a design system." },
});

const open = ref(false);
let enterTimer;
let leaveTimer;

function show() {
  clearTimeout(leaveTimer);
  enterTimer = setTimeout(() => (open.value = true), 200);
}
function hide() {
  clearTimeout(enterTimer);
  leaveTimer = setTimeout(() => (open.value = false), 150);
}
onBeforeUnmount(() => {
  clearTimeout(enterTimer);
  clearTimeout(leaveTimer);
});
</script>

<template>
  <span class="relative inline-block" @pointerenter="show" @pointerleave="hide" @focusin="show" @focusout="hide">
    <button type="button" class="text-[13px] font-medium underline decoration-border underline-offset-4">
      {{ trigger }}
    </button>
    <Transition name="card">
      <div v-if="open" class="absolute left-0 top-full z-40 mt-2 w-64 rounded-xl border bg-background p-4 shadow-xl">
        <p class="text-[13px] font-medium">{{ title }}</p>
        <p class="mt-1 text-[13px] leading-6 text-muted-foreground">{{ description }}</p>
        <slot />
      </div>
    </Transition>
  </span>
</template>

<style>
.card-enter-active { animation: card-pop 320ms linear both; }
.card-leave-active { animation: card-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
@keyframes card-pop { from { opacity: 0; transform: translateY(4px) scale(0.95); filter: blur(2px); } }
@keyframes card-out { to { opacity: 0; transform: translateY(2px) scale(0.97); filter: blur(1px); } }
@media (prefers-reduced-motion: reduce) {
  .card-enter-active, .card-leave-active { animation-duration: 200ms; }
  .card-enter-active { animation: card-fade 200ms linear both; }
  .card-leave-active { animation: card-fade 200ms linear reverse both; }
  @keyframes card-fade { from { opacity: 0; } }
}
</style>
