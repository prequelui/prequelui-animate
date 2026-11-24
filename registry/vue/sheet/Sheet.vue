<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { X } from "@lucide/vue";

const props = defineProps({
  trigger: { type: String, default: "Open sheet" },
  title: { type: String, default: "Workspace" },
  description: { type: String, default: "Choose where this project lives." },
  side: { type: String, default: "right" },
  modelValue: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultOpen);
const open = computed({
  get: () => (props.modelValue === undefined ? internal.value : props.modelValue),
  set: (value) => {
    if (props.modelValue === undefined) internal.value = value;
    emit("update:modelValue", value);
  },
});

function onKey(event) {
  if (event.key === "Escape" && open.value) open.value = false;
}
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <button
    type="button"
    class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
    @click="open = true"
  >
    {{ trigger }}
  </button>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="fixed inset-0 z-50">
        <button
          type="button"
          aria-label="Close sheet"
          class="sheet-veil absolute inset-0 bg-black/20 backdrop-blur-[3px]"
          @click="open = false"
        />
        <div
          role="dialog"
          aria-modal="true"
          class="sheet-panel absolute top-0 flex h-full w-[85%] max-w-sm flex-col border bg-popover p-5 shadow-2xl"
          :class="side === 'right' ? 'right-0 border-l' : 'left-0 border-r'"
          :data-side="side"
        >
          <button
            type="button"
            aria-label="Close"
            class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent"
            @click="open = false"
          >
            <X class="size-4" />
          </button>
          <h2 class="pr-8 text-[15px] font-medium">{{ title }}</h2>
          <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">{{ description }}</p>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.sheet-enter-active .sheet-veil { animation: sheet-veil-in 400ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.sheet-leave-active .sheet-veil { animation: sheet-veil-out 200ms cubic-bezier(0.33, 0.17, 0.67, 0.5) both; }
.sheet-enter-active .sheet-panel { animation: sheet-in 400ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.sheet-leave-active .sheet-panel { animation: sheet-out 200ms cubic-bezier(0.33, 0.17, 0.67, 0.5) both; }
@keyframes sheet-veil-in { from { opacity: 0; } }
@keyframes sheet-veil-out { to { opacity: 0; } }
@keyframes sheet-in { from { transform: translateX(100%); } }
@keyframes sheet-out { to { transform: translateX(100%); } }
.sheet-panel[data-side="left"] { animation-name: sheet-in-left; }
@keyframes sheet-in-left { from { transform: translateX(-100%); } }
.sheet-leave-active .sheet-panel[data-side="left"] { animation-name: sheet-out-left; }
@keyframes sheet-out-left { to { transform: translateX(-100%); } }
@media (prefers-reduced-motion: reduce) {
  .sheet-enter-active .sheet-veil, .sheet-leave-active .sheet-veil { animation: sheet-fade 200ms linear both; }
  .sheet-enter-active .sheet-panel, .sheet-leave-active .sheet-panel { animation: sheet-fade 200ms linear both; }
  @keyframes sheet-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
