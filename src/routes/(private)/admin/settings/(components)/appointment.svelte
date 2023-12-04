<script>
  import AppointmentStatus from "./appointment-status.svelte";
  import HoursOperation from "./hours-operation.svelte";
  import Services from "./services.svelte";
</script>

<div class="flex flex-col gap-6">
  <HoursOperation />
  <div class="divider" />
  <AppointmentStatus />
  <div class="divider" />
  <Services />
</div>
