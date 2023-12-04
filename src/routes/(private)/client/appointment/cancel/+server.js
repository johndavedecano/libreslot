// @ts-nocheck
import { db } from "$lib/server/firebase.js";
import { json } from "@sveltejs/kit";

export async function DELETE({ request, cookies }) {
  try {
    const params = await request.json();

    if (!params.appointment) {
      throw new Error("appointment is not defined");
    }

    const appointment = params.appointment;

    const uid = cookies.get("uid", { path: "/" });

    const snap = await db.collection("appointments").doc(appointment.id).get();

    if (!snap.exists) {
      throw new Error("invalid appointment");
    }

    const doc = { ...snap.data(), id: snap.id };

    if (doc.user !== uid) {
      throw new Error("you are not allowed to access this resource");
    }

    if (doc.status !== "pending") {
      throw new Error("invalid appointment status");
    }

    await db
      .collection("appointments")
      .doc(doc.id)
      .update({ status: "cancelled" });

    return json({
      success: true,
      message: "successfully cancelled",
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
