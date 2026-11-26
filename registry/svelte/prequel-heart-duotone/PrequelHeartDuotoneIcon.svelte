<script>
  import PrequelHeartIcon from "./PrequelHeartIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelHeartIcon {...rest} variant="duotone" />
