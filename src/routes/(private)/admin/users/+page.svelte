<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";
  import moment from "moment";
  import {
    IconEdit,
    IconTrash,
    IconUser,
    IconUserPlus,
  } from "@tabler/icons-svelte";

  import { onMount } from "svelte";
  import { collection, getDocs, query } from "@firebase/firestore";
  import { db } from "$lib/firebase";

  let loading = false;

  let items = [];

  const loadUsers = async () => {
    const colRef = collection(db, "users");

    const q = query(colRef);

    const querySnapShot = await getDocs(q);

    items = querySnapShot.docs
      .map((v) => {
        return {
          id: v.id,
          ...v.data(),
        };
      })
      .filter((v) => v.deleted != true);
  };

  onMount(() => loadUsers());

  const onEditUser = (item) => {
    goto(`/admin/users/${item.id}`);
  };

  const onDeleteUser = async (item) => {
    try {
      const conf = window.confirm("are you sure you want to delete this item?");
      if (conf) {
        const response = await fetch(`/admin/users/${item.id}`, {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
        });

        await response.json();
        loadUsers();
      }
    } catch (error) {
      alert(error.message);
    }
  };
</script>

<PageMain {loading}>
  <PageHead title="Manage Users" subtitle="Manage all users">
    <div slot="action">
      <button
        class="btn btn-primary"
        on:click={() => goto("/admin/users/create")}
      >
        <IconUserPlus size={16} /> Add User
      </button>
    </div>
  </PageHead>
  {#if items.length > 0}
    <div class="overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Mobile</td>
            <td>Registered At</td>
            <td>Admin</td>
            <td />
          </tr>
        </thead>
        <tbody>
          <!-- row 1 -->
          {#each items as item}
            <!-- content here -->
            <tr>
              {#if item.firstName && item.lastName}
                <td>{item.lastName}, {item.firstName}</td>
              {:else}
                <td>{item.id}</td>
              {/if}
              <td>{item.mobile}</td>
              <td>{moment(item.createdAt).format("LLL")}</td>
              <td>{item.admin ? "YES" : "NO"}</td>
              <td>
                <button
                  class="btn btn-primary btn-square"
                  on:click={() => onEditUser(item)}
                >
                  <IconEdit size={16} />
                </button>
                <button
                  class="btn btn-error text-white btn-square"
                  on:click={() => onDeleteUser(item)}
                >
                  <IconTrash size={16} />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else}
    <div class="p-6 border flex items-center mt-6 h-96 justify-center">
      <div
        class="text-lg font-bold flex justify-center flex-col items-center gap-6"
      >
        <div class="text-center">
          <IconUser size={100} />
        </div>
        No users available
      </div>
    </div>
  {/if}
</PageMain>
