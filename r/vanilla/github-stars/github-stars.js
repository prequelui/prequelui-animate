const GITHUB_ICON =
  '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="size-4 shrink-0"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>';
const STAR_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 shrink-0 transition-colors group-hover:fill-current"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.12 2.12 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.12 2.12 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16z"/></svg>';

export function createGitHubStars(root, options = {}) {
  const {
    repo = "",
    href = "",
    count = null,
    defaultCount = null,
    label = "GitHub",
    showLabel = true,
    className = "",
  } = options;
  let live = defaultCount;
  const destination = href || (repo ? `https://github.com/${repo}` : "");
  const format = (current) => {
    if (current === null || current === undefined) return "Star";
    if (current < 1000) return String(current);
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(current);
  };

  root.innerHTML = `
    <a data-slot="github-stars" href="${destination}" target="_blank" rel="noreferrer noopener"
      aria-label="${repo ? `${label} stars on GitHub` : "GitHub"}"
      class="group inline-flex h-8 items-center gap-1.5 rounded-full border bg-background px-2.5 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 ${className}">
      ${GITHUB_ICON}
      ${showLabel ? `<span class="truncate">${label}</span>` : ""}
      <span aria-hidden="true" class="h-3.5 w-px shrink-0 bg-border"></span>
      <span aria-hidden="true"
        class="inline-flex items-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none">
        ${STAR_ICON}
      </span>
      <span data-count class="tabular-nums">${format(count !== null ? count : live)}</span>
    </a>`;
  const link = root.querySelector("[data-slot]");
  const countEl = root.querySelector("[data-count]");
  let active = true;

  if (count === null && repo) {
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data && typeof data.stargazers_count === "number") {
          live = data.stargazers_count;
          countEl.textContent = format(live);
        }
      })
      .catch(() => {});
  }

  return {
    element: link,
    destroy() {
      active = false;
      root.innerHTML = "";
    },
  };
}
