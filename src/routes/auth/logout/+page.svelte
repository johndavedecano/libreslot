<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import { onMount } from "svelte";

  const isUserLoggedIn = () => {
    return auth.currentUser ? true : false;
  };

  const logout = async () => {
    try {
      if (isUserLoggedIn()) {
        auth.signOut();

        await fetch("/auth/logout", {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
          },
        });
      }

      goto("/auth/login");
    } catch (error) {
      alert(error.message);
    }
  };

  onMount(() => logout());
</script>

<p class="text-gray-900">Logging out. Please wait...</p>
