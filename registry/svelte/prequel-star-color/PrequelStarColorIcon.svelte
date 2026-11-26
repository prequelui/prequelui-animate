<script>
  import PrequelStarIcon from "./PrequelStarIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelStarIcon {...rest} variant="color" />
