export type ProgressProps = {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  class?: string;
};

export function Progress(props: ProgressProps) {
  const safeMax = () => (props.max && props.max > 0 ? props.max : 100);
  const clamped = () => Math.min(safeMax(), Math.max(0, props.value ?? 0));
  const percent = () => (clamped() / safeMax()) * 100;

  return (
    <div class={`w-full max-w-[380px] ${props.class ?? ""}`}>
      <div class="mb-2 flex items-center justify-between text-[13px] text-muted-foreground">
        <span>{props.label ?? "Uploading assets"}</span>
        {props.showValue !== false && <span class="tabular-nums">{Math.round(clamped())}%</span>}
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax()}
        aria-valuenow={clamped()}
        class="h-2 w-full overflow-hidden rounded-full bg-accent"
      >
        <div
          class="h-full rounded-full bg-foreground transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{ width: `${percent()}%` }}
        />
      </div>
    </div>
  );
}
