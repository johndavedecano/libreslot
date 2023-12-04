// @ts-nocheck
import { writable } from "svelte/store";

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    return {};
  }
};

const UserStore = () => {
  const store = writable({ user: getCurrentUser() });

  const setCurrentUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    store.update((state) => {
      return {
        ...state,
        user,
      };
    });
  };

  return {
    ...store,
    setCurrentUser,
  };
};

export default UserStore();
