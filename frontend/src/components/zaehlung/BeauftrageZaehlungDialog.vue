<template>
  <v-dialog
    v-model="showDialog"
    persistent
    max-width="50%"
    height="600px"
  >
    <v-card flat>
      <v-card-title>
        <v-icon
          end
          :icon="dialogicon"
        />
        {{ dialogtitle }}
      </v-card-title>

      <v-card-text>
        <!--        TODO anpassen an Config Tabellen-->
        <v-data-table
          v-model="selectedDienstleister"
          class="overflow-y-auto"
          :height="tableHeightDienstleister"
          density="compact"
          :headers="dienstleisterHeaders"
          :items="dienstleister"
          :items-per-page="-1"
          hide-default-footer
          fixed-header
          :search="filterDienstleister"
          :loading="dienstleisterIsLoading"
          no-data-text="Keine aktiven Dienstleister vorhanden."
          :no-results-text="getNoResultText"
          show-select
          single-select
        >
          <template #top>
            <v-toolbar flat>
              <!-- Eingabefeld zum Filtern der Dienstleister -->
              <v-text-field
                v-model="filterDienstleister"
                append-icon="mdi-filter"
                label="Dienstleister nach dem gefiltert werden soll"
                single-line
                hide-details
              ></v-text-field>
            </v-toolbar>
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="showButtonBeauftragen"
          color="secondary"
          variant="elevated"
          text="Beauftragen"
          @click="beauftragen()"
        />
        <v-btn
          v-if="showButtonKorrigieren"
          color="secondary"
          variant="elevated"
          text="Korrigieren"
          @click="korrigieren()"
        />
        <v-btn
          color="grey-lighten-1"
          variant="elevated"
          text="Abbrechen"
          @click="cancel()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type DienstleisterDTO from "@/domain/dto/DienstleisterDTO";

import { isEmpty } from "lodash";
import { computed, ref, watch } from "vue";

import DienstleisterService from "@/api/service/DienstleisterService";
import { useSnackbarStore } from "@/store/SnackbarStore";

interface Props {
  isBeauftragen: boolean;
  dienstleisterkennung?: string;
}
const props = withDefaults(defineProps<Props>(), {
  dienstleisterkennung: "",
});
const showDialog = defineModel<boolean>({
  required: true,
});
const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "beauftragen", payload: DienstleisterDTO): void;
  (e: "korrigieren", payload: DienstleisterDTO): void;
}>();

const snackbarStore = useSnackbarStore();

const filterDienstleister = ref("");
const dienstleisterIsLoading = ref(false);
const dienstleister = ref<Array<DienstleisterDTO>>([]);
const selectedDienstleister = ref<Array<DienstleisterDTO>>([]);

watch(
  () => showDialog.value,
  () => {
    if (showDialog.value) {
      filterDienstleister.value = "";
      dienstleister.value = [];
      selectedDienstleister.value = [];
      dienstleisterIsLoading.value = false;
      loadAllActiveDienstleister();
    }
  }
);

function cancel(): void {
  emits("cancel");
}

function beauftragen(): void {
  if (selectedDienstleister.value.length === 1) {
    emits("beauftragen", selectedDienstleister.value[0]);
  }
}

function korrigieren(): void {
  if (selectedDienstleister.value.length === 1) {
    emits("korrigieren", selectedDienstleister.value[0]);
  }
}

const dialogtitle = computed(() => {
  return props.isBeauftragen
    ? "Dienstleister beauftragen"
    : "Dienstleister korrigieren";
});

const dialogicon = computed(() => {
  return props.isBeauftragen
    ? "mdi-account-arrow-right"
    : "mdi-account-convert-outline";
});

function loadAllActiveDienstleister() {
  dienstleister.value = [];
  dienstleisterIsLoading.value = true;
  DienstleisterService.getAllActive()
    .then((dienstleisterDTOS: Array<DienstleisterDTO>) => {
      dienstleister.value = dienstleisterDTOS;
      if (!isEmpty(props.dienstleisterkennung)) {
        selectedDienstleister.value = dienstleister.value.filter(
          (value) => value.kennung === props.dienstleisterkennung
        );
      }
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      dienstleisterIsLoading.value = false;
    });
}

const dienstleisterHeaders: Array<any> = [
  {
    title: "Name",
    align: "start",
    value: "name",
    lastFixed: true,
  },
  {
    title: "Kennung",
    value: "kennung",
    lastFixed: true,
  },
  {
    title: "Email",
    value: "emailAddressesAsString",
  },
];

/*
  Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
  64px Suche in Tabelle
  58px Header
  52px Button
   */
// TODO berechnung prüfen
const tableHeightDienstleister = computed(() => {
  return 600 - 58 - 64 - 52 + "px";
});

const getNoResultText = computed(() => {
  return `Kein Dienstleister zum Filter '${filterDienstleister.value}' gefunden.`;
});

const showButtonBeauftragen = computed(() => {
  return selectedDienstleister.value.length > 0 && props.isBeauftragen;
});

const showButtonKorrigieren = computed(() => {
  return selectedDienstleister.value.length > 0 && !props.isBeauftragen;
});
</script>
