<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { isValidPassword } from "$lib/string";
  import PageMain from "$lib/components/PageMain.svelte";
  import { page } from "$app/stores";

  let user = {};

  let password = "";
  let password_confirmation = "";

  const onUpdatePassword = async () => {
    try {
      if (!isValidPassword(password)) {
        alert("invalid password");
        return;
      }

      if (password !== password_confirmation) {
        alert("passwords dont match");
        return;
      }

      await fetch("/admin/users/" + $page.params.id + "/password", {
        method: "PUT",
        body: JSON.stringify({
          password,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      alert("successfully updated");

      password = "";
      password_confirmation = "";
    } catch (error) {
      alert(error.message);
    }
  };

  const onUpdateUser = async () => {
    try {
      if (user.firstName === "" || user.lastName === "") {
        alert("invalid name");
        return;
      }

      await fetch("/admin/users/" + $page.params.id, {
        method: "PUT",
        body: JSON.stringify(user),
        headers: {
          "content-type": "application/json",
        },
      });

      alert("successfully updated");
    } catch (error) {
      alert(error.message);
    }
  };

  const loadUser = async () => {
    try {
      const response = await fetch("/admin/users/" + $page.params.id, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const results = await response.json();

      user = results.data;
    } catch (error) {
      alert(error.message);
    }
  };

  onMount(() => loadUser());
</script>

<PageMain>
  <div class="px-4">
    <form action="" method="POST" on:submit|preventDefault={onUpdateUser}>
      <div class="flex items-center gap-6 mb-4">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">First Name:</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="name"
            bind:value={user.firstName}
            required
          />
        </div>
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Last Name:</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="name"
            bind:value={user.lastName}
            required
          />
        </div>
      </div>

      <div class="flex items-center gap-6 mb-8">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Email Address</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="email"
            bind:value={user.email}
            disabled
            required
          />
        </div>
      </div>

      <div class="flex items-center gap-6 mb-8">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Mobile Number</div>
          <input
            type="tel"
            name="mobile"
            bind:value={user.mobile}
            class="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div class="flex items-center gap-6 mb-4">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Address</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="address"
            bind:value={user.address}
            required
          />
        </div>
      </div>

      <div class="flex items-center gap-6 mb-4">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">City</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="city"
            bind:value={user.city}
            required
          />
        </div>
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Province</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="province"
            bind:value={user.province}
            required
          />
        </div>
      </div>

      <div class="flex items-center gap-6 mb-4">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Region</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="region"
            bind:value={user.region}
            required
          />
        </div>
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Zipcode</div>
          <input
            type="text"
            class="input input-bordered w-full"
            name="zipcode"
            bind:value={user.zipcode}
            required
          />
        </div>
      </div>

      <div class="flex items-center">
        <div class="flex-1" />
        <button class="btn btn-primary" type="submit"> Update Details </button>
      </div>
    </form>
  </div>
</PageMain>

<PageMain>
  <div class="px-4">
    <form action="" method="POST" on:submit|preventDefault={onUpdatePassword}>
      <div class="flex items-center gap-6 mb-8">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Password</div>
          <input
            type="password"
            class="input input-bordered w-full"
            name="password"
            bind:value={password}
            required
          />
        </div>
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Password Confirmation</div>
          <input
            type="password"
            class="input input-bordered w-full"
            name="password_confirmation"
            bind:value={password_confirmation}
            required
          />
        </div>
      </div>

      <div class="flex items-center">
        <div class="flex-1" />
        <button class="btn btn-primary" type="submit"> Update Password </button>
      </div>
    </form>
  </div>
</PageMain>
