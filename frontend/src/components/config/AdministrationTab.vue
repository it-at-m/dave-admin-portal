<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
  >
    <v-card
      variant="outlined"
      class="ml-3 mt-3"
      max-width="374"
    >
      <v-card-title>Suchvorschläge zurücksetzen</v-card-title>
      <v-card-actions>
        <v-btn
          variant="outlined"
          text="Alle"
          @click="resetAll"
        />
        <v-btn
          variant="outlined"
          text="nur Messstellen"
          @click="resetMessstellen"
        />
        <v-btn
          variant="outlined"
          text="nur Zählstellen"
          @click="resetZaehlstellen"
        />
      </v-card-actions>
    </v-card>
  </v-sheet>
  <v-dialog
    v-model="openDialogModel"
    persistent
    width="800"
  >
    <v-card>
      <v-card-title> Suchvorschläge zurücksetzen </v-card-title>
      <v-card-text>
        {{ dialogtext }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red-lighten-1"
          text="Zurücksetzen"
          variant="elevated"
          @click="confirmDelete"
        />
        <v-btn
          color="tertiary"
          text="Abbrechen"
          variant="elevated"
          @click="closeDialog"
        />
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

import AdministrationService from "@/api/service/AdministrationService";
import { useSnackbarStore } from "@/store/SnackbarStore";

interface Props {
  height: string;
}
defineProps<Props>();

const snackbarStore = useSnackbarStore();

const resetAllFlag = ref(false);
const resetMessstellenFlag = ref(false);
const resetZaehlstellenFlag = ref(false);
const openDialogModel = ref(false);
const dialogtext = ref("Hier könnte Ihre Werbung stehen.");

function closeDialog() {
  openDialogModel.value = false;
  resetAllFlag.value = false;
  resetMessstellenFlag.value = false;
  resetZaehlstellenFlag.value = false;
}

function openDialog(title: string) {
  dialogtext.value = title;
  openDialogModel.value = true;
}

function resetAll() {
  resetAllFlag.value = true;
  openDialog("Sollen wirklich alle Suchvorschläge zurückgesetzt werden?");
}

function resetMessstellen() {
  resetMessstellenFlag.value = true;
  openDialog(
    "Sollen wirklich alle Suchvorschläge der Messstellen zurückgesetzt werden?"
  );
}

function resetZaehlstellen() {
  resetZaehlstellenFlag.value = true;
  openDialog(
    "Sollen wirklich alle Suchvorschläge der Zählstellen zurückgesetzt werden?"
  );
}

function confirmDelete() {
  if (resetAllFlag.value) {
    AdministrationService.resetAllSuggestions()
      .then(() => {
        snackbarStore.showSuccess(
          "Alle Suchvorschläge wurden erfolgreich zurückgesetzt."
        );
      })
      .catch((error) => {
        snackbarStore.showError(error);
      })
      .finally(() => closeDialog());
  } else if (resetZaehlstellenFlag.value) {
    AdministrationService.resetSuggestionsOfAllZaehlstellen()
      .then(() => {
        snackbarStore.showSuccess(
          "Die Suchvorschläge der Zählstellen wurden erfolgreich zurückgesetzt."
        );
      })
      .catch((error) => {
        snackbarStore.showError(error);
      })
      .finally(() => closeDialog());
  } else if (resetMessstellenFlag.value) {
    AdministrationService.resetSuggestionsOfAllMessstellen()
      .then(() => {
        snackbarStore.showSuccess(
          "Die Suchvorschläge der Messstellen wurden erfolgreich zurückgesetzt."
        );
      })
      .catch((error) => {
        snackbarStore.showError(error);
      })
      .finally(() => closeDialog());
  }
}
</script>
