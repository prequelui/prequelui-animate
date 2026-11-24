<script>
  import { onDestroy } from "svelte";
  import { animate } from "motion";
  import { Check, Copy } from "lucide-svelte";

  let {
    content = "",
    copied = undefined,
    defaultCopied = false,
    delay = 3000,
    onCopiedChange = undefined,
    hoverScale = 1,
    tapScale = 0.97,
    transition = undefined,
    type = "button",
    disabled = false,
    class: className = "",
    onclick = undefined,
    children = undefined,
    ...rest
  } = $props();

  const pressSpring = transition ?? {
    type: "spring",
    stiffness: 550,
    damping: 30,
    restSpeed: 10,
  };

  let button;
  let inner = $state(defaultCopied);
  let hovered = false;
  let timer;
  const isCopied = $derived(copied === undefined ? inner : copied);

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function move(scale) {
    if (!button || reduce()) return;
    animate(button, { scale }, pressSpring);
  }

  function release() {
    move(hovered && hoverScale !== 1 ? hoverScale : 1);
  }

  function setCopied(value) {
    if (copied === undefined) inner = value;
    onCopiedChange?.(value, content);
  }

  function handleClick(event) {
    onclick?.(event);
    if (event?.defaultPrevented || !content || isCopied) return;
    const done = () => {
      setCopied(true);
      clearTimeout(timer);
      timer = setTimeout(() => setCopied(false), delay);
    };
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(content).then(done, done);
    } else {
      done();
    }
  }

  onDestroy(() => clearTimeout(timer));
</script>

<button
  bind:this={button}
  data-slot="copy-button"
  data-copied={isCopied ? "" : undefined}
  {type}
  {disabled}
  class={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  onclick={handleClick}
  onpointerdown={() => !disabled && move(tapScale)}
  onpointerup={release}
  onpointercancel={release}
  onpointerenter={() => {
    hovered = true;
    if (hoverScale !== 1) move(hoverScale);
  }}
  onpointerleave={() => {
    hovered = false;
    move(1);
  }}
  {...rest}
>
  <span data-slot="copy-button-icon" class="relative inline-flex size-4 items-center justify-center">
    <Copy
      aria-hidden="true"
      class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none {isCopied
        ? 'scale-50 opacity-0 blur-[2px]'
        : 'scale-100 opacity-100 blur-0'}"
    />
    <Check
      aria-hidden="true"
      class="absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none {isCopied
        ? 'scale-100 opacity-100 blur-0'
        : 'scale-50 opacity-0 blur-[2px]'}"
    />
  </span>
  {#if children}{@render children()}{:else}{isCopied ? "Copied" : "Copy"}{/if}
</button>
