<script>
  import { IconMenu2 } from "@tabler/icons-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const onClick = () => dispatch("toggle");
</script>

<a href="/" on:click|preventDefault={onClick}>
  <IconMenu2 />
</a>

<style lang="postcss">
  a {
    @apply inline-flex items-center justify-center lg:hidden mr-4;
  }
</style>
