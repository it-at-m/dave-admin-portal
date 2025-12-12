<template>
  <v-sheet
    width="100%"
    class="d-flex flex-column"
  >
    <v-tabs
      v-model="activeTab"
      fixed-tabs
      bg-color="quaternary"
      slider-color="tertiary"
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
          v-model:zaehlung="zaehlung"
          v-model:is-valid="isAllgemeineInfoFormValid"
          :height="contentHeight"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_KNOTEN">
        <knoten-lage-form
          v-model:zaehlung="zaehlung"
          :height="contentHeight"
          :zaehlstelle="zaehlstelle"
          :is-knoten-lage-form-valid="isKnotenLageFormValid"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRBEZIEHUNG">
        <verkehr-form
          v-model:zaehlung="zaehlung"
          :height="contentHeight"
          :is-knoten-lage-form-valid="isKnotenLageFormValid"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRZEUGE">
        <verkehrsart-form
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

import { isEmpty } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import AllgemeineInfoForm from "@/components/zaehlung/form/AllgemeineInfoForm.vue";
import KnotenLageForm from "@/components/zaehlung/form/KnotenLageForm.vue";
import VerkehrForm from "@/components/zaehlung/form/VerkehrForm.vue";
import VerkehrsartForm from "@/components/zaehlung/form/VerkehrsartForm.vue";
import { useEventbus } from "@/store/Eventbus";
import Zaehlart from "@/types/enum/Zaehlart";
import { useDaveUtils } from "@/util/DaveUtils";

interface Props {
  zaehlstelle: ZaehlstelleDTO;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>("zaehlung", {
  required: true,
});
const isZaehlungValid = defineModel<boolean>("isValid", {
  required: false,
});

const daveUtils = useDaveUtils();
const eventbus = useEventbus();

const activeTab = ref(0);
// Kann auch null sein, da es in einer v-form als v-model genutzt wird.
const isAllgemeineInfoFormValid = ref<boolean | null>(null);
const isKnotenLageFormValid = ref(false);

const TAB_INFO = 0;
const TAB_KNOTEN = 1;
const TAB_FAHRBEZIEHUNG = 2;
const TAB_FAHRZEUGE = 3;

onMounted(() => {
  validateZaehlung();
});

watch(
  () => eventbus.getReloadEvent,
  () => {
    activeTab.value = TAB_INFO;
  }
);

watch(isAllgemeineInfoFormValid, () => {
  validateZaehlung();
});

watch(
  () => zaehlung.value,
  () => {
    validateZaehlung();
  },
  { immediate: true, deep: true }
);
watch(
  () => eventbus.getSelectedKnotenarme,
  () => {
    validateZaehlung();
  },
  { immediate: true, deep: true }
);

const contentHeight = computed(() => {
  const height =
    daveUtils.pxToVh(800) -
    daveUtils.cardtitleHeight.value -
    daveUtils.tabHeight.value -
    daveUtils.cardactionHeight.value;
  return `${height}vh`;
});

function validateZaehlung(): void {
  isKnotenLageFormValid.value = validateKnotenLageForm();
  const isVerkehrFormValid = validateVerkehrForm();
  isZaehlungValid.value =
    isAllgemeineInfoFormValid.value !== null &&
    isAllgemeineInfoFormValid.value &&
    isKnotenLageFormValid.value &&
    isVerkehrFormValid;
}

function validateKnotenLageForm(): boolean {
  let isValid = true;
  if (zaehlung.value.zaehlart === Zaehlart.QJS) {
    // Erlaubte Kombinationen: 1 & 3, 2 & 4, 5 & 7, 6 & 8
    // => Absolute Subtraktion der Kontenarmnummern muss immer 2 sein
    isValid =
      zaehlung.value.knotenarme.length === 2 &&
      Math.abs(
        zaehlung.value.knotenarme[0].nummer -
          zaehlung.value.knotenarme[1].nummer
      ) === 2;
  }
  return isValid;
}

function validateVerkehrForm(): boolean {
  const selectedKnotenarme = eventbus.getSelectedKnotenarme;
  let validation = true;
  if (zaehlung.value.zaehlart === Zaehlart.QJS) {
    // Bei QJS muessen auf mind. einer Straßenseite beide Pfeile aktiv sein
    validation =
      (selectedKnotenarme.includes("1") && selectedKnotenarme.includes("2")) ||
      (selectedKnotenarme.includes("3") && selectedKnotenarme.includes("4"));
  } else if (
    zaehlung.value.zaehlart === Zaehlart.FJS ||
    zaehlung.value.zaehlart === Zaehlart.QU
  ) {
    // Bei FJS und QU muss mind. 1 Pfeil pro Knotenarm aktiv sein
    const selectedKnotenarmNummern = selectedKnotenarme.map(
      (knotenarm: string) => knotenarm.charAt(0)
    );
    const notSelectedKnotenarme = zaehlung.value.knotenarme
      .map((arm) => `${arm.nummer}`)
      .filter((nodeNumber) => !selectedKnotenarmNummern.includes(nodeNumber));
    validation = isEmpty(notSelectedKnotenarme);
  }
  return validation;
}
</script>
