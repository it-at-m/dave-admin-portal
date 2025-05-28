<template>
  <v-card
    variant="outlined"
    class="ml-3 mt-3"
    :max-width="maxWidth"
  >
    <v-card-title>
      <v-row
        dense
        no-gutters
      >
        <span>Unauffälliger Tag neuladen</span>
        <v-spacer />
        <v-icon
          v-tooltip:end="TOOLTIP_RELOAD_UNAUFFAELLIGER_TAG"
          size="small"
          icon="mdi-information-outline"
        />
      </v-row>
    </v-card-title>
    <v-card-text>

      <v-date-picker v-model="dateToReload" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        variant="outlined"
        text="Neu laden"
        @click="reloadUnauffaelligerTag"
      />
    </v-card-actions>
  </v-card>
  <v-dialog
    v-model="openDialogModel"
    persistent
    width="800"
  >
    <v-card>
      <v-card-title>Unauffälliger Tag neuladen</v-card-title>
      <v-card-text>
        {{ dialogtext }}
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red-lighten-1"
          text="Ja"
          variant="elevated"
          @click="confirmReload"
        />
        <v-btn
          color="tertiary"
          text="Nein"
          variant="elevated"
          @click="closeDialog"
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

import AdministrationService from "@/api/service/AdministrationService";
import { useSnackbarStore } from "@/store/SnackbarStore";

interface Props {
  maxWidth: string;
}
defineProps<Props>();

const snackbarStore = useSnackbarStore();

const dateToReload = ref(new Date());
const openDialogModel = ref(false);
const dialogtext = ref("Hier könnte Ihre Werbung stehen.");

const TOOLTIP_RELOAD_UNAUFFAELLIGER_TAG =
  "Der unauffällige Tag sollte für alle Messstellen neu geladen werden, wenn es in Mobidam nachträgliche Änderungen bei den auffälligen Tagen gab.";

function closeDialog() {
  dateToReload.value = new Date();
  openDialogModel.value = false;
}

function openDialog(title: string) {
  dialogtext.value = title;
  openDialogModel.value = true;
}

function reloadUnauffaelligerTag() {
  openDialog(
    `Soll der Tag ${dateToReload.value} erneut auf Auffälligkeiten überprüft werden?`
  );
}

function confirmReload() {
  AdministrationService.reloadUnauffaelligerTag(dateToReload.value)
    .then(() => {
      snackbarStore.showSuccess(
        `Der Tag ${dateToReload.value} wurde erneut auf Auffälligkeiten überprüft.`
      );
    })
    .catch((error) => {
      snackbarStore.showError(error);
    })
    .finally(() => closeDialog());
}
</script>
