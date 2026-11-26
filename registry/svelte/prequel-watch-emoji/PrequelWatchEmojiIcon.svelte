<script>
  import PrequelWatchIcon from "./PrequelWatchIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelWatchIcon {...rest} variant="emoji" />
