import SsoUserInfoResponse from "@/domain/SsoUserInfoResponse";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const rolePoweruser = "ROLE_POWERUSER";
const roleFachadmin = "ROLE_FACHADMIN";

/**
 * Der UserStore wird benötigt, um die vom KeyCloak erhaltenen Nutzerdaten (Name, eMail und Authorities)
 * über alle Views hinweg verteilen zu können. Dies betrifft vor allem die Authorities, da einzelnen Elemente
 * der Oberfläche nur für bestimmte Rollen sichtbar sein sollen.
 */
export const useUserStore = defineStore("userStore", () => {
    // ref()s become state properties
    const ssoUserInfoResponse = ref<SsoUserInfoResponse>(
        {} as SsoUserInfoResponse
    );
    // computed()s become getters
    const getName = computed(() => ssoUserInfoResponse.value.name);
    const isPoweruser = computed(() =>
        ssoUserInfoResponse.value.authorities?.includes(rolePoweruser)
    );
    const isFachadmin = computed(() =>
        ssoUserInfoResponse.value.authorities?.includes(roleFachadmin)
    );
    const hasNoAuthorities = computed(
        () =>
            ssoUserInfoResponse.value.authorities === undefined ||
            ssoUserInfoResponse.value.authorities.length === 0
    );

    // function()s become actions
    function setSsoUserInfoResponse(payload: SsoUserInfoResponse) {
        ssoUserInfoResponse.value = payload;
    }

    return {
        getName,
        isPoweruser,
        isFachadmin,
        hasNoAuthorities,
        setSsoUserInfoResponse,
    };
});
