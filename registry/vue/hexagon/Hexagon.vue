<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const props = defineProps({
  hexagonSize: { type: Number, default: 46 },
  hexagonMargin: { type: Number, default: 3 },
  speed: { type: Number, default: 1 },
});

const root = ref(null);
const grid = ref({ rows: 0, columns: 0 });

const width = computed(() => props.hexagonSize);
const height = computed(() => props.hexagonSize * 1.1);
const rowSpacing = computed(() => height.value * 0.75 + props.hexagonMargin);
const rootStyle = computed(() => ({
  "--hex-leave": `${1000 / Math.max(0.1, props.speed)}ms`,
}));

let observer;

function update() {
  const element = root.value;
  if (!element) return;
  const rect = element.getBoundingClientRect();
  const rows = Math.ceil(rect.height / rowSpacing.value) + 2;
  const columns = Math.ceil(rect.width / (width.value + props.hexagonMargin)) + 2;
  if (grid.value.rows === rows && grid.value.columns === columns) return;
  grid.value = { rows, columns };
}

watch(
  () => [props.hexagonSize, props.hexagonMargin, props.speed],
  () => {
    update();
  },
);

onMounted(() => {
  update();
  observer = new ResizeObserver(update);
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="root"
    data-slot="hexagon-background"
    class="relative isolate size-full overflow-hidden bg-[#f4f2ee] dark:bg-[#0b0b0f]"
    :style="rootStyle"
  >
    <div
      aria-hidden="true"
      class="absolute left-0 top-0 size-full overflow-hidden [text-rendering:optimizeSpeed]"
    >
      <div
        v-for="row in grid.rows"
        :key="row"
        class="flex w-max"
        :style="{
          marginTop: `${row === 1 ? -height / 2 : rowSpacing - height}px`,
          marginLeft: `${((row - 1) % 2 === 0 ? 0 : -width / 2) - width / 2}px`,
        }"
      >
        <div
          v-for="column in grid.columns"
          :key="column"
          class="relative shrink-0"
          :style="{
            width: `${width}px`,
            height: `${height}px`,
            marginLeft: `${hexagonMargin}px`,
          }"
        >
          <div
            class="absolute inset-0 bg-foreground/[0.10] transition-colors [transition-duration:var(--hex-leave)] hover:bg-foreground/[0.22] hover:[transition-duration:0ms] dark:bg-foreground/[0.14] dark:hover:bg-foreground/[0.30]"
            :style="{ clipPath: HEX_CLIP }"
          />
          <div
            class="absolute bg-[#f4f2ee] transition-colors [transition-duration:var(--hex-leave)] hover:bg-foreground/[0.06] hover:[transition-duration:0ms] dark:bg-[#0b0b0f] dark:hover:bg-foreground/[0.12]"
            :style="{ inset: `${hexagonMargin}px`, clipPath: HEX_CLIP }"
          />
        </div>
      </div>
    </div>
    <div
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(244,242,238,0.55))] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,11,15,0.65))]"
    />
    <slot />
  </div>
</template>
