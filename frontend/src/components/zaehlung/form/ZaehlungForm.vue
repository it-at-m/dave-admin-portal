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
      <v-tab :value="TAB_BEWEGUNGSBEZIEHUNG">
        <v-icon icon="mdi-routes" />
        Fahrbeziehungen
      </v-tab>
      <v-tab :value="TAB_VERKEHRSART">
        <v-icon icon="mdi-car-multiple" />
        Verkehrsarten
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
      <v-tabs-window-item :value="TAB_BEWEGUNGSBEZIEHUNG">
        <verkehr-form
          v-model:zaehlung="zaehlung"
          :height="contentHeight"
          :is-knoten-lage-form-valid="isKnotenLageFormValid"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_VERKEHRSART">
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

import { computed, onMounted, ref, watch } from "vue";

import AllgemeineInfoForm from "@/components/zaehlung/form/AllgemeineInfoForm.vue";
import KnotenLageForm from "@/components/zaehlung/form/KnotenLageForm.vue";
import VerkehrForm from "@/components/zaehlung/form/VerkehrForm.vue";
import VerkehrsartForm from "@/components/zaehlung/form/VerkehrsartForm.vue";
import { useEventbus } from "@/store/Eventbus";
import { useDaveUtils } from "@/util/DaveUtils";
import { useValidationUtils } from "@/util/ValidationUtils";

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
const validationUtils = useValidationUtils();

const activeTab = ref(0);
// Kann auch null sein, da es in einer v-form als v-model genutzt wird.
const isAllgemeineInfoFormValid = ref<boolean | null>(null);
const isKnotenLageFormValid = ref(false);

const TAB_INFO = 0;
const TAB_KNOTEN = 1;
const TAB_BEWEGUNGSBEZIEHUNG = 2;
const TAB_VERKEHRSART = 3;

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
  () => zaehlung.value.zaehlart,
  (newValue, oldValue) => {
    if (oldValue !== undefined && newValue !== oldValue) {
      zaehlung.value.kategorien = [];
      zaehlung.value.verkehrsbeziehungen = [];
      zaehlung.value.laengsverkehr = [];
      zaehlung.value.querungsverkehr = [];
    }
  },
  { immediate: true }
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
  isKnotenLageFormValid.value = validationUtils.validateKnotenLageForm(
    zaehlung.value
  );
  const isVerkehrsartFormValid = validationUtils.validateVerkehrsartForm(
    zaehlung.value
  );
  const isVerkehrFormValid = validationUtils.validateVerkehrForm(
    zaehlung.value
  );
  isZaehlungValid.value =
    isAllgemeineInfoFormValid.value !== null &&
    isAllgemeineInfoFormValid.value &&
    isKnotenLageFormValid.value &&
    isVerkehrsartFormValid &&
    isVerkehrFormValid;
}
</script>
