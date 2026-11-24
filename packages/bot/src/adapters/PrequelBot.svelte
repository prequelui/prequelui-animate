<script>
  import { onDestroy, onMount } from "svelte";
  import { mountPrequelBot } from "@prequelui/bot";

  export let framework = "svelte";
  export let position = "br";
  export let size = 64;
  export let showLabel = true;
  export let disabled = false;

  let handle = null;

  onMount(() => {
    if (disabled || import.meta.env?.DEV === false) return;
    handle = mountPrequelBot(document.body, {
      framework,
      position,
      size,
      showLabel,
      disabled,
    });
  });

  onDestroy(() => {
    handle?.destroy();
    handle = null;
  });
</script>
