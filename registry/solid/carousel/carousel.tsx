import { For, createSignal } from "solid-js";
import { ChevronLeft, ChevronRight } from "lucide-solid";

export type CarouselSlide = { title: string; body: string };
export type CarouselProps = {
  slides?: CarouselSlide[];
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
};

const FALLBACK: CarouselSlide[] = [
  { title: "Springs", body: "Position and size move on springs." },
  { title: "Tweens", body: "Colour and opacity use short tweens." },
  { title: "Reduced motion", body: "Travel is removed, state is kept." },
];

export function Carousel(props: CarouselProps) {
  const slides = props.slides ?? FALLBACK;
  const [index, setIndex] = createSignal(props.defaultIndex ?? 0);
  const [drag, setDrag] = createSignal(0);
  const [dragging, setDragging] = createSignal(false);
  let start: number | null = null;

  function go(next: number) {
    const value = Math.min(slides.length - 1, Math.max(0, next));
    setIndex(value);
    props.onIndexChange?.(value);
  }
  function down(event: PointerEvent & { currentTarget: HTMLDivElement }) {
    setDragging(true);
    start = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function move(event: PointerEvent) {
    if (!dragging()) return;
    setDrag(event.clientX - (start ?? 0));
  }
  function end() {
    if (drag() > 60) go(index() - 1);
    else if (drag() < -60) go(index() + 1);
    setDrag(0);
    setDragging(false);
    start = null;
  }

  return (
    <div class="w-full max-w-sm">
      <div class="relative overflow-hidden rounded-xl border" onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
        <div
          class="flex touch-pan-y"
          style={{
            transform: `translateX(calc(-${index() * 100}% + ${drag()}px))`,
            transition: dragging() ? "none" : "transform 500ms cubic-bezier(0.34,1.2,0.64,1)",
          }}
        >
          <For each={slides}>
            {(slide) => (
              <article class="w-full shrink-0 p-6">
                <p class="text-[13px] font-medium">{slide.title}</p>
                <p class="mt-2 text-[13px] leading-6 text-muted-foreground">{slide.body}</p>
              </article>
            )}
          </For>
        </div>
        <div class="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
          <button type="button" aria-label="Previous slide" disabled={index() === 0} onClick={() => go(index() - 1)} class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40">
            <ChevronLeft class="size-3.5" />
          </button>
          <button type="button" aria-label="Next slide" disabled={index() === slides.length - 1} onClick={() => go(index() + 1)} class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40">
            <ChevronRight class="size-3.5" />
          </button>
        </div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <div class="flex gap-1.5">
          <For each={slides}>
            {(slide, item) => (
              <button type="button" aria-label={`Go to ${item() + 1}`} onClick={() => go(item())} class="flex size-6 items-center justify-center">
                <span class={`size-1.5 rounded-full transition-colors ${item() === index() ? "bg-foreground" : "bg-border"}`} />
              </button>
            )}
          </For>
        </div>
        <span class="font-mono text-[13px] tabular-nums text-muted-foreground">
          {String(index() + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
