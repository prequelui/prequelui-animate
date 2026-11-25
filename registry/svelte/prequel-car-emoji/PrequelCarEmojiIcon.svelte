<script>
  import PrequelCarIcon from "./PrequelCarIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelCarIcon {...rest} variant="emoji" />
