<script>
  import PrequelBellIcon from "./PrequelBellIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelBellIcon {...rest} variant="emoji" />
