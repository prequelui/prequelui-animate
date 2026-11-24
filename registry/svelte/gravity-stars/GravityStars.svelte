<script>
  import { onMount } from "svelte";

  let {
    speed = 1,
    paused = false,
    starsCount = 80,
    starsSize = 2,
    starsOpacity = 0.75,
    mouseInfluence = 110,
    gravityStrength = 80,
    gravity = "attract",
    glowIntensity = 14,
    interactive = true,
    starColor = "#f8fafc",
    class: className = "",
    ...rest
  } = $props();

  let root;
  let canvas;

  let inView = $state(false);
  let pageVisible = $state(true);
  let reduce = $state(false);

  const rate = $derived(Math.max(0.1, speed));
  const playing = $derived(inView && pageVisible && !reduce && !paused);

  const stars = [];
  const mouse = { x: -9999, y: -9999 };
  let frame = 0;

  function create(width, height) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = (0.16 + Math.random() * 0.4) * rate;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: 1 + Math.random() * starsSize,
      opacity: starsOpacity,
      glow: 1,
    };
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
    ctx.fillStyle = starColor;
    ctx.shadowColor = starColor;
    let blur = -1;
    for (const star of stars) {
      const next = glowIntensity * star.glow * 2;
      if (Math.abs(next - blur) > 1) {
        ctx.shadowBlur = next;
        blur = next;
      }
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
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
    if (stars.length === 0) {
      const bounds = canvas.getBoundingClientRect();
      for (let index = 0; index < starsCount; index++) {
        stars.push(create(bounds.width, bounds.height));
      }
    }
    draw();
  }

  function recreate() {
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    stars.length = 0;
    for (let index = 0; index < starsCount; index++) {
      stars.push(create(bounds.width, bounds.height));
    }
    draw();
  }

  function tick() {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    for (const star of stars) {
      const dx = mouse.x - star.x;
      const dy = mouse.y - star.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < mouseInfluence) {
        const force = (mouseInfluence - distance) / mouseInfluence;
        const push = (force * gravityStrength * 0.0012) / rate;
        const direction = gravity === "attract" ? 1 : -1;
        star.vx += (dx / distance) * push * direction;
        star.vy += (dy / distance) * push * direction;
        star.opacity = Math.min(1, starsOpacity + force * 0.4);
        star.glow = 1 + force * 2;
      } else {
        star.opacity = Math.max(starsOpacity * 0.3, star.opacity - 0.02);
        star.glow = Math.max(1, star.glow - 0.06);
      }
      star.x += star.vx * rate;
      star.y += star.vy * rate;
      star.vx += (Math.random() - 0.5) * 0.0015;
      star.vy += (Math.random() - 0.5) * 0.0015;
      star.vx *= 0.999;
      star.vy *= 0.999;
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;
    }
    draw();
    frame = requestAnimationFrame(tick);
  }

  function start() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!playing) {
      draw();
      return;
    }
    frame = requestAnimationFrame(tick);
  }

  function onPointerMove(event) {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  }

  function onPointerLeave() {
    mouse.x = -9999;
    mouse.y = -9999;
  }

  $effect(() => {
    playing;
    start();
  });

  $effect(() => {
    const count = starsCount;
    if (!canvas || canvas.width < 2) return;
    if (stars.length !== count) recreate();
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
  data-slot="gravity-stars-background"
  class={`relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#191826_0%,#06060b_72%)] ${className}`}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  {...rest}
>
  <canvas
    bind:this={canvas}
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
  ></canvas>
  <slot />
</div>
