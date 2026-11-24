<script>
  import { onMount } from "svelte";

  const CELL = 14;

  let {
    speed = 1,
    paused = false,
    levels = 14,
    scale = 1,
    peak = 1,
    interactive = true,
    lineColor = undefined,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let canvas;

  let inView = $state(false);
  let pageVisible = $state(true);
  let reduce = $state(false);

  const playing = $derived(inView && pageVisible && !reduce && !paused);

  const ripples = [];
  const pointer = {
    x: 0,
    y: 0,
    hx: 0,
    hy: 0,
    raised: 0,
    raisedTarget: 0,
    placed: false,
  };
  let time = 0;
  let last = 0;
  let waited = 0;
  let frame = 0;

  function contour(path, x, y, size, a, b, c, d, level) {
    const top = () => [x + ((level - a) / (b - a)) * size, y];
    const right = () => [x + size, y + ((level - b) / (c - b)) * size];
    const bottom = () => [x + ((level - d) / (c - d)) * size, y + size];
    const left = () => [x, y + ((level - a) / (d - a)) * size];
    const line = (p, q) => {
      path.moveTo(p[0], p[1]);
      path.lineTo(q[0], q[1]);
    };

    const code =
      (a > level ? 8 : 0) |
      (b > level ? 4 : 0) |
      (c > level ? 2 : 0) |
      (d > level ? 1 : 0);
    switch (code) {
      case 0:
      case 15:
        return;
      case 1:
      case 14:
        line(left(), bottom());
        return;
      case 2:
      case 13:
        line(bottom(), right());
        return;
      case 3:
      case 12:
        line(left(), right());
        return;
      case 4:
      case 11:
        line(top(), right());
        return;
      case 6:
      case 9:
        line(top(), bottom());
        return;
      case 7:
      case 8:
        line(left(), top());
        return;
      default: {
        const center = (a + b + c + d) / 4;
        if ((code === 5) === center > level) {
          line(left(), top());
          line(bottom(), right());
        } else {
          line(left(), bottom());
          line(top(), right());
        }
      }
    }
  }

  function draw(at) {
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width < 2 || height < 2) return;
    const dpr = canvas.width / Math.max(1, width);
    const cols = Math.ceil(width / CELL) + 1;
    const rows = Math.ceil(height / CELL) + 1;
    const field = new Float32Array(cols * rows);
    const feature = 170 * Math.max(0.2, scale);
    const tz = at * 0.00008 * Math.max(0.1, speed);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < cols; column++) {
        const x = column * CELL;
        const y = row * CELL;
        const nx = x / feature;
        const ny = y / feature;
        let value =
          Math.sin(nx * 1.7 + tz) * 0.55 +
          Math.sin(ny * 2.1 - tz * 0.8) * 0.45 +
          Math.sin((nx + ny) * 1.15 + tz * 0.55) * 0.3 +
          Math.sin(nx * 3.1 - ny * 2.3 + tz * 1.3) * 0.18;
        value /= 1.48;
        if (pointer.raised > 0.001) {
          const distance = Math.hypot(x - pointer.hx, y - pointer.hy);
          value += pointer.raised * peak * 0.9 * Math.exp(-distance / 100);
        }
        for (const ripple of ripples) {
          const progress = Math.min(1, Math.max(0, (at - ripple.start) / 2600));
          const reach = Math.hypot(width, height) * 0.8;
          const distance = Math.hypot(x - ripple.x, y - ripple.y) - progress * reach;
          value +=
            0.75 *
            (1 - progress) *
            Math.cos((distance / 58) * 1.8) *
            Math.exp(-(distance * distance) / (2 * 58 * 58));
        }
        field[row * cols + column] = value;
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const color =
      lineColor ??
      getComputedStyle(root).color ??
      (document.documentElement.classList.contains("dark")
        ? "#e5e5e5"
        : "#1c1c1c");
    const count = Math.max(4, Math.round(levels));
    const step = 1.8 / count;
    const minor = new Path2D();
    const major = new Path2D();

    for (let levelIndex = -count; levelIndex <= count; levelIndex++) {
      const level = levelIndex * step;
      const path = levelIndex % 5 === 0 ? major : minor;
      for (let row = 0; row < rows - 1; row++) {
        for (let column = 0; column < cols - 1; column++) {
          const a = field[row * cols + column];
          const b = field[row * cols + column + 1];
          const c = field[(row + 1) * cols + column + 1];
          const d = field[(row + 1) * cols + column];
          const lowest = Math.min(a, b, c, d);
          const highest = Math.max(a, b, c, d);
          if (level < lowest || level > highest) continue;
          contour(path, column * CELL, row * CELL, CELL, a, b, c, d, level);
        }
      }
    }

    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.stroke(minor);
    ctx.globalAlpha = 0.68;
    ctx.lineWidth = 1.4;
    ctx.stroke(major);
    ctx.globalAlpha = 1;
  }

  function resize() {
    if (!root || !canvas) return;
    const rect = root.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    draw(reduce ? 0 : time);
  }

  function tick(now) {
    const delta = Math.min(64, now - last);
    last = now;
    waited += delta;
    if (waited >= 33) {
      time += waited;
      waited = 0;
      pointer.hx += (pointer.x - pointer.hx) * 0.12;
      pointer.hy += (pointer.y - pointer.hy) * 0.12;
      pointer.raised +=
        ((interactive ? pointer.raisedTarget : 0) - pointer.raised) * 0.08;
      draw(time);
    }
    frame = requestAnimationFrame(tick);
  }

  function start() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!playing) {
      draw(reduce ? 0 : time);
      return;
    }
    last = performance.now();
    waited = 0;
    frame = requestAnimationFrame(tick);
  }

  function point(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  function onPointerMove(event) {
    if (!interactive || reduce) return;
    const { x, y } = point(event);
    if (!pointer.placed) {
      pointer.hx = x;
      pointer.hy = y;
      pointer.placed = true;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.raisedTarget = 1;
  }

  function onPointerLeave() {
    pointer.raisedTarget = 0;
  }

  function onPointerDown(event) {
    if (!interactive || reduce) return;
    const { x, y } = point(event);
    ripples.push({ x, y, start: time });
    if (ripples.length > 4) ripples.splice(0, ripples.length - 4);
  }

  $effect(() => {
    playing;
    start();
  });

  $effect(() => {
    speed;
    levels;
    scale;
    peak;
    lineColor;
    if (playing) start();
    else draw(reduce ? 0 : time);
  });

  onMount(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduce = media.matches;
    const onMedia = () => {
      reduce = media.matches;
    };
    media.addEventListener?.("change", onMedia);

    pageVisible = document.visibilityState !== "hidden";
    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const observer = new IntersectionObserver(
      (entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0 },
    );
    if (root) observer.observe(root);

    const sizeObserver = new ResizeObserver(resize);
    if (root) sizeObserver.observe(root);
    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMedia);
    };
  });
</script>

<div
  bind:this={root}
  data-slot="topography-background"
  class={`relative size-full overflow-hidden bg-[#f5f2ec] text-[#1b1b1f] dark:bg-[#0b0b0f] dark:text-[#e8e6e1] ${className}`}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  onpointerdown={onPointerDown}
  {...rest}
>
  <canvas
    bind:this={canvas}
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
  ></canvas>
  <slot />
</div>
