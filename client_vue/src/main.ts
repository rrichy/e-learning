import { createApp } from "vue";
import "./style.css";
import "@mdi/font/css/materialdesignicons.css";
import App from "@/App.vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "vue-query";
import { createRouter, createWebHashHistory } from "vue-router";

import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: {
        colors: {
          background: "#fafafa",
          primary: "#00b4aa",
          black: "#222222",
        },
      },
    },
  },
});

import HelloWorld from "@/components/HelloWorld.vue";
import LoginPage from "@/components/LoginPage.vue";
import RegisterPage from "@/components/RegisterPage.vue";
import axiosSetup from "@/axios";

axiosSetup();

const pinia = createPinia();
const router = createRouter({
  routes: [
    {
      path: "/",
      name: "root",
      component: HelloWorld,
      props: { msg: "asdsad" },
    },
    { path: "/login", name: "login", component: LoginPage },
    { path: "/register", name: "register", component: RegisterPage },
  ],
  history: createWebHashHistory(),
});

createApp(App)
  .use(VueQueryPlugin)
  .use(pinia)
  .use(router)
  .use(vuetify)
  .component("Datepicker", Datepicker)
  .mount("#app");
