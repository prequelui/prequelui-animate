<script>
  import PrequelTimerIcon from "./PrequelTimerIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelTimerIcon {...rest} variant="emoji" />
