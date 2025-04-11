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
              icon="mdi-map"
              color="secondary"
              small
              variant="plain"
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
    <span class="text-caption"
      >Stadtbezirk {{ messstelle.stadtbezirkNummer }},
      {{ messstelle.stadtbezirk }}</span
    >
  </v-sheet>
</template>
<script setup lang="ts">
import type LageplanDTO from "@/domain/dto/lageplan/LageplanDTO";
import type MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";

import { computed, ref } from "vue";

import LageplanService from "@/api/service/LageplanService";
import { useSnackbarStore } from "@/store/SnackbarStore";

interface Props {
  height: string;
  minheight: string;
}

withDefaults(defineProps<Props>(), {
  minheight: "160px",
});

const messstelle = defineModel<MessstelleEditDTO>({
  required: true,
});

const snackbarStore = useSnackbarStore();

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
    .then((result: LageplanDTO) => {
      window.open(result.url);
    })
    .catch((error) => {
      snackbarStore.showApiError(error);
    })
    .finally(() => {
      lageplanLoading.value = false;
    });
}
</script>
