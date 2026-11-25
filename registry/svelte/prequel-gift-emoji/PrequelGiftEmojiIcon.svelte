<script>
  import PrequelGiftIcon from "./PrequelGiftIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelGiftIcon {...rest} variant="emoji" />
