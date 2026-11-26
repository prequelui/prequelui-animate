<script>
  import PrequelChipIcon from "./PrequelChipIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelChipIcon {...rest} variant="emoji" />
