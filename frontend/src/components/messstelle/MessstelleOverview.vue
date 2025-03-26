<template>
  <v-sheet
    width="100%"
    color="transparent"
    class="overflow-y-auto"
  >
    <v-card-title style="font-weight: bold; font-size: x-large"
      >Messstellen
    </v-card-title>
    <v-expansion-panels
      v-if="hasMessstellen"
      variant="accordion"
      focusable
      elevation="0"
    >
      <messstelle-overview-panel
        :header="geplanteMessstellenHeader"
        color="orange-lighten-4"
        icon="mdi-clipboard-clock-outline"
        :messstellen="geplanteMessstellen"
      />
      <messstelle-overview-panel
        :header="neuUmgesetzteMessstellenHeader"
        color="blue-lighten-4"
        icon="mdi-clipboard-plus-outline"
        :messstellen="neuUmgesetztMessstellen"
      />
      <messstelle-overview-panel
        :header="nichtSichtbareMessstellenHeader"
        color="purple-lighten-4"
        icon="mdi-eye-off-outline"
        :messstellen="nichtSichtbareMessstellen"
      />
    </v-expansion-panels>
    <v-card-subtitle
      v-else
      class="text-caption grey--text text--lighten-1"
      >Es sind aktuell keine Daten zu den Messstellen vorhanden.
    </v-card-subtitle>
  </v-sheet>
</template>

<script setup lang="ts">
import type MessstelleOverviewDTO from "@/domain/dto/messstelle/MessstelleOverviewDTO";

import { computed, onMounted, ref } from "vue";

import MessstelleService from "@/api/service/MessstelleService";
import MessstelleOverviewPanel from "@/components/messstelle/MessstelleOverviewPanel.vue";
import { MessstelleStatus } from "@/domain/enums/MessstelleStatus";
import { useSnackbarStore } from "@/store/SnackbarStore";

const snackbarStore = useSnackbarStore();

const hasMessstellen = ref(false);

const geplanteMessstellen = ref<Array<MessstelleOverviewDTO>>([]);
const neuUmgesetztMessstellen = ref<Array<MessstelleOverviewDTO>>([]);
const nichtSichtbareMessstellen = ref<Array<MessstelleOverviewDTO>>([]);

const geplanteMessstellenHeader = computed(() => {
  return `Geplante Messstellen: ${geplanteMessstellen.value.length}`;
});
const neuUmgesetzteMessstellenHeader = computed(() => {
  return `Neue Messstellen: ${neuUmgesetztMessstellen.value.length}`;
});
const nichtSichtbareMessstellenHeader = computed(() => {
  return `Nicht sichtbare Messstellen: ${nichtSichtbareMessstellen.value.length}`;
});

onMounted(() => {
  resetDataArrays();
  loadOpenMessstellen();
});

function loadOpenMessstellen(): void {
  hasMessstellen.value = false;
  MessstelleService.getAllMessstellenForOverview()
    .then((messstellen: Array<MessstelleOverviewDTO>) => {
      messstellen.forEach((messstelle: MessstelleOverviewDTO) => {
        if (messstelle.status === MessstelleStatus.IN_PLANUNG) {
          geplanteMessstellen.value.push(messstelle);
        } else if (!messstelle.geprueft) {
          neuUmgesetztMessstellen.value.push(messstelle);
        } else if (!messstelle.sichtbarDatenportal) {
          nichtSichtbareMessstellen.value.push(messstelle);
        }
      });
      hasMessstellen.value = hasMessstellen.value || messstellen.length > 0;
      sortDataArraysMessstelle();
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function sortDataArraysMessstelle(): void {
  geplanteMessstellen.value = sortByMstId(geplanteMessstellen.value);
  neuUmgesetztMessstellen.value = sortByMstId(neuUmgesetztMessstellen.value);
  nichtSichtbareMessstellen.value = sortByMstId(
    nichtSichtbareMessstellen.value
  );
}

function sortByMstId(
  toSort: Array<MessstelleOverviewDTO>
): Array<MessstelleOverviewDTO> {
  return toSort.sort((a, b) => (a.mstId > b.mstId ? 1 : -1));
}

function resetDataArrays(): void {
  geplanteMessstellen.value = [];
  neuUmgesetztMessstellen.value = [];
  nichtSichtbareMessstellen.value = [];
}
</script>
