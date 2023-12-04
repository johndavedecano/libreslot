<script>
  import Loader from "./Loader.svelte";

  export let loading = false;
</script>

<div class="w-full 2xl:w-9/12 relative">
  <Loader {loading} />
  <div class="p-0 lg:p-4">
    <div class="card rounded-none lg:rounded-md flex-1 bg-base-100 shadow-xl">
      <div class="card-body px-4 lg:px-6">
        <slot />
      </div>
    </div>
  </div>
</div>
