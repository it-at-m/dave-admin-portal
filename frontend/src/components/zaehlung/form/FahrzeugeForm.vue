<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
    class="overflow-y-auto"
  >
    <v-card-text>
      <v-row dense>
        <v-col>
          <v-checkbox
            v-model="pkw"
            :label="pkwLabel"
            color="grey-darken-1"
            hide-details
            @click="updateKategorieWithPkw"
          ></v-checkbox>
          <v-checkbox
            v-model="lkw"
            :label="lkwLabel"
            color="grey-darken-1"
            hide-details
            @click="updateKategorieWithLkw"
          ></v-checkbox>
          <v-checkbox
            v-model="lz"
            :label="lzLabel"
            color="grey-darken-1"
            hide-details
            @click="updateKategorieWithLz"
          ></v-checkbox>
          <v-checkbox
            v-model="bus"
            :label="busLabel"
            color="grey-darken-1"
            hide-details
            @click="updateKategorieWithBus"
          ></v-checkbox>
          <v-checkbox
            v-model="krad"
            :label="kradLabel"
            color="grey-darken-1"
            hide-details
            @click="updateKategorieWithKrad"
          ></v-checkbox>
          <v-checkbox
            v-model="rad"
            :label="radLabel"
            color="grey-darken-1"
            hide-details
            @click="updateKategorieWithRad"
          ></v-checkbox>
          <v-checkbox
            v-model="fuss"
            :label="fussLabel"
            color="grey-darken-1"
            hide-details
            @click="updateKategorieWithFuss"
          ></v-checkbox>
          <v-checkbox
            v-model="selectOrDeselectAllVmodel"
            :label="labelSelectOrDeselectAll"
            color="grey-darken-1"
            hide-details
            @click="selectOrDeselectAll()"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-card-text>
  </v-sheet>
</template>

<script setup lang="ts">
import type ZaehlungDTO from "@/domain/dto/ZaehlungDTO";

import { cloneDeep } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import Fahrzeug from "@/domain/enums/Fahrzeug";
import { usePkweinheitStore } from "@/store/PkweinheitStore";
import { useZaehlungStore } from "@/store/ZaehlungStore";

interface Props {
  height: string;
}
defineProps<Props>();

const pkweinheitStore = usePkweinheitStore();
const zaehlungStore = useZaehlungStore();

// Variablen für die Checkboxen
const pkw = ref(false);
const lkw = ref(false);
const lz = ref(false);
const bus = ref(false);
const krad = ref(false);
const rad = ref(false);
const fuss = ref(false);
const selectOrDeselectAllVmodel = ref(false);

onMounted(() => {
  resetForm();
});

watch(
  () => zaehlungStore.getKategorien,
  (kategorien) => {
    selectOrDeselectAllVmodel.value = kategorien.length === 7;
  }
);

watch(
  () => zaehlungStore.getResetformevent,
  () => {
    resetForm();
  }
);

const pkwEinheitenOfStore = computed(() => {
  return pkweinheitStore.getPkwEinheit;
});

const labelSelectOrDeselectAll = computed(() => {
  return selectOrDeselectAllVmodel.value ? "Alles abwählen" : "Alles auswählen";
});

const pkwLabel = computed(() => {
  return `Personenkraftwagen (Pkw) - PKW-Einheit-Faktor: ${pkwEinheitenOfStore.value.pkw}`;
});

const lkwLabel = computed(() => {
  return `Lastkraftwagen (Lkw) - PKW-Einheit-Faktor: ${pkwEinheitenOfStore.value.lkw}`;
});

const lzLabel = computed(() => {
  return `Lastzüge (Lz) - PKW-Einheit-Faktor: ${pkwEinheitenOfStore.value.lastzuege}`;
});

const busLabel = computed(() => {
  return `Bus - PKW-Einheit-Faktor: ${pkwEinheitenOfStore.value.busse}`;
});

const kradLabel = computed(() => {
  return `Krafträder (Krad) - PKW-Einheit-Faktor: ${pkwEinheitenOfStore.value.kraftraeder}`;
});

