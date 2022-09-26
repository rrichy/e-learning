import axios, { AxiosError } from "axios";
import { OptionsObject, SnackbarMessage, useSnackbar } from "notistack";
import { useCallback, useState } from "react";

type LaravelError = string | string[];
interface NestedErrors {
  [k: string]: LaravelError | NestedErrors;
}

function useAlerter() {
  const [errors, setErrors] = useState<NestedErrors>({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const handleError = (e: Error | AxiosError) => {
    const temp_errors: { [k: string]: any } = {};

    if (axios.isAxiosError(e)) {
      enqueueSnackbar((e.response?.data as any).message, { variant: "error" });

      Object.entries(
        ((e.response?.data as any).errors || {}) as { [k: string]: string }
      ).forEach(([k, v]) => {
        temp_errors[k] = typeof v === "string" ? v : (v as string[]).join("");
      });

      setErrors(temp_errors);
    } else enqueueSnackbar(e.message, { variant: "error" });
    return temp_errors as NestedErrors;
  };

  const successSnackbar = (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => {
    enqueueSnackbar(message, { variant: "success", ...options });
  };

  const warningSnackbar = (
    message: SnackbarMessage,
    options?: OptionsObject
  ) => {
    enqueueSnackbar(message, { variant: "warning", ...options });
  };

  const errorSnackbar = useCallback(
    (message: SnackbarMessage, options?: OptionsObject) => {
      enqueueSnackbar(message, { variant: "error", ...options });
    },
    [enqueueSnackbar]
  );

  const clearErrors = () => setErrors({});

  return {
    errors,
    handleError,
    successSnackbar,
    warningSnackbar,
    errorSnackbar,
    clearErrors,
    closeSnackbar,
  };
}

export default useAlerter;
