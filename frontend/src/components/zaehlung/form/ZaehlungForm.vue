<template>
  <v-sheet
    width="100%"
    class="d-flex flex-column"
  >
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
      <v-tab :value="TAB_INFO">
        <v-icon icon="mdi-information-outline" />
        Allgemeine Info
      </v-tab>
      <v-tab :value="TAB_KNOTEN">
        <v-icon icon="mdi-routes" />
        Knoten & Lage
      </v-tab>
      <v-tab :value="TAB_FAHRBEZIEHUNG">
        <v-icon icon="mdi-routes" />
        Fahrbeziehungen
      </v-tab>
      <v-tab :value="TAB_FAHRZEUGE">
        <v-icon icon="mdi-car-multiple" />
        Fahrzeuge
      </v-tab>
    </v-tabs>
    <v-tabs-window
      v-model="activeTab"
      class="d-flex flex-column align-stretch"
    >
      <!-- Inhalte -->
      <v-tabs-window-item :value="TAB_INFO">
        <allgemeine-info-form
          v-model="zaehlung"
          :height="contentHeight"
          @is-valid="setAllgemeineFormValid"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_KNOTEN">
        <knoten-lage-form
          v-model="zaehlung"
          :height="contentHeight"
          :zaehlstelle="zaehlstelle"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRBEZIEHUNG">
        <fahrbeziehung-kreisverkehr-form
          v-if="zaehlung.kreisverkehr"
          v-model="zaehlung"
          :height="contentHeight"
        />
        <fahrbeziehung-form
          v-else
          v-model="zaehlung"
          :height="contentHeight"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRZEUGE">
        <fahrzeuge-form
          v-model="zaehlung"
          :height="contentHeight"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-sheet>
</template>

<script setup lang="ts">
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { computed, ref, watch } from "vue";

import AllgemeineInfoForm from "@/components/zaehlung/form/AllgemeineInfoForm.vue";
import FahrbeziehungForm from "@/components/zaehlung/form/FahrbeziehungForm.vue";
import FahrbeziehungKreisverkehrForm from "@/components/zaehlung/form/FahrbeziehungKreisverkehrForm.vue";
import FahrzeugeForm from "@/components/zaehlung/form/FahrzeugeForm.vue";
import KnotenLageForm from "@/components/zaehlung/form/KnotenLageForm.vue";
import { useEventbus } from "@/store/Eventbus";
import { useDaveUtils } from "@/util/DaveUtils";

interface Props {
  zaehlstelle: ZaehlstelleDTO;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const emits = defineEmits<{
  (e: "isValid", payload: boolean): void;
}>();

const daveUtils = useDaveUtils();
const eventbus = useEventbus();

const activeTab = ref(0);

const TAB_INFO = 0;
const TAB_KNOTEN = 1;
const TAB_FAHRBEZIEHUNG = 2;
const TAB_FAHRZEUGE = 3;

watch(
  () => eventbus.getReloadEvent,
  () => {
    activeTab.value = TAB_INFO;
  }
);

const contentHeight = computed(() => {
  const height =
    daveUtils.pxToVh(800) -
    daveUtils.cardtitleHeight.value -
    daveUtils.tabHeight.value -
    daveUtils.cardactionHeight.value;
  return `${height}vh`;
});

function setAllgemeineFormValid(isPartValid: boolean) {
  emits("isValid", isPartValid);
}
</script>
