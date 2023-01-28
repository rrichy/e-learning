import useAlertStore from "@/stores/useAlertStore";

interface BEResponse {
  data: { message?: string; [k: string]: unknown };
}

interface BEErrorResponse {
  response: {
    data?: {
      errors?: { [k: string]: [string, ...string[]] };
    } & BEResponse["data"];
  };
  message: string;
}

export function handleSuccess(_response: unknown, fallbackMsg = "") {
  const { successAlert } = useAlertStore();
  const response = _response as BEResponse;
  successAlert(response.data.message || fallbackMsg);

  return response;
}

export function handleError(
  _error: unknown,
  setErrors: (
    fields: Partial<Record<keyof undefined, string | undefined>>
  ) => void
) {
  const { errorAlert } = useAlertStore();
  const error = _error as BEErrorResponse;
  errorAlert(error.response?.data?.message || error.message);

  const errors: { [k: string]: string } = {};
  if (error.response.data?.errors) {
    for (const name in error.response.data.errors) {
      errors[name] = error.response.data.errors[name][0];
    }
  }

  setErrors(errors);
}
