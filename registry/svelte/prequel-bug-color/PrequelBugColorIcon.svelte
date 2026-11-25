<script>
  import PrequelBugIcon from "./PrequelBugIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelBugIcon {...rest} variant="color" />
