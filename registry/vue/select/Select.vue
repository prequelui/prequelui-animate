<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Check, ChevronDown } from "@lucide/vue";

const props = defineProps({
  items: { type: Array, default: () => ["Design", "Engineering", "Marketing", "Support"] },
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: "" },
  placeholder: { type: String, default: "Select an option" },
});
const emit = defineEmits(["update:modelValue"]);

const options = computed(() =>
  props.items.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
);
const internal = ref(props.defaultValue);
const current = computed(() => props.modelValue ?? internal.value);
const open = ref(false);
const active = ref(0);
const root = ref(null);
const selected = computed(() => options.value.find((option) => option.value === current.value));

function choose(option) {
  internal.value = option.value;
  emit("update:modelValue", option.value);
  open.value = false;
}
function onPointer(event) {
  if (open.value && root.value && !root.value.contains(event.target)) open.value = false;
}
function onKey(event) {
  if (event.key === "Escape") {
    open.value = false;
    return;
  }
  if (!open.value && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
    event.preventDefault();
    open.value = true;
    return;
  }
  if (!open.value) return;
  if (event.key === "ArrowDown") {
    event.preventDefault();
    active.value = Math.min(options.value.length - 1, active.value + 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    active.value = Math.max(0, active.value - 1);
  } else if (event.key === "Enter") {
    event.preventDefault();
    const option = options.value[active.value];
    if (option) choose(option);
  }
}
onMounted(() => document.addEventListener("pointerdown", onPointer));
onBeforeUnmount(() => document.removeEventListener("pointerdown", onPointer));
</script>

<template>
  <div ref="root" class="relative w-[220px] text-[13px]" @keydown="onKey">
    <button
      type="button"
      aria-haspopup="listbox"
      :aria-expanded="open"
      class="flex h-9 w-full items-center justify-between rounded-lg border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      @click="open = !open"
    >
      <span :class="selected ? '' : 'text-muted-foreground'">
        {{ selected?.label ?? placeholder }}
      </span>
      <ChevronDown class="size-3.5 text-muted-foreground" />
    </button>
    <Transition name="select">
      <div
        v-if="open"
        role="listbox"
        :aria-label="placeholder"
        class="absolute left-0 top-full z-40 mt-1.5 w-full origin-top rounded-xl border bg-popover p-1 shadow-lg"
      >
        <button
          v-for="(option, index) in options"
          :key="option.value"
          type="button"
          role="option"
          :aria-selected="option.value === current"
          class="select-row flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent"
          :class="option.value === current ? 'text-foreground' : 'text-muted-foreground'"
          :style="{ animationDelay: `${index * 30}ms` }"
          @click="choose(option)"
        >
          <span>{{ option.label }}</span>
          <Check v-if="option.value === current" class="size-3.5" />
        </button>
      </div>
    </Transition>
  </div>
</template>

<style>
.select-enter-active { animation: select-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
.select-leave-active { animation: select-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
.select-enter-active .select-row { animation: select-row 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
@keyframes select-in { from { opacity: 0; transform: scale(0.9); } }
@keyframes select-out { to { opacity: 0; transform: scale(0.95); } }
@keyframes select-row { from { opacity: 0; transform: translateY(-4px); } }
@media (prefers-reduced-motion: reduce) {
  .select-enter-active, .select-leave-active, .select-enter-active .select-row { animation: select-fade 150ms linear both; }
  @keyframes select-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
