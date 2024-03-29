import Vue from "vue";
import Router from "vue-router";
import Main from "./views/Main.vue";
import ZaehlstelleView from "@/views/ZaehlstelleView.vue";
import OpenZaehlungenView from "@/views/OpenZaehlungenView.vue";
import ConfigView from "@/views/ConfigView.vue";

Vue.use(Router);

/*
 * Preventing "NavigationDuplicated" errors in console in Vue-router >= 3.1.0
 * https://github.com/vuejs/vue-router/issues/2881#issuecomment-520554378
 * */
/* eslint-disable @typescript-eslint/no-explicit-any */
const routerMethods = ["push", "replace"];
routerMethods.forEach((method: string) => {
    const originalCall = (Router.prototype as any)[method];
    (Router.prototype as any)[method] = function (
        location: any,
        onResolve: any,
        onReject: any
    ): Promise<any> {
        if (onResolve || onReject) {
            return originalCall.call(this, location, onResolve, onReject);
        }
        return (originalCall.call(this, location) as any).catch(
            (err: any) => err
        );
    };
});
/* eslint-enable @typescript-eslint/no-explicit-any */

export default new Router({
    base: process.env.BASE_URL,
    routes: [
        {
            path: "/",
            name: "home",
            component: Main,
        },
        {
            path: "/offeneZaehlungen",
            name: "offeneZaehlungen",
            component: OpenZaehlungenView,
        },
        {
            path: "/zaehlstelle/:zaehlstelleId/:zaehlungId?",
            name: "zaehlstelle",
            component: ZaehlstelleView,
        },
        {
            path: "/config",
            name: "config",
            component: ConfigView,
        },
        { path: "*", redirect: "/" }, //Fallback 2
    ],
});
