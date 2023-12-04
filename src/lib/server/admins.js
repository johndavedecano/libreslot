// @ts-nocheck
import { ADMINISTRATORS } from "$env/static/private";

export const isAdminUser = (uid) => {
  try {
    const admins = JSON.parse(ADMINISTRATORS);
    return admins.includes(uid);
  } catch (error) {
    console.error(error);
    return false;
  }
};
