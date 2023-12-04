<script>
  import { SidebarStore } from "$lib/stores/sidebar.store";
  import { IconX } from "@tabler/icons-svelte";

  export let title = "Admin Portal";

  const onToggle = () => {
    SidebarStore.update((v) => {
      return {
        open: !v.open,
      };
    });
  };
</script>

<div class="sidebar" class:sidebar-open={$SidebarStore.open}>
  <div class="sidebar-top">
    <div class="sidebar-brand">{title}</div>
    <a href="/" class="sidebar-toggle" on:click|preventDefault={onToggle}>
      <IconX />
    </a>
  </div>
  <slot />
</div>

<style lang="postcss">
  .sidebar {
    @apply flex flex-col h-screen bg-gray-900 absolute z-20 -left-52 lg:relative lg:left-0;
    min-width: 13rem;
    width: 13rem;
    top: 0;
    bottom: 0;
    transition: left 200ms ease-in-out;
  }

  .sidebar-top {
    @apply bg-gray-950 px-4 flex items-center;
    min-height: 60px;
  }

  .sidebar-brand {
    @apply flex-1 text-white font-bold lg:text-center;
  }

  .sidebar-toggle {
    @apply text-white inline-block lg:hidden items-center justify-center;
  }

  .sidebar-open {
    @apply left-0 translate-x-0;
  }
</style>
