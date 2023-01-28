<script setup lang="ts">
import usePreviewDialogStore from "@/stores/usePreviewDialogStore";
import { AppForm } from "@/interfaces/Forms/FormBase";
import RegistrationForm from "./Forms/RegistrationForm.vue";
import { storeToRefs } from "pinia";

const { show, proceed, cancel, values } = storeToRefs(usePreviewDialogStore());
</script>

<template>
  <v-dialog
    v-model="show"
    persistent
    max-width="600"
    class="w-100 align-center"
  >
    <v-card title="アカウント情報確認" class="preview-dialog-card">
      <v-container>
        <RegistrationForm
          v-if="values.discriminator === AppForm.RegistrationForm"
          disabled
        />
        <RegistrationForm v-if="false" />
      </v-container>
      <v-card-actions>
        <v-btn color="primary" @click="cancel">キャンセル</v-btn>
        <v-btn color="primary" @click="proceed">確認</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
