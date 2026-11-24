<script>
  import { onMount } from "svelte";
  import { Github, Star } from "lucide-svelte";

  let {
    repo = "",
    href = "",
    count = null,
    defaultCount = null,
    label = "GitHub",
    showLabel = true,
    class: className = "",
    ...rest
  } = $props();

  let live = $state(defaultCount);
  const value = $derived(count !== null ? count : live);
  const destination = $derived(href || (repo ? `https://github.com/${repo}` : undefined));
  const display = $derived.by(() => {
    if (value === null || value === undefined) return "Star";
    if (value < 1000) return String(value);
    return new Intl.NumberFormat("en", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  });

  function load() {
    if (count !== null || !repo) return;
    let active = true;
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data && typeof data.stargazers_count === "number") {
          live = data.stargazers_count;
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }

  onMount(load);
</script>

<a
  data-slot="github-stars"
  href={destination}
  target="_blank"
  rel="noreferrer noopener"
  aria-label={repo ? `${label} stars on GitHub` : "GitHub"}
  class={`group inline-flex h-8 items-center gap-1.5 rounded-full border bg-background px-2.5 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 ${className}`}
  {...rest}
>
  <Github class="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
  {#if showLabel}<span class="truncate">{label}</span>{/if}
  <span aria-hidden="true" class="h-3.5 w-px shrink-0 bg-border"></span>
  <span
    aria-hidden="true"
    class="inline-flex items-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none"
  >
    <Star class="size-3.5 shrink-0 transition-colors group-hover:fill-current" />
  </span>
  <span class="tabular-nums">{display}</span>
</a>
