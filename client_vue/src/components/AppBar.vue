<script setup lang="ts">
import { useLogoutMutation } from "@/mutations/useAuthMutation";
import useAlertStore from "@/stores/useAlertStore";
import useAuthStore from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";

const { isAuthenticated, data } = storeToRefs(useAuthStore());
const { mutate } = useLogoutMutation();
</script>

<template>
  <v-app-bar elevation="1">
    <template v-if="isAuthenticated" #append>
      <v-menu location="bottom">
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="black">
              <v-icon icon="mdi-account-circle" size="large" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item
            :title="data?.name"
            :subtitle="data?.email"
            :prepend-avatar="data?.image || undefined"
          />
          <v-list-item to="/profile"> アカウントを編集 </v-list-item>
          <v-list-item @click="mutate"> ログアウト </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-app-bar>
</template>

<style scoped></style>
