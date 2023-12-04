// @ts-nocheck
import { json } from "@sveltejs/kit";

import { db } from "$lib/server/firebase.js";

export async function GET({ request }) {
  try {
    const appointmentRef = db.collection("appointments");
    const appointmentSnap = await appointmentRef.count().get();
    const appointments = appointmentSnap.data().count;

    const userRef = db.collection("users");
    const userSnap = await userRef.count().get();
    const users = userSnap.data().count;

    return json({
      success: true,
      data: {
        appointments,
        users,
      },
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
