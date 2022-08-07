import { createApp } from "vue";
import { BootstrapVue3, BToastPlugin } from 'bootstrap-vue-3'
import { createPinia } from "pinia";
import piniaPersistedState from 'pinia-plugin-persistedstate'

import App from "./App.vue";
import router from "./router";
import vSelect from "vue-select";
import SlideUpDown from "vue3-slide-up-down";
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";


const app = createApp(App);

app.use(BootstrapVue3);
app.use(BToastPlugin);
app.component("v-select", vSelect);
app.component('slide-up-down', SlideUpDown);
app.use(Toast, {
    shareAppContext: true,
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    newestOnTop: true
});

const pinia = createPinia();
pinia.use(piniaPersistedState);
app.use(pinia);
app.use(router);

app.mount("#app");
