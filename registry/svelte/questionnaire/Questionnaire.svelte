<script>
  import { Check, ChevronRight } from "lucide-svelte";

  let {
    questions = [
      { title: "How often do you ship motion?", options: ["Every day", "Every release", "Rarely"] },
      { title: "What slows you down the most?", options: ["Timing", "Accessibility", "Consistency"] },
    ],
    onComplete = undefined,
  } = $props();

  let step = $state(0);
  let answers = $state([]);
  const done = $derived(step >= questions.length);

  function choose(option) {
    answers = [...answers, option];
    step += 1;
    if (answers.length >= questions.length) onComplete?.([...answers]);
  }
  function restart() {
    answers = [];
    step = 0;
  }
</script>

<div class="w-[300px] rounded-xl border bg-background p-4">
  <div class="flex items-center gap-1.5">
    {#each questions as _, index}
      <span
        class="h-1.5 rounded-full transition-all duration-300"
        class:bg-foreground={index <= step}
        class:bg-border={index > step}
        style={`width:${index === Math.min(step, questions.length - 1) ? 20 : 6}px`}
      ></span>
    {/each}
    <span class="ml-auto text-[13px] text-muted-foreground">
      {Math.min(step + 1, questions.length)} / {questions.length}
    </span>
  </div>
  {#key step}
    {#if done}
      <div class="q-panel pt-4">
        <p class="flex items-center gap-2 text-[14px] font-medium">
          <Check class="size-4" /> All set
        </p>
        <p class="mt-1 text-[13px] leading-5 text-muted-foreground">
          We picked {answers.length} motion tokens for you.
        </p>
        <button
          type="button"
          class="mt-3 text-[13px] text-muted-foreground underline underline-offset-4 hover:text-foreground"
          onclick={restart}
        >
          Start again
        </button>
      </div>
    {:else}
      <div class="q-panel pt-4">
        <p class="text-[14px] font-medium">{questions[step]?.title}</p>
        <div class="mt-3 space-y-1.5">
          {#each questions[step]?.options ?? [] as option, index}
            <button
              type="button"
              class="q-option flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground active:scale-[0.985]"
              style={`animation-delay:${index * 30}ms`}
              onclick={() => choose(option)}
            >
              {option}
              <ChevronRight class="size-3.5" />
            </button>
          {/each}
        </div>
      </div>
    {/if}
  {/key}
</div>

<style>
  .q-panel { animation: q-in 300ms cubic-bezier(0.25, 0.1, 0.35, 1) both; }
  .q-option { animation: q-option 220ms cubic-bezier(0.25, 0.1, 0.35, 1) both; }
  @keyframes q-in { from { opacity: 0; transform: translateY(24px); filter: blur(5px); } }
  @keyframes q-option { from { opacity: 0; transform: translateY(4px); } }
  @media (prefers-reduced-motion: reduce) {
    .q-panel, .q-option { animation: q-fade 150ms linear both; }
    @keyframes q-fade { from { opacity: 0; } }
  }
</style>
