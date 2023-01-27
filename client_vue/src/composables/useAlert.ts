import { inject, provide, reactive, toRefs } from "vue";

type AlertConfig = {
  timeout?: number;
  color?: string;
};

// Custom hook for providing alert functions
export function useAlertProvide() {
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

  provide("successAlert", successAlert);
  provide("errorAlert", errorAlert);

  return { ...toRefs(alertProps) };
}
// Custom hook on injecting alert functions
export function useAlertInject() {
  const successAlert = inject("successAlert") as (
    text: string,
    config?: AlertConfig
  ) => void;
  const errorAlert = inject("errorAlert") as (
    text: string,
    config?: AlertConfig
  ) => void;

  return { successAlert, errorAlert };
}
