<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  accept: { type: String, default: undefined },
  multiple: { type: Boolean, default: false },
  maxSize: { type: Number, default: undefined },
  disabled: { type: Boolean, default: false },
  progress: { type: Number, default: undefined },
  status: { type: String, default: undefined },
  fileName: { type: String, default: undefined },
  title: { type: String, default: "Drop a file or browse" },
  hint: { type: String, default: "SVG, PNG or JPG" },
});
const emit = defineEmits(["files", "error"]);

const root = ref(null);
const input = ref(null);
const icon = ref(null);
const bar = ref(null);
const dragging = ref(false);
const selected = ref([]);
const error = ref(null);
let iconControls;
let barControls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
  return `${Math.round(bytes / 104857.6) / 10} MB`;
}

const resolvedStatus = computed(
  () => props.status ?? (error.value ? "error" : "idle"),
);
const shownName = computed(() => props.fileName ?? selected.value[0]?.name);
const shownSize = computed(() =>
  selected.value[0] ? formatSize(selected.value[0].size) : null,
);
const safeProgress = computed(() =>
  typeof props.progress === "number"
    ? Math.min(100, Math.max(0, props.progress))
    : null,
);

const stateBorder = computed(() => {
  if (resolvedStatus.value === "error") return "border-destructive/60 bg-destructive/5";
  if (dragging.value) return "border-primary/70 bg-accent/60";
  if (resolvedStatus.value === "done") return "border-emerald-500/40 bg-emerald-500/5";
  return "border-border bg-muted/20 hover:border-border/80 hover:bg-accent/40";
});

function acceptFiles(list) {
  if (!list || props.disabled) return;
  const files = Array.from(list);
  if (!files.length) return;
  if (!props.multiple && files.length > 1) files.splice(1);

  if (props.maxSize !== undefined) {
    const oversized = files.find((file) => file.size > props.maxSize);
    if (oversized) {
      const message = `${oversized.name} is larger than ${formatSize(props.maxSize)}.`;
      error.value = message;
      emit("error", message);
      return;
    }
  }

  error.value = null;
  selected.value = files;
  emit("files", files);
}

function open() {
  if (props.disabled) return;
  input.value?.click();
}

function onKey(event) {
  if (props.disabled) return;
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    open();
  }
}

function onChange(event) {
  acceptFiles(event.target.files);
  event.target.value = "";
}

function onDragEnter(event) {
  event.preventDefault();
  if (!props.disabled) dragging.value = true;
}

function onDragOver(event) {
  event.preventDefault();
  if (!props.disabled) dragging.value = true;
}

function onDragLeave(event) {
  if (event.currentTarget.contains(event.relatedTarget)) return;
  dragging.value = false;
}

function onDrop(event) {
  event.preventDefault();
  dragging.value = false;
  acceptFiles(event.dataTransfer.files);
}

watch(dragging, (value) => {
  if (!icon.value) return;
  iconControls?.stop?.();
  const lifted = value && !reduce();
  iconControls = animate(
    icon.value,
    { y: lifted ? -3 : 0, scale: lifted ? 1.04 : 1 },
    { type: "spring", stiffness: 380, damping: 24 },
  );
});

watch(safeProgress, async (value) => {
  await nextTick();
  if (!bar.value || value === null) return;
  barControls?.stop?.();
  barControls = animate(
    bar.value,
    { width: `${value}%` },
    reduce()
      ? { duration: 0 }
      : { type: "spring", stiffness: 220, damping: 26 },
  );
});

onBeforeUnmount(() => {
  iconControls?.stop?.();
  barControls?.stop?.();
});
</script>

<template>
  <div
    ref="root"
    data-slot="file-drop"
    role="button"
    :tabindex="disabled ? -1 : 0"
    :aria-disabled="disabled || undefined"
    :aria-label="title"
    class="group relative flex w-full max-w-[360px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    :class="[stateBorder, disabled ? 'pointer-events-none opacity-50' : '']"
    @click="open"
    @keydown="onKey"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <input
      ref="input"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="sr-only"
      @click.stop
      @change="onChange"
    />

    <slot
      :dragging="dragging"
      :status="resolvedStatus"
      :file-name="shownName"
      :progress="safeProgress"
    >
      <span
        ref="icon"
        class="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm"
      >
        <slot name="icon">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-5">
            <path
              d="M12 16V5m0 0L8 9m4-4 4 4"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4.5 15.5v2A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-2"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linecap="round"
            />
          </svg>
        </slot>
      </span>

      <span class="flex flex-col gap-1">
        <span class="text-[13px] font-medium text-foreground">{{ title }}</span>
        <span class="text-[13px] leading-4 text-muted-foreground">{{ hint }}</span>
      </span>

      <span
        v-if="shownName"
        class="flex w-full flex-col gap-2 rounded-lg border bg-background px-2.5 py-2 text-left"
      >
        <span class="flex items-center gap-2 text-[13px] text-foreground">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            class="size-4 shrink-0"
          >
            <path
              d="M6 2.8h5.2L15 6.6v10.6H6z"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
            <path
              d="M11 2.8v4h4"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
          </svg>
          <span class="min-w-0 flex-1 truncate">{{ shownName }}</span>
          <span v-if="shownSize" class="shrink-0 tabular-nums text-muted-foreground">
            {{ shownSize }}
          </span>
          <span
            v-if="resolvedStatus === 'done'"
            class="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
          >
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="size-4">
              <path
                d="M4.5 10.4 8 14l7.5-8"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
                pathLength="1"
                class="file-drop-check"
              />
            </svg>
          </span>
        </span>
        <span
          v-if="safeProgress !== null"
          class="block h-1 overflow-hidden rounded-full bg-border"
        >
          <span
            ref="bar"
            class="block h-full rounded-full bg-primary"
            style="width: 0%"
          />
        </span>
      </span>

      <span v-if="error" class="text-[13px] leading-4 text-destructive">
        {{ error }}
      </span>
    </slot>
  </div>
</template>

<style scoped>
.file-drop-check {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: file-drop-draw 320ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes file-drop-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .file-drop-check {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
