<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { db } from "$lib/firebase";
  import { doc, getDoc, updateDoc } from "firebase/firestore";
  import { onMount } from "svelte";
  import { isValidEmail, isValidMobile } from "$lib/string";
  import { page } from "$app/stores";
  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";
  import settingStore from "$lib/stores/setting.store";
  import moment from "moment";
  import SchedulePicker from "$lib/components/SchedulePicker.svelte";

  $: services = $settingStore.services.items;

  let loading = false;
  let submit;
  let modal;

  let fields = {
    name: "",
    contact: "09",
    address: "",
    city: "Pasig",
    email: "",
    service: "",
    date: "",
    time: "",
    code: "",
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

  const onCancel = async () => {
    const conf = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (conf) {
      try {
        loading = true;

        const ref = doc(db, "appointments", $page.params.id);

        await updateDoc(ref, { status: "cancelled" });

        alert("successfully cancelled");

        loading = false;

        goto("/admin/appointments");
      } catch (error) {
        alert(error.message);

        loading = false;
      }
    }
  };

  const onReschedule = () => {
    modal.showModal();
  };

  const onSubmitSchedule = async (evt) => {
    const conf = window.confirm(
      "Are you sure you want to reschedule this appointment?"
    );

    if (conf) {
      try {
        loading = true;

        const ref = doc(db, "appointments", $page.params.id);

        const date = evt.detail.date;
        const time = evt.detail.time;
        const datetime = `${date} ${time}`;
        const timestamp = moment(datetime).unix();

        await updateDoc(ref, {
          status: "pending",
          date,
          time,
          datetime,
          timestamp,
        });

        modal.close();

        alert("successfully rescheduled");

        loading = false;

        goto("/admin/appointments");
      } catch (error) {
        alert(error.message);

        loading = false;
      }
    }
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
      "Are you sure you want to update this appointment?"
    );

    if (conf) {
      try {
        loading = true;

        const ref = doc(db, "appointments", $page.params.id);

        await updateDoc(ref, fields);

        alert("successfully updated");

        loading = false;
      } catch (error) {
        alert(error.message);

        loading = false;
      }
    }
  };

  const loadServices = () => {
    settingStore.loadServices();
  };

  const loadEventInfo = async () => {
    const ref = doc(db, "appointments", $page.params.id);
    const snap = await getDoc(ref);

    if (!snap.exists) {
      alert("does not exists");
      goto("/admin/appointments");
      return;
    }

    fields = snap.data();
  };

  onMount(() => {
    loadServices();
    loadEventInfo();
  });

  $: title = `${fields.service} - ${fields.name}`;
  $: subtitle = `${moment(fields.datetime).format("LLL")} - ${String(
    fields.status
  ).toUpperCase()}`;
</script>

<PageMain {loading}>
  <PageHead {title} {subtitle}>
    <div slot="action">
      <button class="btn text-white btn-success" on:click={onReschedule}>
        Reschedule
      </button>
      <button class="btn text-white btn-error" on:click={onCancel}>
        Cancel
      </button>
    </div>
  </PageHead>

  <div class="mb-2 mt-4 flex flex-col gap-2">
    <label for="name">Appointment Code:</label>
    <input
      type="text"
      class="input uppercase font-bold input-bordered"
      name="code"
      readonly
      bind:value={fields.code}
    />
  </div>

  <div class="mb-2 flex flex-col gap-2">
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

  <div class="mb-2 flex flex-col gap-2">
    <label for="name">Select Status:</label>
    <select
      class="select uppercase select-bordered w-full"
      bind:value={fields.status}
    >
      <option value="completed">completed</option>
      <option value="cancelled">cancelled</option>
      <option value="pending">pending</option>
      <option value="expired">expired</option>
    </select>
  </div>

  <div class="mb-2 flex flex-col gap-2">
    <label for="name">Select Date:</label>
    <input
      type="date"
      class="input input-bordered"
      name="date"
      bind:value={fields.date}
      readonly
    />
  </div>

  <div class="mb-2 flex flex-col gap-2">
    <label for="name">Select Time:</label>
    <input
      type="time"
      class="input input-bordered"
      name="time"
      bind:value={fields.time}
      readonly
    />
  </div>

  <div>
    <div class="text-xl mt-4 font-bold mb-4">Client Information</div>
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

    <div class="flex flex-col lg:flex-row gap-2 mb-6">
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

  <div class="flex items-center" bind:this={submit}>
    <button class="btn" on:click={() => goto("/admin/appointments")}
      >Back to Appointments</button
    >
    <div class="flex-1" />

    <button class="btn btn-primary" on:click={onSubmit}>Save Changes</button>
  </div>
</PageMain>

<dialog bind:this={modal} class="modal">
  <div class="modal-box">
    <SchedulePicker on:submit={onSubmitSchedule} />
  </div>
</dialog>
