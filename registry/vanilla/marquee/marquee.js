const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function createMarquee(root, options = {}) {
  const {
    content = "",
    speed = 42,
    reverse = false,
    pauseOnHover = true,
    fade = true,
    gap = 32,
    repeat = 2,
    itemClassName = "",
    className = "",
  } = options;
  const copies = Math.max(2, Math.round(repeat));
  let position = 0;
  let span = 0;
  let paused = false;
  let ready = false;
  let raf = 0;
  let last = 0;
  let observer;
  let mutation;

  const mask = fade
    ? "mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent);-webkit-mask-image:linear-gradient(to right, transparent, black 10%, black 90%, transparent);"
    : "";

  const copy = (index) => `<div data-copy class="flex shrink-0 items-center ${itemClassName}" style="gap:${gap}px"${index > 0 ? ' aria-hidden="true"' : ""}>${content}</div>`;
  root.innerHTML = `
    <div data-slot="marquee" class="relative overflow-hidden ${className}" style="${mask}">
      <div data-track class="flex w-max items-center will-change-transform" style="gap:${gap}px">
        ${Array.from({ length: copies }, (_, index) => copy(index)).join("")}
      </div>
    </div>`;
  const host = root.querySelector("[data-slot]");
  const track = root.querySelector("[data-track]");
  const first = root.querySelector("[data-copy]");
  const extras = Array.from(root.querySelectorAll("[data-copy]")).slice(1);

  function apply() {
    track.style.transform = `translate3d(${position}px, 0, 0)`;
  }

  function measure() {
    for (const node of extras) node.innerHTML = first.innerHTML;
    span = first.scrollWidth + gap;
    if (reverse) position = -span;
    ready = span > 0;
    apply();
  }

  function tick(now) {
    if (!last) last = now;
    const delta = Math.min(now - last, 64);
    last = now;
    if (!reduce() && !paused && ready && speed > 0) {
      const direction = reverse ? 1 : -1;
      let next = position + (direction * speed * delta) / 1000;
      if (span > 0) {
        if (!reverse && next <= -span) next += span;
        if (reverse && next >= 0) next -= span;
        position = next;
        apply();
      }
    }
    raf = requestAnimationFrame(tick);
  }

  function enter() {
    if (pauseOnHover) paused = true;
  }
  function leave() {
    if (pauseOnHover) paused = false;
  }

  host.addEventListener("pointerenter", enter);
  host.addEventListener("pointerleave", leave);

  measure();
  observer = new ResizeObserver(measure);
  observer.observe(first);
  mutation = new MutationObserver(measure);
  mutation.observe(first, { childList: true, subtree: true, characterData: true });
  raf = requestAnimationFrame(tick);

  return {
    element: host,
    destroy() {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      mutation?.disconnect();
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      root.innerHTML = "";
    },
  };
}
