<script setup lang="ts">
import { MembershipType } from "@/interfaces/UserInterface";
import useAuthDataQuery from "@/queries/useAuthDataQuery";
import useAuthStore from "@/stores/useAuthStore";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import AdminUpdateForm from "../Forms/AdminUpdateForm.vue";
import FormSheet from "../Forms/FormSheet.vue";

const { isAuthenticated } = storeToRefs(useAuthStore());
const { data } = useAuthDataQuery(isAuthenticated);

// const component = computed(() => {
//   if (data.value?.user.membership_type_id === MembershipType.admin) {
//     return AdminUpdateForm;
//   }
// });
</script>

<template>
  <FormSheet title="マイページ">
    <AdminUpdateForm />
  </FormSheet>
</template>

<style scoped></style>
