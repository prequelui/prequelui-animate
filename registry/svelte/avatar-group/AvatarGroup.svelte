<script>
  import { onDestroy, tick } from "svelte";
  import { animate } from "motion";

  const fallbackAvatars = [
    { name: "Mina", color: "from-rose-300 to-orange-200" },
    { name: "Theo", color: "from-sky-300 to-indigo-200" },
    { name: "Iris", color: "from-emerald-300 to-lime-200" },
    { name: "Noé", color: "from-amber-300 to-pink-200" },
  ];

  let {
    avatars = fallbackAvatars,
    invertOverlap = false,
    tooltipSideOffset = 8,
    class: className = "",
    ...rest
  } = $props();

  const avatarSpring = { type: "spring", stiffness: 300, damping: 17 };
  const popSpring = { type: "spring", stiffness: 400, damping: 29 };

  let root;
  let tip;
  let hovered = $state(null);
  let center = $state(0);
  let showTip = $state(false);
  let liftControls = [];
  let tipControls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function lift() {
    liftControls.forEach((control) => control.stop?.());
    liftControls = [];
    if (!root) return;
    const nodes = root.querySelectorAll("[data-avatar]");
    nodes.forEach((element, index) => {
      const up = hovered === index && !reduce();
      liftControls.push(
        animate(
          element,
          { y: up ? "-30%" : "0%" },
          reduce() ? { duration: 0 } : avatarSpring,
        ),
      );
    });
  }

  async function enter(index, event) {
    const element = event.currentTarget;
    if (root && element) {
      const groupRect = root.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      center = rect.left - groupRect.left + rect.width / 2;
    }

    if (hovered !== index) {
      hovered = index;
      lift();
    }

    if (showTip) return;
    showTip = true;
    await tick();
    if (!tip) return;
    tipControls?.stop?.();
    if (reduce()) {
      tip.style.opacity = "1";
      return;
    }
    tip.style.opacity = "0";
    tipControls = animate(
      tip,
      { opacity: [0, 1], scale: [0.9, 1], filter: ["blur(4px)", "blur(0px)"] },
      popSpring,
    );
  }

  function leaveGroup() {
    hovered = null;
    lift();
    if (!tip) {
      showTip = false;
      return;
    }
    tipControls?.stop?.();
    if (reduce()) {
      showTip = false;
      return;
    }
    tipControls = animate(tip, { opacity: 0, scale: 0.95 }, { duration: 0.12 });
    tipControls.finished.then(() => {
      if (hovered === null) showTip = false;
    });
  }

  onDestroy(() => {
    liftControls.forEach((control) => control.stop?.());
    tipControls?.stop?.();
  });
</script>

<div
  bind:this={root}
  data-slot="avatar-group"
  class={`relative inline-flex items-end ${className}`}
  onpointerleave={leaveGroup}
  {...rest}
>
  <div class="flex -space-x-3">
    {#each avatars as avatar, index (avatar.id ?? avatar.name ?? index)}
      <span
        data-avatar
        role="img"
        aria-label={avatar.name}
        tabindex="0"
        style={`z-index:${invertOverlap ? 20 - index : index}`}
        class={`relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br text-[13px] font-medium text-black/70 outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${avatar.color || "from-rose-300 to-orange-200"}`}
        onpointerenter={(event) => enter(index, event)}
        onfocus={(event) => enter(index, event)}
      >
        {#if avatar.src}
          <img src={avatar.src} alt="" class="size-full object-cover" />
        {:else}
          {avatar.name.slice(0, 1)}
        {/if}
      </span>
    {/each}
  </div>

  {#if showTip}
    <span
      bind:this={tip}
      role="tooltip"
      style={`left:${center}px;bottom:calc(100% + ${tooltipSideOffset}px);translate:-50% 0;opacity:0`}
      class="pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md"
    >
      {hovered !== null ? avatars[hovered]?.name : ""}
    </span>
  {/if}
</div>
