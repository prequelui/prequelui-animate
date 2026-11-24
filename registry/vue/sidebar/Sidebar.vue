<script setup>
import { computed, ref } from "vue";
import { PanelLeft } from "@lucide/vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { value: "home", label: "Home" },
      { value: "projects", label: "Projects" },
      { value: "team", label: "Team" },
      { value: "settings", label: "Settings" },
    ],
  },
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: "projects" },
  collapsed: { type: Boolean, default: undefined },
  defaultCollapsed: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "update:collapsed"]);

const internal = ref(props.defaultValue);
const current = computed(() => props.modelValue ?? internal.value);
const closedInternal = ref(props.defaultCollapsed);
const closed = computed(() => (props.collapsed === undefined ? closedInternal.value : props.collapsed));

function select(value) {
  internal.value = value;
  emit("update:modelValue", value);
}
function toggle() {
  const next = !closed.value;
  if (props.collapsed === undefined) closedInternal.value = next;
  emit("update:collapsed", next);
}
</script>

<template>
  <div class="flex h-[190px] w-full max-w-[320px] overflow-hidden rounded-xl border bg-background">
    <div
      class="sidebar flex shrink-0 flex-col overflow-hidden border-r bg-accent/40 p-2 transition-[width] duration-[280ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
      :style="{ width: closed ? '54px' : '136px' }"
    >
      <div class="mb-3 flex h-7 items-center gap-2 overflow-hidden px-1">
        <span class="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">P</span>
        <Transition name="side-label">
          <span v-if="!closed" class="whitespace-nowrap text-[13px] font-medium">Prequel</span>
        </Transition>
      </div>
      <button
        v-for="item in items"
        :key="item.value"
        type="button"
        :aria-pressed="item.value === current"
        class="relative mb-0.5 flex h-7 items-center gap-2 overflow-hidden rounded-md px-2 text-[13px] transition-colors"
        :class="item.value === current ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'"
        @click="select(item.value)"
      >
        <span class="relative shrink-0">
          <slot name="icon" :item="item">
            <span class="block size-1.5 rounded-full bg-current" />
          </slot>
        </span>
        <Transition name="side-label">
          <span v-if="!closed" class="relative whitespace-nowrap">{{ item.label }}</span>
        </Transition>
      </button>
    </div>
    <div class="flex min-w-0 flex-1 flex-col p-3">
      <div class="flex items-center justify-between">
        <p class="truncate text-[13px] font-medium">
          {{ items.find((item) => item.value === current)?.label ?? "Projects" }}
        </p>
        <button
          type="button"
          aria-label="Toggle sidebar"
          :aria-expanded="!closed"
          class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          @click="toggle"
        >
          <PanelLeft class="size-3.5" />
        </button>
      </div>
      <div class="mt-3 space-y-2">
        <div v-for="width in [70, 92, 58]" :key="width" class="flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-border" />
          <span class="h-1.5 rounded-full bg-accent" :style="{ width: `${width}%` }" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.side-label-enter-active { animation: side-label-in 140ms cubic-bezier(0.23, 1, 0.32, 1) both; }
.side-label-leave-active { animation: side-label-out 140ms cubic-bezier(0.23, 1, 0.32, 1) both; }
@keyframes side-label-in { from { opacity: 0; filter: blur(2px); transform: translateX(-4px); } }
@keyframes side-label-out { to { opacity: 0; filter: blur(2px); transform: translateX(-4px); } }
@media (prefers-reduced-motion: reduce) {
  .side-label-enter-active, .side-label-leave-active { animation: side-label-fade 140ms linear both; }
  @keyframes side-label-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
