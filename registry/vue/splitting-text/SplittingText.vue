<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: [String, Array], required: true },
  type: { type: String, default: "chars" },
  delay: { type: Number, default: 0 },
  stagger: { type: Number, default: 0 },
  disableAnimation: { type: Boolean, default: false },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
});

const root = ref(null);
const controls = [];
let observer;
let played = false;

const lines = computed(() => (Array.isArray(props.text) ? props.text : []));
const words = computed(() =>
  Array.isArray(props.text) ? [] : (props.text.match(/\S+/g) ?? []),
);
const chars = computed(() => (Array.isArray(props.text) ? [] : Array.from(props.text)));
const label = computed(() => (Array.isArray(props.text) ? props.text.join(" ") : props.text));
const gap = computed(() =>
  props.stagger || (props.type === "words" ? 0.2 : props.type === "lines" ? 0.3 : 0.05),
);

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function play() {
  if (played || !root.value) return;
  played = true;
  const still = props.disableAnimation || reduce();
  const nodes = Array.from(root.value.querySelectorAll("[data-piece]"));
  nodes.forEach((node, index) => {
    if (still) {
      node.style.opacity = "1";
      node.style.transform = "none";
      return;
    }
    controls.push(
      animate(
        node,
        { x: [150, 0], opacity: [0, 1] },
        {
          duration: 0.7,
          ease: [0.23, 1, 0.32, 1],
          delay: props.delay / 1000 + index * gap.value,
        },
      ),
    );
  });
}

onMounted(() => {
  if (!props.inView) {
    play();
    return;
  }
  observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    play();
    if (props.inViewOnce) observer?.disconnect();
  });
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  controls.forEach((control) => control.stop?.());
});
</script>

<template>
  <span ref="root" data-slot="splitting-text" class="inline">
    <span aria-hidden="true">
      <template v-if="lines.length">
        <template v-for="(line, index) in lines" :key="`line-${index}`">
          <span data-piece class="inline-block will-change-transform" style="opacity: 0">{{ line }}</span>
          <br v-if="index < lines.length - 1" />
        </template>
      </template>
      <template v-else-if="type === 'words'">
        <template v-for="(word, index) in words" :key="`word-${index}`">
          <span data-piece class="inline-block will-change-transform" style="opacity: 0">{{ word }}</span>
          <template v-if="index < words.length - 1"> </template>
        </template>
      </template>
      <template v-else>
        <span
          v-for="(char, index) in chars"
          :key="`char-${index}`"
          data-piece
          class="inline-block whitespace-pre will-change-transform"
          style="opacity: 0"
        >{{ char === " " ? "\u00A0" : char }}</span>
      </template>
    </span>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
