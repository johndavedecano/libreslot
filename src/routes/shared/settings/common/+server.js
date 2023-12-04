// @ts-nocheck
import { json } from "@sveltejs/kit";
import { db } from "$lib/server/firebase.js";

export async function GET({ request }) {
  try {
    const snap = await db.collection("settings").doc("common").get();
    return json({
      success: true,
      data: snap.data(),
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
