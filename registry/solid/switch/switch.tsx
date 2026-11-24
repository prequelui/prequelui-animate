import { createSignal } from "solid-js";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  class?: string;
};

export function Switch(props: SwitchProps) {
  const [internal, setInternal] = createSignal(props.defaultChecked ?? false);
  const value = () => props.checked ?? internal();
  const [pressed, setPressed] = createSignal(false);

  const toggle = () => {
    if (props.disabled) return;
    const next = !value();
    if (props.checked === undefined) setInternal(next);
    props.onCheckedChange?.(next);
  };

  return (
    <label class={`flex items-center gap-3 text-[13px] ${props.class ?? ""}`}>
      <button
        type="button"
        role="switch"
        aria-checked={value()}
        aria-label={props.label ?? "Enable notifications"}
        disabled={props.disabled}
        onClick={toggle}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        class={`relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 ${
          value() ? "bg-primary" : "bg-input"
        }`}
      >
        <span
          aria-hidden="true"
          class="block h-5 rounded-full bg-background shadow-sm transition-[transform,width] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
          style={{
            transform: `translateX(${value() ? 20 : 0}px)`,
            width: pressed() ? "24px" : "20px",
          }}
        />
      </button>
      {props.label && <span>{props.label}</span>}
    </label>
  );
}
