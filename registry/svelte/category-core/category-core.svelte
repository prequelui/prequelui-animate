<script module>
  let categoryUid = 0;
</script>

<script>
  import { onMount } from "svelte";

  let {
    definition,
    size = 40,
    active = undefined,
    animateOnHover = true,
    label = "",
    class: className = "",
    ...rest
  } = $props();

  const BASE = { x: 0, y: 0, rotate: 0, scale: 1 };
  const PICTURE_EASE = "cubic-bezier(0.34, 1.3, 0.64, 1)";
  const ART_SCALE = 1.32;
  const ART_TRANSFORM = `translate(512 512) scale(${ART_SCALE}) translate(-512 -512)`;
  const INK_STROKE = 23;
  const STROKE_BOOST = 1.12;

  const gradientId = `cat-${definition.slug}-${categoryUid++}`;

  let reduce = $state(false);
  let hovered = $state(false);

  onMount(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduce = media.matches;
    const onChange = () => {
      reduce = media.matches;
    };
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  });

  const isActive = $derived(
    !!animateOnHover && !reduce && (active === undefined ? hovered : active),
  );

  function targetOf(base, motion) {
    return { ...base, ...(motion ?? {}) };
  }

  const mainTarget = $derived(
    targetOf(BASE, isActive ? definition.motionConfig.main : undefined),
  );
  const accentTarget = $derived(
    targetOf(BASE, isActive ? definition.motionConfig.accent : undefined),
  );

  function transformOf(target) {
    return `translate3d(${target.x ?? 0}px, ${target.y ?? 0}px, 0) rotate(${target.rotate ?? 0}deg) scale(${target.scale ?? 1})`;
  }

  const transition = $derived(reduce ? "none" : `transform 520ms ${PICTURE_EASE}`);
  const accentStyle = $derived(
    `transform:${transformOf(accentTarget)};transition:${transition};transform-box:fill-box;transform-origin:center`,
  );
  const inkStyle = $derived(
    `transform:${transformOf(mainTarget)};transition:${transition};transform-box:fill-box;transform-origin:center`,
  );

  function inkWidth(part) {
    return ((part.width ?? INK_STROKE) * STROKE_BOOST) / ART_SCALE;
  }

  function gradientStop(index) {
    const start = index === 0 ? definition.palette.light[0] : definition.palette.light[1];
    const end = index === 0 ? definition.palette.dark[0] : definition.palette.dark[1];
    return `light-dark(${start}, ${end})`;
  }

  function enter() {
    if (animateOnHover) hovered = true;
  }

  function leave() {
    hovered = false;
  }
</script>

<span
  {...rest}
  data-category-pictogram-host=""
  data-active={active && animateOnHover ? "true" : undefined}
  class={`inline-flex shrink-0 items-center justify-center ${className}`}
  onpointerenter={enter}
  onpointerleave={leave}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 1024 1024"
    fill="none"
    data-category-pictogram={definition.slug}
    data-category-motion={definition.motion}
    role={label ? "img" : undefined}
    aria-label={label || undefined}
    aria-hidden={label ? undefined : true}
  >
    <defs>
      <linearGradient id={gradientId} x1="0" y1="1" x2="1" y2="0">
        <stop stop-color={gradientStop(0)} />
        <stop offset="1" stop-color={gradientStop(1)} />
      </linearGradient>
    </defs>
    <g transform={ART_TRANSFORM}>
      <g
        data-category-accents=""
        fill={`url(#${gradientId})`}
        style={accentStyle}
      >
        {#each definition.accent as part, index (index)}
          <path
            d={part.d}
            transform={part.transform}
            opacity={part.opacity}
          />
        {/each}
      </g>
      <g data-category-ink="" style={inkStyle}>
        {#each definition.ink as part, index (index)}
          {#if part.fill}
            <path
              d={part.d}
              transform={part.transform}
              fill="currentColor"
              fill-rule="evenodd"
              opacity={part.opacity}
            />
          {:else}
            <path
              d={part.d}
              transform={part.transform}
              fill="none"
              stroke="currentColor"
              stroke-width={inkWidth(part)}
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity={part.opacity}
            />
          {/if}
        {/each}
      </g>
    </g>
  </svg>
</span>
