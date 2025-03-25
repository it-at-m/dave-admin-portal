import moment from "moment";
import { createPinia, PiniaVuePlugin } from "pinia";
import Vue, { VNode } from "vue";

import validationRules from "@/mixins/validationRules";
import App from "./App.vue";
import i18n from "./i18n";
import Vuetify from "./plugins/Vuetify";
import router from "./router";

import "./directives/infinitescroll";
import "./plugins/Leafletmaps";
import "./registerServiceWorker";
import "roboto-fontface/css/roboto/roboto-fontface.css";

Vue.config.productionTip = false;

Vue.use(validationRules);

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

moment.locale(window.navigator.language);

new Vue({
  router,
  pinia,
  vuetify: Vuetify,
  i18n,
  render: (h): VNode => h(App),
}).$mount("#app");
