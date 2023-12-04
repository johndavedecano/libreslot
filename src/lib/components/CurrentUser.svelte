<script>
  // @ts-nocheck
  import UserStore from "$lib/stores/user.store";

  $: user = $UserStore.user;
</script>

{#if user && user.displayName}
  <div class="border p-2 inline text-sm">
    Logged in as, {user.displayName}
  </div>
{/if}
