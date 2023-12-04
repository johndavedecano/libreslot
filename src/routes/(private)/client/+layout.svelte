<script>
  import Header from "$lib/components/Header.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Wrapper from "$lib/components/Wrapper.svelte";
  import MenuClient from "$lib/components/MenuClient.svelte";
  import CompanyName from "$lib/components/CompanyName.svelte";
  import CurrentUser from "$lib/components/CurrentUser.svelte";
</script>

<Wrapper>
  <Sidebar slot="sidebar" title="Client Portal">
    <MenuClient />
  </Sidebar>
  <svelte:fragment slot="content">
    <Header>
      <CompanyName />
      <div class="flex-1" />
      <CurrentUser />
    </Header>
    <slot />
  </svelte:fragment>
</Wrapper>

<svelte:head>
  <title>Client Portal</title>
</svelte:head>
