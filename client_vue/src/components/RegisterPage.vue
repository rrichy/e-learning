<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "../stores/authentication";
import ComponentLabeler from "./ComponentLabeler.vue";

const auth = useAuthenticationStore();
const router = useRouter();

if (auth.isAuthenticated) {
  router.replace("/");
}

const selectref = ref();
const form = ref<HTMLFormElement>();
const state = ref({
  name: "",
  email: "",
  sex: 0,
  birthday: null,
  password: "",
  password_confirmation: "",
});

const sexSelection = [
  { id: 0, name: "未選択", disabled: true },
  { id: 1, name: "男性" },
  { id: 2, name: "女性" },
];

const show = ref({
  password: false,
  confirm_password: false,
});

function handleSubmit(e: Event) {
  e.preventDefault();

  console.log(state.value);
}

function handleSexChange(e: Event, data: any) {
  console.log({ e, data });
}
</script>

<template>
  <v-sheet
    class="pa-4 pa-sm-10"
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
        label="氏名"
        stacked
      >
        <v-text-field
          v-model="state.name"
          placeholder="氏名を入力してください"
          variant="outlined"
          density="compact"
          color="primary"
        />
      </ComponentLabeler>

      <ComponentLabeler
        label="メールアドレス"
        stacked
      >
        <v-text-field
          v-model="state.email"
          placeholder="メールアドレスを入力してください"
          variant="outlined"
          density="compact"
          color="primary"
        />
      </ComponentLabeler>
      <ComponentLabeler
        label="性別"
        stacked
      >
        <v-select
          v-model="state.sex"
          :items="sexSelection"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="compact"
          color="primary"
        >
          <template #item="{item, props}">
            <v-list-item
              :value="item.value"
              :disabled="item.raw.disabled"
              @click="props.onClick"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </template>
        </v-select>
      </ComponentLabeler>
      <ComponentLabeler
        label="生年月日"
        stacked
      >
        <Datepicker
          v-model="state.birthday"
          :flow="['year', 'month', 'calendar']"
          :max-date="new Date()"
          :enable-time-picker="false"
          prevent-min-max-navigation
        />
      </ComponentLabeler>
      <ComponentLabeler
        label="パスワード"
        stacked
      >
        <v-text-field
          v-model="state.password"
          :append-inner-icon="show.password ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show.password ? 'text' : 'password'"
          placeholder="パスワードを入力してください"
          variant="outlined"
          density="compact"
          color="primary"
          @click:append-inner="show.password = !show.password"
        />
      </ComponentLabeler>
      <ComponentLabeler
        label="パスワード（確認用）"
        stacked
      >
        <v-text-field
          v-model="state.password_confirmation"
          :append-inner-icon="show.confirm_password ? 'mdi-eye' : 'mdi-eye-off'"
          :type="show.confirm_password ? 'text' : 'password'"
          placeholder="パスワード（確認用）を入力してください"
          variant="outlined"
          density="compact"
          color="primary"
          @click:append-inner="show.confirm_password = !show.confirm_password"
        />
      </ComponentLabeler>
      <button>Register</button>
    </v-form>
    <router-link to="/login">
      Back to login
    </router-link>
  </v-sheet>
</template>

<style scoped>
</style>
