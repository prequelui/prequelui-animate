import { animate } from "motion";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const DEFAULT_TWEEN = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

let segmenter;

function splitGraphemes(value) {
  if (segmenter === undefined) {
    segmenter =
      typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
        ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
        : null;
  }
  if (!segmenter) return Array.from(value);
  return Array.from(segmenter.segment(value), (entry) => entry.segment);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const display = (value) => (value === " " ? "&nbsp;" : escapeHtml(value));

function measure(element, chars) {
  if (!element || typeof document === "undefined") return null;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return null;
  const style = getComputedStyle(element);
  context.font = style.font;
  const spacing = Number.parseFloat(style.letterSpacing) || 0;
  return chars.map((char) => context.measureText(char).width + spacing);
}

export function createSwappingText(root, options = {}) {
  const {
    text: textProp = "",
    duration = 2000,
    delay = 0,
    direction = "up",
    stagger = 0.04,
    transition,
    className = "",
  } = options;
  const tween = transition ?? DEFAULT_TWEEN;
  const texts = (Array.isArray(textProp) ? textProp : [textProp]).slice();
  let index = 0;
  let cycled = false;
  let timer;
  let collapseTimer;
  let observer;
  let onScreen = false;
  let pageVisible = true;
  let destroyed = false;
  let controls = [];

  let state = {
    id: 0,
    from: splitGraphemes(texts[0] ?? ""),
    to: splitGraphemes(texts[0] ?? ""),
    widths: null,
  };

  root.innerHTML = `
    <span data-slot="swapping-text" class="inline-block whitespace-pre ${className}">
      <span data-track aria-hidden="true" class="inline-flex"></span>
      <span data-label class="sr-only"></span>
    </span>`;
  const host = root.querySelector("[data-slot]");
  const track = root.querySelector("[data-track]");
  const label = root.querySelector("[data-label]");

  function stopControls() {
    controls.forEach((control) => control.stop?.());
    controls = [];
  }

  function render() {
    const sign = direction === "up" ? 1 : -1;
    const enter = `${sign * 0.5}em`;
    const exit = `${-sign * 0.5}em`;
    const slots = Math.max(state.from.length, state.to.length);
    let order = 0;
    let html = "";

    for (let position = 0; position < slots; position += 1) {
      const from = state.from[position] ?? "";
      const to = state.to[position] ?? "";
      const animated = state.id > 0 && from !== to && !reduce();

      if (!animated) {
        if (!to) continue;
        html += `<span class="inline-block">${display(to)}</span>`;
        continue;
      }

      const timing = { ...tween, delay: (order += 1, (order - 1) * stagger) };
      const widths = state.widths;
      const widthStyle = widths
        ? `width:${(widths.from[position] ?? 0) / 16}rem`
        : "";
      html += `
        <span data-swap-slot data-position="${position}"
          class="relative inline-block" style="${widthStyle}">
          ${
            from
              ? `<span data-swap-from class="absolute left-0 top-0">${display(from)}</span>`
              : ""
          }
          <span data-swap-to class="inline-block"
            style="position:${widths ? "absolute" : "relative"};left:0;top:0">${display(to)}</span>
          ${widths ? `<span class="invisible">${to ? display(to) : "&nbsp;"}</span>` : ""}
        </span>`;
      // Store timing for the animation pass.
      html = html.replace(
        `data-position="${position}"`,
        `data-position="${position}" data-delay="${timing.delay}" data-enter="${enter}" data-exit="${exit}"`,
      );
    }

    track.innerHTML = html;
    label.textContent = texts[index % texts.length] ?? "";
    playSlots();
  }

  function playSlots() {
    if (state.id === 0) return;
    const widths = state.widths;
    track.querySelectorAll("[data-swap-slot]").forEach((slot) => {
      const position = Number(slot.dataset.position);
      const time = { ...tween, delay: Number(slot.dataset.delay ?? 0) };
      if (widths) {
        const from = (widths.from[position] ?? 0) / 16;
        const to = (widths.to[position] ?? 0) / 16;
        slot.style.width = `${from}rem`;
        controls.push(animate(slot, { width: `${to}rem` }, time));
      }
      const old = slot.querySelector("[data-swap-from]");
      const fresh = slot.querySelector("[data-swap-to]");
      if (old) {
        controls.push(
          animate(
            old,
            { y: slot.dataset.exit, opacity: 0, filter: "blur(2px)" },
            time,
          ),
        );
      }
      if (fresh) {
        fresh.style.transform = `translateY(${slot.dataset.enter})`;
        fresh.style.opacity = "0";
        fresh.style.filter = "blur(2px)";
        controls.push(
          animate(
            fresh,
            { y: "0px", opacity: 1, filter: "blur(0px)" },
            time,
          ),
        );
      }
    });
  }

  function swapTo(next) {
    const chars = splitGraphemes(next);
    if (state.to.join("") === chars.join("")) return;
    const from = measure(host, state.to);
    const to = measure(host, chars);
    stopControls();
    state = {
      id: state.id + 1,
      from: state.to,
      to: chars,
      widths: from && to ? { from, to } : null,
    };
    index = (index + 1) % texts.length;
    render();

    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(
      () => {
        if (destroyed) return;
        state = { ...state, from: state.to, widths: null };
        render();
      },
      reduce() ? 0 : 700,
    );
  }

  function cycling() {
    return texts.length > 1 && onScreen && pageVisible;
  }

  function schedule() {
    clearTimeout(timer);
    if (!cycling() || destroyed) return;
    timer = setTimeout(
      () => {
        cycled = true;
        swapTo(texts[(index + 1) % texts.length] ?? "");
        schedule();
      },
      cycled ? duration : delay + duration,
    );
  }

  function onVisibilityChange() {
    pageVisible = !document.hidden;
    schedule();
  }

  observer = new IntersectionObserver(
    (entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      schedule();
    },
    { threshold: 0.35 },
  );
  observer.observe(host);
  document.addEventListener("visibilitychange", onVisibilityChange);
  pageVisible = !document.hidden;
  render();
  schedule();

  return {
    element: host,
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      clearTimeout(collapseTimer);
      stopControls();
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      root.innerHTML = "";
    },
  };
}
