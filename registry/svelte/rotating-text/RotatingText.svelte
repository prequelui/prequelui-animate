<script>
  import { onMount, tick, untrack } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    texts: textsProp,
    duration = 2000,
    y = -50,
    delay = 0,
    align = "start",
    loop = true,
    transition,
    class: className = "",
    style = "",
    ...rest
  } = $props();

  const DEFAULT_TWEEN = { duration: 0.3, ease: [0.23, 1, 0.32, 1] };

  let root;
  let word;
  let index = $state(0);
  let rotated = $state(false);
  let onScreen = $state(true);
  let pageVisible = $state(true);
  let observer;
  let timer;
  let controls;
  let lastSignature = "";

  function reduce() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  const tween = $derived(transition ?? DEFAULT_TWEEN);
  const list = $derived.by(() => {
    const value = textsProp ?? text ?? "";
    const next = Array.isArray(value) ? value : [value];
    return next.length ? next : [""];
  });
  const unique = $derived([...new Set(list)]);
  const current = $derived(list[index % list.length] ?? "");
  const playing = $derived(
    onScreen &&
      pageVisible &&
      (loop || index < list.length - 1),
  );

  function clearTimer() {
    clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    clearTimer();
    if (!playing) return;
    timer = setTimeout(() => {
      rotated = true;
      const next = loop
        ? (index + 1) % list.length
        : Math.min(index + 1, list.length - 1);
      swap(next);
      schedule();
    }, rotated ? duration : delay);
  }

  function swap(next) {
    const node = word;
    const travel = reduce() ? 0 : y;

    if (!node) {
      index = next;
      return;
    }

    controls?.stop?.();
    controls = animate(node, { opacity: [1, 0], y: [0, travel] }, tween);

    const finish = () => {
      index = next;
      tick().then(() => {
        const entering = word;
        if (!entering) return;
        entering.style.opacity = "0";
        entering.style.transform = `translateY(${-travel}px)`;
        controls = animate(
          entering,
          { opacity: [0, 1], y: [-travel, 0] },
          tween,
        );
      });
    };

    if (controls?.finished) controls.finished.then(finish, finish);
    else finish();
  }

  function onVisibilityChange() {
    pageVisible = !document.hidden;
  }

  $effect(() => {
    const signature = list.join("\u0001");
    untrack(() => {
      if (lastSignature === "") {
        lastSignature = signature;
        return;
      }
      if (lastSignature === signature) return;
      lastSignature = signature;
      index = 0;
      rotated = false;
      clearTimer();
      schedule();
    });
    return () => {};
  });

  $effect(() => {
    const active = playing;
    untrack(() => {
      if (active) schedule();
      else clearTimer();
    });
    return () => clearTimer();
  });

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0 },
    );
    if (root) observer.observe(root);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    schedule();
    return () => {
      clearTimer();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      controls?.stop?.();
    };
  });
</script>

<span
  bind:this={root}
  data-slot="rotating-text"
  class={`relative inline-block overflow-hidden py-1 align-baseline ${className}`}
  style={style}
  {...rest}
>
  <span class="sr-only">{list.join(", ")}</span>
  <span
    aria-hidden="true"
    class="inline-grid"
    style={`justify-items:${align};align-items:baseline`}
  >
    {#each unique as item (item)}
      <span class="invisible whitespace-nowrap" style="grid-area:1 / 1">{item}</span>
    {/each}
    <span style={`grid-area:1 / 1;justify-self:${align}`}>
      <span bind:this={word} aria-hidden="true" class="inline-block whitespace-nowrap">{current}</span>
    </span>
  </span>
</span>
