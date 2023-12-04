<script>
  import { formatNumberWithK } from "$lib/string";
  import { IconCalendar, IconUser } from "@tabler/icons-svelte";
  import moment from "moment";
  import { onMount } from "svelte";

  let totalAppointments = 0;
  let totalUsers = 0;

  const loadStats = async () => {
    const response = await fetch("/admin/stats", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });

    const { data } = await response.json();

    totalAppointments = data.appointments;
    totalUsers = data.users;
  };

  onMount(() => loadStats());
</script>

<div class="stats shadow w-full">
  <div class="stat">
    <div class="stat-figure text-secondary">
      <IconCalendar size={42} />
    </div>
    <div class="stat-title">Appointments for {moment().format("MMMM")}</div>
    <div class="stat-value">{formatNumberWithK(totalAppointments)}</div>
    <!-- <div class="stat-desc">Jan 1st - Feb 1st</div> -->
  </div>

  <div class="stat">
    <div class="stat-figure text-secondary">
      <IconUser size={42} />
    </div>
    <div class="stat-title">New Users</div>
    <div class="stat-value">{formatNumberWithK(totalUsers)}</div>
    <!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
  </div>
</div>
