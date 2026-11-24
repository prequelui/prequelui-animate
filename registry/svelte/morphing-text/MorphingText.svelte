<script>
  import { onMount, tick, untrack } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    delay = 0,
    loop = false,
    holdDelay = 2500,
    inView = false,
    inViewOnce = true,
    transition,
    class: className = "",
    ...rest
  } = $props();

  const EASE = [0.23, 1, 0.32, 1];
  const ENTRY = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    opacity: { duration: 0.3, ease: EASE },
    filter: { duration: 0.3, ease: EASE },
  };
  const EXIT = { duration: 0.15, ease: EASE };
  const LAYOUT = { type: "spring", stiffness: 300, damping: 30 };

  let root;
  let track;
  const texts = $derived(Array.isArray(text) ? text : [text]);
  let index = $state(0);
  let started = $state(delay === 0);
  let onScreen = $state(!inView);
  let pageVisible = $state(true);
  const current = $derived(texts[Math.min(index, texts.length - 1)] ?? "");
  const last = $derived(!loop && index >= texts.length - 1);

  const uid = `morph-${Math.random().toString(36).slice(2, 9)}`;
  let counter = 0;
  let segmenter;
  let shown = $state(current);
  let letters = $state(createLetters(current));
  let leaving = $state([]);

  let observer;
  let timer;
  let delayTimer;
  let enterDelays = new Map();
  let controls = [];
  let lastSignature = texts.join("\u0001");

  const playing = $derived(
    started && texts.length > 1 && !last && onScreen && pageVisible,
  );

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

  function makeId() {
    counter += 1;
    return `${uid}-${counter}`;
  }

  function createLetters(value) {
    return splitGraphemes(value).map((label) => ({ id: makeId(), label }));
  }

  function matchLetters(previous, labels) {
    const rows = previous.length;
    const cols = labels.length;
    const common = Array.from({ length: rows + 1 }, () =>
      new Array(cols + 1).fill(0),
    );
    for (let i = rows - 1; i >= 0; i -= 1) {
      for (let j = cols - 1; j >= 0; j -= 1) {
        common[i][j] =
          previous[i].label === labels[j]
            ? common[i + 1][j + 1] + 1
            : Math.max(common[i + 1][j], common[i][j + 1]);
      }
    }
    const kept = new Map();
    for (let i = 0, j = 0; i < rows && j < cols; ) {
      if (previous[i].label === labels[j]) {
        kept.set(j, previous[i]);
        i += 1;
        j += 1;
      } else if (common[i + 1][j] >= common[i][j + 1]) {
        i += 1;
      } else {
        j += 1;
      }
    }
    return labels.map(
      (label, position) => kept.get(position) ?? { id: makeId(), label },
    );
  }

  function stopControls() {
    for (const control of controls) control?.stop?.();
    controls = [];
  }

  function clearTimer() {
    clearTimeout(timer);
    timer = undefined;
  }

  function schedule() {
    clearTimer();
    if (!playing) return;
    timer = setTimeout(() => {
      index = (index + 1) % texts.length;
      schedule();
    }, holdDelay);
  }

  function capturePositions() {
    const positions = new Map();
    if (!track) return positions;
    for (const node of track.querySelectorAll("[data-letter-id]")) {
      positions.set(node.dataset.letterId, node.getBoundingClientRect());
    }
    return positions;
  }

  function animateLayout(previous) {
    if (!track || !previous.size) return;
    for (const node of track.querySelectorAll("[data-letter-id]")) {
      const id = node.dataset.letterId;
      const before = previous.get(id);
      if (!before) continue;
      const after = node.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      node.style.transform = `translate(${dx}px, ${dy}px)`;
      controls.push(animate(node, { x: [dx, 0], y: [dy, 0] }, LAYOUT));
    }
  }

  function enterOptions(step) {
    return {
      ...(transition ?? ENTRY),
      delay: step,
      opacity: { duration: 0.3, ease: EASE, delay: step },
      filter: { duration: 0.3, ease: EASE, delay: step },
    };
  }

  function animateLetters(delays) {
    if (!track || !delays.size) return;
    for (const node of track.querySelectorAll("[data-letter-id]")) {
      const id = node.dataset.letterId;
      if (!delays.has(id)) continue;
      const step = delays.get(id) ?? 0;
      node.style.opacity = "0";
      let keyframes;
      if (reduce()) {
        keyframes = { opacity: [0, 1] };
      } else {
        node.style.transform = "translateY(0.12em)";
        node.style.filter = "blur(6px)";
        keyframes = {
          opacity: [0, 1],
          y: ["0.12em", 0],
          filter: ["blur(6px)", "blur(0px)"],
        };
      }
      controls.push(animate(node, keyframes, enterOptions(step)));
    }
  }

  function animateLeaving(items) {
    if (!track || !items.length) return;
    for (const item of items) {
      const node = track.querySelector(
        `[data-leaving-id="${item.id}"]`,
      );
      if (!node) continue;
      const keyframes = reduce()
        ? { opacity: [1, 0] }
        : { opacity: [1, 0], filter: ["blur(0px)", "blur(6px)"] };
      const animation = animate(node, keyframes, EXIT);
      controls.push(animation);
      const done = () => {
        leaving = leaving.filter((entry) => entry.id !== item.id);
      };
      animation.finished.then(done, done);
    }
  }

  async function transitionTo(next) {
    const before = capturePositions();
    const previous = letters;
    const previousIds = new Set(previous.map((letter) => letter.id));
    const nextLetters = matchLetters(previous, splitGraphemes(next));
    const nextIds = new Set(nextLetters.map((letter) => letter.id));
    const exits = [];
    const rect = track?.getBoundingClientRect();

    if (rect) {
      for (const old of previous) {
        if (nextIds.has(old.id)) continue;
        const node = track.querySelector(`[data-letter-id="${old.id}"]`);
        if (!node) continue;
        const box = node.getBoundingClientRect();
        exits.push({
          id: old.id,
          label: old.label,
          left: box.left - rect.left,
          top: box.top - rect.top,
          width: box.width,
          height: box.height,
        });
      }
    }

    enterDelays = new Map();
    let incoming = 0;
    for (const letter of nextLetters) {
      if (previousIds.has(letter.id)) continue;
      enterDelays.set(letter.id, 0.08 + 0.012 * incoming);
      incoming += 1;
    }

    shown = next;
    letters = nextLetters;
    if (exits.length) leaving = [...leaving, ...exits];

    await tick();
    animateLayout(before);
    animateLetters(enterDelays);
    animateLeaving(exits);
  }

  function startDelay(value) {
    clearTimeout(delayTimer);
    if (value <= 0) {
      started = true;
      return;
    }
    started = false;
    delayTimer = setTimeout(() => {
      started = true;
    }, value);
  }

  function onVisibilityChange() {
    pageVisible = !document.hidden;
  }

  $effect(() => {
    const next = current;
    untrack(() => {
      if (shown === next) return;
      transitionTo(next);
    });
    return () => {};
  });

  $effect(() => {
    const signature = texts.join("\u0001");
    untrack(() => {
      if (signature === lastSignature) return;
      lastSignature = signature;
      clearTimer();
      stopControls();
      index = 0;
    });
    return () => {};
  });

  $effect(() => {
    const value = delay;
    untrack(() => startDelay(value));
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
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);

    if (inView) {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          onScreen = visible;
          if (visible && inViewOnce) observer?.disconnect();
        },
        { threshold: 0.35 },
      );
      if (root) observer.observe(root);
    } else {
      onScreen = true;
    }

    return () => {
      clearTimer();
      clearTimeout(delayTimer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopControls();
    };
  });
</script>

<span
  bind:this={root}
  data-slot="morphing-text"
  class={`relative inline-flex ${className}`}
  {...rest}
>
  <span class="sr-only">{current}</span>
  <span bind:this={track} aria-hidden="true" class="relative inline-flex">
    {#each letters as letter (letter.id)}
      <span
        data-letter-id={letter.id}
        class="inline-block whitespace-pre will-change-transform"
      >{letter.label}</span>
    {/each}
    {#each leaving as item (item.id)}
      <span
        data-leaving-id={item.id}
        class="absolute inline-block whitespace-pre will-change-transform"
        style={`left:${item.left}px;top:${item.top}px;width:${item.width}px;height:${item.height}px`}
      >{item.label}</span>
    {/each}
  </span>
</span>
