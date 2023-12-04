<script>
  import { SidebarStore } from "$lib/stores/sidebar.store";

  import ToggleIcon from "$lib/components/ToggleIcon.svelte";

  const onToggle = () => {
    SidebarStore.update((v) => {
      return {
        open: !v.open,
      };
    });
  };
</script>

<header class="header">
  <ToggleIcon on:toggle={onToggle} />
  <slot />
</header>

<style lang="postcss">
  .header {
    @apply flex items-center bg-white px-4 sticky top-0 z-10 shadow-sm lg:shadow-none;
    min-height: 60px;
  }
</style>
