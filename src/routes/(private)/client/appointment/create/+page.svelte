<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { auth, db } from "$lib/firebase";

  import {
    collection,
    getDocs,
    query,
    where,
    doc,
    getDoc,
  } from "firebase/firestore";

  import { onMount } from "svelte";

  import moment from "moment";
  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";
  import settingStore from "$lib/stores/setting.store";
  import { isValidEmail, isValidMobile } from "$lib/string";

  $: services = $settingStore.services.items;

  let loading = false;
  let submit;
  let dates = [];
  let slots = {};

  let fields = {
    name: "",
    contact: "09",
    address: "",
    city: "Pasig",
    email: "",
    service: "",
    date: "",
    time: "",
  };

  let invalids = {
    name: false,
    contact: false,
    address: false,
    city: false,
    email: false,
    service: false,
    date: false,
    time: false,
  };

  const onSubmit = async () => {
    if (fields.name === "") {
      invalids.name = true;
      alert("name field is required");
      return;
    }

    invalids.name = false;

    if (!isValidMobile(fields.contact)) {
      invalids.contact = true;
      alert("contact field is invalid");
      return;
    }

    invalids.contact = false;

    if (fields.address === "") {
      invalids.address = true;
      alert("address field is required");
      return;
    }

    invalids.address = false;

    if (fields.city === "") {
      invalids.city = true;
      alert("city field is required");
      return;
    }

    invalids.city = false;

    if (!isValidEmail(fields.email)) {
      invalids.email = true;
      alert("email field is invalid");
      return;
    }

    invalids.email = false;

    if (fields.service === "") {
      invalids.service = true;
      alert("service field is required");
      return;
    }

    invalids.service = false;

    if (fields.date === "") {
      alert("date field is required");
      return;
    }

    if (fields.time === "") {
      invalids.time = true;
      alert("time field is required");
      return;
    }

    invalids.time = false;

    const conf = window.confirm(
      "Are you sure you want to setup this appointment?"
    );

    if (conf) {
      loading = true;

      const idToken = await auth.currentUser.getIdToken();

      await fetch("/client/appointment/create", {
        method: "POST",
        body: JSON.stringify({
          ...fields,
          idToken,
        }),
        headers: {
          "content-type": "application/json",
        },
      })
        .then(() => {
          alert("appointment was successfully booked");
          goto("/client/appointment");
        })
        .catch((error) => {
          alert(error.message);
        })
        .finally(() => (loading = false));
    }
  };

  const isPastDate = (dt) => {
    return moment(dt).isBefore(moment());
  };

  const loadServices = () => {
    settingStore.loadServices();
  };

  const onChangeDate = (evt) => {
    fields.time = "";
    loadSlot(evt.target.value);
    loadUserInfo();
  };

  const loadSlot = async (key) => {
    const ref = doc(db, "slots", key);
    const result = await getDoc(ref);
    const curr = result.data();
    slots = curr.slots;
  };

  const loadEvents = async () => {
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

  const loadUserInfo = async () => {
    const currentUser = auth.currentUser;

    const user = { ...currentUser.toJSON() };

    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    const profile = snap.data();

    fields = {
      ...fields,
      city: profile.city,
      address: profile.address,
      name: user.displayName,
      email: user.email,
      contact: profile.mobile,
    };
  };

  const onSelectTime = (time) => {
    fields.time = time;
    submit.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  };

  onMount(() => {
    loadServices();
    loadEvents();
  });

  $: items = Object.keys(slots).sort();

  $: allowSubmit = fields.name && fields.service && fields.time && fields.date;
</script>

<PageMain {loading}>
  <PageHead
    title="New Appointment"
    subtitle="Please a service to make an appointment"
  >
    <span slot="action" />
  </PageHead>

  <div class="mb-4 mt-4 flex flex-col gap-2">
    <label for="name">Select Service:</label>
    <select
      class="select select-bordered w-full"
      bind:value={fields.service}
      placeholder="Select a service"
    >
      {#each services as item}
        <option value={item.name}>{item.name}</option>
      {/each}
    </select>
  </div>

  {#if fields.service}
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
  {/if}

  <div
    class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 mb-4 max-h-80 overflow-y-auto"
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

  {#if fields.date && fields.time && fields.service}
    <div class="mt-4">
      <div class="text-xl mt-4 font-bold">User Information</div>
      <div class="text-sm text-gray-500 mb-4">
        Please complete your information below
      </div>

      <div class="mb-2 flex flex-col gap-2">
        <label for="name">Your Name:</label>
        <input
          type="text"
          class="input input-bordered w-full"
          class:input-secondary={invalids.name}
          bind:value={fields.name}
          required
        />
      </div>

      <div class="flex flex-col lg:flex-row gap-2 mb-2">
        <div class="flex flex-1 flex-col gap-2">
          <label for="name">Address:</label>
          <input
            type="text"
            class="input input-bordered w-full"
            required
            class:input-secondary={invalids.address}
            bind:value={fields.address}
          />
        </div>
        <div class="flex flex-1 flex-col gap-2">
          <label for="name">City:</label>
          <input
            type="text"
            class="input input-bordered w-full"
            required
            class:input-secondary={invalids.city}
            bind:value={fields.city}
          />
        </div>
      </div>

      <div class="flex flex-col lg:flex-row gap-2 mb-2">
        <div class="flex flex-1 flex-col gap-2">
          <label for="name">Email:</label>
          <input
            type="email"
            class="input input-bordered w-full"
            bind:value={fields.email}
            class:input-secondary={invalids.email}
            required
          />
        </div>
        <div class="flex flex-1 flex-col gap-2">
          <label for="name">Mobile:</label>
          <input
            type="text"
            class="input input-bordered w-full"
            bind:value={fields.contact}
            placeholder="09204206656"
            minlength="11"
            maxlength="11"
            class:input-secondary={invalids.contact}
            required
          />
        </div>
      </div>
    </div>
  {/if}

  <div class="flex items-center" bind:this={submit}>
    <button class="btn" on:click={() => goto("/client/appointment")}
      >Cancel</button
    >
    <div class="flex-1" />

    <button class="btn btn-primary" on:click={onSubmit} disabled={!allowSubmit}
      >Set Appointment</button
    >
  </div>
</PageMain>
