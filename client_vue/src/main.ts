import { createApp } from "vue";
import "./style.css";
import App from "@/App.vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "vue-query";
import { createRouter, createWebHashHistory } from "vue-router";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
});

import SnackbarAlert from "@/components/SnackbarAlert.vue";
import HelloWorld from "@/components/HelloWorld.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import axiosSetup from "@/axios";

axiosSetup();

const pinia = createPinia();
const router = createRouter({
  routes: [
    { path: "/", component: HelloWorld, props: { msg: "asdsad" } },
    { path: "/login", component: LoginPage },
    { path: "/register", component: RegisterPage },
  ],
  history: createWebHashHistory(),
});

createApp(App).use(VueQueryPlugin).use(pinia).use(router).use(vuetify).mount("#app");
