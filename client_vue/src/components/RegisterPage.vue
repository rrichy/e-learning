<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthenticationStore } from "../stores/authentication";
import ComponentLabeler from "./ComponentLabeler.vue";
import TextField from "./Forms/TextField.vue";

const auth = useAuthenticationStore();
const router = useRouter();

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

function handleSubmit(e: Event) {
  e.preventDefault();

  console.log(state.value);
}

function handleSexChange(e: Event, data: any) {
  console.log({ e, data });
}

function itemsProps(item: any) {

  return true;
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
    <v-form ref="form" @submit="handleSubmit">
      <ComponentLabeler label="氏名" stacked>
        <TextField v-model="state.name" placeholder="氏名を入力してください" />
      </ComponentLabeler>

      <ComponentLabeler label="メールアドレス" stacked>
        <TextField
          v-model="state.email"
          placeholder="メールアドレスを入力してください"
        />
      </ComponentLabeler>
      <ComponentLabeler label="性別" stacked>
        <v-select
          v-model="state.sex"
          :items="sexSelection"
          item-title="name"
          item-value="id"
          variant="outlined"
          density="compact"
          color="primary"
          :item-props="true"
        />
      </ComponentLabeler>
      <ComponentLabeler label="生年月日" stacked>
        <Datepicker
          v-model="state.birthday"
          :flow="['year', 'month', 'calendar']"
          :max-date="new Date()"
          :enable-time-picker="false"
          prevent-min-max-navigation
        />
      </ComponentLabeler>
      <ComponentLabeler label="パスワード" stacked>
        <TextField
          v-model="state.password"
          type="password"
          placeholder="パスワードを入力してください"
        />
      </ComponentLabeler>
      <ComponentLabeler label="パスワード（確認用）" stacked>
        <TextField
          v-model="state.password_confirmation"
          type="password"
          placeholder="パスワード（確認用）を入力してください"
        />
      </ComponentLabeler>
      <button>Register</button>
    </v-form>
    <router-link to="/login"> Back to login </router-link>
  </v-sheet>
</template>

<style scoped></style>
