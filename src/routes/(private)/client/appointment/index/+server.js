// @ts-nocheck
import { json } from "@sveltejs/kit";
import { auth, db } from "$lib/server/firebase.js";

export async function GET({ request, cookies }) {
  try {
    const uid = cookies.get("uid", { path: "/" });

    const results = await db
      .collection("appointments")
      .where("user", "==", uid)
      .get();

    const items = results.docs.map((v) => {
      return {
        id: v.id,
        ...v.data(),
      };
    });

    return json({
      success: true,
      message: "successfully fetched",
      data: items,
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
