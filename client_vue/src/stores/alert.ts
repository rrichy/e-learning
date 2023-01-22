import { defineStore } from "pinia";
import { ref } from "vue";

export const useAlertStore = defineStore("alert-store", () => {
  const show = ref(false);
  const timeout = ref(2000);
  const text = ref("");
  const color = ref("success");

  function successAlert(message: string, config?: { timeout?: number; color?: string }) {
    show.value = true;
    text.value = message;
    color.value = "success";

    if (config?.timeout) {
      timeout.value = config.timeout;
    }
    if (config?.color) {
      color.value = config.color;
    }
  }

  function errorAlert(message: string, config?: { timeout?: number; color?: string }) {
    show.value = true;
    text.value = message;
    color.value = "error";

    if (config?.timeout) {
      timeout.value = config.timeout;
    }
    if (config?.color) {
      color.value = config.color;
    }
  }

  return {
    show,
    timeout,
    text,
    color,
    successAlert,
    errorAlert,
  };
});
