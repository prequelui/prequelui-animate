let uid = 0;

export function createProgress(root, options = {}) {
  const { value = 0, max = 100, label = "Uploading assets", showValue = true } = options;
  const id = `progress-${++uid}`;
  const safeMax = max > 0 ? max : 100;
  let current = Math.min(safeMax, Math.max(0, value));

  root.innerHTML = `
    <div class="w-full max-w-[380px]" data-progress="${id}">
      <div class="mb-2 flex items-center justify-between text-[13px] text-muted-foreground">
        <span>${label}</span>
        <span class="tabular-nums" data-value>${Math.round(current)}%</span>
      </div>
      <div role="progressbar" aria-valuemin="0" aria-valuemax="${safeMax}"
        class="h-2 w-full overflow-hidden rounded-full bg-accent">
        <div data-fill class="h-full rounded-full bg-foreground transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"></div>
      </div>
    </div>`;
  const host = root.querySelector(`[data-progress="${id}"]`);
  const fill = host.querySelector("[data-fill]");
  const output = host.querySelector("[data-value]");
  const bar = host.querySelector('[role="progressbar"]');

  function render() {
    fill.style.width = `${(current / safeMax) * 100}%`;
    bar.setAttribute("aria-valuenow", String(current));
    if (output) output.textContent = `${Math.round(current)}%`;
  }
  render();

  return {
    setValue(next) {
      current = Math.min(safeMax, Math.max(0, next));
      render();
    },
    destroy() {
      root.innerHTML = "";
    },
  };
}
