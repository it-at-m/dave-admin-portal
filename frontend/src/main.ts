import Vue, { VNode } from "vue";
import Vuetify from "./plugins/vuetify";
import store from "./store";
import i18n from "./i18n";
import App from "./App.vue";
import router from "./router";
import moment from "moment";
import validationRules from "@/mixins/validationRules";
import "./directives/infinitescroll";
import "./plugins/leafletmaps";
import "./registerServiceWorker";

import "roboto-fontface/css/roboto/roboto-fontface.css";

Vue.config.productionTip = false;

Vue.use(validationRules);

moment.locale(window.navigator.language);

new Vue({
    router,
    store: store,
    vuetify: Vuetify,
    i18n,
    render: (h): VNode => h(App),
}).$mount("#app");
