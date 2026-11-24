<script>
const fallbackSteps = [
  {
    id: "account",
    title: "Account",
    description: "Your details",
    content:
      "<p class=\"font-medium text-foreground\">Create your account</p><p>Use an email you can access. You can change it later.</p>",
  },
  {
    id: "workspace",
    title: "Workspace",
    description: "Name and invite",
    content:
      "<p class=\"font-medium text-foreground\">Set up the workspace</p><p>Invite a teammate or start on your own.</p>",
  },
  {
    id: "ready",
    title: "Ready",
    description: "Start building",
    content:
      "<p class=\"font-medium text-foreground\">Everything is ready</p><p>Your first project is waiting on the dashboard.</p>",
  },
];
</script>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  steps: { type: Array, default: () => fallbackSteps },
  modelValue: { type: Number, default: undefined },
  defaultValue: { type: Number, default: 0 },
  controls: { type: Boolean, default: true },
  backLabel: { type: String, default: "Back" },
  nextLabel: { type: String, default: "Continue" },
  finishLabel: { type: String, default: "Finish" },
  minHeight: { type: Number, default: 112 },
});
const emit = defineEmits(["update:modelValue", "complete"]);

const clamp = (value, max) => Math.min(max, Math.max(0, value));

const last = computed(() => Math.max(0, props.steps.length - 1));
const internal = ref(clamp(props.defaultValue, last.value));
const current = computed(() => clamp(props.modelValue ?? internal.value, last.value));
const previous = ref(current.value);
const direction = ref(1);
const reduced = ref(false);

const step = computed(() => props.steps[current.value]);

watch(current, (next) => {
  direction.value = next >= previous.value ? 1 : -1;
  previous.value = next;
});

onMounted(() => {
  reduced.value = reduce();
});

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function go(next) {
  const safe = clamp(next, last.value);
  if (safe === current.value) return;
  internal.value = safe;
  emit("update:modelValue", safe);
}

function complete() {
  if (current.value === last.value) emit("complete");
}

function badgeClass(index) {
  if (index < current.value) return "border-primary bg-primary text-primary-foreground";
  if (index === current.value) return "border-primary bg-background text-foreground";
  return "border-border bg-muted/40 text-muted-foreground";
}

function enter(element, done) {
  if (reduced.value) {
    animate(element, { opacity: [0, 1] }, { duration: 0.15 }).finished.then(done);
    return;
  }
  animate(
    element,
    {
      opacity: [0, 1],
      x: [direction.value * 18, 0],
      filter: ["blur(3px)", "blur(0px)"],
    },
    { duration: 0.26, ease: [0.23, 1, 0.32, 1] },
  ).finished.then(done);
}

function leave(element, done) {
  if (reduced.value) {
    animate(element, { opacity: [1, 0] }, { duration: 0.15 }).finished.then(done);
    return;
  }
  animate(
    element,
    {
      opacity: [1, 0],
      x: [0, direction.value * -18],
      filter: ["blur(0px)", "blur(2px)"],
    },
    { duration: 0.26, ease: [0.23, 1, 0.32, 1] },
  ).finished.then(done);
}
</script>

<template>
  <div data-slot="stepper" class="w-full max-w-[440px]">
    <ol class="flex w-full items-start" aria-label="Progress">
      <li
        v-for="(item, index) in steps"
        :key="item.id"
        class="relative flex min-w-0 flex-1 flex-col items-center"
      >
        <span
          v-if="index < steps.length - 1"
          aria-hidden="true"
          class="absolute left-1/2 top-[15px] -ml-px h-px w-full overflow-hidden bg-border"
        >
          <span
            class="block h-full w-full origin-left bg-primary transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.1,1)] motion-reduce:transition-none"
            :style="{ transform: index < current ? 'scaleX(1)' : 'scaleX(0)' }"
          />
        </span>
        <button
          type="button"
          :aria-current="index === current ? 'step' : undefined"
          :aria-label="`Step ${index + 1}: ${item.title}`"
          class="group relative z-10 flex flex-col items-center gap-2 rounded-lg px-1 py-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          @click="go(index)"
        >
          <span
            class="flex size-[30px] items-center justify-center rounded-full border text-[13px] font-medium transition-[color,background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
            :class="badgeClass(index)"
            :style="{
              transform: index === current && !reduced ? 'scale(1.08)' : 'scale(1)',
            }"
          >
            <svg
              v-if="index < current"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
              class="size-3.5"
            >
              <path
                d="M3.4 8.4 6.6 11.5 12.6 4.8"
                stroke="currentColor"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
                pathLength="1"
                class="step-check"
              />
            </svg>
            <template v-else>{{ index + 1 }}</template>
          </span>
          <span class="flex min-w-0 flex-col">
            <span
              class="truncate text-[13px] leading-4"
              :class="
                index <= current
                  ? 'font-medium text-foreground'
                  : 'text-muted-foreground'
              "
            >
              {{ item.title }}
            </span>
            <span
              v-if="item.description"
              class="mt-0.5 hidden truncate text-[13px] leading-4 text-muted-foreground sm:block"
            >
              {{ item.description }}
            </span>
          </span>
        </button>
      </li>
    </ol>

    <div
      class="relative mt-6 overflow-hidden rounded-xl border bg-background"
      :style="{ minHeight: `${minHeight}px` }"
    >
      <Transition :css="false" mode="out-in" @enter="enter" @leave="leave">
        <div
          :key="step?.id ?? current"
          role="region"
          aria-live="polite"
          :aria-label="step ? `${step.title} step` : undefined"
          class="p-4 text-[13px] leading-5 text-muted-foreground"
        >
          <slot :step="step" :index="current">
            <div v-if="step && step.content" v-html="step.content" />
            <p v-else class="text-foreground">{{ step?.title }}</p>
          </slot>
        </div>
      </Transition>
    </div>

    <div v-if="controls" class="mt-4 flex items-center justify-between gap-3">
      <button
        type="button"
        :disabled="current === 0"
        class="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[13px] font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        @click="go(current - 1)"
      >
        {{ backLabel }}
      </button>
      <span class="text-[13px] tabular-nums text-muted-foreground">
        {{ Math.min(current + 1, steps.length) }} / {{ steps.length }}
      </span>
      <button
        type="button"
        class="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        @click="current === last ? complete() : go(current + 1)"
      >
        {{ current === last ? finishLabel : nextLabel }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.step-check {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: step-draw 280ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

@keyframes step-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .step-check {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
