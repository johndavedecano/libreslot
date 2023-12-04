<script>
  // @ts-nocheck

  import { page } from "$app/stores";
  import { SidebarStore } from "$lib/stores/sidebar.store";

  import {
    IconCalendar,
    IconCalendarCheck,
    IconHome,
    IconLock,
    IconLogout,
    IconNews,
    IconSettings,
    IconSitemap,
    IconUser,
  } from "@tabler/icons-svelte";
  import MenuLogo from "./MenuLogo.svelte";

  $: isActive = (p) => {
    if ($page.url.pathname === p) return true;

    return p !== "/client" && String($page.url.pathname).startsWith(p);
  };

  const onClick = () => {
    SidebarStore.update((v) => {
      return {
        open: !v.open,
      };
    });
  };
</script>

<MenuLogo />

<ul class="nav">
  <li>
    <a on:click={onClick} href="/client" class:active={isActive("/client")}>
      <IconHome size={16} />
      Dashboard</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/client/appointment"
      class:active={isActive("/client/appointment")}
    >
      <IconCalendar size={16} />
      Appointments</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/client/account"
      class:active={isActive("/client/account")}
    >
      <IconLock size={16} />
      Account Setting</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/auth/logout"
      class:active={isActive("/auth/logout")}
    >
      <IconLogout size={16} />
      Logout</a
    >
  </li>
</ul>

<style lang="postcss">
  .logo {
    @apply flex items-start justify-center p-6 bg-gray-800;
  }

  .logo img {
    max-width: 120px;
    height: auto;
    margin: auto;
  }

  .nav {
    @apply list-none flex flex-col;
  }
  .nav li {
    @apply flex items-center justify-start w-full;
  }
  .nav li a {
    @apply flex items-center justify-start gap-2 text-sm w-full px-4 py-2.5 text-gray-200;
  }

  .nav li a.active {
    @apply bg-primary text-white;
  }

  .nav li a:not(.active):hover {
    @apply bg-gray-800 text-white;
  }
  .nav li.title {
    @apply uppercase text-gray-400 px-4 py-1 bg-gray-800;
    font-size: 0.65rem;
    letter-spacing: 2px;
  }
</style>
