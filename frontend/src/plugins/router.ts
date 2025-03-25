import { createRouter, createWebHashHistory } from "vue-router";

import ConfigView from "@/views/ConfigView.vue";
import ErhebungsstellenOverviewView from "@/views/ErhebungsstellenOverviewView.vue";
import HomeView from "@/views/HomeView.vue";
import MessstelleView from "@/views/MessstelleView.vue";
import ZaehlstelleView from "@/views/ZaehlstelleView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/erhebungsstellenOverview",
    name: "erhebungsstellenOverview",
    component: ErhebungsstellenOverviewView,
  },
  {
    path: "/zaehlstelle/:zaehlstelleId/:zaehlungId?",
    name: "zaehlstelle",
    component: ZaehlstelleView,
  },
  {
    path: "/messstelle/:messstelleId",
    name: "messstelle",
    component: MessstelleView,
    props: true,
  },
  {
    path: "/config",
    name: "config",
    component: ConfigView,
  },
  { path: "/:catchAll(.*)*", redirect: "/" }, // CatchAll route
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  /* eslint-disable  @typescript-eslint/no-unused-vars */
  scrollBehavior(to, from, savedPosition) {
    return { top: 0, left: 0 };
  },
  routes,
});

export default router;
