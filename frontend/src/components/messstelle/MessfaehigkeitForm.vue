<template>
  <v-sheet
    width="100%"
    :min-height="height"
    :max-height="height"
    class="overflow-y-auto"
  >
    <v-card elevation="0">
      <v-card-text>
        <v-form>
          <v-data-table
            density="compact"
            :headers="header as Array<any>"
            :items="messfahigkeiten"
            :items-per-page="-1"
            hide-default-footer
            fixed-header
            :item-class="activeMessfaehigkeit"
          />
        </v-form>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import type MessfaehigkeitEditDTO from "@/domain/dto/messstelle/MessfaehigkeitEditDTO";

import { isEmpty } from "lodash";
import { computed } from "vue";

interface Props {
  height: string;
  messfahigkeiten: Array<MessfaehigkeitEditDTO>;
}

defineProps<Props>();

function activeMessfaehigkeit(item: MessfaehigkeitEditDTO) {
  return isEmpty(item.gueltigBis) ? "indigo-lighten-5" : "";
}

const header = computed(() => {
  return [
    {
      title: "Fahrzeugklassen",
      align: "start",
      sortable: false,
      value: "fahrzeugklassen",
      divider: true,
    },
    {
      title: "Intervallwert",
      align: "start",
      sortable: false,
      value: "intervall",
      divider: true,
    },
    {
      title: "gültig ab",
      align: "start",
      sortable: false,
      value: "gueltigAb",
      divider: true,
    },
    {
      title: "gültig bis",
      align: "start",
      sortable: false,
      value: "gueltigBis",
    },
  ];
});
</script>
