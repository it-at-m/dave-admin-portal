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
          :height="SHEETHEIGHT"
          @is-valid="setAllgemeineFormValid"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_KNOTEN">
        <knoten-lage-form
          v-model="zaehlung"
          :height="SHEETHEIGHT"
          :zaehlstelle="zaehlstelle"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRBEZIEHUNG">
        <fahrbeziehung-kreisverkehr-form
          v-if="zaehlung.kreisverkehr"
          v-model="zaehlung"
          :height="SHEETHEIGHT"
        />
        <fahrbeziehung-form
          v-else
          v-model="zaehlung"
          :height="SHEETHEIGHT"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRZEUGE">
        <fahrzeuge-form
          v-model="zaehlung"
          :height="SHEETHEIGHT"
        />
      </v-tabs-window-item>
    </v-tabs-window>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary"
        text="Speichern"
        variant="elevated"
        :disabled="!isAllgemeinFormValid"
        @click="save()"
      />
      <v-btn
        color="grey-lighten-1"
        variant="elevated"
        text="Abbrechen"
        @click="cancel()"
      />
    </v-card-actions>
  </v-sheet>
</template>

<script setup lang="ts">
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { ref } from "vue";

import ZaehlungService from "@/api/service/ZaehlungService";
import AllgemeineInfoForm from "@/components/zaehlung/form/AllgemeineInfoForm.vue";
import FahrbeziehungForm from "@/components/zaehlung/form/FahrbeziehungForm.vue";
import FahrbeziehungKreisverkehrForm from "@/components/zaehlung/form/FahrbeziehungKreisverkehrForm.vue";
import FahrzeugeForm from "@/components/zaehlung/form/FahrzeugeForm.vue";
import KnotenLageForm from "@/components/zaehlung/form/KnotenLageForm.vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useZaehlungStore } from "@/store/ZaehlungStore";

interface Props {
  zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const SHEETHEIGHT = "580px";

const zaehlungStore = useZaehlungStore();
const snackbarStore = useSnackbarStore();

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "saved"): void;
}>();

const activeTab = ref(0);
const isAllgemeinFormValid = ref(false);

const TAB_INFO = 0;
const TAB_KNOTEN = 1;
const TAB_FAHRBEZIEHUNG = 2;
const TAB_FAHRZEUGE = 3;

function save(): void {
  ZaehlungService.saveZaehlung(zaehlung.value, props.zaehlstelle.id)
    .then(() => {
      emits("saved");
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      activeTab.value = 0;
      zaehlungStore.setResetformevent(true);
    });
}

function cancel(): void {
  activeTab.value = 0;
  zaehlungStore.setResetformevent(true);
  emits("cancel");
}

function setAllgemeineFormValid(isPartValid: boolean) {
  isAllgemeinFormValid.value = isPartValid;
}
</script>
