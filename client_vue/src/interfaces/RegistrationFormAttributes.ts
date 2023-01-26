export interface RegistrationFormAttributes {
  name: string;
  email: string;
  sex: number;
  birthday: Date | null;
  password: string;
  password_confirmation: string;
}
