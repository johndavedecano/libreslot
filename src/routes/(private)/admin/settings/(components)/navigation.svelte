<script>
  // @ts-nocheck
  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";
  import { IconPlus, IconTrash } from "@tabler/icons-svelte";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { onMount } from "svelte";
  import { db } from "$lib/firebase";

  let items = [];

  let field = { name: "", to: "", order: 1 };

  const flipDurationMs = 300;

  function handleDndConsider(e) {
    items = e.detail.items;
  }

  function handleDndFinalize(e) {
    items = e.detail.items.map((item, i) => {
      item.order = i;
      return item;
    });
    saveItems(items);
  }

  const saveItems = async (nextItems) => {
    try {
      const ref = doc(db, "settings", "common");
      await updateDoc(ref, {
        navigation: nextItems,
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const onAddMenu = () => {
    items = items.concat([
      {
        id: Date.now(),
        name: field.name,
        to: field.to,
        order: 0,
      },
    ]);
    field = { name: "", to: "", order: 1 };
    saveItems(items);
  };

  const loadItems = async () => {
    try {
      const ref = doc(db, "settings", "common");
      const result = await getDoc(ref);
      const curr = result.data();
      items = curr.navigation || [];
    } catch (error) {
      alert(error.message);
    }
  };

  onMount(() => loadItems());
</script>

<table class="table table-bordered mb-4">
  <thead>
    <tr>
      <th> Name </th>
      <td> Target </td>
      <td />
    </tr>
  </thead>
  <tbody
    use:dndzone={{ items, flipDurationMs }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each items as item (item.id)}
      <tr key={item.id} animate:flip={{ duration: flipDurationMs }}>
        <td>
          <input
            type="text"
            class="input input-bordered w-full"
            bind:value={item.name}
          /></td
        >
        <td>
          <input
            type="text"
            class="input input-bordered w-full"
            bind:value={item.to}
          />
        </td>
        <td>
          <button class="btn btn-error text-white btn-square">
            <IconTrash size={16} />
          </button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

<div class="flex items-center px-6 w-full gap-6">
  <div class="flex-1">
    <input
      type="text"
      class="input input-bordered w-full"
      bind:value={field.name}
    />
  </div>
  <div class="flex-1">
    <input
      type="text"
      class="input input-bordered w-full"
      bind:value={field.to}
    />
  </div>
  <div class="flex-1">
    <button
      class="btn btn-primary btn-square"
      disabled={field.name === "" || field.to === ""}
      on:click={onAddMenu}
    >
      <IconPlus size={16} />
    </button>
  </div>
  <div class="flex-1 flex justify-end" />
</div>
