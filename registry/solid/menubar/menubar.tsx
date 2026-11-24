import { For, Show, createSignal, onCleanup, onMount } from "solid-js";

export type MenubarItem = { label: string; shortcut?: string; onSelect?: () => void; separator?: boolean };
export type MenubarMenu = { label: string; items: MenubarItem[] };
export type MenubarProps = { menus?: MenubarMenu[] };

const FALLBACK: MenubarMenu[] = [
  { label: "File", items: [{ label: "New file", shortcut: "⌘N" }, { label: "Open", shortcut: "⌘O" }, { separator: true, label: "sep" }, { label: "Save", shortcut: "⌘S" }] },
  { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z" }, { label: "Redo", shortcut: "⇧⌘Z" }] },
  { label: "View", items: [{ label: "Zoom in" }, { label: "Zoom out" }] },
];

export function Menubar(props: MenubarProps) {
  const menus = props.menus ?? FALLBACK;
  const [open, setOpen] = createSignal<number | null>(null);
  let root: HTMLDivElement | undefined;

  const onPointer = (event: PointerEvent) => {
    if (open() !== null && root && !root.contains(event.target as Node)) setOpen(null);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") setOpen(null);
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
    <div ref={root} role="menubar" class="flex items-center gap-1 rounded-lg border p-1">
      <For each={menus}>
        {(menu, index) => (
          <div class="relative">
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={open() === index()}
              onClick={() => setOpen(open() === index() ? null : index())}
              onPointerEnter={() => open() !== null && setOpen(index())}
              class={`h-7 rounded-md px-2.5 text-[13px] font-medium transition-colors ${
                open() === index()
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {menu.label}
            </button>
            <Show when={open() === index()}>
              <div role="menu" class="mb-panel absolute left-0 top-full z-40 mt-1 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl">
                <For each={menu.items}>
                  {(item, itemIndex) => (
                    <Show
                      when={!item.separator}
                      fallback={<div role="separator" class="my-1 h-px bg-border" />}
                    >
                      <button
                        type="button"
                        role="menuitem"
                        class="mb-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                        style={{ "animation-delay": `${itemIndex() * 30}ms` }}
                        onClick={() => {
                          item.onSelect?.();
                          setOpen(null);
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
          </div>
        )}
      </For>
      <style>{`
        .mb-panel { animation: mb-in 220ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .mb-row { animation: mb-row 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
        @keyframes mb-in { from { opacity: 0; } }
        @keyframes mb-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
        @media (prefers-reduced-motion: reduce) { .mb-panel, .mb-row { animation: none; } }
      `}</style>
    </div>
  );
}
