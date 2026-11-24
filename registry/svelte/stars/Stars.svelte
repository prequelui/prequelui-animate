<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  const LAYERS = [
    { count: 1100, size: 1, multiplier: 1, opacity: 0.55 },
    { count: 480, size: 2, multiplier: 2, opacity: 0.75 },
    { count: 220, size: 3, multiplier: 3, opacity: 0.95 },
  ];

  let {
    speed = 50,
    paused = false,
    starColor = "#f8fafc",
    factor = 0.05,
    pointerEvents = true,
    class: className = "",
    ...rest
  } = $props();

  function seeded(index, salt = 1) {
    const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
    return value - Math.floor(value);
  }

  function buildShadows(count, salt) {
    const shadows = [];
    for (let index = 0; index < count; index++) {
      const x = Math.round((seeded(index + salt * 1000, 1.7) - 0.5) * 2800);
      const y = Math.round((seeded(index + salt * 1000, 2.9) - 0.5) * 2800);
      shadows.push(`${x}px ${y}px`);
    }
    return shadows.join(",");
  }

  const layers = LAYERS.map((layer) => ({
    ...layer,
    shadows: buildShadows(layer.count, layer.multiplier),
  }));

  let root;
  let parallax;
  let layerEls = [];

  let inView = $state(false);
  let pageVisible = $state(true);
  let reduce = $state(false);

  const playing = $derived(inView && pageVisible && !reduce && !paused);
  const parallaxClass = $derived(
    pointerEvents ? "absolute inset-0" : "absolute inset-0 pointer-events-none",
  );

  let controls = [];
  let follow;
  const offset = { x: 0, y: 0 };

  function stopControls() {
    for (const control of controls) control?.stop?.();
    controls = [];
  }

  function start() {
    stopControls();
    layers.forEach((layer, index) => {
      const element = layerEls[index];
      if (!element) return;
      if (!playing) {
        controls.push(animate(element, { y: 0 }, { duration: 0 }));
        return;
      }
      const span = (50 * layer.multiplier) / Math.max(0.1, speed);
      controls.push(
        animate(
          element,
          { y: [0, -2000] },
          { duration: span, repeat: Infinity, ease: "linear" },
        ),
      );
    });
  }

  function applyOffset() {
    if (!parallax) return;
    parallax.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
  }

  function onPointerMove(event) {
    if (reduce || !root) return;
    const rect = root.getBoundingClientRect();
    const x = -(event.clientX - rect.left - rect.width / 2) * factor;
    const y = -(event.clientY - rect.top - rect.height / 2) * factor;
    follow?.stop?.();
    follow = animate(
      offset,
      { x, y },
      {
        type: "spring",
        stiffness: 50,
        damping: 20,
        onUpdate: applyOffset,
      },
    );
  }

  $effect(() => {
    playing;
    speed;
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

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMedia);
      stopControls();
      follow?.stop?.();
    };
  });
</script>

<div
  bind:this={root}
  data-slot="stars-background"
  class={`relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#17172a_0%,#05050a_75%)] ${className}`}
  onpointermove={onPointerMove}
  {...rest}
>
  <div bind:this={parallax} aria-hidden="true" class={parallaxClass}>
    {#each layers as layer, index (layer.multiplier)}
      <div
        bind:this={layerEls[index]}
        class="absolute left-0 top-0 h-[2000px] w-full"
        style="will-change:transform"
      >
        <div
          class="absolute rounded-full bg-transparent"
          style={`width:${layer.size}px;height:${layer.size}px;color:${starColor};box-shadow:${layer.shadows};opacity:${reduce ? layer.opacity * 0.8 : layer.opacity}`}
        ></div>
        <div
          class="absolute top-[2000px] rounded-full bg-transparent"
          style={`width:${layer.size}px;height:${layer.size}px;color:${starColor};box-shadow:${layer.shadows};opacity:${reduce ? layer.opacity * 0.8 : layer.opacity}`}
        ></div>
      </div>
    {/each}
  </div>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,10,0.7))]"
  ></div>
  <slot />
</div>
