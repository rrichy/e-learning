<script setup lang="ts">
import { registrationFormSchema } from "@/validations/RegistrationFormValidation";
import { useRouter } from "vue-router";
import useAuthStore from "../stores/useAuthStore";
import RegistrationForm from "./Forms/RegistrationForm.vue";
import { useForm } from "vee-validate";
import usePreviewDialogStore from "@/stores/usePreviewDialogStore";
import { registrationFormInit } from "@/interfaces/Forms/RegistrationFormAttributes";
import useItemStore from "@/stores/useItemStore";

const { showPreview } = usePreviewDialogStore();
const auth = useAuthStore();
const router = useRouter();
const { setItems } = useItemStore();

const { isSubmitting, handleSubmit } = useForm({
  validationSchema: registrationFormSchema,
  initialValues: registrationFormInit,
});

setItems({
  sex: [
    { id: 0, name: "未選択", disabled: true },
    { id: 1, name: "男性" },
    { id: 2, name: "女性" },
  ],
});

const onSubmit = handleSubmit(async (values) => {
  console.log(values);

  const confirmed = await showPreview(values);
  console.log(confirmed);
});

function handleSexChange(e: Event, data: any) {
  console.log({ e, data });
}

function itemsProps(item: any) {
  return true;
}
</script>

<template>
  <v-container class="d-flex justify-center">
    <v-sheet elevation="1" outlined width="100%" max-width="600">
      <div class="v-sheet__title">アカウント登録</div>
      <div class="v-sheet__content pa-4 pa-sm-10">
        <RegistrationForm id="registration-form" @submit="onSubmit" />
        <router-link to="/rules" class="a-btn">
          <v-btn append-icon="mdi-arrow-right" variant="outlined">
            利用規約
          </v-btn>
        </router-link>
        <v-checkbox
          label="利用規約に同意する"
          density="compact"
          color="primary"
          hide-details
        />
        <v-btn
          type="submit"
          color="primary"
          block
          height="60"
          class="font-weight-bold"
          form="registration-form"
          :loading="isSubmitting"
        >
          登録
        </v-btn>
        <router-link to="/login" class="text-caption"
          >ホームページへ</router-link
        >
      </div>
    </v-sheet>
  </v-container>
</template>

<style scoped>
.v-sheet__title {
  margin: 0;
  background-color: #323232;
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  padding: 16px 10px 12px 12px;
  border-left: 5px solid #00b4aa;
  display: block;
}

.v-sheet__content {
  gap: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  box-shadow: 0 3px rgba(0, 150, 150);
}

.a-btn {
  text-decoration: none;
}

.a-btn button {
  font-weight: bold;
  transition-property: box-shadow, border-color, transform, opacity, background;
  border-width: 2px;
  border-color: rgba(0, 180, 170);
}

.a-btn button:hover {
  border-color: rgba(0, 180, 170);
  box-shadow: 0 3px rgba(0, 180, 170);
}
</style>
