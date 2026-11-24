<script>
  import { onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    variant = "ring",
    color = "currentColor",
    size = 100,
    duration = 400,
    disabled = false,
    scope = undefined,
    ...rest
  } = $props();

  let items = $state([]);
  let mounted = $state(false);
  const timers = new Set();
  let nextId = 0;
  let controls = [];
  const uid = Math.random().toString(36).slice(2, 8);

  const crossDirections = [
    { dx: 1, dy: 0, rotate: 0 },
    { dx: -1, dy: 0, rotate: 0 },
    { dx: 0, dy: -1, rotate: 90 },
    { dx: 0, dy: 1, rotate: 90 },
  ];

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function ringGeometry(item) {
    const end = Math.max(item.size / 1.5, 50);
    return {
      end,
      start: Math.max(end * 0.2, 12),
      stroke: Math.max(end * 0.05, 2.5),
    };
  }

  function crossGeometry(item) {
    const distance = Math.max(item.size * 0.65, 56);
    const gap = Math.max(item.size * 0.05, 3);
    const lengthStart = Math.max(item.size * 0.26, 16);
    const lengthEnd = Math.max(lengthStart * 0.55, 6);
    const strokeWidth = Math.max(item.size * 0.065, 2);
    const half = distance + gap + lengthStart;
    return { distance, gap, lengthStart, lengthEnd, strokeWidth, half };
  }

  function burstGeometry(item) {
    const start = Math.max(item.size * 0.4, 36);
    const end = Math.max(item.size * 0.65, 56);
    const lengthStart = Math.max(item.size * 0.2, 14);
    const lengthEnd = Math.max(lengthStart * 0.5, 6);
    const strokeWidth = Math.max(item.size * 0.05, 1.5);
    const half = end + lengthStart;
    return { start, end, lengthStart, lengthEnd, strokeWidth, half };
  }

  function particleGeometry(item) {
    const dot = Math.max(item.size * 0.025, 2.5);
    const radius = item.size * 0.35;
    return { dot, radius, half: radius + dot * 2 };
  }

  function rootStyle(item) {
    const base = "position:fixed;overflow:visible;";

    if (item.variant === "ripple") {
      return `${base}left:${item.x - item.size / 2}px;top:${item.y - item.size / 2}px;width:${item.size}px;height:${item.size}px`;
    }

    if (item.variant === "ring") {
      const ring = ringGeometry(item);
      return `${base}left:${item.x - ring.end / 2}px;top:${item.y - ring.end / 2}px;width:${ring.end}px;height:${ring.end}px`;
    }

    if (item.variant === "crosshair") {
      const cross = crossGeometry(item);
      return `${base}left:${item.x - cross.half}px;top:${item.y - cross.half}px;width:${cross.half * 2}px;height:${cross.half * 2}px;transform:rotate(-25deg)`;
    }

    if (item.variant === "burst") {
      const burst = burstGeometry(item);
      return `${base}left:${item.x - burst.half}px;top:${item.y - burst.half}px;width:${burst.half * 2}px;height:${burst.half * 2}px`;
    }

    const dot = particleGeometry(item);
    return `${base}left:${item.x - dot.half}px;top:${item.y - dot.half}px;width:${dot.half * 2}px;height:${dot.half * 2}px`;
  }

  function ringPartStyle(item) {
    const ring = ringGeometry(item);
    return `width:100%;height:100%;border-radius:9999px;border-style:solid;border-color:${item.color};border-width:${ring.stroke}px;transform:scale(${ring.start / ring.end})`;
  }

  function crossPartStyle(item) {
    const cross = crossGeometry(item);
    return `position:absolute;left:50%;top:50%;width:${cross.lengthStart}px;height:${cross.strokeWidth}px;margin-left:${-cross.lengthStart / 2}px;margin-top:${-cross.strokeWidth / 2}px;background:${item.color};border-radius:9999px`;
  }

  function burstPartStyle(item) {
    const burst = burstGeometry(item);
    return `position:absolute;left:50%;top:50%;width:${burst.lengthStart}px;height:${burst.strokeWidth}px;margin-left:${-burst.lengthStart / 2}px;margin-top:${-burst.strokeWidth / 2}px;background:${item.color};border-radius:9999px`;
  }

  function particlePartStyle(item) {
    const dot = particleGeometry(item);
    return `position:absolute;left:50%;top:50%;width:${dot.dot}px;height:${dot.dot}px;margin-left:${-dot.dot / 2}px;margin-top:${-dot.dot / 2}px;border-radius:9999px;background:${item.color};opacity:0`;
  }

  function animateItem(item) {
    const node = document.querySelector(
      `[data-click-id="${uid}-${item.id}"]`,
    );
    if (!node) return;
    const parts = Array.from(node.querySelectorAll("[data-part]"));
    const seconds = item.duration / 1000;

    if (item.variant === "ripple") {
      for (const part of parts) {
        controls.push(
          animate(
            part,
            { opacity: [0.9, 0], scale: [0.2, 1] },
            { duration: seconds, ease: "easeOut" },
          ),
        );
      }
      return;
    }

    if (item.variant === "ring") {
      const ring = ringGeometry(item);
      for (const part of parts) {
        controls.push(
          animate(
            part,
            {
              scale: [ring.start / ring.end, 1],
              borderWidth: [ring.stroke, 0],
              opacity: [1, 0.9, 0],
            },
            { duration: seconds, ease: "easeOut" },
          ),
        );
      }
      return;
    }

    if (item.variant === "crosshair") {
      const cross = crossGeometry(item);
      parts.forEach((part, index) => {
        const direction = crossDirections[index] ?? crossDirections[0];
        controls.push(
          animate(
            part,
            {
              x: [direction.dx * cross.gap, direction.dx * cross.distance],
              y: [direction.dy * cross.gap, direction.dy * cross.distance],
              rotate: direction.rotate,
              scale: [1, 0],
              opacity: [1, 0],
            },
            { duration: seconds, ease: [0, 0, 0.7, 1] },
          ),
        );
      });
      return;
    }

    if (item.variant === "burst") {
      const burst = burstGeometry(item);
      const total = 8;
      parts.forEach((part, index) => {
        const angle = (index / total) * Math.PI * 2;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        controls.push(
          animate(
            part,
            {
              x: [dx * burst.start, dx * burst.end],
              y: [dy * burst.start, dy * burst.end],
              rotate: (angle * 180) / Math.PI,
              scaleX: [1, burst.lengthEnd / burst.lengthStart],
              opacity: [1, 1, 0],
            },
            { duration: seconds, ease: "easeInOut" },
          ),
        );
      });
      return;
    }

    const dot = particleGeometry(item);
    const total = 8;
    parts.forEach((part, index) => {
      const angle = (index / total) * Math.PI * 2;
      controls.push(
        animate(
          part,
          {
            x: Math.cos(angle) * dot.radius,
            y: Math.sin(angle) * dot.radius,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          },
          {
            duration: seconds,
            delay: index * seconds * 0.06,
            ease: "easeOut",
          },
        ),
      );
    });
  }

  async function add(event) {
    if (disabled || reduce()) return;

    const target =
      typeof scope === "function"
        ? scope()
        : scope?.current ?? scope;

    if (target && target !== document) {
      const rect = target.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        return;
      }
    }

    const id = nextId;
    nextId += 1;
    const item = {
      id,
      x: event.clientX,
      y: event.clientY,
      variant,
      color,
      size,
      duration,
    };
    items = [...items, item];

    await tick();
    animateItem(item);

    const timer = window.setTimeout(() => {
      timers.delete(timer);
      items = items.filter((entry) => entry.id !== id);
    }, duration + 320);
    timers.add(timer);
  }

  function portal(node) {
    if (typeof document !== "undefined") document.body.appendChild(node);
    return {
      destroy() {
        node.remove();
      },
    };
  }

  onMount(() => {
    mounted = true;
    document.addEventListener("pointerup", add, { passive: true });
    return () => {
      document.removeEventListener("pointerup", add);
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
      for (const control of controls) control?.stop?.();
      controls = [];
    };
  });
</script>

<span data-slot="click" style="display:contents" {...rest}>
  <slot />
</span>
{#if mounted}
  <div
    use:portal
    aria-hidden="true"
    style="position:fixed;inset:0;pointer-events:none;z-index:9999"
  >
    {#each items as item (item.id)}
      <div data-click-id={`${uid}-${item.id}`} style={rootStyle(item)}>
        {#if item.variant === "ripple"}
          <span
            data-part
            style={`display:block;width:100%;height:100%;border-radius:9999px;background:${item.color};box-shadow:inset 0 0 0 2px ${item.color}`}
          ></span>
        {:else if item.variant === "ring"}
          <span data-part style={ringPartStyle(item)}></span>
        {:else if item.variant === "crosshair"}
          {#each crossDirections as direction, index (index)}
            <span data-part style={crossPartStyle(item)}></span>
          {/each}
        {:else if item.variant === "burst"}
          {#each Array.from({ length: 8 }) as _, index (index)}
            <span data-part style={burstPartStyle(item)}></span>
          {/each}
        {:else}
          {#each Array.from({ length: 8 }) as _, index (index)}
            <span data-part style={particlePartStyle(item)}></span>
          {/each}
        {/if}
      </div>
    {/each}
  </div>
{/if}
