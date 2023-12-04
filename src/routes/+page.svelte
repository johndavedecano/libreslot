<script>
  // @ts-nocheck

  import CommonNav from "$lib/components/CommonNav.svelte";

  export let data;
</script>

<svelte:head>
  <title>{data.settings.name}</title>
  <meta property="og:image" content={data.settings.logo | "/logo.png"} />
  <link rel="prefetch" href="/auth/login" />
  <link rel="prefetch" href="/auth/register" />
  <link rel="prefetch" href="/auth/forgot" />
</svelte:head>

<CommonNav {data} />

<div class="hero min-h-screen">
  <div class="hero-overlay bg-opacity-60" />
  <div class="hero-content text-center text-neutral-content">
    <div class="max-w-xl">
      <img src={data.settings.logo || "/logo.png"} alt="" />
      <h1 class="mb-5 text-3xl lg:text-5xl font-bold">
        Welcome to {data.settings.name} <bt /> Portal
      </h1>
      <p class="mb-5">
        We would like to provide you the best services. In order to make a
        transaction, you have to setup an appointment.
      </p>
      <a class="btn btn-primary w-full mb-5" href="/client/appointment/create"
        >Setup An Appointment</a
      >

      <a class="btn btn-success w-full" href="/client">Access My Account</a>
    </div>
  </div>
</div>

<style lang="postcss">
  .nav {
    @apply bg-blue-800 w-full;
    height: 60px;
  }
  .nav-container {
    @apply mx-auto flex items-center px-4 xl:px-0;
    height: 60px;
    max-width: 100%;
    width: 1280px;
  }

  .nav-brand {
    @apply font-bold text-lg text-white;
  }

  .nav-items {
    @apply flex items-center gap-4 overflow-x-auto;
  }

  .nav-items a {
    @apply text-white;
  }

  .nav-items a:hover {
    @apply text-yellow-400;
  }
</style>
