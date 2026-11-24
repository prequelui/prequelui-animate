<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  items: { type: Array, default: () => [] },
  children: { type: String, default: "Right click here" },
});

const position = ref(null);

function open(event) {
  event.preventDefault();
  position.value = { x: event.clientX, y: event.clientY };
}
function close() {
  position.value = null;
}
function onKey(event) {
  if (event.key === "Escape") close();
}
onMounted(() => {
  document.addEventListener("pointerdown", close);
  document.addEventListener("keydown", onKey);
});
onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", close);
  document.removeEventListener("keydown", onKey);
});
function select(item) {
  item.onSelect?.();
  close();
}
</script>

<template>
  <div class="flex h-24 w-64 items-center justify-center rounded-xl border border-dashed text-[13px] text-muted-foreground" @contextmenu="open">
    <slot>Right click here</slot>
  </div>
  <Teleport to="body">
    <Transition name="ctx">
      <div v-if="position" role="menu" class="ctx-panel fixed z-50 min-w-[190px] origin-top-left rounded-xl border bg-background p-1 shadow-xl" :style="{ left: `${position.x}px`, top: `${position.y}px` }" @pointerdown.stop>
        <template v-for="(item, index) in items" :key="item.label ?? index">
          <div v-if="item.separator" role="separator" class="my-1 h-px bg-border" />
          <button v-else type="button" role="menuitem" class="ctx-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent" :style="{ animationDelay: `${index * 30}ms` }" @click="select(item)">
            <span>{{ item.label }}</span>
            <span v-if="item.shortcut" class="font-mono text-[13px] text-muted-foreground">{{ item.shortcut }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.ctx-enter-active { animation: ctx-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.ctx-leave-active { animation: ctx-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
.ctx-enter-active .ctx-row { animation: ctx-row 200ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
@keyframes ctx-in { from { opacity: 0; transform: scale(0.96); } }
@keyframes ctx-out { to { opacity: 0; } }
@keyframes ctx-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
@media (prefers-reduced-motion: reduce) {
  .ctx-enter-active, .ctx-leave-active, .ctx-enter-active .ctx-row { animation: none; }
}
</style>
