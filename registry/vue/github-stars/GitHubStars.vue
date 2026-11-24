<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { GitBranch, Star } from "@lucide/vue";

const props = defineProps({
  repo: { type: String, default: "" },
  href: { type: String, default: "" },
  count: { type: Number, default: null },
  defaultCount: { type: Number, default: null },
  label: { type: String, default: "GitHub" },
  showLabel: { type: Boolean, default: true },
});

const live = ref(props.defaultCount);
const value = computed(() => (props.count !== null ? props.count : live.value));
const destination = computed(
  () => props.href || (props.repo ? `https://github.com/${props.repo}` : undefined),
);
const display = computed(() => {
  if (value.value === null || value.value === undefined) return "Star";
  if (value.value < 1000) return String(value.value);
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value.value);
});

function load() {
  if (props.count !== null || !props.repo) return;
  let active = true;
  fetch(`https://api.github.com/repos/${props.repo}`, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (active && data && typeof data.stargazers_count === "number") {
        live.value = data.stargazers_count;
      }
    })
    .catch(() => {});
  return () => {
    active = false;
  };
}

onMounted(load);
watch(() => [props.count, props.repo], load);
</script>

<template>
  <a
    data-slot="github-stars"
    :href="destination"
    target="_blank"
    rel="noreferrer noopener"
    :aria-label="repo ? `${label} stars on GitHub` : 'GitHub'"
    class="group inline-flex h-8 items-center gap-1.5 rounded-full border bg-background px-2.5 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
  >
    <GitBranch class="size-4 shrink-0" :stroke-width="1.8" aria-hidden="true" />
    <span v-if="showLabel" class="truncate">{{ label }}</span>
    <span aria-hidden="true" class="h-3.5 w-px shrink-0 bg-border" />
    <span
      aria-hidden="true"
      class="inline-flex items-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none"
    >
      <Star class="size-3.5 shrink-0 transition-colors group-hover:fill-current" />
    </span>
    <span class="tabular-nums">{{ display }}</span>
  </a>
</template>
