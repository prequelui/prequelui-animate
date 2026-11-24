<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  trigger: { type: String, default: "Share project" },
  title: { type: String, default: "Anyone with the link" },
  description: { type: String, default: "People with the link can view this project but cannot edit it." },
  side: { type: String, default: "bottom" },
});

const open = ref(false);
const root = ref(null);

function onPointer(event) {
  if (open.value && root.value && !root.value.contains(event.target)) open.value = false;
}
function onKey(event) {
  if (event.key === "Escape") open.value = false;
}
onMounted(() => {
  document.addEventListener("pointerdown", onPointer);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onPointer);
  document.removeEventListener("keydown", onKey);
});
</script>

<template>
  <div ref="root" class="relative inline-block">
    <button
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="open"
      class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
      @click="open = !open"
    >
      {{ trigger }}
    </button>
    <Transition name="pop">
      <div
        v-if="open"
        role="dialog"
        class="absolute left-0 z-40 w-64 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl"
        :class="side === 'top' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'"
      >
        <p class="text-[13px] font-medium">{{ title }}</p>
        <p class="mt-1 text-[13px] leading-5 text-muted-foreground">{{ description }}</p>
        <slot />
      </div>
    </Transition>
  </div>
</template>

<style>
.pop-enter-active { animation: pop-in 320ms cubic-bezier(0.23, 1, 0.32, 1) both; }
.pop-leave-active { animation: pop-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
@keyframes pop-in { from { opacity: 0; transform: scale(0.8); } }
@keyframes pop-out { to { opacity: 0; transform: scale(0.9); } }
@media (prefers-reduced-motion: reduce) {
  .pop-enter-active, .pop-leave-active { animation: pop-fade 150ms linear both; }
  @keyframes pop-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
