<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    duration = 100,
    delay = 0,
    holdDelay = 1000,
    loop = false,
    inView = false,
    inViewOnce = true,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let cursor;
  const texts = Array.isArray(text) ? text : [text];
  const segments = texts.map((value) => Array.from(value));
  let index = $state(0);
  let count = $state(0);
  let phase = $state("typing");
  let ready = $state(delay === 0);
  let timer;
  let observer;
  let cursorControl;
  let started = false;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const visible = $derived((segments[index] ?? []).slice(0, count).join(""));

  function schedule() {
    clearTimeout(timer);
    if (reduce()) {
      const target = loop ? 0 : segments.length - 1;
      index = target;
      count = (segments[target] ?? []).length;
      phase = "done";
      return;
    }
    if (!ready) {
      timer = setTimeout(() => {
        ready = true;
        schedule();
      }, delay);
      return;
    }
    if (phase === "done") return;
    const length = (segments[index] ?? []).length;
    const isLast = index === segments.length - 1;

    if (phase === "typing") {
      if (count < length) {
        timer = setTimeout(() => {
          count += 1;
          schedule();
        }, duration);
      } else if (isLast && !loop) {
        phase = "done";
      } else {
        phase = "holding";
        timer = setTimeout(schedule, holdDelay);
      }
    } else if (phase === "holding") {
      phase = "erasing";
      timer = setTimeout(schedule, Math.max(60, duration));
    } else if (phase === "erasing") {
      if (count > 0) {
        timer = setTimeout(() => {
          count -= 1;
          schedule();
        }, Math.max(40, duration * 0.55));
      } else {
        index = isLast ? 0 : index + 1;
        count = 0;
        phase = "typing";
        timer = setTimeout(schedule, Math.max(120, duration));
      }
    }
  }

  function start() {
    if (started) return;
    started = true;
    if (cursor && !reduce()) {
      cursorControl = animate(
        cursor,
        { opacity: [1, 1, 0, 0] },
        { duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] },
      );
    }
    schedule();
  }

  onMount(() => {
    if (!inView) {
      start();
      return;
    }
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      start();
      if (inViewOnce) observer?.disconnect();
    });
    if (root) observer.observe(root);
    return () => {
      clearTimeout(timer);
      observer?.disconnect();
      cursorControl?.stop?.();
    };
  });
</script>

<span bind:this={root} data-slot="typing-text" class={`inline ${className}`} {...rest}>
  <span class="sr-only">{texts.join(", ")}</span>
  <span aria-hidden="true">{visible}</span>
  <span
    bind:this={cursor}
    aria-hidden="true"
    data-slot="typing-text-cursor"
    class="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-foreground"
  ></span>
</span>
