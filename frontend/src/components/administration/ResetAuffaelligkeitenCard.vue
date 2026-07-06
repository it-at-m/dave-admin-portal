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
    <v-card-subtitle class="text-wrap">
      Zur Prüfung kann ein Zeitraum von bis zu
      {{ MAX_ALLOWED_NUMBER_OF_SELECTED_DATES }} Tagen ausgewählt werden.
    </v-card-subtitle>
    <v-card-text>
      <v-date-picker
        v-model="choosenDates"
        :max="dateYesterday"
        multiple="range"
      >
        <template #title />
      </v-date-picker>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn
        variant="outlined"
        text="Prüfen"
        :disabled="areMoreDatesSelectedThanAllowed"
        @click="resetAuffaelligkeiten"
      />
    </v-card-actions>
  </v-card>
  <v-dialog
    v-model="openDialogModel"
    persistent
    width="800"
  >
    <v-card :loading="isPruefungAuffaelligkeitenInProgress">
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
          :disabled="isPruefungAuffaelligkeitenInProgress"
          @click="confirmReset"
        />
        <v-btn
          color="tertiary"
          text="Nein"
          variant="elevated"
          :disabled="isPruefungAuffaelligkeitenInProgress"
          @click="closeDialog"
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { cloneDeep, head, isEmpty, isNil, last, toArray } from "lodash";
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

const MAX_ALLOWED_NUMBER_OF_SELECTED_DATES = 31;

const dateYesterday = ref<Date>(moment(new Date()).subtract(1, "day").toDate());

const datesToReset = ref<Array<Date>>([cloneDeep(dateYesterday.value)]);

const isPruefungAuffaelligkeitenInProgress = ref<boolean>(false);

const choosenDates = computed({
  get() {
    let dates = [cloneDeep(dateYesterday.value)];
    if (!isEmpty(datesToReset.value)) {
      dates = datesToReset.value;
      dates.forEach((date) => date.setHours(5));
    }
    return dates;
  },

  set(dates: Array<Date>) {
    if (!isEmpty(dates)) {
      dates.forEach((date) => date.setHours(5));
    }
    datesToReset.value = dates;
  },
});

const areMoreDatesSelectedThanAllowed = computed<boolean>(() => {
  return (
    toArray(choosenDates.value).length > MAX_ALLOWED_NUMBER_OF_SELECTED_DATES
  );
});

function closeDialog() {
  datesToReset.value = [cloneDeep(dateYesterday.value)];
  openDialogModel.value = false;
}

function openDialog(title: string) {
  dialogtext.value = title;
  openDialogModel.value = true;
}

function resetAuffaelligkeiten() {
  if (!isNil(datesToReset.value)) {
    const resetAuffaelligkeiten = createResetAuffaelligkeitenDTO(
      datesToReset.value
    );
    openDialog(
      `Soll der Zeitraum vom ${dateUtils.getShortVersionOfDate(resetAuffaelligkeiten.startDateToReset)} bis ${dateUtils.getShortVersionOfDate(resetAuffaelligkeiten.endDateToReset)} erneut auf Auffälligkeiten überprüft werden?
            </br> Die bereits ermittelten Auffälligkeiten werden dabei überschrieben.`
    );
  }
}

function confirmReset() {
  if (datesToReset.value) {
    const resetAuffaelligkeiten = createResetAuffaelligkeitenDTO(
      datesToReset.value
    );

    dialogtext.value = `Bitte Warten.</br>Der Zeitraum vom ${dateUtils.getShortVersionOfDate(resetAuffaelligkeiten.startDateToReset)} bis ${dateUtils.getShortVersionOfDate(resetAuffaelligkeiten.endDateToReset)} wird erneut auf Auffälligkeiten überprüft.`;
    isPruefungAuffaelligkeitenInProgress.value = true;

    AdministrationService.resetAuffaelligerTag(resetAuffaelligkeiten)
      .then(() => {
        snackbarStore.showSuccess(
          `Der Zeitraum vom ${dateUtils.getShortVersionOfDate(resetAuffaelligkeiten.startDateToReset)} bis ${dateUtils.getShortVersionOfDate(resetAuffaelligkeiten.endDateToReset)} wurde erneut auf Auffälligkeiten überprüft.`
        );
      })
      .catch((error) => {
        const message =
          "Bei der Prüfung nach Auffälligkeiten ist ein Fehler aufgetreten.";
        snackbarStore.showError(error, message);
      })
      .finally(() => {
        closeDialog();
        isPruefungAuffaelligkeitenInProgress.value = false;
      });
  }
}

function createResetAuffaelligkeitenDTO(datesToReset: Array<Date>) {
  const startDate = head(datesToReset);
  const endDate = last(datesToReset);
  return new ResetAuffaelligkeitenDTO(
    startDate ? startDate : dateYesterday.value,
    endDate ? endDate : dateYesterday.value
  );
}
</script>
