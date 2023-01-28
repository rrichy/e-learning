import { RegistrationFormAttributes } from "@/interfaces/Forms/RegistrationFormAttributes";
import axios from "axios";
import { useMutation } from "vue-query";

export default function useRegisterMutation() {
  return useMutation((value: RegistrationFormAttributes) =>
    axios.post("/api/register", value)
  );
}
