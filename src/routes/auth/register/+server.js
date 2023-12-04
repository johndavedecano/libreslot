// @ts-nocheck
import { json } from "@sveltejs/kit";

import { auth, db } from "$lib/server/firebase.js";

export async function POST({ request }) {
  try {
    const { idToken, mobile, firstName, lastName } = await request.json();

    const { uid } = await auth.verifyIdToken(idToken);

    const name = `${firstName} ${lastName}`;

    const user = await auth.updateUser(uid, { mobile, displayName: name });

    await db.collection("users").doc(uid).set({
      mobile,
      avatar: "/avatar.png",
      admin: false,
      firstName,
      lastName,
      email: user.email,
    });

    return json({
      success: true,
      message: "registration successfull",
      data: {},
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
