<script>
  // @ts-nocheck

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
  import moment from "moment";

  let items = [];

  const loadData = async () => {
    try {
      const colRef = collection(db, "posts");

      const q = query(colRef, orderBy("createdAt"));

      const querySnapShot = await getDocs(q);

      let posts = [];

      querySnapShot.forEach((v) => {
        const item = { ...v.data(), id: v.id };
        posts.push(item);
      });

      items = posts;
    } catch (error) {
      alert(error.message);
    }
  };

  const onChangeStatus = async (item) => {
    try {
      const ref = doc(db, "posts", item.id);

      items = items.map((v) => {
        if (v.id === item.id) v.public = !item.public;
        return v;
      });

      await updateDoc(ref, {
        public: item.public ? true : false,
        updatedAt: Date.now(),
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const onRemove = async (item) => {
    const conf = window.confirm("are you sure you want to delete this page?");
    if (conf) {
      try {
        const ref = doc(db, "posts", item.id);

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
    title="Manage Posts"
    subtitle="Create, update and delete blogs and news"
    on:add={() => goto("/admin/posts/create")}
  />

  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th>Title</th>
          <th>Public</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {#each items as item (item.id)}
          <tr key={item.id}>
            <td>
              <a
                href={`/admin/posts/${item.id}`}
                class="text-primary text-base font-bold block"
              >
                {item.title}
              </a>
              <span class="text-sm text-gray-500">
                {moment(item.createdAt).format("LLL")}
              </span>
            </td>
            <td style="max-width: 80px;">
              <input
                type="checkbox"
                class="toggle toggle-success"
                checked={item.public}
                on:change={() => onChangeStatus(item)}
              />
            </td>
            <td class="text-right px-0">
              <button
                class="btn btn-square text-white btn-success btn-sm"
                on:click={() => goto(`/admin/posts/${item.id}`)}
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
