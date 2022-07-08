import { createApp } from "vue";
import BootstrapVue3 from 'bootstrap-vue-3'
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";



const app = createApp(App);

app.use(BootstrapVue3);
app.use(createPinia());
app.use(router);

app.mount("#app");
