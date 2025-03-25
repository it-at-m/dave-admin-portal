<template>
  <v-sheet
    width="100%"
    class="d-flex flex-column"
  >
    <v-tabs
      v-model="activeTab"
      fixed-tabs
      background-color="grey darken-1"
      dark
      icons-and-text
      slider-color="grey lighten-1"
      slider-size="8"
    >
      <!-- Kopfzeile -->
      <v-tab>
        Allgemeine Info
        <v-icon>mdi-information-outline</v-icon>
      </v-tab>
      <v-tab>
        Knoten & Lage
        <v-icon>mdi-routes</v-icon>
      </v-tab>
      <v-tab>
        Fahrbeziehungen
        <v-icon>mdi-routes</v-icon>
      </v-tab>
      <v-tab>
        Fahrzeuge
        <v-icon>mdi-car-multiple</v-icon>
      </v-tab>
    </v-tabs>
    <v-tabs-items
      v-model="activeTab"
      class="d-flex flex-column align-stretch"
    >
      <!-- Inhalte -->
      <v-tab-item ref="allgemeineInfo">
        <allgemeine-info-form
          :height="SHEETHEIGHT"
          @isValid="setAllgemeineFormValid"
        />
      </v-tab-item>
      <v-tab-item ref="knotenUndLage">
        <knoten-lage-form
          :height="SHEETHEIGHT"
          :zaehlstelle="zaehlstelle"
        />
      </v-tab-item>
      <v-tab-item ref="fahrbeziehungen">
        <fahrbeziehung-kreisverkehr-form
          v-if="isKreisverkehr"
          :height="SHEETHEIGHT"
        />
        <fahrbeziehung-form
          v-else
          :height="SHEETHEIGHT"
        />
      </v-tab-item>
      <v-tab-item ref="fahrzeuge">
        <fahrzeuge-form :height="SHEETHEIGHT" />
      </v-tab-item>
    </v-tabs-items>

    <v-card-actions>
      <v-spacer />
      <v-btn
        color="secondary"
        :disabled="!isAllgemeinFormValid"
        @click="save()"
      >
        Speichern
      </v-btn>
      <v-btn
        color="grey lighten-1"
        @click="cancel()"
      >
        Abbrechen
      </v-btn>
    </v-card-actions>
  </v-sheet>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import { computed, ref } from "vue";

import ZaehlungService from "@/api/service/ZaehlungService";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useZaehlungStore } from "@/store/ZaehlungStore";

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

/**
 * Erzeugt eine vorübergehende ID, um die Knotenarme identifizieren zu können.
 * Diese ID wird vor dem Speichern gelöscht
 */
function generateId(): string {
  return "xyyxyyx-yxxyxxy".replace(/[xy]/g, function (c) {
    let r: number = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function save(): void {
  let copy: ZaehlungDTO = cloneDeep(zaehlungStore.getZaehlung);
  let selfIdLength: number = generateId().length;
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
