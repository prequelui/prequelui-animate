import { For, Show, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { Check, ChevronDown } from "lucide-solid";

export type SelectItem = { value: string; label: string };

export type SelectProps = {
  items?: Array<SelectItem | string>;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  class?: string;
};

const FALLBACK = ["Design", "Engineering", "Marketing", "Support"];

export function Select(props: SelectProps) {
  const options = createMemo(() =>
    (props.items ?? FALLBACK).map((item) =>
      typeof item === "string" ? { value: item, label: item } : item,
    ),
  );
  const [internal, setInternal] = createSignal(props.defaultValue ?? "");
  const current = () => props.value ?? internal();
  const selected = createMemo(() => options().find((option) => option.value === current()));
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  let root: HTMLDivElement | undefined;

  const choose = (option: SelectItem) => {
    if (props.value === undefined) setInternal(option.value);
    props.onValueChange?.(option.value);
    setOpen(false);
  };
  const onPointer = (event: PointerEvent) => {
    if (open() && root && !root.contains(event.target as Node)) setOpen(false);
  };
  onMount(() => {
    document.addEventListener("pointerdown", onPointer);
    onCleanup(() => document.removeEventListener("pointerdown", onPointer));
  });

  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open() && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open()) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(options().length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options()[active()];
      if (option) choose(option);
    }
  };

  return (
    <div ref={root} class={`relative w-[220px] text-[13px] ${props.class ?? ""}`} onKeyDown={onKey}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open()}
        onClick={() => setOpen((value) => !value)}
        class="flex h-9 w-full items-center justify-between rounded-lg border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span class={selected() ? "" : "text-muted-foreground"}>
          {selected()?.label ?? props.placeholder ?? "Select an option"}
        </span>
        <ChevronDown class="size-3.5 text-muted-foreground" />
      </button>
      <Show when={open()}>
        <div
          role="listbox"
          aria-label={props.placeholder ?? "Select an option"}
          class="select absolute left-0 top-full z-40 mt-1.5 w-full origin-top rounded-xl border bg-popover p-1 shadow-lg"
        >
          <For each={options()}>
            {(option, index) => (
              <button
                type="button"
                role="option"
                aria-selected={option.value === current()}
                class={`select-row flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent ${
                  option.value === current() ? "text-foreground" : "text-muted-foreground"
                }`}
                style={{ "animation-delay": `${index() * 30}ms` }}
                onClick={() => choose(option)}
              >
                <span>{option.label}</span>
                <Show when={option.value === current()}>
                  <Check class="size-3.5" />
                </Show>
              </button>
            )}
          </For>
        </div>
      </Show>
      <style>{`
        .select { animation: select-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .select-row { animation: select-row 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
        @keyframes select-in { from { opacity: 0; transform: scale(0.9); } }
        @keyframes select-row { from { opacity: 0; transform: translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) { .select, .select-row { animation: select-fade 150ms linear both; } @keyframes select-fade { from { opacity: 0; } } }
      `}</style>
    </div>
  );
}
