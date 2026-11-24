<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  const DEFAULT_GRADIENT =
    "linear-gradient(120deg, #312e81 0%, #6d28d9 24%, #be185d 48%, #c2410c 72%, #0f766e 100%)";

  let {
    speed = 1,
    paused = false,
    gradient = DEFAULT_GRADIENT,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let sheet;
  let glowOne;
  let glowTwo;

  let inView = $state(false);
  let pageVisible = $state(true);
  let reduce = $state(false);

  const duration = $derived(16 / Math.max(0.1, speed));
  const playing = $derived(inView && pageVisible && !reduce && !paused);

  const sheetStyle = $derived({
    backgroundImage: gradient,
    backgroundSize: "400% 400%",
    backgroundPosition: reduce ? "35% 50%" : undefined,
    willChange: "background-position",
  });

  let controls = [];

  function stopControls() {
    for (const control of controls) control?.stop?.();
    controls = [];
  }

  function start() {
    stopControls();
    if (!playing) {
      controls.push(
        animate(
          sheet,
          { backgroundPosition: reduce ? "35% 50%" : "0% 50%" },
          { duration: 0 },
        ),
      );
      controls.push(animate(glowOne, { x: "-12%", y: "-8%" }, { duration: 0 }));
      controls.push(animate(glowTwo, { x: "10%", y: "12%" }, { duration: 0 }));
      return;
    }

    controls.push(
      animate(
        sheet,
        { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] },
        { duration, ease: "easeInOut", repeat: Infinity },
      ),
    );
    controls.push(
      animate(
        glowOne,
        {
          x: ["-12%", "14%", "-12%"],
          y: ["-8%", "10%", "-8%"],
          scale: [1, 1.25, 1],
        },
        { duration: duration * 1.6, ease: "easeInOut", repeat: Infinity },
      ),
    );
    controls.push(
      animate(
        glowTwo,
        {
          x: ["10%", "-16%", "10%"],
          y: ["12%", "-10%", "12%"],
          scale: [1.1, 0.9, 1.1],
        },
        { duration: duration * 2.1, ease: "easeInOut", repeat: Infinity },
      ),
    );
  }

  $effect(() => {
    playing;
    duration;
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
    };
  });
</script>

<div
  bind:this={root}
  data-slot="gradient-background"
  class={`relative size-full overflow-hidden bg-[#0a0910] ${className}`}
  {...rest}
>
  <div
    bind:this={sheet}
    aria-hidden="true"
    class="absolute -inset-[35%] opacity-90 blur-[10px]"
    style={sheetStyle}
  ></div>
  <div
    bind:this={glowOne}
    aria-hidden="true"
    class="absolute left-[8%] top-[4%] size-[70%] rounded-full opacity-70 blur-[60px]"
    style="background:radial-gradient(circle, rgba(45,212,191,0.75), transparent 68%);will-change:transform"
  ></div>
  <div
    bind:this={glowTwo}
    aria-hidden="true"
    class="absolute bottom-[2%] right-[2%] size-[74%] rounded-full opacity-70 blur-[70px]"
    style="background:radial-gradient(circle, rgba(249,115,22,0.72), transparent 66%);will-change:transform"
  ></div>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(5,4,10,0.6))]"
  ></div>
  <slot />
</div>
