<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    number,
    fromNumber = undefined,
    padStart = false,
    decimalPlaces = 0,
    decimalSeparator = ".",
    thousandSeparator = undefined,
    inView = false,
    inViewOnce = true,
    delay = 0,
    initiallyStable = false,
    transition = undefined,
    onNumberChange = undefined,
    onCompleted = undefined,
    class: className = "",
    ...rest
  } = $props();

  const rollerSpring = { stiffness: 200, damping: 20, mass: 0.4 };
  const countSpring = {
    type: "spring",
    stiffness: 90,
    damping: 50,
    restDelta: 0.001,
    restSpeed: 0.01,
  };
  const digits = Array.from({ length: 10 }, (_, digit) => digit);

  let factor = $derived(Math.pow(10, decimalPlaces));
  let counting = $derived(fromNumber !== undefined);
  const initialValue = initiallyStable ? number : fromNumber ?? 0;

  let root;
  let seen = $state(false);
  let layout = $state({
    length: Math.floor(Math.abs(toUnits(initialValue)) / factor).toString()
      .length,
    negative: toUnits(initialValue) < 0,
  });

  let units = toUnits(initialValue);
  const valueState = { value: initialValue };
  const rollers = new Map();
  let observer;
  let timer;
  let countControls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function toUnits(value) {
    return Math.round(value * factor);
  }

  function digitAt(currentUnits, place) {
    return Math.floor(Math.abs(currentUnits) / place) % 10;
  }

  function formatNumber(value, options) {
    const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
    const fixed = Math.abs(value).toFixed(decimals);
    const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
    const [integer = "0", fraction] = fixed.split(".");
    let integerPart = integer.padStart(padLength, "0");
    if (thousandSeparator !== undefined) {
      integerPart = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        thousandSeparator,
      );
    }
    return fraction
      ? `${sign}${integerPart}${decimalSeparator}${fraction}`
      : `${sign}${integerPart}`;
  }

  let shownLength = $derived.by(() => {
    const target = Math.floor(Math.abs(number)).toString().length;
    return padStart ? Math.max(target, layout.length) : layout.length;
  });

  let intPlaces = $derived.by(() =>
    Array.from(
      { length: Math.max(1, shownLength) },
      (_, index) => Math.pow(10, shownLength - index - 1) * factor,
    ),
  );

  let decimalPlacesList = $derived.by(() =>
    Array.from({ length: decimalPlaces }, (_, index) =>
      Math.pow(10, decimalPlaces - index - 1),
    ),
  );

  let format = $derived({
    decimals: decimalPlaces,
    decimalSeparator,
    thousandSeparator,
    padLength: padStart ? shownLength : 0,
  });

  let finalText = $derived(formatNumber(number, format));

  function digitStyle(place, digit) {
    const current = ((digitAt(units, place) % 10) + 10) % 10;
    let offset = (10 + digit - current) % 10;
    if (offset > 5) offset -= 10;
    return `transform: translateY(${offset * 100}%)`;
  }

  function paint(element, position) {
    if (!element) return;
    const current = ((position % 10) + 10) % 10;
    element.querySelectorAll("[data-digit]").forEach((node) => {
      const digit = Number(node.getAttribute("data-digit"));
      let offset = (10 + digit - current) % 10;
      if (offset > 5) offset -= 10;
      node.style.transform = `translateY(${offset * 100}%)`;
    });
  }

  function syncRollers(moving) {
    if (!root) return;
    const alive = new Set();
    root.querySelectorAll("[data-roller]").forEach((element) => {
      const key = element.getAttribute("data-roller");
      if (!key) return;
      alive.add(key);
      const place = Number(element.getAttribute("data-place"));
      const target = digitAt(units, place);
      let roller = rollers.get(key);
      if (!roller) {
        roller = { position: target, target, controls: null, element };
        rollers.set(key, roller);
        paint(element, target);
        return;
      }
      roller.element = element;
      if (roller.target === target) {
        paint(element, roller.position);
        return;
      }
      roller.target = target;
      if (!moving || reduce()) {
        roller.controls?.stop?.();
        roller.controls = null;
        roller.position = target;
        paint(element, target);
        return;
      }
      roller.controls?.stop?.();
      roller.controls = animate(roller, { position: target }, {
        type: "spring",
        ...(transition ?? rollerSpring),
        onUpdate: () => paint(roller.element, roller.position),
      });
    });
    for (const key of rollers.keys()) {
      if (!alive.has(key)) rollers.delete(key);
    }
  }

  function commit(nextUnits) {
    units = nextUnits;
    const length = Math.floor(Math.abs(nextUnits) / factor).toString().length;
    const negative = nextUnits < 0;
    if (layout.length !== length || layout.negative !== negative) {
      layout = { length, negative };
      tick().then(() => syncRollers(true));
    } else {
      syncRollers(true);
    }
    onNumberChange?.(nextUnits / factor);
  }

  function run() {
    if (!seen) {
      if (!counting && !initiallyStable) commit(toUnits(0));
      return;
    }
    clearTimeout(timer);
    countControls?.stop?.();
    if (reduce()) {
      commit(toUnits(number));
      onCompleted?.();
      return;
    }
    timer = setTimeout(() => {
      if (counting) {
        countControls = animate(valueState, { value: number }, {
          ...countSpring,
          onUpdate: () => commit(toUnits(valueState.value)),
          onComplete: () => onCompleted?.(),
        });
      } else {
        commit(toUnits(number));
        onCompleted?.();
      }
    }, delay);
  }

  let lastNumber = number;

  $effect(() => {
    const current = number;
    if (current === lastNumber) return;
    lastNumber = current;
    if (seen) run();
  });

  let lastShape = `${decimalPlaces}:${padStart}:${thousandSeparator}`;

  $effect(() => {
    const key = `${decimalPlaces}:${padStart}:${thousandSeparator}`;
    if (key === lastShape) return;
    lastShape = key;
    tick().then(() => syncRollers(false));
  });

  onMount(() => {
    tick().then(() => syncRollers(false));
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
    countControls?.stop?.();
    observer?.disconnect();
    for (const roller of rollers.values()) roller.controls?.stop?.();
    rollers.clear();
  });
