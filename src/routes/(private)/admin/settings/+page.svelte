<script>
  // @ts-nocheck
  import { onMount } from "svelte";
  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";
  import General from "./(components)/general.svelte";
  import Appointment from "./(components)/appointment.svelte";
  import SettingStore from "$lib/stores/setting.store";
  import Navigation from "./(components)/navigation.svelte";

  let active = "general";

  const Tabs = {
    GENERAL: "general",
    APPOINTMENT: "appointment",
    NAVIGATION: "navigation",
  };

  onMount(() => {
    SettingStore.loadServices();
  });
</script>

<PageMain>
  <PageHead title="Settings" subtitle="Manage system and website settings">
    <div class="tabs" slot="action">
      <a
        href="/"
        on:click|preventDefault={() => (active = Tabs.GENERAL)}
        class="tab tab-lifted"
        class:tab-active={active === Tabs.GENERAL}>General</a
      >
      <a
        href="/"
        on:click|preventDefault={() => (active = Tabs.APPOINTMENT)}
        class="tab tab-lifted"
        class:tab-active={active === Tabs.APPOINTMENT}>Appointment</a
      >

      <a
        href="/"
        on:click|preventDefault={() => (active = Tabs.NAVIGATION)}
        class="tab tab-lifted"
        class:tab-active={active === Tabs.NAVIGATION}>Navigation</a
      >
    </div>
  </PageHead>
  <div class="py-6">
    {#if active === Tabs.GENERAL}
      <General />
    {:else if active === Tabs.APPOINTMENT}
      <Appointment />
    {:else if active === Tabs.NAVIGATION}
      <Navigation />
    {:else}
      <!-- else content here -->
      <span>no content</span>
    {/if}
  </div>
</PageMain>
