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
        <span>{{ TITLE }}</span>
        <v-spacer />
        <v-icon
          v-tooltip:end="TOOLTIP_RELOAD_UNAUFFAELLIGER_TAG"
          size="small"
          icon="mdi-information-outline"
        />
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-date-picker
        v-model="choosenDate"
        :max="dateYesterday"
      >
        <template #title />
      </v-date-picker>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        variant="outlined"
        text="Prüfen"
        @click="resetAuffaelligkeiten"
      />
    </v-card-actions>
  </v-card>
  <v-dialog
    v-model="openDialogModel"
    persistent
    width="800"
  >
    <v-card>
      <v-card-title>
        <v-icon
          start
          icon="mdi-calendar-search-outline"
        />
        {{ TITLE }}
      </v-card-title>
      <v-card-text>
        <span v-html="dialogtext" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red-lighten-1"
          text="Ja"
          variant="elevated"
          @click="confirmReset"
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
import { isNil, cloneDeep } from "lodash";
import moment from "moment";
import { computed, ref } from "vue";

import AdministrationService from "@/api/service/AdministrationService";
import { useSnackbarStore } from "@/store/SnackbarStore";
import ResetAuffaelligkeitenDTO from "@/types/config/ResetAuffaelligkeitenDTO";
import { useDateUtils } from "@/util/DateUtils";

interface Props {
  maxWidth: string;
}
defineProps<Props>();

const snackbarStore = useSnackbarStore();
const dateUtils = useDateUtils();

const openDialogModel = ref(false);
const dialogtext = ref("Hier könnte Ihre Werbung stehen.");

const TITLE = "Tag auf Auffälligkeiten prüfen";

const TOOLTIP_RELOAD_UNAUFFAELLIGER_TAG =
  "Bei nachträglichen Änderungen an den auffälligen Tagen in Mobidam sollten diese neu geladen werden.";

const dateYesterday = ref(moment(new Date()).subtract(1, "day").toDate());

const dateToReset = ref(cloneDeep(dateYesterday));

const choosenDate = computed({
  get() {
    let date = cloneDeep(dateYesterday.value);
    if (!isNil(dateToReset.value)) {
      date = dateToReset.value;
      date.setHours(5);
    }
    return date;
  },

  set(date: Date) {
    if (!isNil(date)) {
      date.setHours(5);
    }
    dateToReset.value = date;
  },
});

function closeDialog() {
  dateToReset.value = cloneDeep(dateYesterday.value);
  openDialogModel.value = false;
}

function openDialog(title: string) {
  dialogtext.value = title;
  openDialogModel.value = true;
}

function resetAuffaelligkeiten() {
  if (!isNil(dateToReset.value)) {
    openDialog(
      `Soll der ${dateUtils.getShortVersionOfDate(dateToReset.value)} erneut auf Auffälligkeiten überprüft werden?
            </br> Die bereits ermittelten Auffälligkeiten werden dabei überschrieben.`
    );
  }
}

function confirmReset() {
  if (dateToReset.value) {
    const resetAuffaelligkeiten = new ResetAuffaelligkeitenDTO(
      dateToReset.value
    );
    AdministrationService.resetAuffaelligerTag(resetAuffaelligkeiten)
      .then(() => {
        snackbarStore.showSuccess(
          `Der ${dateUtils.getShortVersionOfDate(resetAuffaelligkeiten.dateToReset)} wurde erneut auf Auffälligkeiten überprüft.`
        );
      })
      .catch((error) => {
        snackbarStore.showError(error);
      })
      .finally(() => closeDialog());
  }
}
</script>
