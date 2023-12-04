<script>
</script>

<div class="container">
  <slot />
</div>

<style lang="postcss">
  .container {
    @apply mx-auto flex items-center px-4 xl:px-0;
    max-width: 100%;
    width: 1280px;
  }
</style>
