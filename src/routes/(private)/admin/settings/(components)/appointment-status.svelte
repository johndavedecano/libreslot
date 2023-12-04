<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  import settingStore from "$lib/stores/setting.store";

  let setting = {};

  const onSubmit = async () => {
    try {
      await fetch("/admin/settings/general", {
        method: "POST",
        body: JSON.stringify({
          appointment_enabled: setting.appointment_enabled,
        }),
        headers: {
          "content-type": "application/json",
        },
      });
      alert("successfully updated");
    } catch (error) {
      alert(error.message);
    }
  };

  onMount(async () => {
    settingStore.loadCommon().finally(() => {
      setting = { ...$settingStore.common };
    });
  });
</script>

<div class="flex items-center">
  <div class="flex-1">
    <div class="font-bold text-md">Turn-on Appointments</div>
    <div class="text-gray-500 text-sm">
      Enable or disable appointments for the users.
    </div>
  </div>
  <label class="cursor-pointer label">
    <span class="label-text mr-2">Enabled</span>
    <input
      type="checkbox"
      class="toggle toggle-primary"
      bind:checked={setting.appointment_enabled}
      on:change={onSubmit}
    />
  </label>
</div>
