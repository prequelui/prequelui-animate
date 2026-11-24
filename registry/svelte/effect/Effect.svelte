<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    delay = 0,
    blur = false,
    slide = false,
    fade = false,
    zoom = false,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    transition = undefined,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let observer;
  let controls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const settings = (value) =>
    value && typeof value === "object" ? value : {};

  function variants() {
    const rest = reduce();
    const hidden = {};
    const shown = {};

    if (slide && !rest) {
      const config = settings(slide);
      const dir = config.direction ?? "up";
      const offset = config.offset ?? 100;
      const axis = dir === "up" || dir === "down" ? "y" : "x";
      hidden[axis] = dir === "right" || dir === "down" ? -offset : offset;
      shown[axis] = 0;
    }

    if (fade) {
      const config = settings(fade);
      hidden.opacity = config.initialOpacity ?? 0;
      shown.opacity = config.opacity ?? 1;
    }

    if (zoom && !rest) {
      const config = settings(zoom);
      hidden.scale = config.initialScale ?? 0.5;
      shown.scale = config.scale ?? 1;
    }

    if (blur) {
      const config = settings(blur);
      hidden.filter = `blur(${rest ? 0 : (config.initialBlur ?? 10)}px)`;
      shown.filter = `blur(${config.blur ?? 0}px)`;
    }

    if (rest && (slide || zoom) && shown.opacity === undefined) {
      hidden.opacity = settings(fade).initialOpacity ?? 0;
      shown.opacity = settings(fade).opacity ?? 1;
    }

    return { hidden, shown };
  }

  function styleFor(hidden) {
    const style = {};
    if (hidden.opacity !== undefined) style.opacity = hidden.opacity;
    if (hidden.filter !== undefined) style.filter = hidden.filter;
    const transforms = [];
    if (hidden.x !== undefined) transforms.push(`translateX(${hidden.x}px)`);
    if (hidden.y !== undefined) transforms.push(`translateY(${hidden.y}px)`);
    if (hidden.scale !== undefined) transforms.push(`scale(${hidden.scale})`);
    if (transforms.length) style.transform = transforms.join(" ");
    return style;
  }

  function toCss(style) {
    return Object.entries(style)
      .map(([key, value]) =>
        key === "opacity" || key === "filter"
          ? `${key === "opacity" ? "opacity" : "filter"}:${value}`
          : `${key}:${value}`,
      )
      .join(";");
  }

  function options() {
    const base = transition ?? {
      type: "spring",
      stiffness: 200,
      damping: 20,
    };
    return {
      ...base,
      delay: (base.delay ?? 0) + delay / 1000,
    };
  }

  function play() {
    if (!root) return;
    const { hidden, shown } = variants();
    const keyframes = {};
    for (const key of Object.keys(shown)) {
      keyframes[key] =
        hidden[key] === undefined ? shown[key] : [hidden[key], shown[key]];
    }
    if (!Object.keys(keyframes).length) return;
    controls?.stop?.();
    controls = animate(root, keyframes, options());
  }

  function reset() {
    if (!root) return;
    controls?.stop?.();
    const { hidden } = variants();
    const style = styleFor(hidden);
    for (const key of ["opacity", "filter", "transform"]) {
      if (style[key] === undefined) root.style[key] = "";
      else root.style[key] = String(style[key]);
    }
  }

  onMount(() => {
    if (!root) return;
    reset();
    if (!inView) {
      play();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          play();
          if (inViewOnce) observer?.disconnect();
        } else if (!inViewOnce) {
          reset();
        }
      },
      { threshold: 0.35, rootMargin: inViewMargin },
    );
    observer.observe(root);
    return () => observer?.disconnect();
  });

  $effect(() => () => controls?.stop?.());

  const initial = toCss(styleFor(variants().hidden));
</script>

<div
  bind:this={root}
  data-slot="effect"
  class={className}
  style={initial}
  {...rest}
>
  <slot />
</div>
