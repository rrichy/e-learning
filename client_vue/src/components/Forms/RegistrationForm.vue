<script setup lang="ts">
import { Ref, ref } from "vue";
import ComponentLabeler from "../ComponentLabeler.vue";
import SelectionField from "./Fields/SelectionField.vue";
import TextField from "./Fields/TextField.vue";
import DatePicker from "./Fields/DatePicker.vue";
import useDisabled from "@/composables/useDisabled";

const formRef: Ref<HTMLFormElement | null> = ref(null);
const props = defineProps<{ disabled?: boolean }>();

useDisabled.provide(props);

defineExpose({
  formRef,
});
</script>

<template>
  <v-form ref="formRef" class="w-100">
    <ComponentLabeler label="氏名" stacked>
      <TextField name="name" placeholder="氏名を入力してください" />
    </ComponentLabeler>
    <ComponentLabeler label="メールアドレス" stacked>
      <TextField name="email" placeholder="メールアドレスを入力してください" />
    </ComponentLabeler>
    <ComponentLabeler label="性別" stacked>
      <SelectionField name="sex" />
    </ComponentLabeler>
    <ComponentLabeler label="生年月日" stacked>
      <DatePicker
        name="birthday"
        :flow="['year', 'month', 'calendar']"
        format="yyyy年MM月dd日"
        :max-date="new Date()"
        :enable-time-picker="false"
        prevent-min-max-navigation
        placeholder="生年月日を選んでください"
      />
    </ComponentLabeler>
    <ComponentLabeler label="パスワード" stacked>
      <TextField
        name="password"
        type="password"
        placeholder="パスワードを入力してください"
      />
    </ComponentLabeler>
    <ComponentLabeler label="パスワード（確認用）" stacked>
      <TextField
        name="password_confirmation"
        type="password"
        placeholder="パスワード（確認用）を入力してください"
      />
    </ComponentLabeler>
  </v-form>
</template>

<style scoped></style>
