<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  import userStore from "$lib/stores/user.store";
  import { doc, getDoc } from "firebase/firestore";
  import { auth, db } from "$lib/firebase";
  import { isValidPassword } from "$lib/string";
  import { updatePassword, updateProfile } from "firebase/auth";

  let user = {};
  let profile = {};

  let password = "";
  let password_confirmation = "";

  const onUpdateContact = async () => {
    try {
      await fetch("/client/account/profile", {
        method: "POST",
        body: JSON.stringify(profile),
        headers: {
          "content-type": "application/json",
        },
      });
      alert("successfully updated");
    } catch (error) {
      alert(error.message);
    }
  };

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

      const user = auth.currentUser;

      await updatePassword(user, password);

      alert("successfully updated");
    } catch (error) {
      alert(error.message);
    }
  };

  const onUpdateAccount = async () => {
    try {
      if (profile.firstName === "" || profile.lastName === "") {
        alert("invalid name");
        return;
      }

      await fetch("/client/account/profile", {
        method: "POST",
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      await updateProfile(auth.currentUser, {
        displayName: `${profile.firstName} ${profile.lastName}`,
      });

      alert("successfully updated");
    } catch (error) {
      alert(error.message);
    }
  };

  const loadProfile = async (uid) => {
    const ref = doc(db, "users", uid);
    const snap = await getDoc(ref);
    profile = snap.data();
  };

  onMount(() => {
    user = $userStore.user;
    loadProfile(user.uid);
  });
</script>

<form action="" method="POST" on:submit|preventDefault={onUpdateAccount}>
  <h2 class="card-title text-ellipsis whitespace-nowrap overflow-hidden mb-8">
    Account Setting
  </h2>

  <div class="flex items-center gap-6 mb-4">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">First Name:</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="name"
        bind:value={profile.firstName}
        required
      />
    </div>
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Last Name:</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="name"
        bind:value={profile.lastName}
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

  <div class="flex items-center">
    <div class="flex-1" />
    <button class="btn btn-primary" type="submit"> Update Details </button>
  </div>
</form>

<div class="divider" />

<form action="" method="POST" on:submit|preventDefault={onUpdateContact}>
  <h2 class="card-title text-ellipsis whitespace-nowrap overflow-hidden mb-8">
    Contact Setting
  </h2>

  <div class="flex items-center gap-6 mb-8">
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Mobile Number</div>
      <input
        type="tel"
        name="mobile"
        bind:value={profile.mobile}
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
        bind:value={profile.address}
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
        bind:value={profile.city}
        required
      />
    </div>
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Province</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="province"
        bind:value={profile.province}
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
        bind:value={profile.region}
        required
      />
    </div>
    <div class="flex-1">
      <div class="font-bold text-base mb-2">Zipcode</div>
      <input
        type="text"
        class="input input-bordered w-full"
        name="zipcode"
        bind:value={profile.zipcode}
        required
      />
    </div>
  </div>

  <div class="flex items-center">
    <div class="flex-1" />
    <button class="btn btn-primary" type="submit"> Save Settings </button>
  </div>
</form>

<div class="divider" />

<form action="" method="POST" on:submit|preventDefault={onUpdatePassword}>
  <h2 class="card-title text-ellipsis whitespace-nowrap overflow-hidden mb-8">
    Change Password
  </h2>

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
