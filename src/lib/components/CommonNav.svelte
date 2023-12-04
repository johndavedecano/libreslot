<script>
  // @ts-nocheck

  import { IconMenu } from "@tabler/icons-svelte";
  import { navigating } from "$app/stores";

  export let data;

  let menu = false;

  const toggleMobileMenu = () => (menu = !menu);

  $: if ($navigating) {
    menu = false;
  }
</script>

<nav class="nav">
  <div class="nav-container">
    <div class="logo">
      <a href="/"> <img src={data.settings.logo} alt="Logo" /></a>
    </div>

    <a href="/" class="nav-brand">
      {data.settings.name}
    </a>
    <div class="flex-1" />
    <a
      href="/"
      class="text-white lg:hidden"
      on:click|preventDefault={toggleMobileMenu}
    >
      <IconMenu />
    </a>
    <div class="nav-items">
      {#each data.settings.navigation as item}
        <a href={item.to}>{item.name}</a>
      {/each}
    </div>
  </div>
</nav>

{#if menu}
  <div class="nav-mobile">
    {#each data.settings.navigation as item}
      <a href={item.to}>{item.name}</a>
    {/each}
  </div>
{/if}

<style lang="postcss">
  .nav {
    @apply bg-blue-800 w-full;
    height: 100px;
  }

  .nav-container {
    @apply mx-auto flex items-center px-4 xl:px-0;
    height: 100px;
    max-width: 100%;
    width: 1280px;
  }

  .nav-mobile {
    @apply absolute flex flex-col z-20 bg-gray-950 w-full px-2;
    transition: all 200ms ease-in-out;
  }

  .nav-mobile a {
    @apply flex items-center text-white px-3 py-3;
  }

  .nav-mobile a:hover {
    @apply text-yellow-400;
  }

  .nav-brand {
    @apply font-bold text-xl text-white text-ellipsis overflow-hidden whitespace-nowrap ml-4;
  }

  .nav-items {
    @apply hidden lg:flex items-center gap-4 overflow-x-auto;
  }

  .nav-items a {
    @apply text-white text-ellipsis overflow-hidden whitespace-nowrap;
  }

  .nav-items a:hover {
    @apply text-yellow-400;
  }

  .logo img {
    max-width: 60px;
  }
</style>
