import { For, createEffect, createMemo, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

export type HexagonProps = {
  hexagonSize?: number;
  hexagonMargin?: number;
  speed?: number;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function Hexagon(props: HexagonProps) {
  let root: HTMLDivElement | undefined;
  let observer: ResizeObserver | undefined;

  const [grid, setGrid] = createSignal({ rows: 0, columns: 0 });

  const width = createMemo(() => props.hexagonSize ?? 46);
  const height = createMemo(() => width() * 1.1);
  const margin = createMemo(() => props.hexagonMargin ?? 3);
  const rowSpacing = createMemo(() => height() * 0.75 + margin());
  const rows = createMemo(() => Array.from({ length: grid().rows }, (_, index) => index));
  const columns = createMemo(() =>
    Array.from({ length: grid().columns }, (_, index) => index),
  );

  const update = () => {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const nextRows = Math.ceil(rect.height / rowSpacing()) + 2;
    const nextColumns = Math.ceil(rect.width / (width() + margin())) + 2;
    const current = grid();
    if (current.rows === nextRows && current.columns === nextColumns) return;
    setGrid({ rows: nextRows, columns: nextColumns });
  };

  onMount(() => {
    update();
    observer = new ResizeObserver(update);
    if (root) observer.observe(root);
  });

  createEffect(() => {
    width();
    margin();
    rowSpacing();
    update();
  });

  return (
    <div
      ref={root}
      data-slot="hexagon-background"
      class={`relative isolate size-full overflow-hidden bg-[#f4f2ee] dark:bg-[#0b0b0f] ${props.class ?? ""}`}
      style={{
        "--hex-leave": `${1000 / Math.max(0.1, props.speed ?? 1)}ms`,
        ...(props.style ?? {}),
      }}
    >
      <div
        aria-hidden="true"
        class="absolute left-0 top-0 size-full overflow-hidden [text-rendering:optimizeSpeed]"
      >
        <For each={rows()}>
          {(row) => (
            <div
              class="flex w-max"
              style={{
                "margin-top": `${row === 0 ? -height() / 2 : rowSpacing() - height()}px`,
                "margin-left": `${(row % 2 === 0 ? 0 : -width() / 2) - width() / 2}px`,
              }}
            >
              <For each={columns()}>
                {(column) => (
                  <div
                    class="relative shrink-0"
                    style={{
                      width: `${width()}px`,
                      height: `${height()}px`,
                      "margin-left": `${margin()}px`,
                    }}
                  >
                    <div
                      class="absolute inset-0 bg-foreground/[0.10] transition-colors [transition-duration:var(--hex-leave)] [clip-path:var(--hex-clip)] hover:bg-foreground/[0.22] hover:[transition-duration:0ms] dark:bg-foreground/[0.14] dark:hover:bg-foreground/[0.30]"
                      style={{ "--hex-clip": HEX_CLIP }}
                    />
                    <div
                      class="absolute bg-[#f4f2ee] transition-colors [transition-duration:var(--hex-leave)] [clip-path:var(--hex-clip)] hover:bg-foreground/[0.06] hover:[transition-duration:0ms] dark:bg-[#0b0b0f] dark:hover:bg-foreground/[0.12]"
                      style={{
                        inset: `${margin()}px`,
                        "--hex-clip": HEX_CLIP,
                      }}
                    />
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(244,242,238,0.55))] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,11,15,0.65))]" />
      {props.children}
    </div>
  );
}
