<script>
  // @ts-nocheck

  import settingStore from "$lib/stores/setting.store";

  $: setting = $settingStore.common;
</script>

<div
  class="font-bold text-primary text-sm md:text-base lg:text-lg flex-1 text-ellipsis overflow-hidden whitespace-nowrap"
>
  {setting.name} - {setting.city}
</div>
