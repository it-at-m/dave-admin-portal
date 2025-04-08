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
          :height="SHEETHEIGHT"
          @is-valid="setAllgemeineFormValid"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_KNOTEN">
        <knoten-lage-form
          :height="SHEETHEIGHT"
          :zaehlstelle="zaehlstelle"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRBEZIEHUNG">
        <!--        <fahrbeziehung-kreisverkehr-form-->
        <!--          v-if="isKreisverkehr"-->
        <!--          :height="SHEETHEIGHT"-->
        <!--        />-->
        <!--        <fahrbeziehung-form-->
        <!--          v-else-->
        <!--          :height="SHEETHEIGHT"-->
        <!--        />-->
      </v-tabs-window-item>
      <v-tabs-window-item :value="TAB_FAHRZEUGE">
        <!--        <fahrzeuge-form :height="SHEETHEIGHT" />-->
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
import type ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import type ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import type KnotenarmDTO from "@/domain/KnotenarmDTO";

import { cloneDeep } from "lodash";
import { computed, ref } from "vue";

import ZaehlungService from "@/api/service/ZaehlungService";
import AllgemeineInfoForm from "@/components/zaehlung/form/AllgemeineInfoForm.vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useZaehlungStore } from "@/store/ZaehlungStore";
import KnotenLageForm from "@/components/zaehlung/form/KnotenLageForm.vue";

interface Props {
  zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();

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

/**
 * Erzeugt eine vorübergehende ID, um die Knotenarme identifizieren zu können.
 * Diese ID wird vor dem Speichern gelöscht
 */
function generateId(): string {
  return "xyyxyyx-yxxyxxy".replace(/[xy]/g, function (c) {
    const r: number = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function save(): void {
  const copy: ZaehlungDTO = cloneDeep(zaehlungStore.getZaehlung);
  const selfIdLength: number = generateId().length;
  copy.knotenarme.forEach((arm: KnotenarmDTO) => {
    // Alle Id's entfernen, die ich selber gesetzt habe
    if (arm.id && arm.id.length === selfIdLength) {
      arm.id = "";
    }
  });
  ZaehlungService.saveZaehlung(copy, props.zaehlstelle.id)
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

const isKreisverkehr = computed(() => {
  return zaehlungStore.getZaehlung.kreisverkehr;
});
</script>
