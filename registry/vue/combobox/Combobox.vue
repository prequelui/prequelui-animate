<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Check, ChevronDown } from "@lucide/vue";

const props = defineProps({
  options: { type: Array, default: () => [
    { value: "base-ui", label: "Base UI" },
    { value: "radix-ui", label: "Radix UI" },
    { value: "react-aria", label: "React Aria" },
    { value: "reka-ui", label: "Reka UI" },
  ] },
  placeholder: { type: String, default: "Pick a library" },
  defaultValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const query = ref(props.defaultValue);
const value = ref(props.defaultValue);
const open = ref(false);
const active = ref(0);
const root = ref(null);

const filtered = computed(() =>
  props.options.filter((option) => option.label.toLowerCase().includes(query.value.toLowerCase())),
);

function choose(option) {
  value.value = option.value;
  query.value = option.label;
  open.value = false;
  emit("update:modelValue", option.value);
}

function onPointer(event) {
  if (open.value && root.value && !root.value.contains(event.target)) open.value = false;
}
onMounted(() => document.addEventListener("pointerdown", onPointer));
onBeforeUnmount(() => document.removeEventListener("pointerdown", onPointer));
</script>

<template>
  <div ref="root" class="relative w-56 text-[13px]">
    <div class="flex h-9 items-center rounded-lg border bg-background px-2.5">
      <input
        role="combobox"
        :aria-expanded="open"
        aria-controls="combobox-list"
        aria-autocomplete="list"
        :value="query"
        :placeholder="placeholder"
        class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        @input="query = $event.target.value; open = true; active = 0"
        @focus="open = true"
        @keydown.down.prevent="open = true; active = Math.min(filtered.length - 1, active + 1)"
        @keydown.up.prevent="active = Math.max(0, active - 1)"
        @keydown.enter="filtered[active] && choose(filtered[active])"
        @keydown.esc="open = false"
      />
      <ChevronDown class="size-4 shrink-0 text-muted-foreground" />
    </div>
    <Transition name="combo">
      <ul v-if="open" id="combobox-list" role="listbox" class="absolute top-full z-40 mt-1.5 w-full rounded-xl border bg-background p-1 shadow-xl">
        <li v-if="!filtered.length" class="px-2 py-2 text-muted-foreground">No result</li>
        <li
          v-for="(option, index) in filtered"
          :key="option.value"
          role="option"
          :aria-selected="option.value === value"
          class="combo-row relative flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5"
          :style="{ animationDelay: `${index * 30}ms` }"
          @pointerenter="active = index"
          @click="choose(option)"
        >
          {{ option.label }}
          <Check v-if="option.value === value" class="size-3.5" />
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style>
.combo-enter-active, .combo-leave-active { transition: opacity 220ms cubic-bezier(0.215, 0.61, 0.355, 1), transform 220ms cubic-bezier(0.215, 0.61, 0.355, 1); }
.combo-leave-active { transition-duration: 150ms; transition-timing-function: cubic-bezier(0, 0, 0.58, 1); }
.combo-enter-from, .combo-leave-to { opacity: 0; transform: translateY(-4px); }
.combo-enter-active .combo-row { animation: combo-row 200ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
@keyframes combo-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
@media (prefers-reduced-motion: reduce) {
  .combo-enter-active, .combo-leave-active, .combo-enter-active .combo-row { transition: none; animation: none; }
}
</style>
