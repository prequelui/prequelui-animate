<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { X } from "@lucide/vue";

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  trigger: { type: String, default: "Open drawer" },
  title: { type: String, default: "Notifications" },
  description: { type: String, default: "Updates from the projects you follow." },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultOpen);
watch(() => props.modelValue, (value) => {
  if (value !== undefined) internal.value = value;
});
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
  <button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium" @click="setOpen(true)">
    {{ trigger }}
  </button>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="value" class="fixed inset-0 z-50">
        <button type="button" aria-label="Close drawer" class="drawer-veil absolute inset-0 bg-background/60 backdrop-blur-sm" @click="setOpen(false)" />
        <div role="dialog" aria-modal="true" class="drawer-panel absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l bg-background p-5 shadow-2xl">
          <button type="button" aria-label="Close" class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent" @click="setOpen(false)">
            <X class="size-4" />
          </button>
          <p class="text-[15px] font-medium">{{ title }}</p>
          <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">{{ description }}</p>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.drawer-veil { animation: drawer-fade 400ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.drawer-panel { animation: drawer-in 400ms cubic-bezier(0.34, 1.2, 0.64, 1) both; }
.drawer-leave-active .drawer-veil { animation: drawer-fade 160ms reverse both; }
.drawer-leave-active .drawer-panel { animation: drawer-out 160ms cubic-bezier(0.4, 0, 1, 1) both; }
@keyframes drawer-fade { from { opacity: 0; } }
@keyframes drawer-in { from { transform: translateX(100%); } }
@keyframes drawer-out { to { transform: translateX(100%); } }
@media (prefers-reduced-motion: reduce) {
  .drawer-veil, .drawer-panel, .drawer-leave-active .drawer-veil, .drawer-leave-active .drawer-panel { animation: drawer-fade 200ms both; }
}
</style>
