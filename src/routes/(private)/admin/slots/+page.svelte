<script>
  // @ts-nocheck
  import moment from "moment";

  import PageHead from "$lib/components/PageHead.svelte";
  import PageMain from "$lib/components/PageMain.svelte";

  import { onDestroy, onMount } from "svelte";
  import SlotModal from "./(components)/slot-modal.svelte";
  import {
    collection,
    getDocs,
    query,
    setDoc,
    getDoc,
    where,
    doc,
  } from "firebase/firestore";
  import { db } from "$lib/firebase";
  import { createSlotsObject } from "$lib/common";

  let modal;

  let calendarEl;

  let calendar;

  let start;

  let end;

  const createSlots = async (date) => {
    try {
      const ref = doc(db, "slots", date);

      const result = await getDoc(ref);

      if (!result.exists()) {
        await setDoc(ref, {
          slots: createSlotsObject(),
          enabled: true,
          timestamp: moment(date).unix(),
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onAddSlots = async () => {
    const conf = window.confirm("Add slots for all visible dates?");

    if (!conf) return false;

    const s = moment(start);
    const e = moment(end);

    const diff = e.diff(s, "days") - 1;

    const dates = [s.format("YYYY-MM-DD")];

    for (let i = 0; i < diff; i++) {
      const v = s.add(1, "day");
      const day = v.toDate().getDay();
      if (day !== 0 && day !== 6) {
        dates.push(v.format("YYYY-MM-DD")); // skip weekends
      }
    }

    const promises = [];

    dates.forEach((d) => promises.push(createSlots(d)));

    await Promise.all(promises);

    loadEvents();
  };

  const loadEvents = async () => {
    try {
      calendar.removeAllEvents();

      const startTs = moment(start).unix();
      const endTs = moment(end).unix();

      const colRef = collection(db, "slots");

      const q = query(
        colRef,
        where("timestamp", ">=", startTs),
        where("timestamp", "<=", endTs)
      );

      const querySnapShot = await getDocs(q);

      querySnapShot.docs.forEach((v) => {
        const item = { ...v.data(), id: v.id };
        let total = 0;
        Object.keys(item.slots).forEach((v) => {
          total += item.slots[v].available;
        });
        calendar.addEvent({
          title: item.enabled
            ? `${total} Slots - Open`
            : `${total} Slots - Closed`,
          start: moment(item.id).toDate(),
          allDay: true,
          color: item.enabled ? "green" : "red",
        });
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const onDateClicked = (info) => {
    modal.open(moment(info.date).format("YYYY-MM-DD"));
  };

  const onEventClick = (info) => {
    modal.open(moment(info.event.start).format("YYYY-MM-DD"));
  };

  const onDateSet = (info) => {
    start = info.start;
    end = info.end;
    loadEvents();
  };

  onMount(() => {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      dateClick: onDateClicked,
      datesSet: onDateSet,
      eventClick: onEventClick,
    });
    calendar.render();
  });

  onDestroy(() => {
    if (
      calendar &&
      calendar.destroy &&
      typeof calendar.destroy === "function"
    ) {
      calendar.destroy();
    }
  });
</script>

<PageMain>
  <PageHead
    title="Manage Slots"
    subtitle="Create, update and delete appointment slots"
  >
    <div slot="action">
      <button class="btn btn-primary" on:click={onAddSlots}> Add Slots </button>
    </div>
  </PageHead>

  <div id="calendar" bind:this={calendarEl} />
</PageMain>

<SlotModal bind:this={modal} on:refresh={loadEvents} />
