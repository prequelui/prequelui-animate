import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { ChevronDown } from "lucide-solid";

export type NavigationItem = { label: string; content: unknown };
export type NavigationMenuProps = { items?: NavigationItem[] };

const FALLBACK: NavigationItem[] = [
  { label: "Components", content: "Every primitive, with the same motion contract." },
  { label: "Templates", content: "Full pages built on the same tokens." },
  { label: "Docs", content: "Installation, accessibility and API references." },
];

export function NavigationMenu(props: NavigationMenuProps) {
  const items = props.items ?? FALLBACK;
  const [open, setOpen] = createSignal<number | null>(null);
  let root: HTMLDivElement | undefined;
  let timer: number | undefined;

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
    clearTimeout(timer);
    document.removeEventListener("pointerdown", onPointer);
    document.removeEventListener("keydown", onKey);
  });

  return (
    <div
      ref={root}
      class="relative w-full max-w-sm"
      onPointerLeave={() => {
        timer = window.setTimeout(() => setOpen(null), 180);
      }}
      onPointerEnter={() => clearTimeout(timer)}
    >
      <div role="menubar" class="flex items-center gap-1 rounded-lg border p-1">
        <For each={items}>
          {(item, index) => (
            <button
              type="button"
              aria-expanded={open() === index()}
              onClick={() => setOpen(open() === index() ? null : index())}
              onPointerEnter={() => setOpen(index())}
              class={`flex h-7 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium transition-colors ${
                open() === index()
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              <ChevronDown class={`size-3 transition-transform ${open() === index() ? "rotate-180" : ""}`} />
            </button>
          )}
        </For>
      </div>
      <Show when={open() !== null} keyed>
        <div class="nav-panel absolute left-0 top-full z-40 mt-1.5 w-full overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
          <div class="nav-content text-[13px] leading-6 text-muted-foreground">
            {items[open()!]?.content as never}
          </div>
        </div>
      </Show>
      <style>{`
        .nav-panel { animation: nav-in 240ms cubic-bezier(0.215,0.61,0.355,1) both; }
        .nav-content { animation: nav-content 200ms cubic-bezier(0.215,0.61,0.355,1) both; }
        @keyframes nav-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
        @keyframes nav-content { from { opacity: 0; transform: translateX(6px); } }
        @media (prefers-reduced-motion: reduce) { .nav-panel, .nav-content { animation: none; } }
      `}</style>
    </div>
  );
}
