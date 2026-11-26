<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from "vue";
import CategoryPictogram from "./category-core.vue";

const props = defineProps({
  items: { type: Array, default: () => [] },
  size: { type: Number, default: 40 },
  className: { type: String, default: "" },
  ariaLabel: { type: String, default: "Categories" },
  onSelect: { type: Function, default: null },
});

const scroller = ref(null);
const hovered = ref(null);
const state = reactive({ left: false, right: false, overflow: false });
let observer = null;

function measure() {
  const node = scroller.value;
  if (!node) return;
  const max = node.scrollWidth - node.clientWidth;
  state.left = node.scrollLeft > 1;
  state.right = max - node.scrollLeft > 1;
  state.overflow = max > 1;
}

function scrollBy(direction) {
  const node = scroller.value;
  if (!node) return;
  const amount = Math.max(240, Math.round(node.clientWidth * 0.7));
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  node.scrollBy({ left: direction * amount, behavior: reduce ? "auto" : "smooth" });
}

onMounted(() => {
  const node = scroller.value;
  if (!node) return;
  measure();
  node.addEventListener("scroll", measure, { passive: true });
  observer = new ResizeObserver(measure);
  observer.observe(node);
});

onBeforeUnmount(() => {
  const node = scroller.value;
  if (!node) return;
  node.removeEventListener("scroll", measure);
  observer?.disconnect();
});

function gradientOf(definition) {
  const { light, dark } = definition.palette;
  return `linear-gradient(45deg, light-dark(${light[0]}, ${dark[0]}), light-dark(${light[1]}, ${dark[1]}))`;
}

function isActive(item) {
  return item.active ? true : hovered.value === item.definition.slug ? true : undefined;
}

function select(item) {
  props.onSelect?.(item);
}
</script>

<template>
  <nav
    data-category-row=""
    :aria-label="ariaLabel"
    :class="['relative w-full', props.className]"
  >
    <div
      ref="scroller"
      class="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul class="mx-auto flex w-max min-w-full items-stretch justify-center px-3 py-4">
        <li
          v-for="item in items"
          :key="item.definition.slug"
          class="shrink-0 snap-start px-2.5"
          @pointerenter="hovered = item.definition.slug"
          @pointerleave="hovered = hovered === item.definition.slug ? null : hovered"
        >
          <component
            :is="item.href ? 'a' : 'button'"
            :href="item.href || undefined"
            :type="item.href ? undefined : 'button'"
            :aria-current="item.active ? 'page' : undefined"
            class="group/cat relative flex min-w-14 select-none flex-col items-center gap-1 rounded-md py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background max-md:py-2.5"
            @click="item.href ? undefined : select(item)"
            @focus="hovered = item.definition.slug"
            @blur="hovered = null"
          >
            <CategoryPictogram
              :definition="item.definition"
              :size="size"
              :active="isActive(item)"
              class="text-foreground"
            />
            <span
              data-category-label=""
              :class="[
                'w-full text-center text-[15px] leading-[19px] text-foreground',
                item.active ? 'font-medium' : '',
              ]"
            >
              {{ item.label ?? item.definition.name }}
            </span>
            <span
              aria-hidden="true"
              :class="[
                'pointer-events-none absolute -bottom-[5px] left-1/2 h-0.5 w-6 -translate-x-1/2 origin-center rounded-full bg-background transition-transform duration-100 ease-out',
                'scale-x-0 group-hover/cat:scale-x-100 group-focus-visible/cat:scale-x-100',
                item.active ? 'scale-x-100' : '',
                'motion-reduce:transition-none',
              ]"
              :style="{ backgroundImage: gradientOf(item.definition) }"
            />
            <span
              v-if="item.badge"
              class="absolute -left-1 -top-2 rounded-full px-1.5 py-0.5 text-[13px] font-semibold uppercase leading-none"
              :style="{
                backgroundImage: gradientOf(item.definition),
                color: 'light-dark(#ffffff, #171717)',
              }"
            >
              {{ item.badge }}
            </span>
          </component>
        </li>
      </ul>
    </div>

    <template v-if="state.overflow">
      <button
        type="button"
        aria-label="Scroll categories left"
        :tabindex="state.left ? 0 : -1"
        :class="[
          'absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground',
          state.left ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 pointer-events-none',
        ]"
        @click="scrollBy(-1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Scroll categories right"
        :tabindex="state.right ? 0 : -1"
        :class="[
          'absolute inset-y-0 right-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground',
          state.right ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 pointer-events-none',
        ]"
        @click="scrollBy(1)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </template>
  </nav>
</template>
