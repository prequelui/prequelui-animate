<script>
  import PrequelTagIcon from "./PrequelTagIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelTagIcon {...rest} variant="solid" />
