<script>
  // @ts-nocheck

  import { IconPlus } from "@tabler/icons-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let title = "Page";
  export let subtitle = null;
</script>

<div class="flex flex-col lg:flex-row gap-4 lg:gap-0 items-center">
  <div class="flex-1 flex w-full justify-start flex-col">
    {#if title}
      <h2 class="card-title text-ellipsis whitespace-nowrap overflow-hidden">
        {title}
      </h2>
    {/if}
    {#if subtitle}
      <p class="text-gray-500 text-ellipsis whitespace-nowrap overflow-hidden">
        {subtitle}
      </p>
    {/if}
  </div>

  {#if $$slots.action}
    <slot name="action" />
  {:else}
    <button
      class="btn w-full lg:w-auto btn-primary"
      on:click={() => dispatch("add")}
    >
      <IconPlus size={16} />
      Add New
    </button>
  {/if}
</div>
