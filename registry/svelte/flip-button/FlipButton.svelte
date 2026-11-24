<script>
  import { animate } from "motion";

  let {
    from = "top",
    tapScale = 0.97,
    transition = undefined,
    faceTransition = undefined,
    type = "button",
    disabled = false,
    class: className = "",
    style = undefined,
    children = undefined,
    back = undefined,
    ...rest
  } = $props();

  const pressSpring = transition ?? {
    type: "spring",
    stiffness: 550,
    damping: 30,
    restSpeed: 10,
  };
  const flipSpring = faceTransition ?? {
    type: "spring",
    stiffness: 280,
    damping: 20,
  };

  let button;
  let frontEl;
  let backEl;

  const vertical = $derived(from === "top" || from === "bottom");
  const axis = $derived(vertical ? "rotateX" : "rotateY");
  const frontSide = $derived(from === "top" || from === "left");

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stringStyle(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return Object.entries(value)
      .filter(([, entry]) => entry !== undefined && entry !== null)
      .map(([key, entry]) => `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}:${entry}`)
      .join(";");
  }

  function place(element, rotate, offset, opacity) {
    if (!element) return;
    animate(
      element,
      { [axis]: rotate, [vertical ? "y" : "x"]: offset, opacity },
      reduce() ? { duration: 0 } : flipSpring,
    );
  }

  function apply(next) {
    const active = next && !reduce();
    const outward = frontSide ? "50%" : "-50%";
    place(frontEl, active ? 90 : 0, active ? outward : "0%", active ? 0 : 1);
    place(
      backEl,
      active ? 0 : 90,
      active ? "0%" : frontSide ? "-50%" : "50%",
      active ? 1 : 0,
    );
  }

  function press() {
    if (!button || reduce()) return;
    animate(button, { scale: tapScale }, pressSpring);
  }

  function release() {
    if (!button || reduce()) return;
    animate(button, { scale: 1 }, pressSpring);
  }
</script>

<button
  bind:this={button}
  {type}
  {disabled}
  data-slot="flip-button"
  data-from={from}
  class={`inline-grid place-items-center rounded-lg text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  style={`perspective:1000px;${stringStyle(style)}`}
  onpointerdown={press}
  onpointerup={release}
  onpointercancel={release}
  onpointerenter={() => apply(true)}
  onpointerleave={() => {
    release();
    apply(false);
  }}
  {...rest}
>
  <span
    bind:this={frontEl}
    data-slot="flip-button-front"
    class="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-primary-foreground"
    style="grid-area: 1 / 1"
  >
    {#if children}{@render children()}{/if}
  </span>
  <span
    bind:this={backEl}
    aria-hidden="true"
    data-slot="flip-button-back"
    class="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-4 text-secondary-foreground"
    style="grid-area: 1 / 1; opacity: 0"
  >
    {#if back}{@render back()}{/if}
  </span>
</button>
