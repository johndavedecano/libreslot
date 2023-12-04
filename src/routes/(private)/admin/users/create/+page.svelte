<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import { isValidEmail, isValidPassword } from "$lib/string";
  import PageMain from "$lib/components/PageMain.svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  let user = {};

  const onCreateUser = async () => {
    try {
      if (user.firstName === "" || user.lastName === "") {
        alert("invalid first or last name");
        return;
      }

      if (!isValidEmail(user.email)) {
        alert("invalid user password");
        return;
      }

      if (!isValidPassword(user.password)) {
        alert("invalid user password");
        return;
      }

      if (user.password !== user.password_confirmation) {
        alert("password does not match");
        return;
      }

      await fetch("/admin/users/create", {
        method: "POST",
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          mobile: user.mobile,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      alert("successfully created");

      goto("/admin/users");
    } catch (error) {
      alert(error.message);
    }
  };
</script>

<PageMain>
  <div class="px-4">
    <form action="" method="POST" on:submit|preventDefault={onCreateUser}>
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

      <div class="flex items-center gap-6 mb-8">
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Password</div>
          <input
            type="password"
            class="input input-bordered w-full"
            name="password"
            bind:value={user.password}
            required
          />
        </div>
        <div class="flex-1">
          <div class="font-bold text-base mb-2">Password Confirmation</div>
          <input
            type="password"
            class="input input-bordered w-full"
            name="password_confirmation"
            bind:value={user.password_confirmation}
            required
          />
        </div>
      </div>

      <div class="flex items-center">
        <div class="flex-1" />
        <button class="btn btn-primary" type="submit"> Create User </button>
      </div>
    </form>
  </div>
</PageMain>
