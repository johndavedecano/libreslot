<script>
  export let loading = false;
</script>

{#if loading}
  <div class="loader">
    <div class="loader-wrapper">
      <span class="loading loading-ring loading-xs" />
    </div>
  </div>
{/if}

<style lang="postcss">
  .loader {
    @apply bg-white/30 absolute left-0 right-0 bottom-0 top-0 flex items-center justify-center z-40;
  }

  .loader-wrapper {
    width: 50px;
    height: 50px;
  }
</style>
