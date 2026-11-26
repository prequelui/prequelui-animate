<script>
  import PrequelPlayIcon from "./PrequelPlayIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelPlayIcon {...rest} variant="solid" />
