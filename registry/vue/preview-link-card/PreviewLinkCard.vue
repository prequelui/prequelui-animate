<script setup>
import { onBeforeUnmount, ref } from "vue";
import { ArrowUpRight } from "@lucide/vue";

const props = defineProps({
  href: { type: String, default: "https://prequelui.dev" },
  trigger: { type: String, default: "prequelui.dev" },
  title: { type: String, default: "PrequelUI Animate" },
  description: { type: String, default: "Motion for the primitives you already use." },
  image: { type: String, default: "" },
  delay: { type: Number, default: 200 },
  closeDelay: { type: Number, default: 150 },
});
const open = ref(false);
let enterTimer;
let leaveTimer;

function show() {
  clearTimeout(leaveTimer);
  enterTimer = setTimeout(() => (open.value = true), props.delay ?? 200);
}
function hide() {
  clearTimeout(enterTimer);
  leaveTimer = setTimeout(() => (open.value = false), props.closeDelay ?? 150);
}
onBeforeUnmount(() => {
  clearTimeout(enterTimer);
  clearTimeout(leaveTimer);
});
</script>

<template>
  <span class="relative inline-block" @pointerenter="show" @pointerleave="hide" @focusin="show" @focusout="hide">
    <a
      :href="href"
      target="_blank"
      rel="noreferrer"
      class="inline-flex items-center gap-1 text-[13px] font-medium underline decoration-border underline-offset-4"
      @click.prevent
    >
      {{ trigger }}
      <ArrowUpRight class="size-3.5" />
    </a>
    <Transition name="preview">
      <div class="absolute left-1/2 top-8 z-40 w-[260px] -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-xl">
        <img v-if="image" :src="image" alt="" class="h-[92px] w-full object-cover" />
        <div v-else class="h-[92px] bg-[radial-gradient(circle_at_30%_20%,#f6c7ae,transparent_60%),linear-gradient(135deg,#efe9df,#dbe7e2)] dark:bg-[radial-gradient(circle_at_30%_20%,#3a2b2b,transparent_60%),linear-gradient(135deg,#1a1a1a,#101816)]" />
        <div class="p-3">
          <p class="text-[13px] font-medium">{{ title }}</p>
          <p class="mt-1 text-[13px] leading-5 text-muted-foreground">{{ description }}</p>
        </div>
      </div>
    </Transition>
  </span>
</template>

<style>
.preview-enter-active { animation: preview-in 250ms cubic-bezier(0.23, 1, 0.32, 1) both; }
.preview-leave-active { animation: preview-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
@keyframes preview-in { from { opacity: 0; transform: translate(-50%, 8px) scale(0.97); filter: blur(6px); } }
@keyframes preview-out { to { opacity: 0; transform: translate(-50%, 6px) scale(0.98); filter: blur(4px); } }
@media (prefers-reduced-motion: reduce) {
  .preview-enter-active, .preview-leave-active { animation: preview-fade 150ms linear both; }
  @keyframes preview-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