const radLabel = computed(() => {
  return `Radfahrer - PKW-Einheit-Faktor: ${pkwEinheitenOfStore.value.fahrradfahrer}`;
});

const fussLabel = computed(() => {
  return `Fußgänger - PKW-Einheit-Faktor: nicht existent`;
});

function updateKategorieWithPkw() {
  if (pkw.value) {
    addKategorie(Fahrzeug.PKW);
  } else {
    removeKategorie(Fahrzeug.PKW);
  }
}

function updateKategorieWithLkw() {
  if (lkw.value) {
    addKategorie(Fahrzeug.LKW);
  } else {
    removeKategorie(Fahrzeug.LKW);
  }
}

function updateKategorieWithLz() {
  if (lz.value) {
    addKategorie(Fahrzeug.LZ);
  } else {
    removeKategorie(Fahrzeug.LZ);
  }
}

function updateKategorieWithBus() {
  if (bus.value) {
    addKategorie(Fahrzeug.BUS);
  } else {
    removeKategorie(Fahrzeug.BUS);
  }
}

function updateKategorieWithKrad() {
  if (krad.value) {
    addKategorie(Fahrzeug.KRAD);
  } else {
    removeKategorie(Fahrzeug.KRAD);
  }
}

function updateKategorieWithRad() {
  if (rad.value) {
    addKategorie(Fahrzeug.RAD);
  } else {
    removeKategorie(Fahrzeug.RAD);
  }
}

function updateKategorieWithFuss() {
  if (fuss.value) {
    addKategorie(Fahrzeug.FUSS);
  } else {
    removeKategorie(Fahrzeug.FUSS);
  }
}

/**
 * Hilfsmethode, um alle Checkboxen der Fahrzeugkategorien aufeinmal
 * aus- oder abzuwählen, wenn diese nicht disabled sind.
 * @private
 */
function selectOrDeselectAll() {
  pkw.value = selectOrDeselectAllVmodel.value;
  lkw.value = selectOrDeselectAllVmodel.value;
  lz.value = selectOrDeselectAllVmodel.value;
  bus.value = selectOrDeselectAllVmodel.value;
  krad.value = selectOrDeselectAllVmodel.value;
  rad.value = selectOrDeselectAllVmodel.value;
  fuss.value = selectOrDeselectAllVmodel.value;
  // in den Store schreiben//löschen
  if (selectOrDeselectAllVmodel.value) {
    const allFahrzeuge: Array<Fahrzeug> = [];
    allFahrzeuge.push(Fahrzeug.PKW);
    allFahrzeuge.push(Fahrzeug.LKW);
    allFahrzeuge.push(Fahrzeug.LZ);
    allFahrzeuge.push(Fahrzeug.BUS);
    allFahrzeuge.push(Fahrzeug.KRAD);
    allFahrzeuge.push(Fahrzeug.RAD);
    allFahrzeuge.push(Fahrzeug.FUSS);
    zaehlungStore.addAllKategorien(allFahrzeuge);
  } else {
    zaehlungStore.deleteAllKategorien();
  }
}

function addKategorie(kategorie: Fahrzeug) {
  zaehlungStore.addKategorie(cloneDeep(kategorie));
}

function removeKategorie(kategorie: Fahrzeug) {
  zaehlungStore.deleteKategorie(cloneDeep(kategorie));
}

function resetForm() {
  const zaehlung: ZaehlungDTO = zaehlungStore.getZaehlung;
  pkw.value = zaehlung.kategorien.includes(Fahrzeug.PKW);
  lkw.value = zaehlung.kategorien.includes(Fahrzeug.LKW);
  lz.value = zaehlung.kategorien.includes(Fahrzeug.LZ);
  bus.value = zaehlung.kategorien.includes(Fahrzeug.BUS);
  krad.value = zaehlung.kategorien.includes(Fahrzeug.KRAD);
  rad.value = zaehlung.kategorien.includes(Fahrzeug.RAD);
  fuss.value = zaehlung.kategorien.includes(Fahrzeug.FUSS);
  selectOrDeselectAllVmodel.value = zaehlung.kategorien.length === 7;
}
</script>
