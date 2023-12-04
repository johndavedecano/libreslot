// @ts-nocheck
import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";
import { getApp, getApps, cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { FIREBASE_SERVICE_ACCOUNT_KEY } from "$env/static/private";

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT_KEY);

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
