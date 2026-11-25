<script>
  import PrequelMessageIcon from "./PrequelMessageIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelMessageIcon {...rest} variant="emoji" />
