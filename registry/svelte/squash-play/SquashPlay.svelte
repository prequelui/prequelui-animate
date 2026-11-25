<script>
  import { onMount } from "svelte";
  import { createSquashPlay } from "./squash-play.js";

  let { className = "", preview = false } = $props();
  let host;
  let instance;

  onMount(() => {
    instance = createSquashPlay(host, { className, preview });
    const extra = String(className || "").split(/\s+/).filter(Boolean);
    if (extra.length) host.classList.add(...extra);
    return () => instance?.destroy();
  });

  $effect(() => {
    const next = preview;
    instance?.update({ preview: next });
  });
</script>

<div bind:this={host}></div>
