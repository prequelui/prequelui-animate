import { For, Show, createEffect, createMemo, createSignal } from "solid-js";

export type ToggleGroupItem = { value: string; label: string };

export type ToggleGroupProps = {
  items?: Array<ToggleGroupItem | string>;
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  class?: string;
};

const FALLBACK = ["day", "week", "month"];

const asArray = (value: string | string[] | undefined) =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

export function ToggleGroup(props: ToggleGroupProps) {
  const options = createMemo(() =>
    (props.items ?? FALLBACK).map((item) =>
      typeof item === "string" ? { value: item, label: item } : item,
    ),
  );
  const [internal, setInternal] = createSignal(asArray(props.defaultValue ?? options()[0]?.value));
  const selected = () => asArray(props.value ?? internal());
  let buttons: HTMLButtonElement[] = [];
  const [indicator, setIndicator] = createSignal({ left: 0, width: 0 });

  const measure = () => {
    const index = options().findIndex((item) => selected().includes(item.value));
    const node = buttons[index];
    if (!node) return;
    setIndicator({ left: node.offsetLeft, width: node.offsetWidth });
  };
  createEffect(() => {
    selected();
    options();
    requestAnimationFrame(measure);
  });

  const toggle = (next: string) => {
    let result: string[];
    if (props.type === "multiple") {
      result = selected().includes(next)
        ? selected().filter((entry) => entry !== next)
        : [...selected(), next];
    } else {
      result = selected().includes(next) ? [] : [next];
    }
    if (props.value === undefined) setInternal(result);
    props.onValueChange?.(props.type === "multiple" ? result : (result[0] ?? ""));
    requestAnimationFrame(measure);
  };

  return (
    <div role="group" class={`relative flex items-center rounded-lg bg-accent p-1 ${props.class ?? ""}`}>
      <Show when={props.type !== "multiple" && selected().length > 0}>
        <span
          aria-hidden="true"
          class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"
          style={{ left: `${indicator().left}px`, width: `${indicator().width}px` }}
        />
      </Show>
      <For each={options()}>
        {(item, index) => (
          <button
            ref={(node) => {
              buttons[index()] = node;
            }}
            type="button"
            aria-pressed={selected().includes(item.value)}
            onClick={() => toggle(item.value)}
            class={`relative rounded-md px-3 py-1.5 text-[13px] capitalize transition-[color,background-color,transform] duration-200 active:scale-[0.97] ${
              selected().includes(item.value)
                ? props.type === "multiple"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.label}
          </button>
        )}
      </For>
    </div>
  );
}
