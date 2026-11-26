<script>
  import PrequelUserIcon from "./PrequelUserIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelUserIcon {...rest} variant="emoji" />
