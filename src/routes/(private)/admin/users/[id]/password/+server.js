// @ts-nocheck
import { isAdminUser } from "$lib/server/admins.js";
import { auth } from "$lib/server/firebase.js";
import { isValidPassword } from "$lib/string.js";
import { json } from "@sveltejs/kit";

export async function PUT({ params, request }) {
  try {
    const user = await auth.getUser(params.id);

    if (!user) {
      throw new Error("user not found");
    }

    const body = await request.json();

    if (!isValidPassword(body.password)) {
      throw new Error("invalid password");
    }

    await auth.updateUser(params.id, {
      password: body.password,
    });

    return json({
      success: true,
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
