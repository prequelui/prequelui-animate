import { createCategoryPictogram } from "./category-core.js";

function gradientOf(definition) {
  const { light, dark } = definition.palette;
  return `linear-gradient(45deg, light-dark(${light[0]}, ${dark[0]}), light-dark(${light[1]}, ${dark[1]}))`;
}

const CHEVRON_LEFT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;
const CHEVRON_RIGHT = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;

export function createCategoryRow(root, options = {}) {
  let items = options.items ?? [];
  const size = options.size ?? 40;
  const ariaLabel = options.ariaLabel ?? "Categories";
  const className = options.className ?? "";
  let controllers = [];
  let observer = null;

  root.innerHTML = `<nav data-category-row="" aria-label="${ariaLabel}" class="relative w-full${
    className ? ` ${className}` : ""
  }"><div data-category-scroller="" class="overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"><ul data-category-list="" class="mx-auto flex w-max min-w-full items-stretch justify-center px-3 py-4"></ul></div><button type="button" data-category-arrow="left" aria-label="Scroll categories left" class="absolute inset-y-0 left-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground -translate-x-2 opacity-0 pointer-events-none">${CHEVRON_LEFT}</button><button type="button" data-category-arrow="right" aria-label="Scroll categories right" class="absolute inset-y-0 right-0 z-10 flex w-8 items-center justify-center bg-background text-muted-foreground transition-[opacity,transform] duration-100 ease-in-out hover:text-foreground translate-x-2 opacity-0 pointer-events-none">${CHEVRON_RIGHT}</button></nav>`;

  const scroller = root.querySelector("[data-category-scroller]");
  const list = root.querySelector("[data-category-list]");
  const left = root.querySelector('[data-category-arrow="left"]');
  const right = root.querySelector('[data-category-arrow="right"]');

  function measure() {
    if (!scroller) return;
    const max = scroller.scrollWidth - scroller.clientWidth;
    const state = {
      left: scroller.scrollLeft > 1,
      right: max - scroller.scrollLeft > 1,
      overflow: max > 1,
    };
    for (const [node, visible, negative] of [
      [left, state.left, true],
      [right, state.right, false],
    ]) {
      if (!node) continue;
      node.style.display = state.overflow ? "" : "none";
      node.tabIndex = visible ? 0 : -1;
      node.classList.toggle("opacity-100", visible);
      node.classList.toggle("opacity-0", !visible);
      node.classList.toggle("pointer-events-none", !visible);
      node.classList.toggle(negative ? "-translate-x-2" : "translate-x-2", !visible);
      node.classList.toggle("translate-x-0", visible);
    }
  }

  function scrollBy(direction) {
    if (!scroller) return;
    const amount = Math.max(240, Math.round(scroller.clientWidth * 0.7));
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollBy({ left: direction * amount, behavior: reduce ? "auto" : "smooth" });
  }

  function build() {
    for (const controller of controllers) controller.destroy();
    controllers = [];
    if (!list) return;
    list.innerHTML = "";
    for (const item of items) {
      const definition = item.definition;
      const label = item.label ?? definition.name;
      const li = document.createElement("li");
      li.className = "shrink-0 snap-start px-2.5";
      const tag = item.href ? "a" : "button";
      const node = document.createElement(tag);
      if (item.href) node.setAttribute("href", item.href);
      else node.setAttribute("type", "button");
      if (item.active) node.setAttribute("aria-current", "page");
      node.className =
        "group/cat relative flex min-w-14 select-none flex-col items-center gap-1 rounded-md py-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background max-md:py-2.5";

      const host = document.createElement("span");
      host.className = "inline-flex";
      node.appendChild(host);

      const labelNode = document.createElement("span");
      labelNode.setAttribute("data-category-label", "");
      labelNode.className = `w-full text-center text-[15px] leading-[19px] text-foreground${
        item.active ? " font-medium" : ""
      }`;
      labelNode.textContent = label;
      node.appendChild(labelNode);

      const underline = document.createElement("span");
      underline.setAttribute("aria-hidden", "true");
      underline.className = `pointer-events-none absolute -bottom-[5px] left-1/2 h-0.5 w-6 -translate-x-1/2 origin-center rounded-full bg-background transition-transform duration-100 ease-out scale-x-0 group-hover/cat:scale-x-100 group-focus-visible/cat:scale-x-100${
        item.active ? " scale-x-100" : ""
      } motion-reduce:transition-none`;
      underline.style.backgroundImage = gradientOf(definition);
      node.appendChild(underline);

      if (item.badge) {
        const badge = document.createElement("span");
        badge.className =
          "absolute -left-1 -top-2 rounded-full px-1.5 py-0.5 text-[13px] font-semibold uppercase leading-none";
        badge.style.backgroundImage = gradientOf(definition);
        badge.style.color = "light-dark(#ffffff, #171717)";
        badge.textContent = item.badge;
        node.appendChild(badge);
      }

      const controller = createCategoryPictogram(host, definition, {
        size,
        active: item.active ? true : undefined,
        animateOnHover: true,
        className: "text-foreground",
      });
      controllers.push(controller);

      node.addEventListener("pointerenter", () => controller.update({ active: true }));
      node.addEventListener("pointerleave", () =>
        controller.update({ active: item.active ? true : undefined }),
      );
      node.addEventListener("focus", () => controller.update({ active: true }));
      node.addEventListener("blur", () =>
        controller.update({ active: item.active ? true : undefined }),
      );
      if (!item.href) {
        node.addEventListener("click", () => options.onSelect?.(item));
      }

      li.appendChild(node);
      list.appendChild(li);
    }
    measure();
  }

  const onLeft = () => scrollBy(-1);
  const onRight = () => scrollBy(1);
  left?.addEventListener("click", onLeft);
  right?.addEventListener("click", onRight);
  scroller?.addEventListener("scroll", measure, { passive: true });
  if (scroller) {
    observer = new ResizeObserver(measure);
    observer.observe(scroller);
  }
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready.then(measure).catch(() => {});
  }
  build();

  return {
    element: root.querySelector("[data-category-row]"),
    update(next = {}) {
      if (next.items) items = next.items;
      build();
    },
    destroy() {
      for (const controller of controllers) controller.destroy();
      controllers = [];
      observer?.disconnect();
      root.removeEventListener("pointerenter", measure);
      left?.removeEventListener("click", onLeft);
      right?.removeEventListener("click", onRight);
      scroller?.removeEventListener("scroll", measure);
      root.innerHTML = "";
    },
  };
}
