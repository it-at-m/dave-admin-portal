import { createApp } from "vue";

import App from "./App.vue";

import "./plugins/leafletmaps";

import { registerPlugins } from "@/plugins";

console.log("App Version:", import.meta.env.VITE_APP_VERSION);

const app = createApp(App);

registerPlugins(app);

app.mount("#app");
