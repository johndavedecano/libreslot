<script>
  // @ts-nocheck
  import { db } from "$lib/firebase";

  import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
  } from "firebase/firestore";

  import { createEventDispatcher, onMount } from "svelte";

  import moment from "moment";

  let submit;
  let dates = [];
  let slots = {};

  let fields = {
    date: "",
    time: "",
  };

  const dispatch = createEventDispatcher();

  const onSubmit = async () => {
    dispatch("submit", fields);
  };

  const isPastDate = (dt) => {
    return moment(dt).isBefore(moment());
  };

  const onChangeDate = (evt) => {
    fields.time = "";
    loadSlot(evt.target.value);
  };

  const loadSlot = async (key) => {
    const ref = doc(db, "slots", key);
    const result = await getDoc(ref);
    const curr = result.data();
    slots = curr.slots;
  };

  const loadDates = async () => {
    try {
      const currDate = moment().format("YYYY-MM-DD");
      const startTs = moment(currDate).unix();
      const endTs = moment().add(90, "days").unix();

      const colRef = collection(db, "slots");

      const q = query(
        colRef,
        where("timestamp", ">=", startTs),
        where("timestamp", "<=", endTs)
      );

      const querySnapShot = await getDocs(q);

      const items = [];

      querySnapShot.docs.forEach((v) => {
        const item = { ...v.data(), id: v.id };

        if (isPastDate(item.id) || !item.enabled) return;

        let total = 0;

        Object.keys(item.slots).forEach((v) => {
          total += item.slots[v].available;
        });

        if (!total) return;

        items.push({
          label: `${moment(item.id).format("LL")} - ${total} slots`,
          value: item.id,
        });
      });

      dates = items;
    } catch (error) {
      alert(error.message);
    }
  };

  const onSelectTime = (time) => {
    fields.time = time;
  };

  onMount(() => {
    loadDates();
  });

  $: items = Object.keys(slots).sort();
</script>

<div class="mb-4 mt-4 flex flex-col gap-2">
  <label for="name">Select Date:</label>
  <select
    class="select select-bordered w-full"
    bind:value={fields.date}
    placeholder="Select a date"
    on:change={onChangeDate}
  >
    {#each dates as item}
      <option value={item.value}>{item.label}</option>
    {/each}
  </select>
</div>

<div
  class="grid grid-cols-1 lg:grid-cols-2 gap-2 mb-4 max-h-80 overflow-y-auto"
>
  {#each items as key}
    <!-- content here -->
    <button
      class="btn"
      class:btn-primary={fields.time === key}
      on:click={() => onSelectTime(key)}
    >
      {slots[key].label} - {slots[key].available} Available
    </button>
  {/each}
</div>

{#if fields.date && fields.time}
  <div class="flex items-center" bind:this={submit}>
    <div class="flex-1" />
    <button class="btn btn-primary" on:click={onSubmit}>Reschedule</button>
  </div>
{/if}
