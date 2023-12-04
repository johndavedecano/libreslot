// @ts-nocheck
import { json } from "@sveltejs/kit";
import { db } from "$lib/server/firebase.js";

export async function POST({ request, cookies }) {
  try {
    const uid = cookies.get("uid", { path: "/" });

    const params = await request.json();

    delete params.admin;

    await db.collection("users").doc(uid).update(params);

    return json({
      success: true,
      message: "successfully updated",
    });
  } catch (error) {
    console.error(error);
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
