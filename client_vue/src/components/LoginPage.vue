<script setup lang="ts">
import { useAlertStore } from "@/stores/alert";
import { ref, Ref } from "vue";
import { useRouter } from "vue-router";
import { CredentialInterface } from "../interfaces/UserInterface";
import { useAuthenticationStore } from "../stores/authentication";
import ComponentLabeler from "./ComponentLabeler.vue";
import logo from "@/assets/logo.png";

const auth = useAuthenticationStore();
const { successAlert, errorAlert } = useAlertStore();
const router = useRouter();

const { mutate } = auth.loginMutation();
const form = ref<HTMLFormElement>();
const showPassword = ref(false);

if (auth.isAuthenticated) {
  router.replace("/");
}

const state: Ref<CredentialInterface> = ref({
  email: "",
  password: "",
});

function handleSubmit(e: Event) {
  e.preventDefault();
  mutate(state.value, {
    onSuccess: (res: any) => {
      successAlert(res.data.message);
      auth.getAuthData();
      router.replace("/");
    },
    onError: (e: any) => {
      state.value = {
        email: "",
        password: "",
      };
      errorAlert(e.response.data.message);
    },
  });
}
</script>

<template>
  <div class="container h-100 d-flex flex-column justify-center align-center">
    <figure class="d-flex flex-column align-center">
      <v-img
        :src="logo"
        width="200"
      />
      <figcaption class="text-caption font-weight-bold mt-2">
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
      <v-form
        ref="form"
        @submit="handleSubmit"
      >
        <ComponentLabeler
          label="User ID（登録メールアドレス）"
          stacked
        >
          <v-text-field
            v-model="state.email"
            placeholder="IDを入力してください"
            variant="outlined"
            density="compact"
            color="primary"
          />
        </ComponentLabeler>
        <ComponentLabeler
          label="パスワード"
          stacked
        >
          <v-text-field
            v-model="state.password"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            placeholder="パスワードを入力してください"
            variant="outlined"
            :type="showPassword ? 'text' : 'password'"
            density="compact"
            color="primary"
            @click:append-inner="showPassword = !showPassword"
          />
        </ComponentLabeler>
        <v-btn
          type="submit"
          color="primary"
          block
          height="60"
          class="font-weight-bold"
        >
          ログイン
        </v-btn>
      </v-form>
      <div class="d-flex flex-column align-center">
        <router-link
          to="/rule"
          class="a-btn"
        >
          <v-btn
            append-icon="mdi-arrow-right"
            variant="outlined"
          >
            利用規約
          </v-btn>
        </router-link>
        <router-link
          to="/forgot-password"
          class="text-caption"
        >
          パスワードをお忘れの方はこちら
        </router-link>
        <router-link
          to="/register"
          class="text-caption"
        >
          アカウントをお持ちではない方はこちら
        </router-link>
      </div>
    </v-sheet>
    <a
      class="text-caption"
      href="https://www.techhub.tokyo/"
      target="_blank"
    >
      techhub TOPページ
      <v-icon
        icon="mdi-open-in-new"
        size="x-small"
      />
    </a>
  </div>
</template>

<style scoped>
.container {
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
