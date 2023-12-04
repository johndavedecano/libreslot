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

    return p !== "/admin" && String($page.url.pathname).startsWith(p);
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
    <a on:click={onClick} href="/admin" class:active={isActive("/admin")}>
      <IconHome size={16} />
      Dashboard</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/admin/pages"
      class:active={isActive("/admin/pages")}
    >
      <IconSitemap size={16} />
      Manage Pages</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/admin/posts"
      class:active={isActive("/admin/posts")}
    >
      <IconNews size={16} />
      Manage Posts</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/admin/appointments"
      class:active={isActive("/admin/appointments")}
    >
      <IconCalendar size={16} />
      Appointments</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/admin/slots"
      class:active={isActive("/admin/slots")}
    >
      <IconCalendarCheck size={16} />
      Manage Slots</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/admin/users"
      class:active={isActive("/admin/users")}
    >
      <IconUser size={16} />
      User Management</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/admin/settings"
      class:active={isActive("/admin/settings")}
    >
      <IconSettings size={16} />
      General Setting</a
    >
  </li>
  <li>
    <a
      on:click={onClick}
      href="/admin/account"
      class:active={isActive("/admin/account")}
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