</script>

<span
  bind:this={root}
  data-slot="sliding-number"
  class={`inline-flex items-center tabular-nums ${className}`}
  {...rest}
>
  <span class="sr-only">{finalText}</span>
  {#if layout.negative}
    <span aria-hidden="true" class="mr-1">-</span>
  {/if}
  {#each intPlaces as place, index (`int-${place}`)}
    <span
      data-roller={`int-${place}`}
      data-place={place}
      data-slot="sliding-number-roller"
      class="relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums"
    >
      <span class="invisible">0</span>
      {#each digits as digit (digit)}
        <span
          data-digit={digit}
          aria-hidden="true"
          data-slot="sliding-number-digit"
          class="absolute inset-0 flex items-center justify-center"
          style={digitStyle(place, digit)}
        >
          {digit}
        </span>
      {/each}
    </span>
    {#if thousandSeparator !== undefined && intPlaces.length - index - 1 > 0 && (intPlaces.length - index - 1) % 3 === 0}
      <span aria-hidden="true">{thousandSeparator}</span>
    {/if}
  {/each}
  {#if decimalPlaces > 0}
    <span aria-hidden="true">{decimalSeparator}</span>
    {#each decimalPlacesList as place (`dec-${place}`)}
      <span
        data-roller={`dec-${place}`}
        data-place={place}
        data-slot="sliding-number-roller"
        class="relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums"
      >
        <span class="invisible">0</span>
        {#each digits as digit (digit)}
          <span
            data-digit={digit}
            aria-hidden="true"
            data-slot="sliding-number-digit"
            class="absolute inset-0 flex items-center justify-center"
            style={digitStyle(place, digit)}
          >
            {digit}
          </span>
        {/each}
      </span>
    {/each}
  {/if}
</span>
