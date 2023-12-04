// @ts-nocheck
import { json } from "@sveltejs/kit";

import { db } from "$lib/server/firebase.js";

export async function GET({ request }) {
  try {
    const items = await db.collection("services").get();

    const data = items.docs.map((v) => {
      return {
        id: v.id,
        ...v.data(),
      };
    });

    return json({
      success: true,
      data,
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

export async function POST({ request }) {
  try {
    const { name } = await request.json();

    if (name === "") {
      throw new Error("name must not be empty");
    }

    await db.collection("services").add({
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
