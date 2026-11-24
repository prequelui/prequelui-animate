<script module>
  let bubbleCount = 0;
</script>

<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    interactive = false,
    speed = 1,
    paused = false,
    colors = undefined,
    transition = undefined,
    class: className = "",
    ...rest
  } = $props();

  const DEFAULTS = {
    first: "#6366f1",
    second: "#a855f7",
    third: "#22d3ee",
    fourth: "#f472b6",
    fifth: "#f59e0b",
    sixth: "#34d399",
  };

  let root;
  let blobOne;
  let blobTwo;
  let blobThree;
  let blobFour;
  let blobFive;
  let blobSix;

  let inView = $state(false);
  let pageVisible = $state(true);
  let reduce = $state(false);

  const filterId = `bubble-goo-${++bubbleCount}`;
  const palette = $derived({ ...DEFAULTS, ...(colors ?? {}) });
  const rate = $derived(Math.max(0.2, speed));
  const playing = $derived(inView && pageVisible && !reduce && !paused);

  let controls = [];
  let follow;
  const pointer = { x: 0, y: 0 };

  const rootStyle = $derived(
    [
      `--bubble-first:${palette.first}`,
      `--bubble-second:${palette.second}`,
      `--bubble-third:${palette.third}`,
      `--bubble-fourth:${palette.fourth}`,
      `--bubble-fifth:${palette.fifth}`,
      `--bubble-sixth:${palette.sixth}`,
    ].join(";"),
  );

  function background(name) {
    return `radial-gradient(circle at center, color-mix(in oklab, var(--bubble-${name}) 80%, transparent) 0%, transparent 58%)`;
  }

  function stopLoops() {
    for (const control of controls) control?.stop?.();
    controls = [];
  }

  function snap(element, values) {
    if (!element) return;
    controls.push(animate(element, values, { duration: 0 }));
  }

  function play() {
    stopLoops();
    if (!playing) {
      snap(blobOne, { y: -46 });
      snap(blobTwo, { rotate: reduce ? 90 : 0 });
      snap(blobThree, { rotate: reduce ? 180 : 0 });
      snap(blobFour, { x: -46 });
      snap(blobFive, { rotate: reduce ? 45 : 0 });
      return;
    }

    const base = transition ?? {};
    controls.push(
      animate(
        blobOne,
        { y: [-46, 46, -46] },
        { duration: 30 / rate, ease: "easeInOut", repeat: Infinity, ...base },
      ),
    );
    controls.push(
      animate(
        blobTwo,
        { rotate: [0, 360] },
        { duration: 20 / rate, ease: "linear", repeat: Infinity, ...base },
      ),
    );
    controls.push(
      animate(
        blobThree,
        { rotate: [0, -360] },
        { duration: 40 / rate, ease: "linear", repeat: Infinity, ...base },
      ),
    );
    controls.push(
      animate(
        blobFour,
        { x: [-46, 46, -46] },
        { duration: 40 / rate, ease: "easeInOut", repeat: Infinity, ...base },
      ),
    );
    controls.push(
      animate(
        blobFive,
        { rotate: [0, 360] },
        { duration: 24 / rate, ease: "linear", repeat: Infinity, ...base },
      ),
    );
  }

  function applyPointer() {
    if (!blobSix) return;
    blobSix.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0)`;
  }

  function onPointerMove(event) {
    if (!interactive || reduce || !root) return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    follow?.stop?.();
    follow = animate(
      pointer,
      { x, y },
      {
        type: "spring",
        stiffness: 100,
        damping: 20,
        onUpdate: applyPointer,
      },
    );
  }

  $effect(() => {
    playing;
    rate;
    transition;
    play();
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
      stopLoops();
      follow?.stop?.();
    };
  });
</script>

<div
  bind:this={root}
  data-slot="bubble-background"
  class={`relative size-full overflow-hidden bg-[linear-gradient(135deg,#12111a,#1d1830_45%,#0f172a)] ${className}`}
  style={rootStyle}
  onpointermove={onPointerMove}
  {...rest}
>
  <svg aria-hidden="true" class="pointer-events-none absolute size-0">
    <defs>
      <filter id={filterId}>
        <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </svg>

  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
    style={`filter:url(#${filterId}) blur(38px)`}
  >
    <div
      bind:this={blobOne}
      class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-90 mix-blend-hard-light"
      style={`background:${background("first")};will-change:transform`}
    ></div>
    <div
      bind:this={blobTwo}
      class="absolute inset-0 flex origin-[calc(50%-380px)] items-center justify-center"
    >
      <div
        class="size-[80%] rounded-full mix-blend-hard-light"
        style={`background:${background("second")}`}
      ></div>
    </div>
    <div
      bind:this={blobThree}
      class="absolute inset-0 flex origin-[calc(50%+400px)] items-center justify-center"
    >
      <div
        class="absolute left-[calc(50%-460px)] top-[calc(50%+180px)] size-[80%] rounded-full mix-blend-hard-light"
        style={`background:${background("third")}`}
      ></div>
    </div>
    <div
      bind:this={blobFour}
      class="absolute left-[8%] top-[8%] size-[86%] rounded-full opacity-70 mix-blend-hard-light"
      style={`background:${background("fourth")};will-change:transform`}
    ></div>
    <div
      bind:this={blobFive}
      class="absolute inset-0 flex origin-[calc(50%-760px)_calc(50%+180px)] items-center justify-center"
    >
      <div
        class="absolute left-1/2 top-1/2 size-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 mix-blend-hard-light"
        style={`background:${background("fifth")}`}
      ></div>
    </div>
    {#if interactive}
      <div
        bind:this={blobSix}
        class="absolute size-full rounded-full opacity-70 mix-blend-hard-light"
        style={`background:${background("sixth")};will-change:transform`}
      ></div>
    {/if}
  </div>

  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(4,4,8,0.55))]"
  ></div>
  <slot />
</div>
