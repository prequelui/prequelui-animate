<script>
  import { onMount, tick } from "svelte";

  let {
    theme = "light",
    resolvedTheme = "light",
    setTheme = undefined,
    direction = "ltr",
    onImmediateChange = undefined,
    tempo = 1,
    children = undefined,
  } = $props();

  const WIPE_DURATION = 700;
  const WIPE_EASING = "ease-in-out";
  const WIPE_TYPE = "prequel-theme-wipe";
  const WIPE_STYLE =
    "::view-transition-old(root), ::view-transition-new(root){animation:none;mix-blend-mode:normal;}" +
    `:root:active-view-transition-type(${WIPE_TYPE}) body, :root:active-view-transition-type(${WIPE_TYPE}) body *{view-transition-name:none !important;}`;

  const PLACEHOLDER = { effective: "system", resolved: "light" };

  let mounted = $state(false);
  let current = $state({
    effective: theme,
    resolved: resolvedTheme,
  });

  const pace = $derived(Math.max(0.4, tempo));
  const wipeDuration = $derived(WIPE_DURATION * pace);
  const state = $derived(mounted ? current : PLACEHOLDER);

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function systemResolved() {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function clipKeyframes(wipe) {
    switch (wipe) {
      case "rtl":
        return ["inset(0 0 0 100%)", "inset(0 0 0 0)"];
      case "ttb":
        return ["inset(0 0 100% 0)", "inset(0 0 0 0)"];
      case "btt":
        return ["inset(100% 0 0 0)", "inset(0 0 0 0)"];
      case "ltr":
      default:
        return ["inset(0 100% 0 0)", "inset(0 0 0 0)"];
    }
  }

  function startWipe(update) {
    if (typeof document === "undefined" || !document.startViewTransition) {
      return null;
    }
    try {
      return document.startViewTransition({ update, types: [WIPE_TYPE] });
    } catch {
      return document.startViewTransition(update);
    }
  }

  function applyTheme(next) {
    setTheme?.(next);
  }

  export function toggleTheme(next) {
    const resolved = next === "system" ? systemResolved() : next;
    current = { effective: next, resolved };
    onImmediateChange?.(next);

    if (next === "system" && resolved === resolvedTheme) {
      applyTheme(next);
      return;
    }

    if (reduce()) {
      current = { effective: next, resolved };
      applyTheme(next);
      return;
    }

    const transition = startWipe(async () => {
      current = { effective: next, resolved };
      document.documentElement.classList.toggle("dark", resolved === "dark");
      await tick();
    });

    if (!transition) {
      current = { effective: next, resolved };
      applyTheme(next);
      return;
    }

    const [fromClip, toClip] = clipKeyframes(direction);
    void transition.ready.then(() => {
      document.documentElement
        .animate(
          { clipPath: [fromClip, toClip] },
          {
            duration: wipeDuration,
            easing: WIPE_EASING,
            pseudoElement: "::view-transition-new(root)",
          },
        )
        .finished.finally(() => applyTheme(next));
    });
  }

  $effect(() => {
    current = {
      effective: theme,
      resolved: resolvedTheme,
    };
  });

  onMount(() => {
    mounted = true;
    const style = document.createElement("style");
    style.setAttribute("data-slot", "theme-toggler-style");
    style.textContent = WIPE_STYLE;
    document.head.appendChild(style);
    return () => style.remove();
  });
</script>

<span data-slot="theme-toggler" style="display:contents">
  {#if children}
    {@render children({
      effective: state.effective,
      resolved: state.resolved,
      toggleTheme,
    })}
  {/if}
</span>
