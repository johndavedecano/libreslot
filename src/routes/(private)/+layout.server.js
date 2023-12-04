// @ts-nocheck
import { isAdminUser } from "$lib/server/admins";
import { redirect } from "@sveltejs/kit";
import isEmpty from "lodash/isEmpty";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, url, request }) {
  const uid = cookies.get("uid");
  const idToken = cookies.get("idToken");

  if (isEmpty(uid) || isEmpty(idToken)) {
    throw redirect(302, "/auth/login");
  }

  if (url.pathname.startsWith("/admin") && !isAdminUser(uid)) {
    throw redirect(302, "/");
  }

  return {};
}
