<script>
  import { animate } from "motion";

  let {
    text = "",
    direction = "down",
    trigger = "hover",
    class: className = "",
    ...rest
  } = $props();

  let track;
  let shown = false;
  let offset = 0;
  let controls;

  const sign = () => (direction === "down" ? 1 : -1);
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function slideTo(next) {
    shown = next;
    if (!track) return;
    const lap = sign() * (next ? 1 : 0);
    const transform =
      lap === 0 ? "translateY(0%)" : `translateY(calc(${lap * 100}% + ${lap} * 0.6em))`;
    controls?.stop?.();
    controls = animate(
      track,
      { transform },
      reduce() ? { duration: 0 } : { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    );
  }

  function enter(event) {
    if (trigger !== "hover" || event.pointerType === "touch") return;
    slideTo(true);
  }

  function leave(event) {
    if (trigger !== "hover" || event.pointerType === "touch") return;
    slideTo(false);
  }

  function click() {
    if (trigger !== "click") return;
    offset += 1;
    slideTo(offset % 2 === 1);
  }
</script>

<span
  data-slot="sliding-text"
  data-direction={direction}
  data-trigger={trigger}
  class={`relative inline-block overflow-clip ${className}`}
  style="padding-block:0.25em;margin-block:-0.25em"
  onpointerenter={enter}
  onpointerleave={leave}
  onclick={click}
  {...rest}
>
  <span
    bind:this={track}
    data-slot="sliding-text-track"
    class="relative inline-block"
    style="transform:translateY(0%)"
  >
    {text}
    <span
      data-slot="sliding-text-copy"
      aria-hidden="true"
      class="absolute left-0 w-full"
      style={`top:calc(${-sign() * 100}% - ${sign()} * 0.6em)`}
    >{text}</span>
  </span>
</span>
