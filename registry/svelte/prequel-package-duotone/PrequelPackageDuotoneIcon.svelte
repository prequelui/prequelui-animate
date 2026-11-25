<script>
  import PrequelPackageIcon from "./PrequelPackageIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelPackageIcon {...rest} variant="duotone" />
