import { For, Show, createSignal } from "solid-js";
import { PanelLeft } from "lucide-solid";

export type SidebarItem = {
  value: string;
  label: string;
  icon?: unknown;
};

export type SidebarProps = {
  items?: SidebarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  class?: string;
};

const FALLBACK: SidebarItem[] = [
  { value: "home", label: "Home" },
  { value: "projects", label: "Projects" },
  { value: "team", label: "Team" },
  { value: "settings", label: "Settings" },
];

export function Sidebar(props: SidebarProps) {
  const items = () => props.items ?? FALLBACK;
  const [internal, setInternal] = createSignal(props.defaultValue ?? "projects");
  const current = () => props.value ?? internal();
  const [closedInternal, setClosedInternal] = createSignal(props.defaultCollapsed ?? false);
  const closed = () => props.collapsed ?? closedInternal();

  const select = (next: string) => {
    if (props.value === undefined) setInternal(next);
    props.onValueChange?.(next);
  };
  const toggle = () => {
    const next = !closed();
    if (props.collapsed === undefined) setClosedInternal(next);
    props.onCollapsedChange?.(next);
  };

  return (
    <div
      class={`flex h-[190px] w-full max-w-[320px] overflow-hidden rounded-xl border bg-background ${
        props.class ?? ""
      }`}
    >
      <div
        class="flex shrink-0 flex-col overflow-hidden border-r bg-accent/40 p-2 transition-[width] duration-[280ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
        style={{ width: closed() ? "54px" : "136px" }}
      >
        <div class="mb-3 flex h-7 items-center gap-2 overflow-hidden px-1">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">
            P
          </span>
          <Show when={!closed()}>
            <span class="side-label whitespace-nowrap text-[13px] font-medium">Prequel</span>
          </Show>
        </div>
        <For each={items()}>
          {(item) => (
            <button
              type="button"
              aria-pressed={item.value === current()}
              onClick={() => select(item.value)}
              class={`relative mb-0.5 flex h-7 items-center gap-2 overflow-hidden rounded-md px-2 text-[13px] transition-colors ${
                item.value === current()
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span class="relative shrink-0">
                {(item.icon as never) ?? <span class="block size-1.5 rounded-full bg-current" />}
              </span>
              <Show when={!closed()}>
                <span class="side-label relative whitespace-nowrap">{item.label}</span>
              </Show>
            </button>
          )}
        </For>
      </div>
      <div class="flex min-w-0 flex-1 flex-col p-3">
        <div class="flex items-center justify-between">
          <p class="truncate text-[13px] font-medium">
            {items().find((item) => item.value === current())?.label ?? "Projects"}
          </p>
          <button
            type="button"
            aria-label="Toggle sidebar"
            aria-expanded={!closed()}
            onClick={toggle}
            class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <PanelLeft class="size-3.5" />
          </button>
        </div>
        <div class="mt-3 space-y-2">
          <For each={[70, 92, 58]}>
            {(width) => (
              <div class="flex items-center gap-2">
                <span class="size-1.5 rounded-full bg-border" />
                <span class="h-1.5 rounded-full bg-accent" style={{ width: `${width}%` }} />
              </div>
            )}
          </For>
        </div>
      </div>
      <style>{`
        .side-label { animation: side-label-in 140ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes side-label-in { from { opacity: 0; filter: blur(2px); transform: translateX(-4px); } }
        @media (prefers-reduced-motion: reduce) { .side-label { animation: side-label-fade 140ms linear both; } @keyframes side-label-fade { from { opacity: 0; } } }
      `}</style>
    </div>
  );
}
