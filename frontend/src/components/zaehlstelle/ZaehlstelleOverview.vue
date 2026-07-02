<template>
  <v-sheet
    width="100%"
    color="transparent"
  >
    <v-card-title>
      <h3>Zählstellen</h3>
    </v-card-title>
    <v-expansion-panels
      v-if="hasOpenZaehlungen"
      variant="accordion"
      focusable
      elevation="0"
    >
      <open-zaehlung-panel
        :header="getCreatedHeader"
        :status-design="createdStatusDesign"
        :zaehlungen="createdZaehlungen"
      />
      <open-zaehlung-panel
        :header="getInstructedHeader"
        :status-design="instructedStatusDesign"
        :zaehlungen="instructedZaehlungen"
      />
      <open-zaehlung-panel
        :header="getCountingHeader"
        :status-design="countingStatusDesign"
        :zaehlungen="countingZaehlungen"
      />
      <open-zaehlung-panel
        :header="getAccomplishedHeader"
        :status-design="accomplishedStatusDesign"
        :zaehlungen="accomplishedZaehlungen"
      />
      <open-zaehlung-panel
        :header="getCorrectionHeader"
        :status-design="correctionStatusDesign"
        :zaehlungen="correctionZaehlungen"
      />
    </v-expansion-panels>
    <v-card-subtitle
      v-else
      class="text-caption grey--text text--lighten-1"
      >Es sind aktuell keine offenen Zählungen vorhanden.
    </v-card-subtitle>
  </v-sheet>
</template>

<script setup lang="ts">
import type OpenZaehlungDTO from "@/types/zaehlung/OpenZaehlungDTO";

import { computed, onMounted, ref } from "vue";

import ZaehlungService from "@/api/service/ZaehlungService";
import IconOptions from "@/components/icons/IconOptions";
import OpenZaehlungPanel from "@/components/zaehlung/OpenZaehlungPanel.vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import Status, { statusIcon } from "@/types/enum/Status";
import ZaehlungComparator from "@/util/ZaehlungComparator";

const snackbarStore = useSnackbarStore();

const hasOpenZaehlungen = ref(false);

const createdZaehlungen = ref<Array<OpenZaehlungDTO>>([]);
const instructedZaehlungen = ref<Array<OpenZaehlungDTO>>([]);
const countingZaehlungen = ref<Array<OpenZaehlungDTO>>([]);
const accomplishedZaehlungen = ref<Array<OpenZaehlungDTO>>([]);
const correctionZaehlungen = ref<Array<OpenZaehlungDTO>>([]);

const createdStatusDesign = computed(() => {
  return getStatusDesign(Status.CREATED);
});
const instructedStatusDesign = computed(() => {
  return getStatusDesign(Status.INSTRUCTED);
});
const countingStatusDesign = computed(() => {
  return getStatusDesign(Status.COUNTING);
});
const accomplishedStatusDesign = computed(() => {
  return getStatusDesign(Status.ACCOMPLISHED);
});
const correctionStatusDesign = computed(() => {
  return getStatusDesign(Status.CORRECTION);
});

const getCreatedHeader = computed(() => {
  return `Angelegte Zählungen: ${createdZaehlungen.value.length}`;
});
const getInstructedHeader = computed(() => {
  return `Beauftragte Zählungen: ${instructedZaehlungen.value.length}`;
});
const getCountingHeader = computed(() => {
  return `Laufende Zählungen: ${countingZaehlungen.value.length}`;
});
const getAccomplishedHeader = computed(() => {
  return `Durchgeführte Zählungen: ${accomplishedZaehlungen.value.length}`;
});
const getCorrectionHeader = computed(() => {
  return `Fehlerhafte Zählungen: ${correctionZaehlungen.value.length}`;
});

onMounted(() => {
  resetDataArrays();
  loadOpenZaehlungen();
});

function loadOpenZaehlungen(): void {
  hasOpenZaehlungen.value = false;
  ZaehlungService.getAllOpenZaehlungen()
    .then((zaehlungen: Array<OpenZaehlungDTO>) => {
      zaehlungen.forEach((zaehlung: OpenZaehlungDTO) => {
        switch (zaehlung.status) {
          case Status.CREATED:
            createdZaehlungen.value.push(zaehlung);
            break;
          case Status.INSTRUCTED:
            instructedZaehlungen.value.push(zaehlung);
            break;
          case Status.COUNTING:
            countingZaehlungen.value.push(zaehlung);
            break;
          case Status.ACCOMPLISHED:
            accomplishedZaehlungen.value.push(zaehlung);
            break;
          case Status.CORRECTION:
            correctionZaehlungen.value.push(zaehlung);
            break;
        }
      });
      hasOpenZaehlungen.value = zaehlungen.length > 0;
      sortDataArraysZaehlstelle();
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function sortDataArraysZaehlstelle(): void {
  createdZaehlungen.value = sortByDatumDesc(createdZaehlungen.value);
  instructedZaehlungen.value = sortByDatumDesc(instructedZaehlungen.value);
  countingZaehlungen.value = sortByDatumDesc(countingZaehlungen.value);
  accomplishedZaehlungen.value = sortByDatumDesc(accomplishedZaehlungen.value);
  correctionZaehlungen.value = sortByDatumDesc(correctionZaehlungen.value);
}

function sortByDatumDesc(
  toSort: Array<OpenZaehlungDTO>
): Array<OpenZaehlungDTO> {
  return toSort.sort(ZaehlungComparator.sortByDatumDesc);
}

function resetDataArrays(): void {
  createdZaehlungen.value = [];
  instructedZaehlungen.value = [];
  countingZaehlungen.value = [];
  accomplishedZaehlungen.value = [];
  correctionZaehlungen.value = [];
}

function getStatusDesign(status: Status): IconOptions {
  let design: IconOptions | undefined = statusIcon.get(status);
  if (!design) {
    design = {} as IconOptions;
    design.color = "deep-orange-lighten-4";
    design.iconPath = "mdi-calendar-question";
    design.tooltip = "Status unbekannt";
  }
  return design;
}
</script>
