<script>
  // @ts-nocheck

  import moment from "moment";

  import { db } from "$lib/firebase";

  import { getDoc, doc, setDoc } from "firebase/firestore";
  import { createEventDispatcher, onMount } from "svelte";
  import { createSlotsObject } from "$lib/common";

  let modal;

  let date;

  let slots = {};

  let enabled = false;

  let timestamp;

  const dispatch = createEventDispatcher();

  const loadSlot = async (key) => {
    const ref = doc(db, "slots", key);
    const result = await getDoc(ref);
    if (result.exists()) {
      const curr = result.data();
      slots = curr.slots || createSlotsObject();
      enabled = curr.enabled;
      timestamp = curr.date;
    } else {
      slots = createSlotsObject();
      enabled = true;
      timestamp = moment(date).unix();
    }
  };

  const onSubmit = async () => {
    try {
      const ref = doc(db, "slots", date);

      await setDoc(ref, {
        slots,
        enabled,
        timestamp: moment(date).unix(),
      });

      modal.close();

      dispatch("refresh");
    } catch (error) {
      alert(error.message);
    }
  };

  export function open(value) {
    modal.showModal();

    date = value;

    loadSlot(date);
  }

  export function close() {
    modal.close();
  }

  onMount(() => {
    slots = createSlotsObject();
  });

  $: items = Object.keys(slots).sort();
</script>

<dialog bind:this={modal} class="modal">
  <div class="modal-box">
    <div class="form-group flex flex-col gap-1 mb-6">
      <label for="date" class="font-bold">Selected Date:</label>
      <input
        type="text"
        class="input input-bordered w-full"
        value={moment(date).format("LL")}
        readonly
      />
    </div>

    <div class="grid grid-cols-2 gap-2 mb-4 max-h-80 overflow-y-auto">
      {#each items as key}
        <!-- content here -->
        <div class="flex items-center border px-2">
          <label for="" class="label cursor-pointer">
            <input
              type="checkbox"
              bind:checked={slots[key].enabled}
              class="checkbox"
            />
            <div class="label-text pl-2">
              {slots[key].label}
            </div>
          </label>
          <div class="flex-1">
            <input
              type="number"
              class="input text-left w-full font-bold p-0"
              bind:value={slots[key].available}
            />
          </div>
        </div>
      {/each}
    </div>

    <div class="flex gap-4 w-full">
      <div class="form-control">
        <label class="label cursor-pointer flex gap-2">
          <input
            type="checkbox"
            class="toggle toggle-success"
            bind:checked={enabled}
          />
          <span class="label-text"
            >Enable appointments for this date. {moment(date).format(
              "LL"
            )}</span
          >
        </label>
      </div>
    </div>

    <div class="modal-action flex items-center">
      <form method="dialog">
        <!-- if there is a button, it will close the modal -->
        <button class="btn">Cancel</button>
      </form>
      <div class="flex-1" />
      <button class="btn btn-primary" on:click={onSubmit}>Save</button>
    </div>
  </div>
</dialog>
