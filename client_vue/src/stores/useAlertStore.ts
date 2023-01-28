import { defineStore } from "pinia";
import { reactive, toRefs } from "vue";

type AlertConfig = {
  timeout?: number;
  color?: string;
};

const useAlertStore = defineStore("alert-store", () => {
  const alertProps = reactive({
    show: false,
    timeout: 2000,
    color: "success",
    text: "",
  });

  function successAlert(text: string, config?: AlertConfig) {
    const props = {
      show: true,
      text,
      color: config?.color || "success",
      timeout: config?.timeout || 2000,
    };

    Object.assign(alertProps, props);
  }

  function errorAlert(text: string, config?: AlertConfig) {
    const props = {
      show: true,
      text,
      color: config?.color || "error",
      timeout: config?.timeout || 2000,
    };

    Object.assign(alertProps, props);
  }

  return { ...toRefs(alertProps), successAlert, errorAlert };
});

export default useAlertStore;
