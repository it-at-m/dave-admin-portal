<template>
  <v-sheet
    width="100%"
    class="dave-default"
  >
    <v-card-title style="justify-self: center">
      <v-icon start>mdi-cogs</v-icon>
      Einstellungen
    </v-card-title>
    <v-tabs
      v-model="activeTab"
      fixed-tabs
      bg-color="grey-darken-1"
      slider-color="grey-lighten-1"
      stacked
      density="compact"
      color="white"
      class="text-grey-lighten-1"
    >
      <!-- Kopfzeile -->
      <v-tab :value="TAB_HOCHRECHNUNG">
        <v-icon>mdi-car-cog</v-icon>
        Hochrechnungsfaktoren
      </v-tab>
      <v-tab :value="TAB_EMAIL">
        <v-icon>mdi-email-outline</v-icon>
        EMail-Adressen
      </v-tab>
      <v-tab :value="TAB_DIENSTLEISTER">
        <v-icon>mdi-account-cog-outline</v-icon>
        Dienstleister
      </v-tab>
      <v-tab :value="TAB_INFO">
        <v-icon>mdi-message-text-outline</v-icon>
        Info-Nachricht
      </v-tab>
    </v-tabs>
    <v-tabs-window
      v-model="activeTab"
      class="d-flex flex-column align-stretch"
    >
      <!-- Inhalte -->
      <v-tabs-window-item :value="TAB_HOCHRECHNUNG">
        <config-hochrechnungsfaktoren :height="contentHeight" />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_EMAIL">
        <config-email-address :height="contentHeight" />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_DIENSTLEISTER">
        <config-dienstleister :height="contentHeight" />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_INFO">
        <config-info-message :height="contentHeight" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

import ConfigDienstleister from "@/components/config/subconfig/ConfigDienstleister.vue";
import ConfigEmailAddress from "@/components/config/subconfig/ConfigEmailAddress.vue";
import ConfigHochrechnungsfaktoren from "@/components/config/subconfig/ConfigHochrechnungsfaktoren.vue";
import ConfigInfoMessage from "@/components/config/subconfig/ConfigInfoMessage.vue";
import { useDaveUtils } from "@/util/DaveUtils";

const activeTab = ref(0);
const daveUtils = useDaveUtils();

const TAB_HOCHRECHNUNG = 0;
const TAB_EMAIL = 1;
const TAB_DIENSTLEISTER = 2;
const TAB_INFO = 3;

/**
 * Berechnet die Höhe der Fläche unter den Tabs in "vh"
 */
const contentHeight = computed(() => {
  const height =
    100 -
    daveUtils.appBarHeight.value -
    daveUtils.cardtitleHeight.value -
    daveUtils.tabHeight.value;
  return `${height}vh`;
});
</script>
<style scoped lang="scss">
@use "vuetify/settings" with (
  $tab-slider-size: 8px
);
</style>
