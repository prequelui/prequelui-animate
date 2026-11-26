<script>
  import PrequelTrashIcon from "./PrequelTrashIcon.svelte";

  let { ...rest } = $props();
</script>

<PrequelTrashIcon {...rest} variant="emoji" />
