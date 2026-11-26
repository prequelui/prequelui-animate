// @ts-nocheck
import { For, Show, createSignal, onCleanup, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import { CategoryPictogram } from "./category-core";

function gradientOf(definition) {
  const { light, dark } = definition.palette;
  return `linear-gradient(45deg, light-dark(${light[0]}, ${dark[0]}), light-dark(${light[1]}, ${dark[1]}))`;
}

export function CategoryRow(props) {
  let scroller;
  const [hovered, setHovered] = createSignal(null);
  const [state, setState] = createSignal({ left: false, right: false, overflow: false });
  let observer = null;

  const measure = () => {
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    setState({
      left: scroller.scrollLeft > 1,
      right: max - scroller.scrollLeft > 1,
      overflow: max > 1,
    });
  };

  const scrollBy = (direction) => {
    if (!scroller) return;
    const amount = Math.max(240, Math.round(scroller.clientWidth * 0.7));
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollBy({ left: direction * amount, behavior: reduce ? "auto" : "smooth" });
  };

  onMount(() => {
    if (!scroller) return;
    measure();
    scroller.addEventListener("scroll", measure, { passive: true });
    observer = new ResizeObserver(measure);
    observer.observe(scroller);
    onCleanup(() => {
      scroller?.removeEventListener("scroll", measure);
      observer?.disconnect();
    });
  });

  const isActive = (item) =>
    item.active ? true : hovered() === item.definition.slug ? true : undefined;

  return (
    <nav
      data-category-row=""
      aria-label={props.ariaLabel ?? "Categories"}
      class={`relative w-full ${props.class ?? props.className ?? ""}`}
    >
      <div
        ref={scroller}
        class="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <ul class="mx-auto flex w-max min-w-full items-stretch justify-center px-3 py-4">
          <For each={props.items ?? []}>
            {(item) => (
              <li
                class="shrink-0 snap-start px-2.5"
                onPointerEnter={() => setHovered(item.definition.slug)}
                onPointerLeave={() =>
                  setHovered(hovered() === item.definition.slug ? null : hovered())
                }
              >
                <Dynamic
                  component={item.href ? "a" : "button"}
                  href={item.href || undefined}
                  type={item.href ? undefined : "button"}
                  aria-current={item.active ? "page" : undefined}
                  class="group/cat relative flex min-w-14 select-none flex-col items-center gap-1 rounded-md py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background max-md:py-2.5"
                  onClick={() => (item.href ? undefined : props.onSelect?.(item))}
                  onFocus={() => setHovered(item.definition.slug)}
                  onBlur={() => setHovered(null)}
                >
                  <CategoryPictogram
                    definition={item.definition}
                    size={props.size ?? 40}
                    active={isActive(item)}
                    class="text-foreground"
                  />
                  <span
                    data-category-label=""
                    class={`w-full text-center text-[15px] leading-[19px] text-foreground ${
                      item.active ? "font-medium" : ""
                    }`}
                  >
                    {item.label ?? item.definition.name}
                  </span>
                  <span
                    aria-hidden="true"
                    class={`pointer-events-none absolute -bottom-[5px] left-1/2 h-0.5 w-6 -translate-x-1/2 origin-center rounded-full bg-background transition-transform duration-100 ease-out scale-x-0 group-hover/cat:scale-x-100 group-focus-visible/cat:scale-x-100 ${
                      item.active ? "scale-x-100" : ""
                    } motion-reduce:transition-none`}
                    style={`background-image:${gradientOf(item.definition)}`}
                  />
                  <Show when={item.badge}>
                    <span
                      class="absolute -left-1 -top-2 rounded-full px-1.5 py-0.5 text-[13px] font-semibold uppercase leading-none"
                      style={`background-image:${gradientOf(item.definition)};color:light-dark(#ffffff, #171717)`}
                    >
                      {item.badge}
                    </span>
                  </Show>
                </Dynamic>
              </li>
            )}
          </For>
        </ul>
      </div>

      <Show when={state().overflow}>
        <button
          type="button"
          aria-label="Scroll categories left"
          tabindex={state().left ? 0 : -1}
          class={`absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground ${
            state().left
              ? "translate-x-0 opacity-100"
              : "-translate-x-2 opacity-0 pointer-events-none"
          }`}
          onClick={() => scrollBy(-1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
            aria-hidden="true"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Scroll categories right"
          tabindex={state().right ? 0 : -1}
          class={`absolute inset-y-0 right-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground ${
            state().right
              ? "translate-x-0 opacity-100"
              : "translate-x-2 opacity-0 pointer-events-none"
          }`}
          onClick={() => scrollBy(1)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="size-4"
            aria-hidden="true"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </Show>
    </nav>
  );
}
