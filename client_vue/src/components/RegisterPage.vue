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
  <v-container class="d-flex justify-center">
    <v-sheet
      elevation="1"
      outlined
      width="100%"
      max-width="600"
    >
      <div class="v-sheet__title">アカウント登録</div>
      <div class="v-sheet__content pa-4 pa-sm-10">
        <v-form
          ref="form"
          class="w-100"
          @submit="handleSubmit"
          id="registration-form"
        >
          <ComponentLabeler label="氏名" stacked>
            <TextField
              v-model="state.name"
              placeholder="氏名を入力してください"
            />
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
            <DatePicker
              v-model="state.birthday"
              :flow="['year', 'month', 'calendar']"
              :max-date="new Date()"
              :enable-time-picker="false"
              prevent-min-max-navigation
              placeholder="生年月日を選んでください"
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
        </v-form>
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
        >
          登録
        </v-btn>
        <router-link to="/login" class="text-caption">ホームページへ</router-link>
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
