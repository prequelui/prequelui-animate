import { Show, createSignal, onCleanup, onMount } from "solid-js";

export type PopoverProps = {
  trigger?: string;
  title?: string;
  description?: string;
  side?: "top" | "bottom";
  children?: unknown;
};

export function Popover(props: PopoverProps) {
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
        aria-haspopup="dialog"
        aria-expanded={open()}
        onClick={() => setOpen((value) => !value)}
        class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
      >
        {props.trigger ?? "Share project"}
      </button>
      <Show when={open()}>
        <div
          role="dialog"
          class={`pop absolute left-0 z-40 w-64 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl ${
            props.side === "top" ? "bottom-full mb-2 origin-bottom" : "top-full mt-2 origin-top"
          }`}
        >
          <p class="text-[13px] font-medium">{props.title ?? "Anyone with the link"}</p>
          <p class="mt-1 text-[13px] leading-5 text-muted-foreground">
            {props.description ?? "People with the link can view this project but cannot edit it."}
          </p>
          {props.children as never}
        </div>
      </Show>
      <style>{`
        .pop { animation: pop-in 320ms cubic-bezier(0.23,1,0.32,1) both; }
        @keyframes pop-in { from { opacity: 0; transform: scale(0.8); } }
        @media (prefers-reduced-motion: reduce) { .pop { animation: pop-fade 150ms linear both; } @keyframes pop-fade { from { opacity: 0; } } }
      `}</style>
    </div>
  );
}
