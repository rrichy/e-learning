export enum AppForm {
  BlankForm,
  RegistrationForm,
}

export interface FormBase {
  discriminator: AppForm;
}
