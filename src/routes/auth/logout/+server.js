// @ts-nocheck

import { json } from "@sveltejs/kit";

export async function DELETE({ cookies }) {
  cookies.delete("idToken", { path: "/" });
  cookies.delete("uid", { path: "/" });
  return json({
    message: "logout successfully",
  });
}
