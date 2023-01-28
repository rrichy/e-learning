import { FormBase, AppForm } from "./FormBase";

export interface RegistrationFormAttributes extends FormBase {
  name: string;
  email: string;
  sex: number;
  birthday: Date | null;
  password: string;
  password_confirmation: string;
}

export const registrationFormInit: RegistrationFormAttributes = {
  discriminator: AppForm.RegistrationForm,
  name: "",
  email: "",
  sex: 0,
  birthday: null,
  password: "",
  password_confirmation: "",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function instanceOfRegistrationForm(object: any): boolean {
  return object.discriminator === AppForm.RegistrationForm;
}
