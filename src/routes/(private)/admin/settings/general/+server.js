// @ts-nocheck
import { json } from "@sveltejs/kit";

import { db } from "$lib/server/firebase.js";

import pick from "lodash/pick";

export async function POST({ request }) {
  try {
    const params = await request.json();

    const setting = pick(params, [
      "appointment_enabled",
      "city",
      "cover",
      "email",
      "logo",
      "maintenance_enabled",
      "maintenance_ends_at",
      "maintenance_message",
      "name",
      "navigation",
      "cover",
      "province",
      "region",
      "zipcode",
      "phone",
      "zipcode",
      "address",
    ]);

    console.log(setting);

    await db.collection("settings").doc("common").update(setting);

    return json({
      success: true,
      message: "successfully added",
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
