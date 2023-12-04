import { redirect } from "@sveltejs/kit";
import isEmpty from "lodash/isEmpty";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies, route }) {
  const uid = cookies.get("uid");
  const idToken = cookies.get("idToken");

  if (route.id === "/auth/logout") return {};

  if (uid && idToken) {
    throw redirect(302, "/");
  }

  return {};
}
