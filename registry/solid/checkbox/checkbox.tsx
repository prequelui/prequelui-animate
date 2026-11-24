import { createSignal } from "solid-js";

export type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  class?: string;
};

export function Checkbox(props: CheckboxProps) {
  const [internal, setInternal] = createSignal(props.defaultChecked ?? false);
  const value = () => props.checked ?? internal();

  function toggle() {
    if (props.disabled) return;
    const next = !value();
    if (props.checked === undefined) setInternal(next);
    props.onCheckedChange?.(next);
  }

  return (
    <label class={`flex items-center gap-2.5 text-[13px] ${props.class ?? ""}`}>
      <button
        type="button"
        role="checkbox"
        aria-checked={value()}
        disabled={props.disabled}
        onClick={toggle}
        class={`relative flex size-4 items-center justify-center rounded-[4px] border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
          value() ? "border-foreground" : "border-input"
        }`}
      >
        <span
          aria-hidden="true"
          class="absolute inset-0 rounded-[3px] bg-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          style={{
            transform: `scale(${value() ? 1 : 0.5})`,
            opacity: value() ? 1 : 0,
          }}
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="relative size-3 text-background"
        >
          <path
            d="m5 12 4 4L19 6"
            style={{
              "stroke-dasharray": 20,
              "stroke-dashoffset": value() ? 0 : 20,
              transition: "stroke-dashoffset .25s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        </svg>
      </button>
      <span>{props.label ?? "Accept terms"}</span>
    </label>
  );
}
