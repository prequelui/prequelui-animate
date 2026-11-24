<script>
  import { onDestroy, onMount } from "svelte";
  import { animate } from "motion";

  let {
    number,
    fromNumber = 0,
    padStart = false,
    decimalPlaces = 0,
    decimalSeparator = ".",
    thousandSeparator = undefined,
    inView = false,
    inViewOnce = true,
    delay = 0,
    initiallyStable = false,
    transition = undefined,
    onCompleted = undefined,
    class: className = "",
    ...rest
  } = $props();

  const countSpring = {
    type: "spring",
    stiffness: 90,
    damping: 50,
    restDelta: 0.001,
    restSpeed: 0.01,
  };

  let root;
  let visual;
  let seen = $state(false);
  const counter = { value: initiallyStable ? number : fromNumber };
  let observer;
  let timer;
  let controls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatNumber(value, options) {
    const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
    const fixed = Math.abs(value).toFixed(decimals);
    const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
    const [integer = "0", fraction] = fixed.split(".");
    const padded = integer.padStart(padLength, "0");
    const grouped =
      thousandSeparator === undefined
        ? padded
        : padded.replace(/\B(?=(\d{3})+$)/g, thousandSeparator);
    return fraction
      ? `${sign}${grouped}${decimalSeparator}${fraction}`
      : `${sign}${grouped}`;
  }

  let format = $derived({
    decimals: decimalPlaces,
    decimalSeparator,
    thousandSeparator,
    padLength: padStart ? Math.floor(Math.abs(number)).toString().length : 0,
  });

  let finalText = $derived(formatNumber(number, format));

  function write(value) {
    if (visual) visual.textContent = formatNumber(value, format);
  }

  function spring() {
    return transition ?? countSpring;
  }

  function run() {
    if (!seen) return;
    clearTimeout(timer);
    controls?.stop?.();
    if (reduce()) {
      counter.value = number;
      write(counter.value);
      onCompleted?.();
      return;
    }
    timer = setTimeout(() => {
      controls = animate(counter, { value: number }, {
        ...spring(),
        onUpdate: () => write(counter.value),
        onComplete: () => onCompleted?.(),
      });
    }, delay);
  }

  let lastNumber = number;

  $effect(() => {
    const current = number;
    if (current === lastNumber) return;
    lastNumber = current;
    if (seen) run();
  });

  $effect(() => {
    write(counter.value);
  });

  onMount(() => {
    write(counter.value);
    if (!inView) {
      seen = true;
      run();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        seen = visible;
        if (!visible) return;
        run();
        if (inViewOnce) observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
  });

  onDestroy(() => {
    clearTimeout(timer);
    controls?.stop?.();
    observer?.disconnect();
  });
</script>

<span
  bind:this={root}
  data-slot="counting-number"
  class={`inline-block tabular-nums ${className}`}
  {...rest}
>
  <span aria-hidden="true" bind:this={visual}></span>
  <span class="sr-only">{finalText}</span>
</span>
