import SsoUserInfoResponse from "@/domain/SsoUserInfoResponse";
import _ from "lodash";

const rolePoweruser = "ROLE_POWERUSER";
const roleFachadmin = "ROLE_FACHADMIN";

/**
 * Der UserStore wird benötigt, um die vom KeyCloak erhaltenen Nutzerdaten (Name, eMail und Authorities)
 * über alle Views hinweg verteilen zu können. Dies betrifft vor allem die Authorities, da einzelnen Elemente
 * der Oberfläche nur für bestimmte Rollen sichtbar sein sollen.
 */
export default {
    namespaced: true,
    state: {
        ssoUserInfoResponse: {} as SsoUserInfoResponse,
    },
    getters: {
        getName(state: any): string {
            return state.ssoUserInfoResponse.name;
        },
        isPoweruser(state: any): boolean {
            return state.ssoUserInfoResponse.authorities?.includes(
                rolePoweruser
            );
        },
        isFachadmin(state: any): boolean {
            return state.ssoUserInfoResponse.authorities?.includes(
                roleFachadmin
            );
        },
        hasNoAuthorities(state: any): boolean {
            return (
                state.ssoUserInfoResponse.authorities === undefined ||
                state.ssoUserInfoResponse.authorities.length === 0
            );
        },
    },
    mutations: {
        setSsoUserInfoResponse(state: any, payload: SsoUserInfoResponse) {
            state.ssoUserInfoResponse = payload;
        },
    },
    actions: {
        setSsoUserInfoResponse(context: any, payload: SsoUserInfoResponse) {
            context.commit("setSsoUserInfoResponse", payload);
        },
    },
};
