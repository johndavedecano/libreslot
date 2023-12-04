<script>
  // @ts-nocheck
  import { db } from "$lib/firebase";

  import { getDoc, doc, setDoc } from "firebase/firestore";
  import { onMount } from "svelte";

  const INIT_VALUES = {
    mon: {
      enabled: true,
      start: "08:00",
      end: "18:00",
      name: "Monday",
    },
    tue: {
      enabled: true,
      start: "08:00",
      end: "18:00",
      name: "Tuesday",
    },
    wed: {
      enabled: true,
      start: "08:00",
      end: "18:00",
      name: "Wednesday",
    },
    thu: {
      enabled: true,
      start: "08:00",
      end: "18:00",
      name: "Thursday",
    },
    fri: {
      enabled: true,
      start: "08:00",
      end: "18:00",
      name: "Friday",
    },
    sat: {
      enabled: false,
      start: "08:00",
      end: "18:00",
      name: "Saturday",
    },
    sun: {
      enabled: false,
      start: "08:00",
      end: "18:00",
      name: "Sunday",
    },
  };

  let values = { ...INIT_VALUES };

  $: items = Object.keys(values);

  const onChange = async () => {
    try {
      const ref = doc(db, "settings", "hours");
      await setDoc(ref, values);
    } catch (error) {
      alert(error.message);
    }
  };

  const loadValues = async () => {
    try {
      const ref = doc(db, "settings", "hours");
      const result = await getDoc(ref);
      if (result.exists()) {
        values = {
          ...values,
          ...result.data(),
        };
      } else {
        await setDoc(ref, INIT_VALUES);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  onMount(() => loadValues());
</script>

<div class="flex items-center">
  <div class="flex-1">
    <div class="font-bold text-md">Hours of Operation</div>
    <div class="text-gray-500 text-sm">
      When is the office opens up to cater services
    </div>
  </div>
</div>

<table class="table table-bordered">
  <thead>
    <tr>
      <th />
      <th> Day </th>
      <td> Start </td>
      <td> End </td>
    </tr>
  </thead>
  <tbody>
    {#each items as day}
      <tr>
        <td style="width: 25px;">
          <input
            type="checkbox"
            bind:checked={values[day].enabled}
            class="checkbox checkbox-success"
            on:change={onChange}
          />
        </td>
        <td>{values[day].name}</td>
        <td>
          <input
            type="time"
            class="input input-bordered input-sm w-full"
            bind:value={values[day].start}
            on:change={onChange}
          />
        </td>
        <td>
          <input
            type="time"
            class="input input-bordered input-sm w-full"
            bind:value={values[day].end}
            on:change={onChange}
          />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
