<template>
  <v-sheet
    width="100%"
    :height="height"
    :min-height="minheight"
    color="transparent"
    class="pa-4"
  >
    <span class="text-caption">
      Messstelle
      <v-tooltip right>
        <template #activator="{ props }">
          <span v-bind="props">
            <v-btn
              class="ma-0 pa-0"
              icon="mdi-map"
              color="secondary"
              min-width="0"
              variant="text"
              :disabled="!messstelle.lageplanVorhanden"
              @click="loadLageplan"
            />
          </span>
        </template>
        <span>{{ tooltipLageplan }}</span>
      </v-tooltip>
    </span>
    <br />
    <span class="text-h5">{{ messstelle.mstId }}</span>
    <br /><br />
    <span class="text-caption">Stadtbezirk{{ stadtbezirkInfo }}</span>
  </v-sheet>
</template>
<script setup lang="ts">
import type { DocumentDto } from "@/api/client";
import type MessstelleEdit from "@/types/messstelle/MessstelleEdit";

import { computed, ref } from "vue";

import LageplanService from "@/api/service/LageplanService";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useStadtbezirkStore } from "@/store/StadtbezirkStore";

interface Props {
  height: string;
  minheight: string;
}

withDefaults(defineProps<Props>(), {
  minheight: "160px",
});

const messstelle = defineModel<MessstelleEdit>({
  required: true,
});

const snackbarStore = useSnackbarStore();
const stadtbezirkStore = useStadtbezirkStore();

const stadtbezirkInfo = computed(() => {
  const stadtbezirkName = stadtbezirkStore.getStadtbezirkName(
    messstelle.value.stadtbezirkNummer
  );
  return messstelle.value.stadtbezirkNummer !== undefined
    ? ` ${messstelle.value.stadtbezirkNummer} ${stadtbezirkName || ""}`
    : ": keine Angabe";
});

const lageplanLoading = ref(false);

const tooltipLageplan = computed(() => {
  return messstelle.value.lageplanVorhanden
    ? "Lageplan"
    : "Kein Lageplan vorhanden";
});

function loadLageplan() {
  if (lageplanLoading.value) {
    return;
  }
  lageplanLoading.value = true;
  LageplanService.loadLageplan(messstelle.value.mstId)
    .then((result: DocumentDto) => {
      if (result.url) {
        window.open(result.url);
      }
    })
    .catch((error) => {
      snackbarStore.showApiError(error);
    })
    .finally(() => {
      lageplanLoading.value = false;
    });
}
</script>
