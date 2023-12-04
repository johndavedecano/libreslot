<script>
  // @ts-nocheck
  import moment from "moment";

  import { onDestroy, onMount } from "svelte";

  import { collection, getDocs, query, where } from "firebase/firestore";

  import { db } from "$lib/firebase";

  let calendarEl;

  let calendar;

  let start;

  let end;

  const loadEvents = async () => {
    try {
      calendar.removeAllEvents();

      const startTs = moment(start).unix();
      const endTs = moment(end).unix();

      const colRef = collection(db, "appointments");

      const q = query(
        colRef,
        where("timestamp", ">=", startTs),
        where("timestamp", "<=", endTs)
      );

      const querySnapShot = await getDocs(q);

      querySnapShot.docs.forEach((v) => {
        const item = { ...v.data(), id: v.id };
        const start = moment(`${item.date} ${item.time}`);
        const end = start.add(30, "minutes");

        calendar.addEvent({
          id: item.id,
          title: `${item.service} - ${item.name} - ${item.status}`,
          start: start.format("YYYY-MM-DD HH:mm"),
          end: end.format("YYYY-MM-DD HH:mm"),
          color: item.status === "pending" ? "green" : "red",
          url: "/admin/appointments/" + item.id,
        });
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const onEventClick = (info) => {
    console.log(info);
  };

  const onDateSet = (info) => {
    start = info.start;
    end = info.end;
    loadEvents();
  };

  onMount(() => {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek,multiMonthYear",
      },
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

<div class="card flex-1 bg-base-100 shadow-xl">
  <div class="card-body">
    <div id="calendar" bind:this={calendarEl} />
  </div>
</div>
