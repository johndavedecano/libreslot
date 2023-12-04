<script>
  // @ts-nocheck
  import moment from "moment";
  export let data;
</script>

<article>
  <div class="text-2xl font-bold">
    {data.page.title}
  </div>
  <div class="text-gray-500 mb-6">
    Posted at {moment(data.page.createdAt).format("LLL")}
  </div>
  <div>
    {@html data.page.body}
  </div>
</article>
