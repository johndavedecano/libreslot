<script>
  // @ts-nocheck

  import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-svelte";

  import settingStore from "$lib/stores/setting.store";

  let modal = null;

  let fields = { name: "", id: null };

  $: items = $settingStore.services.items;

  const onEdit = (item) => {
    fields = { name: item.name, id: item.id };
    modal.showModal();
  };

  const onAddNew = () => {
    fields = { name: "", id: null };
    modal.showModal();
  };

  const onRemove = async (item) => {
    const conf = window.confirm(`Are you sure you wanna delete ${item.name}?`);
    if (conf) {
      await fetch("/admin/settings/appointment/services/" + item.id, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
        },
      }).finally(() => {
        settingStore.loadServices();
      });
    }
  };

  const onSubmit = async () => {
    const promise = fields.id ? onUpdate() : onCreateNew();
    promise.finally(() => settingStore.loadServices());
  };

  const onUpdate = async () => {
    try {
      if (fields.name === "") {
        alert("name must not be empty");
        return;
      }
      await fetch("/admin/settings/appointment/services/" + fields.id, {
        method: "PUT",
        body: JSON.stringify({
          name: fields.name,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      modal.close();
    } catch (error) {
      alert(error.message);
    }
  };

  const onCreateNew = async () => {
    try {
      if (fields.name === "") {
        alert("name must not be empty");
        return;
      }

      await fetch("/admin/settings/appointment/services", {
        method: "POST",
        body: JSON.stringify({
          name: fields.name,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      modal.close();
    } catch (error) {
      alert(error.message);
    }
  };
</script>

<dialog bind:this={modal} class="modal modal-bottom md:modal-middle">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        >✕</button
      >
    </form>
    <div class="form-control w-full mb-4">
      <label class="label" for="name">
        <span class="label-text">Name</span>
      </label>
      <input
        name="name"
        type="text"
        placeholder="e.g Cedula"
        required
        class="input input-bordered w-full"
        bind:value={fields.name}
      />
    </div>
    <button class="btn btn-primary w-full" on:click={onSubmit}> Save </button>
  </div>
</dialog>

<div class="flex items-center">
  <div class="flex-1">
    <div class="font-bold text-md">Manage Services</div>
    <div class="text-gray-500 text-sm">
      Manage what kind of services can the users make an appointment to.
    </div>
  </div>
  <button class="btn btn-square btn-sm" title="Add New" on:click={onAddNew}>
    <IconPlus />
  </button>
</div>

<div class="overflow-x-auto">
  <table class="table px-0">
    <tbody>
      <!-- row 1 -->
      {#each items as item}
        <!-- content here -->
        <tr>
          <td class="text-left px-0">{item.name}</td>
          <td class="text-right px-0">
            <button
              class="btn btn-square text-white btn-success btn-sm"
              on:click={() => onEdit(item)}
            >
              <IconEdit size={16} />
            </button>
            <button
              class="btn btn-error btn-square text-white btn-sm"
              on:click={() => onRemove(item)}
            >
              <IconTrash size={16} />
            </button>
          </td>
        </tr>
      {:else}
        <!-- empty list -->
        <div class="text-center">not items yet</div>
      {/each}
    </tbody>
  </table>
</div>
