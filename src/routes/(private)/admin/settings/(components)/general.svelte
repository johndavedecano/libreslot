<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  import settingStore from "$lib/stores/setting.store";

  let setting = {};

  const onSubmit = async () => {
    try {
      await fetch("/admin/settings/general", {
        method: "POST",
        body: JSON.stringify(setting),
        headers: {
          "content-type": "application/json",
        },
      });
      alert("successfully updated");
      settingStore.loadCommon();
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

<div class="flex items-center mb-8">
  <div class="flex-1">
    <div class="font-bold text-lg">Basic Settings</div>
    <div class="text-gray-500 text-sm">
      Configure general website information.
    </div>
  </div>
</div>

<form action="" method="POST" on:submit|preventDefault={onSubmit}>
  <div class="flex items-center gap-6 mb-4">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Barangay Name</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="name"
        bind:value={setting.name}
        required
      />
    </div>
  </div>

  <div class="flex items-center gap-6 mb-4">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Logo</div>
      <input
        type="url"
        class="input input-bordered w-full"
        name="logo"
        bind:value={setting.logo}
        required
      />
    </div>
  </div>

  <div class="flex items-center gap-6 mb-4">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Cover</div>
      <input
        type="url"
        class="input input-bordered w-full"
        name="cover"
        bind:value={setting.cover}
        required
      />
    </div>
  </div>

  <div class="flex items-center gap-6 mb-4">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Address</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="address"
        bind:value={setting.address}
        required
      />
    </div>
  </div>

  <div class="flex items-center gap-6 mb-4">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">City</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="city"
        bind:value={setting.city}
        required
      />
    </div>
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Province</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="province"
        bind:value={setting.province}
        required
      />
    </div>
  </div>

  <div class="flex items-center gap-6 mb-4">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Region</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="region"
        bind:value={setting.region}
        required
      />
    </div>
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Zipcode</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="zipcode"
        bind:value={setting.zipcode}
        required
      />
    </div>
  </div>

  <div class="flex items-center gap-6 mb-8">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Email Address</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="email"
        bind:value={setting.email}
        required
      />
    </div>
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Phone Number</div>
      <input
        type="tel"
        name="phone"
        bind:value={setting.phone}
        class="input input-bordered w-full"
        required
      />
    </div>
  </div>

  <div class="flex items-center mb-8">
    <div class="flex-1">
      <div class="font-bold text-lg">Maintenance Mode</div>
      <div class="text-gray-500 text-sm">
        Temporarily put the website on maintenance mode.
      </div>
    </div>
    <input
      type="checkbox"
      class="toggle toggle-success"
      name="maintenance_enabled"
      bind:checked={setting.maintenance_enabled}
    />
  </div>

  <div class="flex items-center gap-6 mb-8">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Message</div>
      <textarea
        class="textarea textarea-bordered h-32 w-full mb-6"
        bind:value={setting.maintenance_message}
        rows={20}
        name="maitenance_message"
      />
      <div class="font-bold text-base mb-2">Date</div>
      <input
        type="datetime-local"
        class="input input-bordered w-full"
        name="maintenance_ends_at"
        bind:value={setting.maintenance_ends_at}
      />
    </div>
  </div>

  <div class="flex items-center">
    <div class="flex-1" />
    <button class="btn btn-primary" type="submit"> Save Settings </button>
  </div>
</form>
