// @ts-nocheck
import { json } from "@sveltejs/kit";

import { auth, db } from "$lib/server/firebase.js";
import * as firestore from "firebase-admin/firestore";
import { generateAppointmentCode } from "$lib/string.js";
import moment from "moment-timezone";

export async function POST({ request, cookies }) {
  try {
    const params = await request.json();

    if (params.name === "") {
      throw new Error("name field is required");
    }

    if (params.contact === "") {
      throw new Error("contact field is required");
    }

    if (params.address === "") {
      throw new Error("address field is required");
    }

    if (params.city === "") {
      throw new Error("city field is required");
    }

    if (params.email === "") {
      throw new Error("email field is required");
    }

    if (params.service === "") {
      throw new Error("service field is required");
    }

    if (params.timestamp === "") {
      throw new Error("timestamp field is required");
    }

    if (params.date === "") {
      throw new Error("date field is required");
    }

    if (params.time === "") {
      throw new Error("time field is required");
    }

    if (params.idToken === "") {
      throw new Error("idToken field is required");
    }

    cookies.set("idToken", params.idToken, { path: "/" });

    const user = await auth.verifyIdToken(params.idToken);

    const result = await db.collection("slots").doc(params.date).get();

    if (!result.exists) {
      return json(
        {
          success: false,
          message: "date does not exists",
        },
        {
          status: 400,
        }
      );
    }

    const date = { ...result.data(), id: result.id };

    const slots = date.slots;

    const slot = slots[params.time];

    if (!slot) {
      return json(
        {
          success: false,
          message: "slot does not exists",
        },
        {
          status: 400,
        }
      );
    }

    const available = slot.available;

    if (available < 1) {
      return json(
        {
          success: false,
          message: "slot is no longer available",
        },
        {
          status: 400,
        }
      );
    }

    const id = `${user.uid}_${params.date}_${params.time}`;

    const curr = await db.collection("appointments").doc(id).get();

    if (curr.exists) {
      return json(
        {
          success: false,
          message: "you already have an appointment",
        },
        {
          status: 400,
        }
      );
    }

    delete params.idToken;

    const code = generateAppointmentCode();

    params.timestamp = moment
      .tz(`${params.date} ${params.time}`, "Asia/Manila")
      .unix();

    const appointment = {
      ...params,
      user: user.uid,
      id,
      code,
      datetime: `${params.date} ${params.time}`,
      timestamp: params.timestamp,
      status: "pending",
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    };

    slots[params.time].available = available === 1 ? 0 : available - 1;

    await db.collection("slots").doc(params.date).update({ slots });

    await db.collection("appointments").doc(id).set(appointment);

    return json({
      success: true,
      message: "successfully added",
      data: {
        appointment,
      },
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
