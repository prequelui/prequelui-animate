import { Github, Star } from "lucide-solid";
import { createMemo, createSignal, onMount } from "solid-js";
import type { JSX } from "solid-js";

export type GitHubStarsProps = {
  repo?: string;
  href?: string;
  count?: number | null;
  defaultCount?: number | null;
  label?: string;
  showLabel?: boolean;
  class?: string;
};

export function GitHubStars(props: GitHubStarsProps) {
  const [live, setLive] = createSignal<number | null>(props.defaultCount ?? null);
  const value = createMemo(() =>
    props.count !== undefined && props.count !== null ? props.count : live(),
  );
  const destination = createMemo(
    () => props.href || (props.repo ? `https://github.com/${props.repo}` : undefined),
  );
  const display = createMemo(() => {
    const current = value();
    if (current === null || current === undefined) return "Star";
    if (current < 1000) return String(current);
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(current);
  });

  onMount(() => {
    if ((props.count !== undefined && props.count !== null) || !props.repo) return;
    let active = true;
    fetch(`https://api.github.com/repos/${props.repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data && typeof data.stargazers_count === "number") {
          setLive(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  });

  return (
    <a
      data-slot="github-stars"
      href={destination()}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={props.repo ? `${props.label ?? "GitHub"} stars on GitHub` : "GitHub"}
      class={`group inline-flex h-8 items-center gap-1.5 rounded-full border bg-background px-2.5 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 ${props.class ?? ""}`}
    >
      <Github class="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
      {props.showLabel === false ? null : (
        <span class="truncate">{props.label ?? "GitHub"}</span>
      )}
      <span aria-hidden="true" class="h-3.5 w-px shrink-0 bg-border" />
      <span
        aria-hidden="true"
        class="inline-flex items-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none"
      >
        <Star class="size-3.5 shrink-0 transition-colors group-hover:fill-current" />
      </span>
      <span class="tabular-nums">{display()}</span>
    </a>
  );
}
