<template>
  <v-card
    width="100%"
    :height="height"
    :max-height="height"
    flat
  >
    <v-card-title>
      Historisierung der letzten
      {{ inactiveInfoMessages.length }} deaktivierten Info-Nachrichten.
    </v-card-title>
    <v-card-text>
      <v-sheet
        width="100%"
        :height="cardTextHeight"
        :max-height="cardTextHeight"
        class="overflow-y-auto"
      >
        <v-list density="compact">
          <v-list-item
            v-for="(infoMessage, index) in inactiveInfoMessages"
            :key="index"
          >
            <v-text-field
              class="mt-2"
              :model-value="computedDateFormattedForList(infoMessage)"
              label="Gültigkeitsbereich"
              prepend-inner-icon="mdi-calendar-range"
              readonly
            />
            <v-textarea
              v-model="infoMessage.content"
              label="Infonachricht"
              variant="outlined"
              density="compact"
              readonly
              rows="6"
              row-height="15"
            />
            <v-divider />
          </v-list-item>
        </v-list>
      </v-sheet>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type InfoMessageDTO from "@/domain/dto/InfoMessageDTO";

import { computed } from "vue";

import { useDateUtils } from "@/util/DateUtils";
import { useDaveUtils } from "@/util/DaveUtils";

interface Props {
  height: string;
}
const props = defineProps<Props>();

const inactiveInfoMessages = defineModel<Array<InfoMessageDTO>>({
  required: true,
});

const dateUtils = useDateUtils();
const daveUtils = useDaveUtils();

function infoMessageToDateArray(infoMessage: InfoMessageDTO): Array<string> {
  const dates: Array<string> = [];
  if (infoMessage.gueltigVon) {
    dates.push(infoMessage.gueltigVon.substring(0, 10));
  }
  if (infoMessage.gueltigBis) {
    dates.push(infoMessage.gueltigBis.substring(0, 10));
  }
  return dates;
}

function computedDateFormattedForList(infoMessage: InfoMessageDTO): string {
  const dates: Array<string> = infoMessageToDateArray(infoMessage);
  return createComputedDateFormatted(dates);
}

function createComputedDateFormatted(dates: Array<string>): string {
  if (dates.length === 0) {
    return "";
  }
  if (dates.length === 1) {
    return `von: ${dateUtils.formatDate(dates[0])}`;
  } else {
    dates = sortDates(dates);
    return `von: ${dateUtils.formatDate(
      dates[0]
    )}, bis: ${dateUtils.formatDate(dates[1])}`;
  }
}

// Wenn das zweite Datum vor dem ersten liegt, werden beide getauscht
// 'von' muss vor 'bis' liegen
function sortDates(dates: Array<string>): Array<string> {
  let sortedDates: Array<string> = dates;
  const date0: number = parseInt(sortedDates[0].replace(/-/g, ""));
  const date1: number = parseInt(sortedDates[1].replace(/-/g, ""));
  if (date0 > date1) {
    sortedDates = sortedDates.reverse();
  }
  return sortedDates;
}

// Von der Sheet-Height alles abziehen, was nicht die scrollable sein soll
const cardTextHeight = computed(() => {
  return (
    parseInt(props.height.replace("vh", "")) -
    daveUtils.cardtitleHeight.value +
    "vh"
  );
});
</script>
