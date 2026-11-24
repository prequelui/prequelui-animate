const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export function createHexagon(root, options = {}) {
  const {
    content = "",
    hexagonSize = 46,
    hexagonMargin = 3,
    speed = 1,
    className = "",
  } = options;
  const width = hexagonSize;
  const height = width * 1.1;
  const margin = hexagonMargin;
  const rowSpacing = height * 0.75 + margin;
  let observer;
  let rows = 0;
  let columns = 0;

  root.innerHTML = `
    <div data-slot="hexagon-background"
      class="relative isolate size-full overflow-hidden bg-[#f4f2ee] dark:bg-[#0b0b0f] ${className}"
      style="--hex-leave:${1000 / Math.max(0.1, speed)}ms">
      <div data-grid aria-hidden="true" class="absolute left-0 top-0 size-full overflow-hidden [text-rendering:optimizeSpeed]"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(244,242,238,0.55))] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,11,15,0.65))]"></div>
      ${content}
    </div>`;
  const host = root.querySelector("[data-slot]");
  const grid = root.querySelector("[data-grid]");

  function render() {
    let html = "";
    for (let row = 0; row < rows; row += 1) {
      const rowStyle = `margin-top:${row === 0 ? -height / 2 : rowSpacing - height}px;margin-left:${
        (row % 2 === 0 ? 0 : -width / 2) - width / 2
      }px`;
      html += `<div class="flex w-max" style="${rowStyle}">`;
      for (let column = 0; column < columns; column += 1) {
        html += `
          <div class="relative shrink-0" style="width:${width}px;height:${height}px;margin-left:${margin}px">
            <div class="absolute inset-0 bg-foreground/[0.10] transition-colors [transition-duration:var(--hex-leave)] [clip-path:var(--hex-clip)] hover:bg-foreground/[0.22] hover:[transition-duration:0ms] dark:bg-foreground/[0.14] dark:hover:bg-foreground/[0.30]"
              style="--hex-clip:${HEX_CLIP}"></div>
            <div class="absolute bg-[#f4f2ee] transition-colors [transition-duration:var(--hex-leave)] [clip-path:var(--hex-clip)] hover:bg-foreground/[0.06] hover:[transition-duration:0ms] dark:bg-[#0b0b0f] dark:hover:bg-foreground/[0.12]"
              style="inset:${margin}px;--hex-clip:${HEX_CLIP}"></div>
          </div>`;
      }
      html += "</div>";
    }
    grid.innerHTML = html;
  }

  function update() {
    const rect = host.getBoundingClientRect();
    const nextRows = Math.ceil(rect.height / rowSpacing) + 2;
    const nextColumns = Math.ceil(rect.width / (width + margin)) + 2;
    if (nextRows === rows && nextColumns === columns) return;
    rows = nextRows;
    columns = nextColumns;
    render();
  }

  update();
  observer = new ResizeObserver(update);
  observer.observe(host);

  return {
    element: host,
    destroy() {
      observer?.disconnect();
      root.innerHTML = "";
    },
  };
}
