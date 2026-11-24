import { For, createSignal } from "solid-js";

export type RadioGroupItem = {
  value: string;
  label: string;
  hint?: string;
};

export type RadioGroupProps = {
  items?: RadioGroupItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  class?: string;
};

const FALLBACK: RadioGroupItem[] = [
  { value: "standard", label: "Standard", hint: "5–7 business days" },
  { value: "express", label: "Express", hint: "2–3 business days" },
  { value: "overnight", label: "Overnight", hint: "Next business day" },
];

export function RadioGroup(props: RadioGroupProps) {
  const items = () => props.items ?? FALLBACK;
  const [internal, setInternal] = createSignal(props.defaultValue ?? "standard");
  const current = () => props.value ?? internal();

  const choose = (next: string) => {
    if (props.value === undefined) setInternal(next);
    props.onValueChange?.(next);
  };

  return (
    <div role="radiogroup" class={`flex flex-col gap-2 ${props.class ?? ""}`}>
      <For each={items()}>
        {(item) => (
          <button
            type="button"
            role="radio"
            aria-checked={item.value === current()}
            onClick={() => choose(item.value)}
            class="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left text-[13px] transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.97]"
          >
            <span class="flex size-4 items-center justify-center rounded-full border">
              <span
                aria-hidden="true"
                class="size-2 rounded-full bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
                style={{ transform: `scale(${item.value === current() ? 1 : 0})` }}
              />
            </span>
            <span class="flex-1">{item.label}</span>
            {item.hint && <span class="text-[13px] text-muted-foreground">{item.hint}</span>}
          </button>
        )}
      </For>
    </div>
  );
}
