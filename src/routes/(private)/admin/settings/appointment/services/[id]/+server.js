// @ts-nocheck
import { json } from "@sveltejs/kit";

import { db } from "$lib/server/firebase.js";

export async function PUT({ request, params }) {
  try {
    const id = params.id;

    const { name } = await request.json();

    if (name === "") {
      throw new Error("name must not be empty");
    }

    await db.collection("services").doc(id).update({
      name,
    });

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

export async function DELETE({ params }) {
  try {
    const id = params.id;

    await db.collection("services").doc(id).delete();

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
