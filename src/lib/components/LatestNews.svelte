<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  import { collection, getDocs, query, orderBy } from "firebase/firestore";

  import { db } from "$lib/firebase";

  import moment from "moment";

  let items = [];

  const loadData = async () => {
    try {
      const colRef = collection(db, "posts");

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
    <h2 class="card-title mb-2">Latest News</h2>
    {#each items as item}
      <div class="flex items-center mb-2">
        <a
          href={`/news/${item.id}`}
          class="text-base text-primary font-bold block leading-0"
        >
          {item.title}
          <span class="text-xs text-gray-500 block font-light">
            Post on {moment(item.createdAt).format("LLL")}
          </span>
        </a>
      </div>
    {/each}
  </div>
</div>
