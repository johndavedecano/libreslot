<script>
  export let status = "pending";
</script>

<div
  class="badge"
  class:badge-primary={status === "pending"}
  class:badge-secondary={status === "cancelled"}
  class:badge-success={status === "completed"}
>
  {status}
</div>
