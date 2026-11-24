<script>
  import { onMount, tick, untrack } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    transition,
    delay = 0,
    inView = false,
    inViewOnce = true,
    class: className = "",
    ...rest
  } = $props();

  const DEFAULT_TWEEN = { duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] };

  let root;
  let seen = $state(!inView);
  const controls = [];
  let observer;
  let played = false;
  let segmenter;
  let lastText = null;

  function reduce() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function splitGraphemes(value) {
    if (segmenter === undefined) {
      segmenter =
        typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
          ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
          : null;
    }
    if (!segmenter) return Array.from(value);
    return Array.from(segmenter.segment(value), (entry) => entry.segment);
  }

  const tween = $derived(transition ?? DEFAULT_TWEEN);
  const step = $derived(Number(tween.delay ?? 0));

  const words = $derived.by(() => {
    const parts = text.split(/(\s+)/).filter(Boolean);
    let charIndex = 0;
    return parts.map((part, index) => {
      if (/^\s+$/.test(part)) {
        return { key: `space-${index}`, space: true, part };
      }
      return {
        key: `word-${index}`,
        space: false,
        chars: splitGraphemes(part).map((label, charOffset) => {
          const charDelay = delay / 1000 + charIndex * step;
          charIndex += 1;
          return {
            key: `char-${index}-${charOffset}`,
            label,
            delay: charDelay,
          };
        }),
      };
    });
  });

  function stop() {
    while (controls.length) controls.pop()?.stop?.();
  }

  function reset() {
    if (!root) return;
    stop();
    for (const node of root.querySelectorAll("[data-char-top]")) {
      node.style.transform = "rotateX(0deg)";
      node.style.opacity = "";
    }
    for (const node of root.querySelectorAll("[data-char-bottom]")) {
      node.style.transform = "rotateX(90deg)";
      node.style.opacity = "";
    }
  }

  function play() {
    if (!seen || !root) return;
    if (reduce()) {
      played = true;
      for (const node of root.querySelectorAll("[data-char-top]")) {
        node.style.transform = "rotateX(90deg)";
      }
      for (const node of root.querySelectorAll("[data-char-bottom]")) {
        node.style.transform = "rotateX(0deg)";
      }
      return;
    }
    if (played) return;
    played = true;
    const bases = { ...tween, ease: tween.ease ?? [0.23, 1, 0.32, 1] };
    for (const node of root.querySelectorAll("[data-roll]")) {
      const charDelay = Number(node.dataset.delay ?? 0);
      const top = node.querySelector("[data-char-top]");
      const bottom = node.querySelector("[data-char-bottom]");
      if (top) {
        controls.push(
          animate(top, { rotateX: [0, 90] }, { ...bases, delay: charDelay }),
        );
      }
      if (bottom) {
        controls.push(
          animate(
            bottom,
            { rotateX: [90, 0] },
            { ...bases, delay: charDelay + 0.3 },
          ),
        );
      }
    }
  }

  $effect(() => {
    const value = text;
    untrack(() => {
      if (lastText === null) {
        lastText = value;
        return;
      }
      if (lastText === value) return;
      lastText = value;
      played = false;
      reset();
      tick().then(() => {
        if (!inView || seen) play();
      });
    });
    return () => {};
  });

  onMount(() => {
    if (!inView) {
      play();
      return () => {
        observer?.disconnect();
        stop();
      };
    }
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        seen = visible;
        if (visible) {
          play();
          if (inViewOnce) observer?.disconnect();
        } else if (!inViewOnce) {
          played = false;
          reset();
        }
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
    return () => {
      observer?.disconnect();
      stop();
    };
  });
</script>

<span
  bind:this={root}
  data-slot="rolling-text"
  class={`inline ${className}`}
  {...rest}
>
  <span aria-hidden="true">
    {#each words as word (word.key)}
      {#if word.space}
        <span>{word.part}</span>
      {:else}
        <span class="inline-block whitespace-nowrap">
          {#each word.chars as char (char.key)}
            <span
              data-roll
              data-delay={char.delay}
              class="relative inline-block"
              style="perspective:9999999px;transform-style:preserve-3d"
            >
              <span
                data-char-top
                aria-hidden="true"
                class="absolute inline-block"
                style="backface-visibility:hidden;transform-origin:50% 25%;transform:rotateX(0deg)"
              >{char.label === " " ? "\u00A0" : char.label}</span>
              <span
                data-char-bottom
                aria-hidden="true"
                class="absolute inline-block"
                style="backface-visibility:hidden;transform-origin:50% 100%;transform:rotateX(90deg)"
              >{char.label === " " ? "\u00A0" : char.label}</span>
              <span class="invisible">{char.label === " " ? "\u00A0" : char.label}</span>
            </span>
          {/each}
        </span>
      {/if}
    {/each}
  </span>
  <span class="sr-only">{text}</span>
</span>
