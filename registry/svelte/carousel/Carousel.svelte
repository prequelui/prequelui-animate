<script>
  import { ChevronLeft, ChevronRight } from "lucide-svelte";

  let {
    slides = [
      { title: "Springs", body: "Position and size move on springs." },
      { title: "Tweens", body: "Colour and opacity use short tweens." },
      { title: "Reduced motion", body: "Travel is removed, state is kept." },
    ],
    defaultIndex = 0,
    index = undefined,
    onIndexChange = undefined,
  } = $props();

  let internal = $state(defaultIndex);
  const current = $derived(index ?? internal);
  let drag = $state(0);
  let dragging = $state(false);
  let start = null;

  function go(next) {
    const value = Math.min(slides.length - 1, Math.max(0, next));
    if (index === undefined) internal = value;
    onIndexChange?.(value);
  }
  function down(event) {
    dragging = true;
    start = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event) {
    if (!dragging) return;
    drag = event.clientX - start;
  }
  function end() {
    if (drag > 60) go(current - 1);
    else if (drag < -60) go(current + 1);
    drag = 0;
    dragging = false;
    start = null;
  }
</script>

<div class="w-full max-w-sm">
  <div class="relative overflow-hidden rounded-xl border" onpointerdown={down} onpointermove={move} onpointerup={end} onpointercancel={end}>
    <div
      class="flex touch-pan-y"
      style={`transform:translateX(calc(-${current * 100}% + ${drag}px));transition:${dragging ? "none" : "transform 500ms cubic-bezier(0.34,1.2,0.64,1)"}`}
    >
      {#each slides as slide (slide.title)}
        <article class="w-full shrink-0 p-6">
          <p class="text-[13px] font-medium">{slide.title}</p>
          <p class="mt-2 text-[13px] leading-6 text-muted-foreground">{slide.body}</p>
        </article>
      {/each}
    </div>
    <div class="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
      <button type="button" aria-label="Previous slide" disabled={current === 0} class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40" onclick={() => go(current - 1)}>
        <ChevronLeft class="size-3.5" />
      </button>
      <button type="button" aria-label="Next slide" disabled={current === slides.length - 1} class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40" onclick={() => go(current + 1)}>
        <ChevronRight class="size-3.5" />
      </button>
    </div>
  </div>
  <div class="mt-3 flex items-center justify-between">
    <div class="flex gap-1.5">
      {#each slides as slide, item (slide.title)}
        <button type="button" aria-label={`Go to ${item + 1}`} class="flex size-6 items-center justify-center" onclick={() => go(item)}>
          <span class="size-1.5 rounded-full transition-colors" class:bg-foreground={item === current} class:bg-border={item !== current}></span>
        </button>
      {/each}
    </div>
    <span class="font-mono text-[13px] tabular-nums text-muted-foreground">
      {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
    </span>
  </div>
</div>
