<script>
  // @ts-nocheck

  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import settingStore from "$lib/stores/setting.store";
  import { isValidEmail, isValidMobile, isValidPassword } from "$lib/string";
  import {
    createUserWithEmailAndPassword,
    sendEmailVerification,
  } from "firebase/auth";

  import isEmpty from "lodash/isEmpty.js";

  let loading = false;

  let fields = {
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    password: "",
  };

  const onSubmit = () => {
    if (isEmpty(fields.firstName)) {
      alert("first name field is required");
      return;
    }

    if (isEmpty(fields.lastName)) {
      alert("last name field is required");
      return;
    }

    if (!isValidMobile(fields.mobile)) {
      alert("Mobile number field is required");
      return;
    }

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

    createUserWithEmailAndPassword(auth, fields.email, fields.password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await sendEmailVerification(user);

        const idToken = await user.getIdToken();

        await fetch("/auth/register", {
          method: "POST",
          body: JSON.stringify({
            idToken,
            email: fields.email,
            mobile: fields.mobile,
            firstName: fields.firstName,
            lastName: fields.lastName,
          }),
          headers: {
            "content-type": "application/json",
          },
        });

        alert(
          "registration successful. please check your email " +
            fields.email +
            " to activate your account."
        );

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
          Please use the form below to create a new account
        </p>
      </div>
      <form action="" on:submit|preventDefault={onSubmit}>
        <div class="flex gap-2 w-full mb-4">
          <div class="flex-1">
            <label for="name">
              <span class="label-text">First Name:</span>
            </label>
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              class="input input-bordered w-full"
              bind:value={fields.firstName}
            />
          </div>
          <div class="flex-1">
            <label for="name">
              <span class="label-text">Last Name:</span>
            </label>
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              class="input input-bordered w-full"
              bind:value={fields.lastName}
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 w-full mb-4">
          <label for="mobile_number">
            <span class="label-text">Mobile Number:</span>
          </label>
          <input
            type="tel"
            name="mobile"
            class="input input-bordered w-full"
            bind:value={fields.mobile}
            placeholder="09204206656"
            minlength="11"
            maxlength="11"
          />
        </div>

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

        <div class="flex flex-col gap-2 w-full mb-4">
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
        <button class="btn btn-primary w-full" type="submit" disabled={loading}
          >Register</button
        >
      </form>

      <div class="card-actions">
        <p class="text-center">
          Already have an account? <a href="/auth/login" class="text-primary"
            >Sign in</a
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
