<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    value,
    size = 148,
    strokeWidth = 10,
    from = 0,
    label = undefined,
    showLabel = true,
    showTicks = true,
    ticks = 48,
    inView = true,
    color = "currentColor",
    trackColor = "currentColor",
    transition = undefined,
    class: className = "",
    style = undefined,
    ...rest
  } = $props();

  const arcSpring = {
    type: "spring",
    stiffness: 90,
    damping: 50,
    restDelta: 0.001,
  };
  const countSpring = {
    type: "spring",
    stiffness: 90,
    damping: 50,
    restDelta: 0.001,
    restSpeed: 0.01,
  };

  let root;
  let arc;
  let visual;
  let gradientId = $state("radial-gradient");
  let seen = $state(!inView);
  const countState = { value: from };
  const progressState = { p: 0 };
  let observer;
  let arcControls;
  let countControls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let safe = $derived(Math.min(100, Math.max(0, value)));
  let radius = $derived((size - strokeWidth) / 2);
  let center = $derived(size / 2);
  let tickCount = $derived(Math.max(4, Math.round(ticks)));

  let finalText = $derived(formatNumber(safe));

  let ticksList = $derived.by(() => {
    if (!showTicks) return [];
    return Array.from({ length: tickCount }, (_, index) => {
      const angle = (index / tickCount) * 360;
      const major = index % 6 === 0;
      const active = (index / tickCount) * 100 <= safe;
      const inner = radius + strokeWidth / 2 + 4;
      const outer = inner + (major ? 5 : 2.5);
      return { angle, major, active, inner, outer };
    });
  });

  function formatNumber(current) {
    const fixed = Math.abs(current).toFixed(0);
    const sign = current < 0 && Number(fixed) !== 0 ? "-" : "";
    return `${sign}${fixed.replace(/\B(?=(\d{3})+$)/g, ",")}`;
  }

  function writeCount(current) {
    if (visual) visual.textContent = formatNumber(current);
  }

  function circumference() {
    return 2 * Math.PI * radius;
  }

  function applyArc() {
    if (!arc) return;
    const total = circumference();
    arc.style.strokeDasharray = `${total}`;
    arc.style.strokeDashoffset = `${total * (1 - progressState.p)}`;
  }

  function drawArc() {
    arcControls?.stop?.();
    const total = circumference();
    if (arc) arc.style.strokeDasharray = `${total}`;
    if (!seen) {
      progressState.p = 0;
      applyArc();
      return;
    }
    if (reduce()) {
      progressState.p = safe / 100;
      applyArc();
      return;
    }
    arcControls = animate(progressState, { p: safe / 100 }, {
      ...(transition ?? arcSpring),
      onUpdate: applyArc,
    });
  }

  function animateCount() {
    if (!seen) return;
    countControls?.stop?.();
    if (reduce()) {
      countState.value = safe;
      writeCount(countState.value);
      return;
    }
    countControls = animate(countState, { value: safe }, {
      ...countSpring,
      onUpdate: () => writeCount(countState.value),
    });
  }

  function activate() {
    animateCount();
    drawArc();
  }

  let lastValue = value;

  $effect(() => {
    const current = value;
    if (current === lastValue) return;
    lastValue = current;
    if (seen) activate();
  });

  let lastFrom = from;

  $effect(() => {
    const current = from;
    if (current === lastFrom) return;
    lastFrom = current;
    countState.value = current;
    writeCount(current);
  });

  let lastGeometry = `${size}:${strokeWidth}`;

  $effect(() => {
    const key = `${size}:${strokeWidth}`;
    if (key === lastGeometry) return;
    lastGeometry = key;
    tick().then(() => {
      applyArc();
      if (seen) drawArc();
    });
  });

  onMount(() => {
    gradientId = `radial-${Math.random().toString(36).slice(2, 8)}`;
    writeCount(countState.value);
    applyArc();
    if (!inView) {
      seen = true;
      activate();
      return;
    }
    if (!root) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        seen = true;
        activate();
        observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
  });

  onDestroy(() => {
    observer?.disconnect();
    arcControls?.stop?.();
    countControls?.stop?.();
  });
</script>

<div
  bind:this={root}
  data-slot="radial-progress"
  role="progressbar"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={Math.round(safe)}
  aria-label={label ?? "Progress"}
  class={`relative inline-flex items-center justify-center ${className}`}
  style={`width: ${size}px; height: ${size}px; ${style ?? ""}`}
  {...rest}
>
  <svg
    width={size}
    height={size}
    viewBox={`0 0 ${size} ${size}`}
    class="-rotate-90"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color={color} stop-opacity="0.55" />
        <stop offset="100%" stop-color={color} stop-opacity="1" />
      </linearGradient>
    </defs>
    <circle
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke={trackColor}
      stroke-opacity="0.12"
      stroke-width={strokeWidth}
      stroke-linecap="round"
    />
    <circle
      bind:this={arc}
      cx={center}
      cy={center}
      r={radius}
      fill="none"
      stroke={`url(#${gradientId})`}
      stroke-width={strokeWidth}
      stroke-linecap="round"
      stroke-dasharray="0 9999"
    />
    {#each ticksList as tick, index (index)}
      <line
        x1={center}
        y1={center - tick.inner}
        x2={center}
        y2={center - tick.outer}
        stroke={color}
        stroke-opacity={tick.active ? 0.5 : 0.14}
        stroke-width={tick.major ? 1.4 : 1}
        stroke-linecap="round"
        transform={`rotate(${tick.angle} ${center} ${center})`}
      />
    {/each}
  </svg>
  <div
    class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center"
  >
    <span
      bind:this={visual}
      aria-hidden="true"
      class="inline-block font-medium leading-none tracking-[-0.04em] tabular-nums"
      style={`font-size: ${Math.max(22, Math.round(size * 0.25))}px`}
    ></span>
    <span class="sr-only">{finalText}</span>
    {#if showLabel}
      <span class="text-[13px] leading-4 text-muted-foreground">
        {label ?? "complete"}
      </span>
    {/if}
  </div>
</div>
