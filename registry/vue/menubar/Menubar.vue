<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const props = defineProps({
  menus: { type: Array, default: () => [
    { label: "File", items: [{ label: "New file", shortcut: "⌘N" }, { label: "Open", shortcut: "⌘O" }, { separator: true, label: "sep" }, { label: "Save", shortcut: "⌘S" }] },
    { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z" }, { label: "Redo", shortcut: "⇧⌘Z" }] },
    { label: "View", items: [{ label: "Zoom in" }, { label: "Zoom out" }] },
  ] },
});

const open = ref(null);
const root = ref(null);

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
  document.removeEventListener("pointerdown", onPointer);
  document.removeEventListener("keydown", onKey);
});
function select(item) {
  item.onSelect?.();
  open.value = null;
}
</script>

<template>
  <div ref="root" role="menubar" class="flex items-center gap-1 rounded-lg border p-1">
    <div v-for="(menu, index) in menus" :key="menu.label" class="relative">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        :aria-expanded="open === index"
        class="h-7 rounded-md px-2.5 text-[13px] font-medium transition-colors"
        :class="open === index ? 'bg-accent text-foreground' : 'text-muted-foreground hover:text-foreground'"
        @click="open = open === index ? null : index"
        @pointerenter="open !== null && (open = index)"
      >
        {{ menu.label }}
      </button>
      <Transition name="menubar">
        <div v-if="open === index" role="menu" class="mb-panel absolute left-0 top-full z-40 mt-1 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl">
          <template v-for="(item, itemIndex) in menu.items" :key="item.label ?? itemIndex">
            <div v-if="item.separator" role="separator" class="my-1 h-px bg-border" />
            <button v-else type="button" role="menuitem" class="mb-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent" :style="{ animationDelay: `${itemIndex * 30}ms` }" @click="select(item)">
              <span>{{ item.label }}</span>
              <span v-if="item.shortcut" class="font-mono text-[13px] text-muted-foreground">{{ item.shortcut }}</span>
            </button>
          </template>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.menubar-enter-active { animation: mb-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.menubar-leave-active { animation: mb-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
.menubar-enter-active .mb-row { animation: mb-row 200ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
@keyframes mb-in { from { opacity: 0; } }
@keyframes mb-out { to { opacity: 0; } }
@keyframes mb-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
@media (prefers-reduced-motion: reduce) {
  .menubar-enter-active, .menubar-leave-active, .menubar-enter-active .mb-row { animation: none; }
}
</style>
