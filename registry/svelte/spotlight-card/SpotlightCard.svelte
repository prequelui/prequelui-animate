<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    color = "rgba(255,255,255,0.16)",
    size = 280,
    intensity = 1,
    alwaysOn = false,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let light;
  let active = $state(alwaysOn);
  let position = { x: 0, y: 0 };
  let follow;
  let fade;

  const gradient = $derived(
    `radial-gradient(${size}px circle at 50% 50%, ${color}, transparent 68%)`,
  );

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyPosition() {
    if (!light) return;
    light.style.background = `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${color}, transparent 68%)`;
  }

  function moveTo(x, y) {
    follow?.stop?.();
    follow = animate(position, { x, y }, {
      type: "spring",
      stiffness: 260,
      damping: 34,
      mass: 0.5,
      onUpdate: applyPosition,
    });
  }

  function update(event) {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top);
  }

  function updateOpacity() {
    if (!light) return;
    fade?.stop?.();
    fade = animate(
      light,
      {
        opacity:
          active && !reduce()
            ? intensity
            : alwaysOn
              ? intensity
              : 0,
      },
      { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
    );
  }

  function move(event) {
    if (event.pointerType === "touch") return;
    update(event);
  }

  function enter(event) {
    if (reduce() || event.pointerType === "touch") return;
    update(event);
    active = true;
  }

  function leave() {
    if (alwaysOn) return;
    active = false;
  }

  let previousAlwaysOn = alwaysOn;

  $effect(() => {
    active;
    updateOpacity();
  });

  $effect(() => {
    const value = alwaysOn;
    if (value === previousAlwaysOn) return;
    previousAlwaysOn = value;
    active = value;
  });

  onMount(() => {
    if (alwaysOn && root) {
      const rect = root.getBoundingClientRect();
      position.x = rect.width / 2;
      position.y = rect.height / 2;
      applyPosition();
    }
    updateOpacity();
    return () => {
      follow?.stop?.();
      fade?.stop?.();
    };
  });
</script>

<div
  bind:this={root}
  data-slot="spotlight-card"
  data-active={active ? "true" : "false"}
  class={`relative isolate overflow-hidden rounded-xl border bg-card text-card-foreground ${className}`}
  onpointermove={move}
  onpointerenter={enter}
  onpointerleave={leave}
  {...rest}
>
  <span
    bind:this={light}
    aria-hidden="true"
    data-slot="spotlight-card-light"
    class="pointer-events-none absolute -inset-px z-0 rounded-[inherit]"
    style={`background:${gradient};opacity:0`}
  ></span>
  <span
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_38%)]"
  ></span>
  <div class="relative z-10">
    <slot />
  </div>
</div>
