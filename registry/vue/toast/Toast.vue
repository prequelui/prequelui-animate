<script setup>
import { onBeforeUnmount, ref } from "vue";
import { Check, X } from "@lucide/vue";

const props = defineProps({
  trigger: { type: String, default: "Show toast" },
  title: { type: String, default: "Changes saved" },
  description: { type: String, default: "" },
  duration: { type: Number, default: 5000 },
});

const toasts = ref([]);
const timers = new Map();

function dismiss(id) {
  const timer = timers.get(id);
  if (timer) clearTimeout(timer);
  timers.delete(id);
  toasts.value = toasts.value.filter((toast) => toast.id !== id);
}
function add() {
  const id = Date.now();
  toasts.value = [...toasts.value, { id, title: props.title, description: props.description }].slice(-4);
  timers.set(id, setTimeout(() => dismiss(id), props.duration));
}
onBeforeUnmount(() => {
  for (const timer of timers.values()) clearTimeout(timer);
  timers.clear();
});
</script>

<template>
  <div class="flex w-full max-w-[420px] flex-col items-center gap-4">
    <button
      type="button"
      class="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background"
      @click="add"
    >
      {{ trigger }}
    </button>
    <div class="relative h-[96px] w-full">
      <TransitionGroup name="toast">
        <div
          v-for="(toast, index) in toasts"
          :key="toast.id"
          class="absolute bottom-4 left-1/2 flex w-[280px] -translate-x-1/2 items-center gap-2 rounded-xl border bg-popover px-3 py-2.5 text-[13px] shadow-lg"
        >
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f9d63] text-white">
            <Check class="size-3" />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block truncate">{{ toast.title }}</span>
            <span v-if="toast.description" class="mt-0.5 block truncate text-[12px] text-muted-foreground">
              {{ toast.description }}
            </span>
          </span>
          <button
            type="button"
            aria-label="Dismiss"
            class="shrink-0 text-muted-foreground hover:text-foreground"
            @click="dismiss(toast.id)"
          >
            <X class="size-3.5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style>
.toast-enter-active { animation: toast-in 320ms cubic-bezier(0.34,1.36,0.64,1) both; }
.toast-leave-active { animation: toast-out 200ms cubic-bezier(0.33, 0.17, 0.67, 0.5) both; }
.toast-move { transition: transform 300ms cubic-bezier(0.34, 1.3, 0.64, 1); }
@keyframes toast-in { from { opacity: 0; transform: translate(-50%, 24px) scale(0.96); filter: blur(4px); } }
@keyframes toast-out { to { opacity: 0; transform: translate(-50%, 12px) scale(0.96); filter: blur(4px); } }
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active, .toast-leave-active, .toast-move { animation: toast-fade 200ms linear both; transition: none; }
  @keyframes toast-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
