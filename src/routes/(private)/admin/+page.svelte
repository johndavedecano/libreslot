<script>
  import AdminCalendar from "$lib/components/AdminCalendar.svelte";
  import AdminStats from "$lib/components/AdminStats.svelte";
  import LatestAppointments from "$lib/components/LatestAppointments.svelte";
  import LatestNews from "$lib/components/LatestNews.svelte";
</script>

<div class="w-full 2xl:w-9/12">
  <div class="p-4 lg:p-6">
    <div class="mb-4 lg:mb-6">
      <AdminStats />
    </div>

    <div class="flex flex-col lg:flex-row gap-4 mb-6 lg:gap-6">
      <LatestNews />
      <LatestAppointments />
    </div>

    <div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
      <AdminCalendar />
    </div>
  </div>
</div>
