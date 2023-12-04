<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  import { collection, getDocs, query, orderBy } from "firebase/firestore";

  import { db } from "$lib/firebase";

  import moment from "moment";
  import { goto } from "$app/navigation";

  let items = [];

  const loadData = async () => {
    try {
      const colRef = collection(db, "appointments");

      const q = query(colRef, orderBy("createdAt", "desc"));

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

  onMount(() => {
    loadData();
  });
</script>

<div class="card flex-1 bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title mb-2">Latest Appointments</h2>
    {#each items as item}
      <div class="flex items-center mb-2">
        <a
          href={`/admin/appointments/${item.id}`}
          class="text-base text-primary font-bold block leading-0"
        >
          {item.name} - {item.service}
          <span class="text-xs text-gray-500 block font-light">
            {moment(`${item.date} ${item.time}`).format("LLL")}
          </span>
        </a>
      </div>
    {/each}

    <div class="card-actions justify-end">
      <button class="btn btn-link" on:click={() => goto("/admin/appointments")}
        >View All</button
      >
    </div>
  </div>
</div>
