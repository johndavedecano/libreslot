<script>
  import settingStore from "$lib/stores/setting.store";

  $: setting = $settingStore.common;
</script>

<div class="logo">
  <a href="/"> <img src={setting.logo} alt="Logo" /></a>
</div>

<style lang="postcss">
  .logo {
    @apply flex items-start justify-center p-6 bg-gray-800;
  }

  .logo img {
    max-width: 120px;
    height: auto;
    margin: auto;
  }
</style>
