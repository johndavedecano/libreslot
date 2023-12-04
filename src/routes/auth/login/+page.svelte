<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import settingStore from "$lib/stores/setting.store";
  import userStore from "$lib/stores/user.store";
  import { isValidEmail, isValidPassword } from "$lib/string";
  import { signInWithEmailAndPassword } from "firebase/auth";

  let loading = false;

  let fields = {
    email: "",
    password: "",
  };

  const onSubmit = () => {
    if (!isValidEmail(fields.email)) {
      alert("Email address field is invalid");
      return;
    }

    const password = isValidPassword(fields.password);

    if (!password.success) {
      alert(password.message);
      return;
    }

    loading = true;

    signInWithEmailAndPassword(auth, fields.email, fields.password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        if (!user.emailVerified) {
          alert("email address is not yet verified!");
          return;
        }

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

        alert("successfully logged in");

        goto("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        alert(`${errorCode}:${errorMessage}`);

        loading = false;

        auth.signOut();
      });
  };

  $: setting = $settingStore.common;
</script>

<div class="login">
  <div class="card shadow-none lg:shadow-xl w-full">
    <div class="card-body">
      <div class="mb-4">
        <h2 class="card-title">Welcome to {setting.name} Portal</h2>
        <p class="text-gray-400">Please use the form below to get started</p>
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

        <div class="flex flex-col gap-2 w-full mb-2">
          <label for="email">
            <span class="label-text">Password:</span>
          </label>
          <input
            name="password"
            type="password"
            class="input input-bordered w-full"
            bind:value={fields.password}
          />
        </div>

        <div class="text-right mb-4">
          <a href="/auth/forgot" class="text-primary">Forgot Password</a>
        </div>

        <button class="btn btn-primary w-full" type="submit" disabled={loading}
          >Login</button
        >
      </form>

      <div class="card-actions">
        <p class="text-center">
          Dont have an account yet? <a
            href="/auth/register"
            class="text-primary">Sign up</a
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
