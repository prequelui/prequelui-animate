<script>
  import { cubicBezier } from "motion";
  import { Check, X } from "lucide-svelte";

  let {
    trigger = "Show toast",
    title = "Changes saved",
    description = "",
    duration = 5000,
  } = $props();

  let toasts = $state([]);
  const timers = new Map();
  const ease = cubicBezier(0.34, 1.36, 0.64, 1);
  const easeAway = cubicBezier(0.33, 0.17, 0.67, 0.5);

  function dismiss(id) {
    const timer = timers.get(id);
    if (timer) clearTimeout(timer);
    timers.delete(id);
    toasts = toasts.filter((toast) => toast.id !== id);
  }
  function add() {
    const id = Date.now();
    toasts = [...toasts, { id, title, description }].slice(-4);
    timers.set(id, setTimeout(() => dismiss(id), duration));
  }
  function enter(node) {
    return {
      duration: 320,
      easing: ease,
      css: (t) =>
        `opacity:${t};transform:translate(-50%,${24 * (1 - t)}px) scale(${0.96 + 0.04 * t});filter:blur(${4 * (1 - t)}px);`,
    };
  }
  function leave(node) {
    return {
      duration: 200,
      easing: easeAway,
      css: (t) =>
        `opacity:${t};transform:translate(-50%,${12 * (1 - t)}px) scale(${0.96 + 0.04 * t});filter:blur(${4 * (1 - t)}px);`,
    };
  }
</script>

<div class="flex w-full max-w-[420px] flex-col items-center gap-4">
  <button
    type="button"
    class="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background"
    onclick={add}
  >
    {trigger}
  </button>
  <div class="relative h-[96px] w-full">
    {#each toasts as toast (toast.id)}
      <div
        class="absolute bottom-4 left-1/2 flex w-[280px] -translate-x-1/2 items-center gap-2 rounded-xl border bg-popover px-3 py-2.5 text-[13px] shadow-lg"
        in:enter
        out:leave
      >
        <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f9d63] text-white">
          <Check class="size-3" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate">{toast.title}</span>
          {#if toast.description}
            <span class="mt-0.5 block truncate text-[12px] text-muted-foreground">{toast.description}</span>
          {/if}
        </span>
        <button
          type="button"
          aria-label="Dismiss"
          class="shrink-0 text-muted-foreground hover:text-foreground"
          onclick={() => dismiss(toast.id)}
        >
          <X class="size-3.5" />
        </button>
      </div>
    {/each}
  </div>
</div>
