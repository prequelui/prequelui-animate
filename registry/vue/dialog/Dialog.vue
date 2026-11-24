<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { X } from "@lucide/vue";

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  trigger: { type: String, default: "Open dialog" },
  title: { type: String, default: "Edit profile" },
  description: { type: String, default: "Make changes to your profile here." },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultOpen);
watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) internal.value = value;
  },
);
const value = computed(() => (props.modelValue === undefined ? internal.value : props.modelValue));

function setOpen(next) {
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}

function onKey(event) {
  if (event.key === "Escape" && value.value) setOpen(false);
}
onMounted(() => document.addEventListener("keydown", onKey));
onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <button type="button" class="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-[13px] font-medium text-background" @click="setOpen(true)">
    {{ trigger }}
  </button>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="value" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <button type="button" aria-label="Close dialog" class="dialog-veil absolute inset-0 bg-background/60 backdrop-blur-sm" @click="setOpen(false)" />
        <div role="dialog" aria-modal="true" class="dialog-popup relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl">
          <button type="button" aria-label="Close" class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent" @click="setOpen(false)">
            <X class="size-4" />
          </button>
          <h2 class="text-[15px] font-medium">{{ title }}</h2>
          <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">{{ description }}</p>
          <slot />
          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="h-8 rounded-md border px-3 text-[13px]" @click="setOpen(false)">Cancel</button>
            <button type="button" class="h-8 rounded-md bg-foreground px-3 text-[13px] font-medium text-background" @click="setOpen(false)">Save</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.dialog-veil,
.dialog-popup {
  animation: dialog-in 400ms cubic-bezier(0.215, 0.61, 0.355, 1) both;
}
.dialog-popup {
  animation: dialog-pop 450ms linear both;
}
.dialog-leave-active .dialog-veil,
.dialog-leave-active .dialog-popup {
  animation: dialog-out 200ms cubic-bezier(0, 0, 0.58, 1) both;
}
@keyframes dialog-in {
  from { opacity: 0; }
}
@keyframes dialog-pop {
  from { opacity: 0; transform: translateY(8px) scale(0.96); filter: blur(4px); }
}
@keyframes dialog-out {
  to { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dialog-veil, .dialog-popup, .dialog-leave-active .dialog-veil, .dialog-leave-active .dialog-popup {
    animation-duration: 200ms;
  }
  .dialog-popup { animation: dialog-in 200ms linear both; }
}
</style>
