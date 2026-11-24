<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronDown } from "@lucide/vue";

defineProps({
  trigger: { type: String, default: "Actions" },
  items: { type: Array, default: () => [] },
  align: { type: String, default: "start" },
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
function select(item) {
  item.onSelect?.();
  open.value = false;
}
</script>

<template>
  <div ref="root" class="relative inline-block">
    <button
      type="button"
      aria-haspopup="menu"
      :aria-expanded="open"
      class="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium"
      @click="open = !open"
    >
      {{ trigger }}
      <ChevronDown class="size-3.5 text-muted-foreground" />
    </button>
    <Transition name="menu">
      <div
        v-if="open"
        role="menu"
        class="absolute top-full z-40 mt-1.5 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl"
        :class="align === 'end' ? 'right-0' : 'left-0'"
      >
        <template v-for="(item, index) in items" :key="item.label ?? index">
          <div v-if="item.separator" role="separator" class="my-1 h-px bg-border" />
          <button
            v-else
            type="button"
            role="menuitem"
            class="menu-item flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
            :style="{ animationDelay: `${index * 30}ms` }"
            @click="select(item)"
          >
            <span>{{ item.label }}</span>
            <span v-if="item.shortcut" class="font-mono text-[13px] text-muted-foreground">{{ item.shortcut }}</span>
          </button>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style>
.menu-enter-active, .menu-leave-active { transition: opacity 220ms cubic-bezier(0.215, 0.61, 0.355, 1); }
.menu-leave-active { transition-duration: 150ms; transition-timing-function: cubic-bezier(0, 0, 0.58, 1); }
.menu-enter-from, .menu-leave-to { opacity: 0; }
.menu-enter-active .menu-item { animation: menu-item-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
@keyframes menu-item-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
@media (prefers-reduced-motion: reduce) {
  .menu-enter-active, .menu-leave-active, .menu-enter-active .menu-item { transition: none; animation: none; }
}
</style>
