import { createApp } from "vue";
import BootstrapVue3 from 'bootstrap-vue-3'
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import vSelect from "vue-select";
import SlideUpDown from "vue3-slide-up-down";





const app = createApp(App);

app.use(BootstrapVue3);
app.component("v-select", vSelect);
app.component('slide-up-down', SlideUpDown);
app.use(createPinia());
app.use(router);

app.mount("#app");
