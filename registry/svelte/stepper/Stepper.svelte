<script>
  import { tick } from "svelte";
  import { animate } from "motion";

  const fallbackSteps = [
    {
      id: "account",
      title: "Account",
      description: "Your details",
      content: "Create your account. Use an email you can access. You can change it later.",
    },
    {
      id: "workspace",
      title: "Workspace",
      description: "Name and invite",
      content: "Set up the workspace. Invite a teammate or start on your own.",
    },
    {
      id: "ready",
      title: "Ready",
      description: "Start building",
      content: "Everything is ready. Your first project is waiting on the dashboard.",
    },
  ];

  let {
    steps = fallbackSteps,
    value = undefined,
    defaultValue = 0,
    onValueChange = undefined,
    controls = true,
    backLabel = "Back",
    nextLabel = "Continue",
    finishLabel = "Finish",
    onComplete = undefined,
    minHeight = 112,
    class: className = "",
    children = undefined,
    ...rest
  } = $props();

  const clamp = (value, max) => Math.min(max, Math.max(0, value));
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let internal = $state(
    clamp(defaultValue, Math.max(0, steps.length - 1)),
  );
  const current = $derived(
    clamp(value ?? internal, Math.max(0, steps.length - 1)),
  );
  const last = $derived(Math.max(0, steps.length - 1));
  const currentStep = $derived(steps[current]);

  let displayed = $state(current);
  const shownStep = $derived(steps[displayed]);
  let panel;
  let panelControls = [];
  let transitioning = false;
  let queued = null;

  function stopPanel() {
    panelControls.forEach((control) => control.stop?.());
    panelControls = [];
  }

  async function transitionTo(target) {
    if (transitioning) {
      queued = target;
      return;
    }
    if (!panel) {
      displayed = target;
      return;
    }

    transitioning = true;
    const direction = target >= displayed ? 1 : -1;
    const rest = reduce();
    stopPanel();

    try {
      if (rest) {
        await animate(panel, { opacity: [1, 0] }, { duration: 0.15 }).finished;
        displayed = target;
        await tick();
        if (panel) {
          await animate(
            panel,
            { opacity: [0, 1] },
            { duration: 0.15 },
          ).finished;
        }
      } else {
        await animate(
          panel,
          {
            opacity: [1, 0],
            x: [0, direction * -18],
            filter: ["blur(0px)", "blur(2px)"],
          },
          { duration: 0.26, ease: [0.23, 1, 0.32, 1] },
        ).finished;
        displayed = target;
        await tick();
        if (panel) {
          await animate(
            panel,
            {
              opacity: [0, 1],
              x: [direction * 18, 0],
              filter: ["blur(3px)", "blur(0px)"],
            },
            { duration: 0.26, ease: [0.23, 1, 0.32, 1] },
          ).finished;
        }
      }
    } finally {
      transitioning = false;
      if (queued !== null) {
        const next = queued;
        queued = null;
        if (next !== displayed) transitionTo(next);
      }
    }
  }

  $effect(() => {
    const target = current;
    if (target === displayed) return;
    transitionTo(target);
  });

  function go(next) {
    const safe = clamp(next, last);
    if (safe === current) return;
    if (value === undefined) internal = safe;
    onValueChange?.(safe);
  }

  function complete() {
    if (current === last) onComplete?.();
    else go(current + 1);
  }

  function badgeClass(index) {
    if (index < current)
      return "border-primary bg-primary text-primary-foreground";
    if (index === current)
      return "border-primary bg-background text-foreground";
    return "border-border bg-muted/40 text-muted-foreground";
  }

  function isReduced() {
    return reduce();
  }
</script>

<div
  data-slot="stepper"
  class={`w-full max-w-[440px] ${className}`}
  {...rest}
>
  <ol class="flex w-full items-start" aria-label="Progress">
    {#each steps as item, index (item.id)}
      <li class="relative flex min-w-0 flex-1 flex-col items-center">
        {#if index < steps.length - 1}
          <span
            aria-hidden="true"
            class="absolute left-1/2 top-[15px] -ml-px h-px w-full overflow-hidden bg-border"
          >
            <span
              class="block h-full w-full origin-left bg-primary transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0,0.1,1)] motion-reduce:transition-none"
              style={`transform:scaleX(${index < current ? 1 : 0})`}
            ></span>
          </span>
        {/if}
        <button
          type="button"
          aria-current={index === current ? "step" : undefined}
          aria-label={`Step ${index + 1}: ${item.title}`}
          class="group relative z-10 flex flex-col items-center gap-2 rounded-lg px-1 py-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          onclick={() => go(index)}
        >
          <span
            class={`flex size-[30px] items-center justify-center rounded-full border text-[13px] font-medium transition-[color,background-color,border-color,transform] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none ${badgeClass(index)}`}
            style={`transform:scale(${index === current && !isReduced() ? 1.08 : 1})`}
          >
            {#if index < current}
              <svg
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
            {:else}
              {index + 1}
            {/if}
          </span>
          <span class="flex min-w-0 flex-col">
            <span
              class={`truncate text-[13px] leading-4 ${index <= current ? "font-medium text-foreground" : "text-muted-foreground"}`}
            >
              {item.title}
            </span>
            {#if item.description}
              <span
                class="mt-0.5 hidden truncate text-[13px] leading-4 text-muted-foreground sm:block"
              >
                {item.description}
              </span>
            {/if}
          </span>
        </button>
      </li>
    {/each}
  </ol>

  <div
    class="relative mt-6 overflow-hidden rounded-xl border bg-background"
    style={`min-height:${minHeight}px`}
  >
    <div
      bind:this={panel}
      role="region"
      aria-live="polite"
      aria-label={shownStep ? `${shownStep.title} step` : undefined}
      class="p-4 text-[13px] leading-5 text-muted-foreground"
    >
      {#if children}
        {@render children({ step: shownStep, index: displayed })}
      {:else if shownStep?.content}
        {#if typeof shownStep.content === "string"}
          <p>{shownStep.content}</p>
        {:else}
          {@render shownStep.content()}
        {/if}
      {:else}
        <p class="text-foreground">{shownStep?.title}</p>
      {/if}
    </div>
  </div>

  {#if controls}
    <div class="mt-4 flex items-center justify-between gap-3">
      <button
        type="button"
        disabled={current === 0}
        class="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[13px] font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        onclick={() => go(current - 1)}
      >
        {backLabel}
      </button>
      <span class="text-[13px] tabular-nums text-muted-foreground">
        {Math.min(current + 1, steps.length)} / {steps.length}
      </span>
      <button
        type="button"
        class="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        onclick={complete}
      >
        {current === last ? finishLabel : nextLabel}
      </button>
    </div>
  {/if}
</div>

<style>
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
