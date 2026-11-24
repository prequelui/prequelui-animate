<script>
  import { animate } from "motion";
  import { Monitor, Moon, Sun } from "lucide-svelte";

  let {
    theme = "light",
    resolvedTheme = "light",
    modes = ["light", "dark", "system"],
    onThemeChange = undefined,
    hoverScale = 1,
    tapScale = 0.97,
    transition = undefined,
    type = "button",
    disabled = false,
    onclick = undefined,
    class: className = "",
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
  let hovered = false;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const next = $derived.by(() => {
    let index = modes.indexOf(theme);
    if (index === -1) index = modes.indexOf(resolvedTheme);
    if (index === -1) return modes[0] ?? resolvedTheme;
    return modes[(index + 1) % modes.length];
  });

  const iconClass = (name) =>
    `absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
      theme === name
        ? "rotate-0 scale-100 opacity-100 blur-0"
        : "-rotate-90 scale-50 opacity-0 blur-[2px]"
    }`;

  function move(scale) {
    if (!button || reduce()) return;
    animate(button, { scale }, pressSpring);
  }

  function release() {
    move(hovered && hoverScale !== 1 ? hoverScale : 1);
  }
</script>

<button
  bind:this={button}
  {type}
  {disabled}
  data-slot="theme-toggler-button"
  data-theme={theme}
  aria-label={`Switch to ${next} theme`}
  class={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  onclick={(event) => {
    onclick?.(event);
    if (!event?.defaultPrevented) onThemeChange?.(next);
  }}
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
  <span class="relative inline-flex size-4 items-center justify-center">
    <Sun aria-hidden="true" class={iconClass("light")} />
    <Moon aria-hidden="true" class={iconClass("dark")} />
    <Monitor aria-hidden="true" class={iconClass("system")} />
  </span>
  {#if children}{@render children()}{:else}{theme}{/if}
</button>
