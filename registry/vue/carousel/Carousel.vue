<script setup>
import { computed, ref, watch } from "vue";
import { ChevronLeft, ChevronRight } from "@lucide/vue";

const props = defineProps({
  slides: { type: Array, default: () => [
    { title: "Springs", body: "Position and size move on springs." },
    { title: "Tweens", body: "Colour and opacity use short tweens." },
    { title: "Reduced motion", body: "Travel is removed, state is kept." },
  ] },
  defaultIndex: { type: Number, default: 0 },
  modelValue: { type: Number, default: undefined },
});
const emit = defineEmits(["update:modelValue"]);

const index = ref(props.modelValue ?? props.defaultIndex);
const drag = ref(0);
const dragging = ref(false);
let start = null;

watch(() => props.modelValue, (value) => {
  if (value !== undefined) index.value = value;
});

function go(next) {
  const value = Math.min(props.slides.length - 1, Math.max(0, next));
  if (props.modelValue === undefined) index.value = value;
  emit("update:modelValue", value);
}

function down(event) {
  dragging.value = true;
  start = event.clientX;
  event.currentTarget.setPointerCapture(event.pointerId);
}
function move(event) {
  if (!dragging.value) return;
  drag.value = event.clientX - start;
}
function end() {
  if (drag.value > 60) go(index.value - 1);
  else if (drag.value < -60) go(index.value + 1);
  drag.value = 0;
  dragging.value = false;
  start = null;
}

const trackStyle = computed(() => ({
  transform: `translateX(calc(-${index.value * 100}% + ${drag.value}px))`,
  transition: dragging.value ? "none" : "transform 500ms cubic-bezier(0.34,1.2,0.64,1)",
}));
</script>

<template>
  <div class="w-full max-w-sm">
    <div class="relative overflow-hidden rounded-xl border" @pointerdown="down" @pointermove="move" @pointerup="end" @pointercancel="end">
      <div class="flex touch-pan-y" :style="trackStyle">
        <article v-for="slide in slides" :key="slide.title" class="w-full shrink-0 p-6">
          <p class="text-[13px] font-medium">{{ slide.title }}</p>
          <p class="mt-2 text-[13px] leading-6 text-muted-foreground">{{ slide.body }}</p>
        </article>
      </div>
      <div class="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
        <button type="button" aria-label="Previous slide" :disabled="index === 0" class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40" @click="go(index - 1)">
          <ChevronLeft class="size-3.5" />
        </button>
        <button type="button" aria-label="Next slide" :disabled="index === slides.length - 1" class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40" @click="go(index + 1)">
          <ChevronRight class="size-3.5" />
        </button>
      </div>
    </div>
    <div class="mt-3 flex items-center justify-between">
      <div class="flex gap-1.5">
        <button v-for="(slide, item) in slides" :key="slide.title" type="button" :aria-label="`Go to ${item + 1}`" class="flex size-6 items-center justify-center" @click="go(item)">
          <span class="size-1.5 rounded-full transition-colors" :class="item === index ? 'bg-foreground' : 'bg-border'" />
        </button>
      </div>
      <span class="font-mono text-[13px] tabular-nums text-muted-foreground">
        {{ String(index + 1).padStart(2, "0") }} / {{ String(slides.length).padStart(2, "0") }}
      </span>
    </div>
  </div>
</template>
