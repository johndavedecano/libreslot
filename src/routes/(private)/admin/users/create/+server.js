// @ts-nocheck
import { auth, db } from "$lib/server/firebase.js";
import { isValidEmail, isValidPassword } from "$lib/string.js";
import { json } from "@sveltejs/kit";

export async function POST({ params, request }) {
  try {
    const body = await request.json();

    if (!body.firstName || !body.lastName) {
      throw new Error("invalid name");
    }

    if (!isValidEmail(body.email)) {
      alert("invalid user password");
      return;
    }

    if (!isValidPassword(body.password)) {
      alert("invalid user password");
      return;
    }

    const name = `${body.firstName} ${body.lastName}`;

    const user = await auth.createUser({
      email: body.email,
      displayName: name,
      password: body.password,
    });

    await db.collection("users").doc(user.uid).set({
      mobile: body.mobile,
      avatar: "/avatar.png",
      admin: false,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
    });

    return json({
      success: true,
    });
  } catch (error) {
    return json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 400,
      }
    );
  }
}
