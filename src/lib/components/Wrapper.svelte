<div class="wrapper">
  <slot name="sidebar" />
  <div class="content">
    <slot name="content" />
  </div>
</div>

<style lang="postcss">
  .wrapper {
    @apply w-screen h-screen flex bg-gray-100;
  }

  .content {
    @apply flex flex-col flex-1 relative max-h-screen h-screen overflow-y-auto;
  }
</style>
