import { animate } from "motion";

const SR_ONLY =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0";

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

const reduceQuery = () =>
  typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

const reduce = () => reduceQuery()?.matches ?? false;

export function createTypingText(root, options = {}) {
  const {
    text = "",
    duration = 100,
    delay = 0,
    holdDelay = 1000,
    loop = false,
    inView = false,
    inViewOnce = true,
    className = "",
    style,
  } = options;
  const texts = Array.isArray(text) ? text : [text];
  const segments = texts.map(splitGraphemes);
  const controls = [];
  let index = 0;
  let count = 0;
  let phase = "typing";
  let ready = delay === 0;
  let delayArmed = false;
  let seen = !inView;
  let onScreen = true;
  let pageVisible = typeof document === "undefined" ? true : !document.hidden;
  let timer;
  let blink;
  let observer;
  let destroyed = false;

  const host = document.createElement("span");
  host.dataset.slot = "typing-text";
  host.className = `inline ${className}`.trim();
  if (style) Object.assign(host.style, style);

  const sr = document.createElement("span");
  sr.className = "sr-only";
  sr.setAttribute("style", SR_ONLY);
  sr.textContent = texts.join(", ");

  const visible = document.createElement("span");
  visible.setAttribute("aria-hidden", "true");

  const cursor = document.createElement("span");
  cursor.dataset.slot = "typing-text-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.className =
    "ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-foreground";

  host.append(sr, visible, cursor);
  root.innerHTML = "";
  root.append(host);

  const length = () => (segments[index] ?? []).length;

  function updateCursor() {
    if (destroyed) return;
    const typing = !reduce() && phase === "typing" && count > 0 && count < length();
    const canBlink = !reduce() && pageVisible && onScreen && phase !== "done";
    if (typing || !canBlink) {
      blink?.stop?.();
      blink = undefined;
      cursor.style.opacity = "1";
      return;
    }
    if (!blink) {
      blink = animate(
        cursor,
        { opacity: [1, 1, 0, 0] },
        {
          duration: 1,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.5, 0.5, 1],
        },
      );
    }
  }

  function render() {
    visible.textContent = (segments[index] ?? []).slice(0, count).join("");
    updateCursor();
  }

  function finalize() {
    index = loop ? 0 : segments.length - 1;
    count = (segments[index] ?? []).length;
    phase = "done";
    render();
  }

  function pump() {
    clearTimeout(timer);
    timer = undefined;
    if (destroyed) return;
    if (reduce()) {
      finalize();
      return;
    }
    if (!ready) {
      if (inView && !seen) return;
      if (delayArmed) return;
      delayArmed = true;
      timer = setTimeout(() => {
        timer = undefined;
        ready = true;
        pump();
      }, delay);
      return;
    }
    if (inView && !seen) return;
    if (!pageVisible || (loop && !onScreen)) return;
    if (phase === "done") return;

    const size = length();
    const isLast = index === segments.length - 1;

    if (phase === "typing") {
      if (count < size) {
        timer = setTimeout(() => {
          count = Math.min(count + 1, size);
          render();
          pump();
        }, duration);
      } else if (isLast && !loop) {
        phase = "done";
        render();
      } else {
        timer = setTimeout(() => {
          phase = "holding";
          pump();
        }, holdDelay);
      }
    } else if (phase === "holding") {
      timer = setTimeout(() => {
        phase = "erasing";
        pump();
      }, Math.max(60, duration));
    } else if (phase === "erasing") {
      if (count > 0) {
        timer = setTimeout(() => {
          count = Math.max(0, count - 1);
          render();
          pump();
        }, Math.max(40, duration * 0.55));
      } else {
        timer = setTimeout(() => {
          index = isLast ? 0 : index + 1;
          count = 0;
          phase = "typing";
          render();
          pump();
        }, Math.max(120, duration));
      }
    }
  }

  if (inView) {
    observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.some((entry) => entry.isIntersecting);
        onScreen = entering;
        if (entering && !seen) seen = true;
        else if (!entering && !inViewOnce) seen = false;
        pump();
        updateCursor();
      },
      { threshold: 0 },
    );
    observer.observe(host);
  }

  const query = reduceQuery();
  const onMotionChange = () => {
    pump();
    updateCursor();
  };
  query?.addEventListener?.("change", onMotionChange);

  const onVisibilityChange = () => {
    pageVisible = !document.hidden;
    pump();
    updateCursor();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  render();
  pump();

  return {
    element: host,
    destroy() {
      destroyed = true;
      clearTimeout(timer);
      observer?.disconnect();
      query?.removeEventListener?.("change", onMotionChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      blink?.stop?.();
      for (const control of controls) control.stop?.();
      controls.length = 0;
      root.innerHTML = "";
    },
  };
}
