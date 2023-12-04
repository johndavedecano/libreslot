// @ts-nocheck
import { db } from "$lib/server/firebase.js";

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ params }) {
  const snap = await db.collection("posts").doc(params.id).get();

  if (!snap.exists) {
    throw error(404, "page not found");
  }

  const doc = snap.data();

  if (!doc.public) {
    throw error(404, "page not found");
  }

  const page = {
    title: doc.title,
    body: doc.body,
    createdAt: doc.createdAt,
  };

  return {
    page,
  };
}

export const prerender = false;
