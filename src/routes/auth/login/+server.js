// @ts-nocheck
import { auth, db } from "$lib/server/firebase.js";
import { json } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
  try {
    const { idToken } = await request.json();

    const user = await auth.verifyIdToken(idToken);

    const userRef = await db.collection("users").doc(user.uid).get();
    const profile = userRef.data();

    if (profile.deleted) {
      throw new Error("user does not exists`");
    }

    cookies.set("idToken", idToken, { path: "/" });
    cookies.set("uid", user.uid, { path: "/" });

    return json({
      success: true,
      message: "successfully logged in",
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
