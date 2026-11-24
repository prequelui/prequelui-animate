import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { Check, ChevronDown } from "lucide-solid";

export type ComboboxOption = { value: string; label: string };
export type ComboboxProps = {
  options?: ComboboxOption[];
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
};

const FALLBACK: ComboboxOption[] = [
  { value: "base-ui", label: "Base UI" },
  { value: "radix-ui", label: "Radix UI" },
  { value: "react-aria", label: "React Aria" },
  { value: "reka-ui", label: "Reka UI" },
];

export function Combobox(props: ComboboxProps) {
  const options = props.options ?? FALLBACK;
  const [query, setQuery] = createSignal(props.defaultValue ?? "");
  const [value, setValue] = createSignal(props.defaultValue ?? "");
  const [open, setOpen] = createSignal(false);
  const [active, setActive] = createSignal(0);
  let root: HTMLDivElement | undefined;

  const filtered = () =>
    options.filter((option) =>
      option.label.toLowerCase().includes(query().toLowerCase()),
    );

  function choose(option: ComboboxOption) {
    setValue(option.value);
    setQuery(option.label);
    setOpen(false);
    props.onChange?.(option.value);
  }

  const onPointer = (event: PointerEvent) => {
    if (open() && root && !root.contains(event.target as Node)) setOpen(false);
  };
  onMount(() => {
    document.addEventListener("pointerdown", onPointer);
    onCleanup(() => document.removeEventListener("pointerdown", onPointer));
  });

  function onKey(event: KeyboardEvent) {
    if (event.key === "Escape") setOpen(false);
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(filtered().length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter" && filtered()[active()]) {
      choose(filtered()[active()]);
    }
  }

  return (
    <div ref={root} class="relative w-56 text-[13px]">
      <div class="flex h-9 items-center rounded-lg border bg-background px-2.5">
        <input
          role="combobox"
          aria-expanded={open()}
          aria-controls="combobox-list"
          aria-autocomplete="list"
          value={query()}
          placeholder={props.placeholder ?? "Pick a library"}
          onInput={(event) => {
            setQuery(event.currentTarget.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKey}
          class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
        />
        <ChevronDown class="size-4 shrink-0 text-muted-foreground" />
      </div>
      <Show when={open()}>
        <ul id="combobox-list" role="listbox" class="combo-panel absolute top-full z-40 mt-1.5 w-full rounded-xl border bg-background p-1 shadow-xl">
          <Show when={filtered().length === 0}>
            <li class="px-2 py-2 text-muted-foreground">No result</li>
          </Show>
          <For each={filtered()}>
            {(option, index) => (
              <li
                role="option"
                aria-selected={option.value === value()}
                class="combo-row relative flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5"
                style={{ "animation-delay": `${index() * 30}ms` }}
                onPointerEnter={() => setActive(index())}
                onClick={() => choose(option)}
              >
                {option.label}
                <Show when={option.value === value()}>
                  <Check class="size-3.5" />
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <style>{`
        .combo-panel { animation: combo-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .combo-row { animation: combo-row 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
        @keyframes combo-in { from { opacity: 0; transform: translateY(-4px); } }
        @keyframes combo-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
        @media (prefers-reduced-motion: reduce) { .combo-panel, .combo-row { animation: none; } }
      `}</style>
    </div>
  );
}
