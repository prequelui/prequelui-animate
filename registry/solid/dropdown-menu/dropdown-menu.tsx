import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { ChevronDown } from "lucide-solid";

export type DropdownItem = {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
  separator?: boolean;
};

export type DropdownMenuProps = {
  trigger?: string;
  items: DropdownItem[];
  align?: "start" | "end";
};

export function DropdownMenu(props: DropdownMenuProps) {
  const [open, setOpen] = createSignal(false);
  let root: HTMLDivElement | undefined;

  const onPointer = (event: PointerEvent) => {
    if (open() && root && !root.contains(event.target as Node)) setOpen(false);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") setOpen(false);
  };
  onMount(() => {
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
  });
  onCleanup(() => {
    if (typeof window === "undefined") return;
    document.removeEventListener("pointerdown", onPointer);
    document.removeEventListener("keydown", onKey);
  });

  return (
    <div ref={root} class="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open()}
        onClick={() => setOpen((value) => !value)}
        class="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium"
      >
        {props.trigger ?? "Actions"}
        <ChevronDown class="size-3.5 text-muted-foreground" />
      </button>
      <Show when={open()}>
        <div
          role="menu"
          class="menu-panel absolute top-full z-40 mt-1.5 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl"
          classList={{ "right-0": props.align === "end", "left-0": props.align !== "end" }}
        >
          <For each={props.items}>
            {(item, index) => (
              <Show
                when={!item.separator}
                fallback={<div role="separator" class="my-1 h-px bg-border" />}
              >
                <button
                  type="button"
                  role="menuitem"
                  class="menu-item flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                  style={{ "animation-delay": `${index() * 30}ms` }}
                  onClick={() => {
                    item.onSelect?.();
                    setOpen(false);
                  }}
                >
                  <span>{item.label}</span>
                  <Show when={item.shortcut}>
                    <span class="font-mono text-[13px] text-muted-foreground">{item.shortcut}</span>
                  </Show>
                </button>
              </Show>
            )}
          </For>
        </div>
      </Show>
      <style>{`
        .menu-panel { animation: menu-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .menu-item { animation: menu-item-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
        @keyframes menu-in { from { opacity: 0; } }
        @keyframes menu-item-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
        @media (prefers-reduced-motion: reduce) { .menu-panel, .menu-item { animation: none; } }
      `}</style>
    </div>
  );
}
