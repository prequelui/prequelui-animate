let uid = 0;

export function createCarousel(root, options = {}) {
  const {
    slides = [
      { title: "Springs", body: "Position and size move on springs." },
      { title: "Tweens", body: "Colour and opacity use short tweens." },
      { title: "Reduced motion", body: "Travel is removed, state is kept." },
    ],
    defaultIndex = 0,
    onIndexChange = undefined,
  } = options;
  const id = `carousel-${++uid}`;
  let index = defaultIndex;
  let drag = 0;
  let dragging = false;
  let start = null;

  root.innerHTML = `
    <div class="w-full max-w-sm" data-carousel="${id}">
      <div class="relative overflow-hidden rounded-xl border" data-viewport>
        <div class="flex touch-pan-y" data-track>
          ${slides
            .map(
              (slide) => `<article class="w-full shrink-0 p-6">
                <p class="text-[13px] font-medium">${slide.title}</p>
                <p class="mt-2 text-[13px] leading-6 text-muted-foreground">${slide.body}</p>
              </article>`,
            )
            .join("")}
        </div>
        <div class="absolute inset-x-3 top-1/2 flex -translate-y-1/2 justify-between">
          <button type="button" aria-label="Previous slide" data-prev class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button type="button" aria-label="Next slide" data-next class="flex size-7 items-center justify-center rounded-full border bg-background/80 text-muted-foreground backdrop-blur disabled:opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-3.5"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div class="mt-3 flex items-center justify-between">
        <div class="flex gap-1.5">
          ${slides
            .map(
              (slide, item) => `<button type="button" aria-label="Go to ${item + 1}" data-dot="${item}" class="flex size-6 items-center justify-center">
                <span class="size-1.5 rounded-full transition-colors"></span>
              </button>`,
            )
            .join("")}
        </div>
        <span class="font-mono text-[13px] tabular-nums text-muted-foreground" data-counter></span>
      </div>
    </div>`;

  const viewport = root.querySelector("[data-viewport]");
  const track = root.querySelector("[data-track]");
  const prev = root.querySelector("[data-prev]");
  const next = root.querySelector("[data-next]");
  const dots = [...root.querySelectorAll("[data-dot]")];
  const counter = root.querySelector("[data-counter]");

  function render() {
    track.style.transform = `translateX(calc(-${index * 100}% + ${drag}px))`;
    track.style.transition = dragging ? "none" : "transform 500ms cubic-bezier(0.34,1.2,0.64,1)";
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    dots.forEach((dot, item) => {
      dot.querySelector("span").className = `size-1.5 rounded-full transition-colors ${item === index ? "bg-foreground" : "bg-border"}`;
      dot.setAttribute("aria-current", item === index ? "true" : "false");
    });
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  }

  function go(nextIndex) {
    index = Math.min(slides.length - 1, Math.max(0, nextIndex));
    onIndexChange?.(index);
    render();
  }

  viewport.addEventListener("pointerdown", (event) => {
    dragging = true;
    start = event.clientX;
    viewport.setPointerCapture(event.pointerId);
    render();
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    drag = event.clientX - start;
    render();
  });
  const end = () => {
    if (drag > 60) go(index - 1);
    else if (drag < -60) go(index + 1);
    drag = 0;
    dragging = false;
    start = null;
    render();
  };
  viewport.addEventListener("pointerup", end);
  viewport.addEventListener("pointercancel", end);
  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));
  dots.forEach((dot, item) => dot.addEventListener("click", () => go(item)));

  render();
  return {
    get index() { return index; },
    go,
    destroy() { root.innerHTML = ""; },
  };
}
