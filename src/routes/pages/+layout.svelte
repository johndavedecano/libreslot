<script>
  // @ts-nocheck

  import CommonNav from "$lib/components/CommonNav.svelte";
  import Container from "$lib/components/Container.svelte";

  export let data;
</script>

<CommonNav {data} />

<Container>
  <div class="bg-white shadow-lg rounded-lg w-full mt-6">
    <div class="p-4 lg:p-12">
      <slot />
    </div>
  </div>
</Container>
