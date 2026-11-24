let uid = 0;

export function createSlider(root, options = {}) {
  const {
    defaultValue = 42,
    min = 0,
    max = 100,
    step = 1,
    label = "Volume",
    showValue = true,
    onValueChange = undefined,
  } = options;
  const id = `slider-${++uid}`;
  const safeMax = max > min ? max : min + 1;
  let current = defaultValue;
  let dragging = false;

  root.innerHTML = `
    <div class="w-full max-w-[360px]" data-slider="${id}">
      <div class="mb-2 flex items-center justify-between text-[13px]">
        <span class="text-muted-foreground">${label}</span>
        ${showValue ? '<span class="tabular-nums" data-value></span>' : ""}
      </div>
      <div role="slider" tabindex="0" aria-valuemin="${min}" aria-valuemax="${safeMax}" aria-label="${label}"
        class="relative flex h-6 w-full touch-none select-none items-center outline-none" data-track>
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-accent">
          <div data-fill class="h-full rounded-full bg-foreground transition-[width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"></div>
        </div>
        <span aria-hidden="true" data-thumb
          class="absolute top-1/2 block h-3 -translate-y-1/2 rounded-full border bg-background shadow-sm transition-[left,width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style="margin-left:-6px"></span>
      </div>
    </div>`;
  const host = root.querySelector(`[data-slider="${id}"]`);
  const track = host.querySelector("[data-track]");
  const fill = host.querySelector("[data-fill]");
  const thumb = host.querySelector("[data-thumb]");
  const output = host.querySelector("[data-value]");

  function render() {
    const percent = Math.min(100, Math.max(0, ((current - min) / (safeMax - min)) * 100));
    fill.style.width = `${percent}%`;
    thumb.style.left = `${percent}%`;
    thumb.style.width = dragging ? "14.25px" : "12px";
    thumb.classList.toggle("border-foreground/40", dragging);
    track.setAttribute("aria-valuenow", String(current));
    if (output) output.textContent = String(current);
  }
  function commit(next) {
    const snapped = Math.round((next - min) / step) * step + min;
    current = Math.min(safeMax, Math.max(min, snapped));
    onValueChange?.(current);
    render();
  }
  function fromClientX(clientX) {
    const rect = track.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    commit(min + ratio * (safeMax - min));
  }

  track.addEventListener("pointerdown", (event) => {
    track.setPointerCapture(event.pointerId);
    dragging = true;
    fromClientX(event.clientX);
  });
  track.addEventListener("pointermove", (event) => {
    if (dragging) fromClientX(event.clientX);
  });
  track.addEventListener("pointerup", () => {
    dragging = false;
    render();
  });
  track.addEventListener("pointercancel", () => {
    dragging = false;
    render();
  });
  track.addEventListener("keydown", (event) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? step
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -step
          : event.key === "Home"
            ? min - current
            : event.key === "End"
              ? safeMax - current
              : 0;
    if (!delta) return;
    event.preventDefault();
    commit(current + delta);
  });
  render();

  return {
    get value() { return current; },
    setValue(next) {
      commit(next);
    },
    destroy() {
      root.innerHTML = "";
    },
  };
}
