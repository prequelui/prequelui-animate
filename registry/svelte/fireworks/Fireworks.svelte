<script>
  import { onMount } from "svelte";

  const PALETTE = ["#f97316", "#f43f5e", "#a855f7", "#22d3ee", "#facc15", "#34d399"];

  let {
    speed = 1,
    paused = false,
    interactive = true,
    population = 1,
    colors = PALETTE,
    particleCount = 64,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let canvas;

  let inView = $state(false);
  let pageVisible = $state(true);
  let reduce = $state(false);

  const rate = $derived(Math.max(0.1, speed));
  const palette = $derived(
    Array.isArray(colors) && colors.length ? colors : PALETTE,
  );
  const playing = $derived(inView && pageVisible && !reduce && !paused);

  const rockets = [];
  const sparks = [];

  let frame = 0;
  let nextLaunch = 0;
  let last = 0;

  function explode(x, y, color) {
    const count = Math.round(
      particleCount * Math.min(1.6, Math.max(0.4, rate)),
    );
    for (let index = 0; index < count; index++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 0.9 + Math.random() * 4.4;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 1,
        decay: 0.005 + Math.random() * 0.01,
        size: 1.2 + Math.random() * 2.8,
        color,
      });
    }
  }

  function launch(x, target, color) {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const options = palette;
    rockets.push({
      x,
      y: rect.height * 1.02,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -(3.4 + Math.random() * 2.2) * rate,
      target,
      color: color ?? options[Math.floor(Math.random() * options.length)] ?? PALETTE[0],
      size: 1.8 + Math.random() * 1.8,
      trail: [],
    });
  }

  function draw() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width < 2 || height < 2) return;
    const dpr = canvas.width / Math.max(1, width);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const background = ctx.createRadialGradient(
      width / 2,
      height * 0.8,
      0,
      width / 2,
      height * 0.8,
      Math.max(width, height) * 0.8,
    );
    background.addColorStop(0, "#10101c");
    background.addColorStop(1, "#040408");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    for (const rocket of rockets) {
      if (rocket.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);
        for (const point of rocket.trail) ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = rocket.size;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      }
    }
    for (const spark of sparks) {
      ctx.globalAlpha = Math.max(0, spark.alpha);
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  function staticFrame() {
    if (!canvas) return;
    sparks.length = 0;
    rockets.length = 0;
    const rect = canvas.getBoundingClientRect();
    const spots = [0.3, 0.5, 0.72];
    const options = palette;
    for (const spot of spots) {
      explode(
        rect.width * spot,
        rect.height * (0.3 + Math.random() * 0.25),
        options[0] ?? PALETTE[0],
      );
    }
    for (let step = 0; step < 22; step++) {
      for (const spark of sparks) {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.05;
        spark.vx *= 0.985;
        spark.vy *= 0.985;
        spark.alpha *= 0.94;
      }
    }
    draw();
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
    if (reduce) staticFrame();
    else draw();
  }

  function tick(now) {
    const delta = Math.min(64, now - last);
    last = now;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (now > nextLaunch) {
      if (population > 0 && Math.random() < population) {
        launch(
          rect.width * (0.12 + Math.random() * 0.76),
          rect.height * (0.12 + Math.random() * 0.3),
        );
      }
      nextLaunch = now + (260 + Math.random() * 520) / Math.max(0.2, population);
    }
    for (let index = rockets.length - 1; index >= 0; index--) {
      const rocket = rockets[index];
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 18) rocket.trail.shift();
      rocket.x += rocket.vx * rate;
      rocket.y += rocket.vy * rate;
      rocket.vy += 0.028 * delta * 0.06;
      if (rocket.vy >= 0 || rocket.y <= rocket.target) {
        explode(rocket.x, rocket.y, rocket.color);
        rockets.splice(index, 1);
      }
    }
    for (let index = sparks.length - 1; index >= 0; index--) {
      const spark = sparks[index];
      spark.vx *= 0.985;
      spark.vy *= 0.985;
      spark.vy += 0.045;
      spark.x += spark.vx * rate;
      spark.y += spark.vy * rate;
      spark.alpha -= spark.decay;
      if (spark.alpha <= 0) sparks.splice(index, 1);
    }
    draw();
    frame = requestAnimationFrame(tick);
  }

  function start() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!playing) {
      if (reduce) staticFrame();
      return;
    }
    last = performance.now();
    const first = canvas?.getBoundingClientRect();
    if (first) {
      const options = palette;
      explode(
        first.width * 0.5,
        first.height * 0.3,
        options[1] ?? options[0] ?? PALETTE[0],
      );
      nextLaunch = performance.now() + 260;
    }
    frame = requestAnimationFrame(tick);
  }

  function onClick(event) {
    if (!interactive || !playing || !root) return;
    const rect = root.getBoundingClientRect();
    launch(event.clientX - rect.left, event.clientY - rect.top);
  }

  $effect(() => {
    playing;
    rate;
    start();
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
  data-slot="fireworks-background"
  class={`relative size-full overflow-hidden bg-[#040408] ${className}`}
  onclick={onClick}
  {...rest}
>
  <canvas
    bind:this={canvas}
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
  ></canvas>
  <slot />
</div>
