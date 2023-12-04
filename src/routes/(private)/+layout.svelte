<script>
  // @ts-nocheck

  import { auth } from "$lib/firebase.js";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  import settingStore from "$lib/stores/setting.store";
  import userStore from "$lib/stores/user.store";

  let loading = true;

  const login = async (user) => {
    const idToken = await user.getIdToken();
    userStore.setCurrentUser(user);
    await fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        idToken,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
  };

  const logout = async () => {
    await fetch("/auth/logout", {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
      },
    });
    goto("/auth/login");
  };

  onMount(() => {
    settingStore.loadCommon().finally(() => {
      loading = false;
    });
    auth.onAuthStateChanged((user) => {
      if (user) {
        login(user);
      } else {
        logout();
      }
    });
  });
</script>

<slot />
