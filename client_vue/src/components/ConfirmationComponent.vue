<script setup lang="ts">
import useConfirm from "@/composables/useConfirm";
import { AppForm } from "@/interfaces/Forms/FormBase";
import RegistrationForm from "./Forms/RegistrationForm.vue";

const { show, proceed, cancel, values } = useConfirm.provide();
</script>

<template>
  <slot />
  <v-dialog v-model="show" persistent>
    <v-card>
      <v-container>
        <RegistrationForm
          v-if="values.discriminator === AppForm.RegistrationForm"
          disabled
        />
        <RegistrationForm v-if="false" disabled />
      </v-container>
      <v-card-actions>
        <v-btn color="secondary" @click="cancel">Cancel</v-btn>
        <v-btn color="primary" @click="proceed">Continue</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
