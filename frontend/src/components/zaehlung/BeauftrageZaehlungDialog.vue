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

      <v-card-text class="py-0">
        <v-data-table
          v-model="selectedDienstleister"
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
            <v-toolbar
              flat
              color="white"
            >
              <v-toolbar-title>
                <!-- Eingabefeld zum Filtern der Dienstleister -->
                <v-text-field
                  v-model="filterDienstleister"
                  append-inner-icon="mdi-filter"
                  label="Dienstleister nach dem gefiltert werden soll"
                  single-line
                  hide-details
                  variant="underlined"
                  width="50%"
                  density="compact"
                />
              </v-toolbar-title>
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
import { useDaveUtils } from "@/util/DaveUtils";

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
const daveUtils = useDaveUtils();

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
  Von der Table-Height alles abziehen, was nicht die Tabelle ist
*/
const tableHeightDienstleister = computed(() => {
  return (
    daveUtils.pxToVh(600) -
    daveUtils.cardtitleHeight.value -
    daveUtils.datatableFilterHeight.value -
    daveUtils.cardactionHeight.value +
    "vh"
  );
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
