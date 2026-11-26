<script>
  import PrequelActivityIcon from "./PrequelActivityIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelActivityIcon {...rest} variant="emoji" />
