<template>
  <v-app v-if="isFachadmin">
    <the-snackbar />

    <!--  clipped-right: Gibt an, auf welcher Seite der Navigation-Drawer eingeblendet werden soll und dort soll die Toolbar bleiben  -->
    <v-app-bar
      color="primary"
      height="50"
      class="px-4"
    >
      <v-row align="center">
        <v-col
          cols="3"
          class="d-flex align-center justify-start"
        >
          <router-link
            to="/"
            style="text-decoration: none"
            @click="resetMapAndSearch"
          >
            <v-toolbar-title class="text-white font-weight-medium">
              <span class="font-weight-medium">DAVe</span>
              <span class="font-weight-thin"> | Adminportal</span>
            </v-toolbar-title>
          </router-link>
        </v-col>
        <v-spacer />
        <v-col
          cols="4"
          class="d-flex align-center justify-center"
        >
          <search-input-field />
        </v-col>
        <v-spacer />
        <v-col
          cols="3"
          class="d-flex align-center justify-end"
        >
          <unread-messages />
          <v-btn
            v-tooltip:bottom="'Zählungen & Messstellen'"
            class="mx-3"
            density="compact"
            icon="mdi-clipboard-list-outline"
            to="/erhebungsstellenOverview"
          />
          <v-btn
            v-tooltip:bottom="'Konfiguration'"
            class="mr-3"
            density="compact"
            icon="mdi-cogs"
            to="/config"
          />
          <v-btn
            v-tooltip:bottom="'Anwenderhandbuch'"
            class="mr-3"
            density="compact"
            icon="mdi-clippy"
            @click="navigateToHandbuch"
          />
          <span> {{ loggedInUser }} </span>
        </v-col>
      </v-row>
    </v-app-bar>

    <router-view
      v-slot="{ Component }"
      :key="route.fullPath"
    >
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </router-view>
  </v-app>
  <v-overlay
    v-else
    color="white"
  >
    <p
      style="
        text-align: center;
        color: black;
        font-weight: bold;
        font-size: xxx-large;
      "
    >
      Sie verfügen nicht über die nötigen Rechte diese Anwendung zu benutzen
    </p>
    <p style="text-align: center; color: black; font-size: x-large">
      Bitte wenden Sie sich an einen Administrator
    </p>
  </v-overlay>
</template>

<script setup lang="ts">
import type ConfigurationDTO from "@/types/configuration/ConfigurationDTO";

import { computed, ref } from "vue";
import { useRoute } from "vue-router";

import ConfigurationService from "@/api/service/ConfigurationService";
import SsoUserInfoService from "@/api/service/SsoUserInfoService";
import VersionInfoService from "@/api/service/VersionInfoService";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import UnreadMessages from "@/components/app/UnreadMessages.vue";
import TheSnackbar from "@/components/common/TheSnackbar.vue";
import SearchInputField from "@/components/search/SearchInputField.vue";
import { useConfigurationStore } from "@/store/ConfigurationStore";
import { useMapOptionsStore } from "@/store/MapOptionsStore";
import { useSearchStore } from "@/store/SearchStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useUserStore } from "@/store/UserStore";
import SsoUserInfoResponse from "@/types/app/SsoUserInfoResponse";
import VersionInfoResponse from "@/types/app/VersionInfoResponse";

const URL_HANDBUCH_LINK =
  "https://wilma.muenchen.de/web/senders/af10dc2a-8da5-4d24-815a-b6a9df4c686b/documents/54ddf065-d01f-4965-9bdf-c66ea47927c8";

const loggedInUser = ref("no-security");
const backendVersion = ref("");
const frontendVersion = ref("");

const snackbarStore = useSnackbarStore();
const userStore = useUserStore();
const searchStore = useSearchStore();
const route = useRoute();
const mapOptionsStore = useMapOptionsStore();
const configurationStore = useConfigurationStore();

created();

// Lifecycle hook
function created() {
  SsoUserInfoService.getUserInfo()
    .then((ssoUserInfoResponse: SsoUserInfoResponse) => {
      userStore.setSsoUserInfoResponse(ssoUserInfoResponse);
      loggedInUser.value = userStore.getName;
    })
    .catch((error) => {
      snackbarStore.showApiError(error);
      return false;
    });
  VersionInfoService.getFrontendInfo()
    .then((frontendInfoResponse: VersionInfoResponse) => {
      frontendVersion.value = frontendInfoResponse.application.version;
    })
    .catch(() => {
      frontendVersion.value = "error";
    });
  VersionInfoService.getBackendInfo()
    .then((backendInfoResponse: VersionInfoResponse) => {
      backendVersion.value = backendInfoResponse.application.version;
    })
    .catch(() => {
      backendVersion.value = "error";
    });
  ConfigurationService.getConfiguration().then(
    (configuration: ConfigurationDTO) => {
      configurationStore.setConfiguration(configuration);
    }
  );
}

function navigateToHandbuch() {
  window.open(URL_HANDBUCH_LINK);
}

const isFachadmin = computed(() => {
  if (BaseUrlProvider.isDevelopment() && userStore.hasNoAuthorities) {
    return true;
  } else {
    return userStore.isFachadmin;
  }
});

function resetMapAndSearch() {
  mapOptionsStore.resetMapOptions();
  searchStore.resetSearchAndFilterOptions();
  searchStore.resetAndTriggerSearch();
}
</script>
<style>
/* Alle Hinweise werden nun rot eingefärbt */
.v-messages {
  color: #e57373 !important;
}

.dave-default {
  --app-bar-height: 50px;
  width: 100%;
  height: 100%;
  /* Um auf der Y-Achse direkt unter der App Bar zu liegen */
  padding-top: var(--app-bar-height);
  position: fixed;
}
</style>
