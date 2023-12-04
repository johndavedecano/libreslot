// @ts-nocheck
import { writable } from "svelte/store";

const SettingStore = () => {
  const store = writable({
    services: { loaded: false, loading: true, items: [] },
    common: {
      logo: "/logo.png",
      name: "Company Name",
      city: "",
    },
    hours: {},
  });

  const loadServices = async () => {
    try {
      const response = await fetch("/shared/services", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const { data } = await response.json();

      store.update((v) => ({
        ...v,
        services: {
          loaded: true,
          items: data,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const loadCommon = async () => {
    try {
      const response = await fetch("/shared/settings/common", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const { data } = await response.json();

      store.update((v) => ({
        ...v,
        common: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const loadHours = async () => {
    try {
      const response = await fetch("/shared/settings/hours", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      const { data } = await response.json();

      store.update((v) => ({
        ...v,
        hours: data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    ...store,
    loadServices,
    loadCommon,
    loadHours,
  };
};

export default SettingStore();
