<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  trigger: { type: String, default: "Delete project" },
  title: { type: String, default: "Delete project?" },
  description: { type: String, default: "This action cannot be undone. The project and its data will be removed." },
  confirmLabel: { type: String, default: "Delete" },
});
const emit = defineEmits(["update:modelValue", "confirm"]);

const internal = ref(props.defaultOpen);
watch(() => props.modelValue, (value) => {
  if (value !== undefined) internal.value = value;
});
const value = computed(() => (props.modelValue === undefined ? internal.value : props.modelValue));

function setOpen(next) {
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}
function confirm() {
  emit("confirm");
  setOpen(false);
}
function onKey(event) {
  if (event.key === "Escape" && value.value) setOpen(false);
}
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium" @click="setOpen(true)">
    {{ trigger }}
  </button>
  <Teleport to="body">
    <Transition name="alert">
      <div v-if="value" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button type="button" aria-label="Close dialog" class="alert-veil absolute inset-0 bg-background/60 backdrop-blur-sm" @click="setOpen(false)" />
        <div role="alertdialog" aria-modal="true" class="alert-popup relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl">
          <h2 class="text-[15px] font-medium">{{ title }}</h2>
          <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">{{ description }}</p>
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="h-8 rounded-md border px-3 text-[13px]" @click="setOpen(false)">Cancel</button>
            <button type="button" class="h-8 rounded-md bg-destructive px-3 text-[13px] font-medium text-destructive-foreground" @click="confirm">{{ confirmLabel }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.alert-veil { animation: alert-in 400ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.alert-popup { animation: alert-pop 450ms cubic-bezier(0.23, 1, 0.32, 1) both; }
.alert-leave-active .alert-veil, .alert-leave-active .alert-popup { animation: alert-out 200ms cubic-bezier(0, 0, 0.58, 1) both; }
@keyframes alert-in { from { opacity: 0; } }
@keyframes alert-pop { from { opacity: 0; transform: translateY(8px) scale(0.96); filter: blur(4px); } }
@keyframes alert-out { to { opacity: 0; } }
@media (prefers-reduced-motion: reduce) {
  .alert-veil, .alert-popup, .alert-leave-active .alert-veil, .alert-leave-active .alert-popup { animation-duration: 200ms; }
  .alert-popup { animation: alert-in 200ms linear both; }
}
</style>
