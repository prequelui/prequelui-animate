import { For, createEffect, createSignal, onMount } from "solid-js";
import { animate } from "motion";
import { ChevronLeft, ChevronRight } from "lucide-solid";

export type PaginationProps = {
  pages?: number;
  defaultPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
};

export function Pagination(props: PaginationProps) {
  const pages = props.pages ?? 5;
  const [internal, setInternal] = createSignal(props.defaultPage ?? 1);
  const current = () => props.page ?? internal();
  const buttons: Record<number, HTMLButtonElement | undefined> = {};
  let indicator: HTMLSpanElement | undefined;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function place(animated: boolean) {
    const target = buttons[current()];
    if (!target || !indicator) return;
    const x = target.offsetLeft;
    const width = target.offsetWidth;
    if (!animated || reduce()) {
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.width = `${width}px`;
      return;
    }
    animate(indicator, { x, width }, { type: "spring", stiffness: 500, damping: 40 });
  }

  let ready = false;

  function go(next: number) {
    const value = Math.min(pages, Math.max(1, next));
    if (props.page === undefined) setInternal(value);
    props.onPageChange?.(value);
  }

  onMount(() =>
    requestAnimationFrame(() => {
      ready = true;
      place(false);
    }),
  );
  createEffect(() => {
    current();
    if (ready) requestAnimationFrame(() => place(true));
  });

  return (
    <nav aria-label="Pagination" class="relative flex items-center gap-1">
      <button type="button" aria-label="Previous page" disabled={current() === 1} onClick={() => go(current() - 1)} class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40">
        <ChevronLeft class="size-4" />
      </button>
      <span ref={indicator} class="absolute inset-y-0 left-0 rounded-md border bg-background shadow-sm" aria-hidden="true" />
      <For each={Array.from({ length: pages }, (_, index) => index + 1)}>
        {(item) => (
          <button
            ref={(node) => {
              buttons[item] = node;
            }}
            type="button"
            aria-current={item === current() ? "page" : undefined}
            onClick={() => go(item)}
            class={`relative flex size-8 items-center justify-center rounded-md text-[13px] font-medium ${
              item === current() ? "text-foreground" : "text-muted-foreground"
            }`}
          >
            {item}
          </button>
        )}
      </For>
      <button type="button" aria-label="Next page" disabled={current() === pages} onClick={() => go(current() + 1)} class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40">
        <ChevronRight class="size-4" />
      </button>
    </nav>
  );
}
