<script>
  import PrequelImageIcon from "./PrequelImageIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelImageIcon {...rest} variant="emoji" />
