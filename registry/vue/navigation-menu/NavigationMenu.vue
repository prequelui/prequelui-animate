<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronDown } from "@lucide/vue";

const props = defineProps({
  items: { type: Array, default: () => [
    { label: "Components", content: "Every primitive, with the same motion contract." },
    { label: "Templates", content: "Full pages built on the same tokens." },
    { label: "Docs", content: "Installation, accessibility and API references." },
  ] },
});

const open = ref(null);
const root = ref(null);
let timer;

function scheduleClose() {
  clearTimeout(timer);
  timer = setTimeout(() => (open.value = null), 180);
}
function cancelClose() {
  clearTimeout(timer);
}
function onPointer(event) {
  if (open.value !== null && root.value && !root.value.contains(event.target)) open.value = null;
}
function onKey(event) {
  if (event.key === "Escape") open.value = null;
}
onMounted(() => {
  document.addEventListener("pointerdown", onPointer);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  clearTimeout(timer);
  document.removeEventListener("pointerdown", onPointer);
  document.removeEventListener("keydown", onKey);
});
</script>

<template>
  <div ref="root" class="relative w-full max-w-sm" @pointerleave="scheduleClose" @pointerenter="cancelClose">
    <div role="menubar" class="flex items-center gap-1 rounded-lg border p-1">
      <button
        v-for="(item, index) in items"
        :key="item.label"
        type="button"
        :aria-expanded="open === index"
        class="flex h-7 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium transition-colors"
        :class="open === index ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
        @click="open = open === index ? null : index"
        @pointerenter="open = index"
      >
        {{ item.label }}
        <ChevronDown class="size-3 transition-transform" :class="open === index ? 'rotate-180' : ''" />
      </button>
    </div>
    <Transition name="nav">
      <div v-if="open !== null" class="nav-panel absolute left-0 top-full z-40 mt-1.5 w-full overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
        <Transition name="nav-content" mode="out-in">
          <div :key="open" class="text-[13px] leading-6 text-muted-foreground">
            {{ items[open]?.content }}
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<style>
.nav-enter-active { animation: nav-in 240ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.nav-leave-active { animation: nav-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
.nav-content-enter-active { transition: opacity 200ms, transform 200ms; }
.nav-content-leave-active { transition: opacity 100ms, transform 100ms; }
.nav-content-enter-from { opacity: 0; transform: translateX(6px); }
.nav-content-leave-to { opacity: 0; transform: translateX(-4px); }
@keyframes nav-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
@keyframes nav-out { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .nav-enter-active, .nav-leave-active { animation: none; }
  .nav-content-enter-active, .nav-content-leave-active { transition: none; }
}
</style>
