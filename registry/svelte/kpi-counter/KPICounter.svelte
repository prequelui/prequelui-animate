<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    label,
    value,
    from = 0,
    prefix = undefined,
    suffix = undefined,
    decimals = 0,
    delta = undefined,
    deltaSuffix = "%",
    points = [18, 24, 21, 32, 29, 36, 34, 44, 48, 46, 57, 62],
    inView = true,
    hint = undefined,
    class: className = "",
    ...rest
  } = $props();

  const width = 240;
  const height = 62;
  const countSpring = {
    type: "spring",
    stiffness: 90,
    damping: 50,
    restDelta: 0.001,
    restSpeed: 0.01,
  };

  let root;
  let visual;
  let linePath;
  let areaPath;
  let deltaEl;
  let gradientId = $state("kpi-gradient");
  let seen = $state(!inView);
  const countState = { value: from };
  let observer;
  let countControls;
  const sparkControls = [];

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let up = $derived((delta ?? 0) >= 0);

  let geometry = $derived.by(() => {
    if (points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;
    const coords = points.map((point, index) => ({
      x: (index / (points.length - 1)) * width,
      y: height - 6 - ((point - min) / span) * (height - 14),
    }));
    const line = smoothPath(coords);
    const area = `${line} L ${width} ${height} L 0 ${height} Z`;
    return { line, area };
  });

  let finalText = $derived(formatNumber(value));

  function smoothPath(coords) {
    if (coords.length === 0) return "";
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let index = 0; index < coords.length - 1; index += 1) {
      const current = coords[index];
      const next = coords[index + 1];
      const midX = (current.x + next.x) / 2;
      d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }
    return d;
  }

  function formatNumber(current) {
    const fixed = Math.abs(current).toFixed(decimals);
    const sign = current < 0 && Number(fixed) !== 0 ? "-" : "";
    const [integer = "0", fraction] = fixed.split(".");
    const grouped = integer.replace(/\B(?=(\d{3})+$)/g, ",");
    return fraction ? `${sign}${grouped}.${fraction}` : `${sign}${grouped}`;
  }

  function writeCount(current) {
    if (visual) visual.textContent = formatNumber(current);
  }

  function animateCount() {
    if (!seen) return;
    countControls?.stop?.();
    if (reduce()) {
      countState.value = value;
      writeCount(countState.value);
      return;
    }
    countControls = animate(countState, { value }, {
      ...countSpring,
      onUpdate: () => writeCount(countState.value),
    });
  }

  function drawSparkline() {
    sparkControls.forEach((control) => control?.stop?.());
    sparkControls.length = 0;
    const line = linePath;
    if (!line) return;
    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    if (areaPath) areaPath.style.opacity = "0";
    if (!seen) return;

    if (areaPath) {
      sparkControls.push(
        animate(areaPath, { opacity: [0, 1] }, {
          duration: 0.45,
          ease: [0.23, 1, 0.32, 1],
        }),
      );
    }
    sparkControls.push(
      animate(
        line,
        { strokeDashoffset: [length, 0] },
        reduce()
          ? { duration: 0 }
          : { duration: 0.9, ease: [0.33, 0, 0.2, 1] },
      ),
    );
  }

  function activate() {
    animateCount();
    drawSparkline();
  }

  function animateDelta() {
    if (!deltaEl) return;
    if (reduce()) {
      deltaEl.style.opacity = "1";
      deltaEl.style.transform = "none";
      return;
    }
    animate(deltaEl, { opacity: [0, 1], y: [4, 0] }, {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1],
      delay: 0.15,
    });
  }

  let lastValue = value;

  $effect(() => {
    const current = value;
    if (current === lastValue) return;
    lastValue = current;
    if (seen) activate();
  });

  let lastPoints = JSON.stringify(points ?? []);

  $effect(() => {
    const snapshot = JSON.stringify(points ?? []);
    if (snapshot === lastPoints) return;
    lastPoints = snapshot;
    tick().then(() => drawSparkline());
  });

  let lastDecimals = decimals;

  $effect(() => {
    const current = decimals;
    if (current === lastDecimals) return;
    lastDecimals = current;
    writeCount(countState.value);
  });

  let lastDelta = delta;

  $effect(() => {
    const current = delta;
    if (current === lastDelta) return;
    lastDelta = current;
    if (current === undefined) return;
    tick().then(() => animateDelta());
  });

  onMount(() => {
    gradientId = `kpi-${Math.random().toString(36).slice(2, 8)}`;
    writeCount(countState.value);
    tick().then(() => {
      if (!inView) {
        seen = true;
        activate();
      } else if (root) {
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
        drawSparkline();
      }
      animateDelta();
    });
  });

  onDestroy(() => {
    observer?.disconnect();
    countControls?.stop?.();
    sparkControls.forEach((control) => control?.stop?.());
  });
</script>

<div
  bind:this={root}
  data-slot="kpi-counter"
  class={`flex w-full max-w-[300px] flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground ${className}`}
  {...rest}
>
  <div class="flex items-start justify-between gap-3">
    <div class="flex min-w-0 flex-col gap-1">
      <span class="truncate text-[13px] leading-4 text-muted-foreground">
        {label}
      </span>
      <span
        class="flex items-baseline gap-0.5 text-[32px] font-medium leading-none tracking-[-0.03em]"
      >
        {#if prefix}
          <span class="text-[20px] text-muted-foreground">{prefix}</span>
        {/if}
        <span
          bind:this={visual}
          aria-hidden="true"
          class="inline-block tabular-nums"
        ></span>
        <span class="sr-only">{finalText}</span>
        {#if suffix}
          <span class="text-[15px] font-normal text-muted-foreground">
            {suffix}
          </span>
        {/if}
      </span>
    </div>
    {#if delta !== undefined}
      <span
        bind:this={deltaEl}
        aria-hidden="true"
        class={`inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium tabular-nums ${
          up
            ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
            : "bg-rose-500/12 text-rose-600 dark:text-rose-400"
        }`}
        style="opacity: 0; transform: translateY(4px)"
      >
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" class="size-3">
          <path
            d={up ? "M3 9 9 3M4.4 3H9v4.6" : "M3 3l6 6M4.4 9H9V4.4"}
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {Math.abs(delta ?? 0)}{deltaSuffix}
      </span>
    {/if}
  </div>

  {#if geometry}
    <div class="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        class="h-[62px] w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.26" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path
          bind:this={areaPath}
          d={geometry.area}
          fill={`url(#${gradientId})`}
          stroke="none"
          style="opacity: 0"
        />
        <path
          bind:this={linePath}
          d={geometry.line}
          fill="none"
          stroke="currentColor"
          stroke-dasharray="0 9999"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  {/if}

  {#if hint}
    <p class="text-[13px] leading-4 text-muted-foreground">{hint}</p>
  {/if}
</div>
