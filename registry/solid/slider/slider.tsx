import { createSignal } from "solid-js";

export type SliderProps = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  onValueChange?: (value: number) => void;
  class?: string;
};

export function Slider(props: SliderProps) {
  const min = () => props.min ?? 0;
  const max = () => (props.max !== undefined && props.max > min() ? props.max : min() + 100);
  const step = () => props.step ?? 1;
  const [internal, setInternal] = createSignal(props.defaultValue ?? 42);
  const current = () => props.value ?? internal();
  const [dragging, setDragging] = createSignal(false);
  let track: HTMLDivElement | undefined;
  const percent = () => Math.min(100, Math.max(0, ((current() - min()) / (max() - min())) * 100));

  const commit = (next: number) => {
    const snapped = Math.round((next - min()) / step()) * step() + min();
    const clamped = Math.min(max(), Math.max(min(), snapped));
    if (props.value === undefined) setInternal(clamped);
    props.onValueChange?.(clamped);
  };
  const fromClientX = (clientX: number) => {
    const rect = track?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    commit(min() + ratio * (max() - min()));
  };
  const onDown = (event: PointerEvent & { currentTarget: HTMLDivElement }) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    fromClientX(event.clientX);
  };
  const onMove = (event: PointerEvent) => {
    if (dragging()) fromClientX(event.clientX);
  };
  const onKey = (event: KeyboardEvent) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? step()
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -step()
          : event.key === "Home"
            ? min() - current()
            : event.key === "End"
              ? max() - current()
              : 0;
    if (!delta) return;
    event.preventDefault();
    commit(current() + delta);
  };

  return (
    <div class={`w-full max-w-[360px] ${props.class ?? ""}`}>
      <div class="mb-2 flex items-center justify-between text-[13px]">
        <span class="text-muted-foreground">{props.label ?? "Volume"}</span>
        {props.showValue !== false && <span class="tabular-nums">{current()}</span>}
      </div>
      <div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-valuemin={min()}
        aria-valuemax={max()}
        aria-valuenow={current()}
        aria-label={props.label ?? "Volume"}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
        onKeyDown={onKey}
        class="relative flex h-6 w-full touch-none select-none items-center outline-none"
      >
        <div class="h-1.5 w-full overflow-hidden rounded-full bg-accent">
          <div
            class="h-full rounded-full bg-foreground transition-[width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
            style={{ width: `${percent()}%` }}
          />
        </div>
        <span
          aria-hidden="true"
          class={`absolute top-1/2 block h-3 -translate-y-1/2 rounded-full border bg-background shadow-sm transition-[left,width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none ${
            dragging() ? "border-foreground/40" : ""
          }`}
          style={{
            left: `${percent()}%`,
            width: dragging() ? "14.25px" : "12px",
            "margin-left": "-6px",
          }}
        />
      </div>
    </div>
  );
}
