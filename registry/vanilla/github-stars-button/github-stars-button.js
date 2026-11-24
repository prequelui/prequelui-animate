import { animate } from "motion";

const GITHUB_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>';
const STAR_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 transition-colors duration-300"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/></svg>';

export function createGitHubStarsButton(root, options = {}) {
  const {
    username = "prequelui",
    repo = "prequelui-animate",
    value = 0,
    delay = 0,
    inView = true,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let count = reduce() ? value : 0;
  let starred = false;
  let burst = 0;
  let started = false;
  let observer;
  let countControls;

  const particles = Array.from({ length: 6 }, () => '<span></span>').join("");
  root.innerHTML = `
    <button type="button" data-slot="github-stars-button"
      aria-label="Star ${username}/${repo} on GitHub"
      class="relative inline-flex h-9 items-center gap-2 overflow-visible rounded-lg border bg-background px-3 text-[13px] font-medium ${className}">
      ${GITHUB_ICON}
      <span>Star</span>
      <span class="h-4 w-px bg-border" aria-hidden="true"></span>
      <span class="relative flex items-center gap-1 tabular-nums text-muted-foreground">
        <span data-star class="inline-flex">${STAR_ICON}</span>
        <span data-count>${count.toLocaleString("en-US")}</span>
      </span>
      <span data-particles class="pointer-events-none absolute right-3 top-1/2" aria-hidden="true">${particles}</span>
    </button>`;
  const button = root.querySelector("button");
  const starEl = root.querySelector("[data-star]");
  const countEl = root.querySelector("[data-count]");
  const particleWrap = root.querySelector("[data-particles]");
  for (const node of particleWrap.children) {
    node.className = "absolute size-1 rounded-full bg-[#f5b301] opacity-0";
  }

  function renderCount() {
    countEl.textContent = count.toLocaleString("en-US");
  }

  function startCount() {
    if (started) return;
    started = true;
    if (reduce()) {
      count = value;
      renderCount();
      return;
    }
    countControls = animate(0, value, {
      type: "spring",
      stiffness: 90,
      damping: 50,
      delay: delay / 1000,
      onUpdate: (latest) => {
        count = Math.round(latest);
        renderCount();
      },
    });
  }

  function toggle() {
    starred = !starred;
    count += starred ? 1 : -1;
    burst += 1;
    renderCount();
    starEl.querySelector("svg").classList.toggle("fill-[#f5b301]", starred);
    starEl.querySelector("svg").classList.toggle("text-[#f5b301]", starred);
    starEl.querySelector("svg").classList.toggle("text-muted-foreground", !starred);
    if (reduce()) return;
    if (starred) {
      animate(
        starEl,
        { scale: [1, 1.35, 1], rotate: [0, 12, 0] },
        { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
      );
    }
    const nodes = Array.from(particleWrap.children);
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      animate(
        node,
        {
          opacity: [1, 0],
          x: [0, Math.cos(angle) * 26],
          y: [0, Math.sin(angle) * 26],
          scale: [0.6, 0.35],
        },
        { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
      );
    });
  }

  if (!inView) {
    startCount();
  } else {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startCount();
          observer?.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(button);
  }

  button.addEventListener("click", toggle);

  return {
    element: button,
    get count() { return count; },
    destroy() {
      observer?.disconnect();
      countControls?.stop();
      button.removeEventListener("click", toggle);
      root.innerHTML = "";
    },
  };
}
