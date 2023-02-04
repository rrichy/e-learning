<script setup lang="ts">
import {
  AdminMyPageAttributes,
  adminMyPageInit,
  ImageFieldValue,
} from "@/interfaces/Forms/MyPageFormAttributes";
import { useUpdateAuthMutation } from "@/mutations/useAuthMutation";
import useAuthDataQuery from "@/queries/useAuthDataQuery";
import { handleError, handleSuccess } from "@/utils/mutationResponseHandler";
import { adminMyPageFormSchema } from "@/validations/MyPageFormValidation";
import { useForm } from "vee-validate";
import { watch } from "vue";
import { useRouter } from "vue-router";
import ComponentLabeler from "../ComponentLabeler.vue";
import ImageField from "./Fields/ImageField.vue";
import TextField from "./Fields/TextField.vue";

const { push } = useRouter();
const { mutate } = useUpdateAuthMutation();
const { data, isSuccess } = useAuthDataQuery(true);
const { resetForm, handleSubmit, setErrors, meta } =
  useForm<AdminMyPageAttributes>({
    validationSchema: adminMyPageFormSchema,
    initialValues: adminMyPageInit,
  });

watch(
  isSuccess,
  () => {
    console.log("resetting form");
    const { name, email } = { ...adminMyPageInit, ...data.value?.user };
    const image = ["", data.value?.user.image || null] as ImageFieldValue;
    resetForm({
      values: {
        name,
        email,
        image,
      },
    });
  },
  { immediate: true }
);

const onSubmit = handleSubmit((values) => {
  // TODO: IMAGE UPLOAD
  console.log(values);
  mutate(values, {
    onSuccess: (response: unknown) => {
      handleSuccess(response);
      push("/");
    },
    onError: (error: unknown) => {
      handleError(error, setErrors);
    },
  });
});
</script>

<template>
  <v-form ref="formRef" class="w-100" @submit="onSubmit">
    <!-- TODO: INSERT IMAGE COMPONENT -->
    <h6>INSERT IMAGE COMPONENT HERE</h6>
    <ImageField name="image" />
    <ComponentLabeler label="氏名" stacked>
      <TextField name="name" placeholder="氏名を入力してください" />
    </ComponentLabeler>
    <ComponentLabeler label="メールアドレス" stacked>
      <TextField name="email" placeholder="メールアドレスを入力してください" />
    </ComponentLabeler>
    <div class="btn-wrapper">
      <v-btn
        color="primary"
        height="60"
        class="btn-submit"
        type="submit"
        :disabled="!(meta.dirty && meta.valid)"
      >
        編集
      </v-btn>
      <v-btn color="primary" variant="text" class="btn-cancel" to="/"
        >キャンセル</v-btn
      >
      <router-link to="/change-password" class="text-caption"
        >パスワードを変更する</router-link
      >
    </div>
  </v-form>
</template>

<style scoped>
.btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.btn-submit {
  font-weight: bold;
  width: 100%;
  max-width: 300px;
  box-shadow: 0 3px rgba(0, 150, 150);
}

.btn-cancel {
  font-weight: bold;
}
</style>
