// @ts-nocheck
import { db } from "$lib/server/firebase.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load() {
  const snap = await db.collection("settings").doc("common").get();

  const settings = snap.data();

  console.log(JSON.stringify(settings));

  return {
    settings,
  };
}
