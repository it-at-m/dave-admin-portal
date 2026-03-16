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
            v-if="notOnlyRadAndFussIsAllowed"
            v-model="pkw"
            :label="pkwLabel"
            color="quaternary"
            hide-details
            @update:model-value="updateKategorieWithPkw"
          />
          <v-checkbox
            v-if="notOnlyRadAndFussIsAllowed"
            v-model="lkw"
            :label="lkwLabel"
            color="quaternary"
            hide-details
            @update:model-value="updateKategorieWithLkw"
          />
          <v-checkbox
            v-if="notOnlyRadAndFussIsAllowed"
            v-model="lz"
            :label="lzLabel"
            color="quaternary"
            hide-details
            @update:model-value="updateKategorieWithLz"
          />
          <v-checkbox
            v-if="notOnlyRadAndFussIsAllowed"
            v-model="bus"
            :label="busLabel"
            color="quaternary"
            hide-details
            @update:model-value="updateKategorieWithBus"
          />
          <v-checkbox
            v-if="notOnlyRadAndFussIsAllowed"
            v-model="krad"
            :label="kradLabel"
            color="quaternary"
            hide-details
            @update:model-value="updateKategorieWithKrad"
          />
          <v-checkbox
            v-model="rad"
            :label="radLabel"
            color="quaternary"
            hide-details
            @update:model-value="updateKategorieWithRad"
          />
          <v-checkbox
            v-model="fuss"
            :label="fussLabel"
            color="quaternary"
            hide-details
            @update:model-value="updateKategorieWithFuss"
          />
          <v-checkbox
            v-model="selectOrDeselectAllVmodel"
            :label="labelSelectOrDeselectAll"
            color="quaternary"
            hide-details
            @update:model-value="selectOrDeselectAll()"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-sheet>
</template>

<script setup lang="ts">
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { computed, onMounted, ref, watch } from "vue";

import { useEventbus } from "@/store/Eventbus";
import { usePkweinheitStore } from "@/store/PkweinheitStore";
import Fahrzeug from "@/types/enum/Fahrzeug";
import Zaehlart from "@/types/enum/Zaehlart";

interface Props {
  height: string;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const pkweinheitStore = usePkweinheitStore();
const eventbus = useEventbus();

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
  () => eventbus.getReloadEvent,
  () => {
    resetForm();
  }
);

watch(
  () => zaehlung.value.kategorien,
  () => {
    resetForm();
  },
  { immediate: true, deep: true }
);

const pkwEinheitenOfStore = computed(() => {
  return pkweinheitStore.getPkwEinheit;
});

const labelSelectOrDeselectAll = computed(() => {
  return selectOrDeselectAllVmodel.value ? "Alles abwählen" : "Alles auswählen";
});

const notOnlyRadAndFussIsAllowed = computed(() => {
  const zaehlarten = [Zaehlart.QJS, Zaehlart.QU, Zaehlart.FJS];
  return !zaehlarten.includes(zaehlung.value.zaehlart);
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
  if (selectOrDeselectAllVmodel.value) {
    zaehlung.value.kategorien = [];
    if (notOnlyRadAndFussIsAllowed.value) {
      zaehlung.value.kategorien.push(Fahrzeug.PKW);
      zaehlung.value.kategorien.push(Fahrzeug.LKW);
      zaehlung.value.kategorien.push(Fahrzeug.LZ);
      zaehlung.value.kategorien.push(Fahrzeug.BUS);
      zaehlung.value.kategorien.push(Fahrzeug.KRAD);
    }
    zaehlung.value.kategorien.push(Fahrzeug.RAD);
    zaehlung.value.kategorien.push(Fahrzeug.FUSS);
  } else {
    zaehlung.value.kategorien = [];
  }
}

function addKategorie(kategorie: Fahrzeug) {
  zaehlung.value.kategorien.push(kategorie);
}

function removeKategorie(kategorie: Fahrzeug) {
  let toDelete = -1;
  zaehlung.value.kategorien.forEach((kat: Fahrzeug, index: number) => {
    if (kat === kategorie) {
      toDelete = index;
    }
  });
  if (toDelete > -1) {
    zaehlung.value.kategorien.splice(toDelete, 1);
  }
}

function resetForm() {
  pkw.value = zaehlung.value.kategorien.includes(Fahrzeug.PKW);
  lkw.value = zaehlung.value.kategorien.includes(Fahrzeug.LKW);
  lz.value = zaehlung.value.kategorien.includes(Fahrzeug.LZ);
  bus.value = zaehlung.value.kategorien.includes(Fahrzeug.BUS);
  krad.value = zaehlung.value.kategorien.includes(Fahrzeug.KRAD);
  rad.value = zaehlung.value.kategorien.includes(Fahrzeug.RAD);
  fuss.value = zaehlung.value.kategorien.includes(Fahrzeug.FUSS);
  selectOrDeselectAllVmodel.value = zaehlung.value.kategorien.length === 7;
}
</script>
