<script setup>
import { computed, ref } from "vue";
import { Check, ChevronRight } from "@lucide/vue";

const props = defineProps({
  questions: {
    type: Array,
    default: () => [
      { title: "How often do you ship motion?", options: ["Every day", "Every release", "Rarely"] },
      { title: "What slows you down the most?", options: ["Timing", "Accessibility", "Consistency"] },
    ],
  },
});
const emit = defineEmits(["complete"]);

const step = ref(0);
const answers = ref([]);
const done = computed(() => step.value >= props.questions.length);

function choose(option) {
  answers.value = [...answers.value, option];
  step.value += 1;
  if (answers.value.length >= props.questions.length) emit("complete", [...answers.value]);
}
function restart() {
  answers.value = [];
  step.value = 0;
}
</script>

<template>
  <div class="w-[300px] rounded-xl border bg-background p-4">
    <div class="flex items-center gap-1.5">
      <span
        v-for="(_, index) in questions"
        :key="index"
        class="h-1.5 rounded-full transition-all duration-300"
        :class="index <= step ? 'bg-foreground' : 'bg-border'"
        :style="{ width: index === Math.min(step, questions.length - 1) ? '20px' : '6px' }"
      />
      <span class="ml-auto text-[13px] text-muted-foreground">
        {{ Math.min(step + 1, questions.length) }} / {{ questions.length }}
      </span>
    </div>
    <Transition name="q" mode="out-in">
      <div v-if="done" key="done" class="pt-4">
        <p class="flex items-center gap-2 text-[14px] font-medium">
          <Check class="size-4" /> All set
        </p>
        <p class="mt-1 text-[13px] leading-5 text-muted-foreground">
          We picked {{ answers.length }} motion tokens for you.
        </p>
        <button
          type="button"
          class="mt-3 text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
          @click="restart"
        >
          Start again
        </button>
      </div>
      <div v-else :key="step" class="pt-4">
        <p class="text-[14px] font-medium">{{ questions[step]?.title }}</p>
        <div class="mt-3 space-y-1.5">
          <button
            v-for="(option, index) in questions[step]?.options"
            :key="option"
            type="button"
            class="q-option flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.985]"
            :style="{ animationDelay: `${index * 30}ms` }"
            @click="choose(option)"
          >
            {{ option }}
            <ChevronRight class="size-3.5" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.q-enter-active { animation: q-in 300ms cubic-bezier(0.25, 0.1, 0.35, 1) both; }
.q-leave-active { animation: q-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
.q-option { animation: q-option 220ms cubic-bezier(0.25, 0.1, 0.35, 1) both; }
@keyframes q-in { from { opacity: 0; transform: translateY(24px); filter: blur(5px); } }
@keyframes q-out { to { opacity: 0; transform: translateY(-24px); filter: blur(5px); } }
@keyframes q-option { from { opacity: 0; transform: translateY(4px); } }
@media (prefers-reduced-motion: reduce) {
  .q-enter-active, .q-leave-active, .q-option { animation: q-fade 150ms linear both; }
  @keyframes q-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
