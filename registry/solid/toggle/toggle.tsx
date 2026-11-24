import { createSignal } from "solid-js";

export type ToggleProps = {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children?: unknown;
  class?: string;
};

export function Toggle(props: ToggleProps) {
  const [internal, setInternal] = createSignal(props.defaultPressed ?? false);
  const value = () => props.pressed ?? internal();

  const toggle = () => {
    const next = !value();
    if (props.pressed === undefined) setInternal(next);
    props.onPressedChange?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={value()}
      onClick={toggle}
      class={`relative inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97] ${
        value()
          ? "bg-primary text-primary-foreground"
          : "bg-background text-muted-foreground hover:bg-accent"
      } ${props.class ?? ""}`}
    >
      <span
        aria-hidden="true"
        class={`block size-2 rounded-full transition-colors duration-200 ${
          value() ? "bg-[#7ee2a8]" : "bg-muted-foreground/50"
        }`}
      />
      {(props.children as never) ?? "Live preview"}
    </button>
  );
}
