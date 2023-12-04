<script>
  // @ts-nocheck
  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";

  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { page } from "$app/stores";

  import toolbar from "$lib/toolbar";

  let editorEl;

  let editor;

  let item = {};

  let fields = {
    title: "",
    body: "",
    public: true,
    order: 0,
  };

  $: console.log(fields);

  const onSubmit = async () => {
    try {
      if (fields.title === "") {
        alert("title field is required");
        return;
      }

      if (fields.body === "") {
        alert("post content is required");
        return;
      }

      const ref = doc(db, "posts", $page.params.id);

      await updateDoc(ref, {
        title: fields.title,
        body: fields.body,
        public: fields.public,
        updatedAt: Date.now(),
      });

      alert("successfully updated");
    } catch (error) {
      alert(error.message);
    }
  };

  const initEditor = () => {
    setTimeout(() => {
      editor = new window.Quill(editorEl, {
        modules: { toolbar },
        theme: "snow",
      });

      editor.on("text-change", () => {
        fields.body = editor.root.innerHTML;
      });
    }, 1000);
  };

  const onLoadItem = async () => {
    try {
      const ref = doc(db, "posts", $page.params.id);
      const snap = await getDoc(ref);
      item = { ...snap.data(), id: snap.id };
      fields = {
        title: item.title,
        body: item.body,
        public: item.public,
        order: item.order,
      };
      editorEl.innerHTML = item.body;
    } catch (error) {
      alert(error.message);
    }
  };

  onMount(() => {
    initEditor();
    onLoadItem();
  });
</script>

<PageMain>
  <PageHead title={`Editing ${fields.title}`}>
    <span slot="action" />
  </PageHead>

  <div class="flex-1 mt-4 mb-4">
    <input
      type="text"
      class="input input-bordered w-full"
      placeholder="Title"
      bind:value={fields.title}
    />
  </div>

  <div style="min-height: 600px" class="mb-4">
    <div bind:this={editorEl} />
  </div>

  <div class="flex items-center">
    <button class="btn" on:click={() => goto("/admin/posts")}> Cancel</button>
    <div class="flex-1" />
    <button class="btn btn-primary" on:click={onSubmit}> Save Changes </button>
  </div>
</PageMain>

<style>
  :global(.ql-editor) {
    min-height: 600px;
  }
</style>
