<script>
  // @ts-nocheck

  import { flip } from "svelte/animate";
  import { dndzone } from "svelte-dnd-action";

  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";

  import { onMount } from "svelte";

  import {
    collection,
    getDocs,
    query,
    serverTimestamp,
    updateDoc,
    doc,
    orderBy,
  } from "firebase/firestore";

  import { db } from "$lib/firebase";
  import { IconEdit, IconTrash } from "@tabler/icons-svelte";
  import { goto } from "$app/navigation";

  let items = [];

  const flipDurationMs = 300;

  function handleDndConsider(e) {
    items = e.detail.items;
  }

  function handleDndFinalize(e) {
    items = e.detail.items.map((item, i) => {
      item.order = i;
      onChangeOrder(item);
      return item;
    });
  }

  const loadData = async () => {
    try {
      const colRef = collection(db, "pages");

      const q = query(colRef, orderBy("order"));

      const querySnapShot = await getDocs(q);

      let pages = [];

      querySnapShot.forEach((v) => {
        const item = { ...v.data(), id: v.id };
        pages.push(item);
      });

      items = pages;
    } catch (error) {
      alert(error.message);
    }
  };

  const onChangeOrder = async (item) => {
    try {
      const ref = doc(db, "pages", item.id);

      await updateDoc(ref, {
        order: item.order,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const onChangeStatus = async (item) => {
    try {
      const ref = doc(db, "pages", item.id);

      items = items.map((v) => {
        if (v.id === item.id) v.public = !item.public;
        return v;
      });

      await updateDoc(ref, {
        public: item.public ? true : false,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const onRemove = async (item) => {
    const conf = window.confirm("are you sure you want to delete this page?");
    if (conf) {
      try {
        const ref = doc(db, "pages", item.id);

        items = items.map((v) => {
          if (v.id === item.id) {
            v.public = false;
            v.deleted = true;
          }
          return v;
        });

        await updateDoc(ref, {
          public: false,
          deleted: true,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        alert(error.message);
      }
    }
  };

  onMount(() => {
    loadData();
  });
</script>

<PageMain>
  <PageHead
    title="Manage Pages"
    subtitle="Create, update and delete pages"
    on:add={() => goto("/admin/pages/create")}
  />

  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th />
          <th>Name</th>
          <th>Public</th>
          <th />
        </tr>
      </thead>
      <tbody
        use:dndzone={{ items, flipDurationMs }}
        on:consider={handleDndConsider}
        on:finalize={handleDndFinalize}
      >
        {#each items as item (item.id)}
          <tr key={item.id} animate:flip={{ duration: flipDurationMs }}>
            <td style="width: 10px; min-width: 10px;">{item.order}</td>
            <td style="width: 80%;">
              <a
                href={`/admin/pages/${item.id}`}
                class="text-primary font-bold"
              >
                {item.title}
              </a>
            </td>
            <td style="width: 80px;">
              <input
                type="checkbox"
                class="toggle toggle-success"
                checked={item.public}
                on:change={() => onChangeStatus(item)}
              />
            </td>
            <td class="text-right px-0" style="min-width: 100px;">
              <button
                class="btn btn-square text-white btn-success btn-sm"
                on:click={() => goto(`/admin/pages/${item.id}`)}
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
        {/each}
      </tbody>
    </table>
  </div>
</PageMain>
