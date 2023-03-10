<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import ComponentLabeler from "../ComponentLabeler.vue";
import logo from "@/assets/logo.png";
import TextField from "../Forms/Fields/TextField.vue";
import { useLoginMutation } from "@/mutations/useAuthMutation";
import { CredentialInterface } from "@/interfaces/AuthAttributes";
import { handleError, handleSuccess } from "@/utils/mutationResponseHandler";
import { useForm } from "vee-validate";

const { handleSubmit, setErrors } = useForm({
  initialValues: {
    email: "",
    password: "",
  } as CredentialInterface,
});

const router = useRouter();

const { mutate, isLoading } = useLoginMutation();
const emailRef = ref();

const onSubmit = handleSubmit((values) => {
  mutate(values, {
    onSuccess: (response: unknown) => {
      handleSuccess(response);
      router.push("/");
    },
    onError: (error: unknown) => {
      // TODO better error response
      handleError(error, setErrors);
    },
  });
});

onMounted(() => {
  emailRef.value.inputRef.focus();
});
</script>

<template>
  <v-container class="d-flex flex-column justify-center align-center">
    <figure class="d-flex flex-column align-center">
      <v-img :src="logo" width="200" />
      <figcaption class="text-caption text-center font-weight-bold mt-2">
        ITインフラエンジニア向け資格対策eラーニング
      </figcaption>
    </figure>
    <v-sheet
      class="pa-8 pa-sm-12"
      elevation="1"
      outlined
      width="100%"
      max-width="430"
    >
      <v-form ref="form" @submit="onSubmit">
        <ComponentLabeler label="User ID（登録メールアドレス）" stacked>
          <TextField
            name="email"
            placeholder="IDを入力してください"
            ref="emailRef"
          />
        </ComponentLabeler>
        <ComponentLabeler label="パスワード" stacked>
          <TextField
            name="password"
            type="password"
            placeholder="パスワードを入力してください"
          />
        </ComponentLabeler>
        <v-btn
          type="submit"
          color="primary"
          block
          height="60"
          class="font-weight-bold"
          :loading="isLoading"
        >
          ログイン
        </v-btn>
      </v-form>
      <div class="d-flex flex-column align-center">
        <router-link to="/rules" class="a-btn">
          <v-btn append-icon="mdi-arrow-right" variant="outlined">
            利用規約
          </v-btn>
        </router-link>
        <router-link to="/forgot-password" class="text-caption">
          パスワードをお忘れの方はこちら
        </router-link>
        <router-link to="/register" class="text-caption">
          アカウントをお持ちではない方はこちら
        </router-link>
      </div>
    </v-sheet>
    <a class="text-caption" href="https://www.techhub.tokyo/" target="_blank">
      techhub TOPページ
      <v-icon icon="mdi-open-in-new" size="x-small" />
    </a>
  </v-container>
</template>

<style scoped>
.v-container {
  gap: 40px;
}

a > i {
  display: inline-block;
}

button {
  box-shadow: 0 3px rgba(0, 150, 150);
}

.a-btn {
  text-decoration: none;
}

.a-btn button {
  margin: 24px 0;
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
