<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import settingStore from "$lib/stores/setting.store";
  import { isValidEmail } from "$lib/string";
  import { sendPasswordResetEmail } from "firebase/auth";

  let loading = false;

  let fields = {
    email: "",
  };

  const onSubmit = () => {
    if (!isValidEmail(fields.email)) {
      alert("Email address field is invalid");
      return;
    }

    loading = true;

    sendPasswordResetEmail(auth, fields.email)
      .then(async () => {
        alert("password reset instruction was sent to " + fields.email);
        goto("/auth/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`${errorCode}:${errorMessage}`);

        loading = false;
      });
  };

  $: setting = $settingStore.common;
</script>

<div class="login">
  <div class="card shadow-none lg:shadow-xl w-full">
    <div class="card-body">
      <div class="mb-4">
        <h2 class="card-title">Welcome to {setting.name} Portal</h2>
        <p class="text-gray-400">
          Please use the form below to reset your password.
        </p>
      </div>
      <form action="" on:submit|preventDefault={onSubmit}>
        <div class="flex flex-col gap-2 w-full mb-4">
          <label for="email">
            <span class="label-text">Email Address:</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            class="input input-bordered w-full"
            bind:value={fields.email}
          />
        </div>

        <button class="btn btn-primary w-full" type="submit" disabled={loading}
          >Reset Instruction</button
        >
      </form>

      <div class="card-actions">
        <p class="text-center">
          Already remembered your password? <a
            href="/auth/login"
            class="text-primary">Sign In</a
          >
        </p>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .login {
    @apply mx-4;
    width: 500px;
    max-width: 100%;
  }
</style>
