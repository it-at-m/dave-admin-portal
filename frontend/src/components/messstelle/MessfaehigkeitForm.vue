<template>
  <v-data-table
    density="compact"
    :headers="header as Array<any>"
    :items="messfahigkeiten"
    :items-per-page="-1"
    hide-default-footer
    fixed-header
    :height="height"
    :row-props="(item: any) => rowClasses(item.item)"
  />
</template>

<script setup lang="ts">
import type MessfaehigkeitEditDTO from "@/domain/dto/messstelle/MessfaehigkeitEditDTO";

import { isEmpty } from "lodash";

interface Props {
  height: string;
}

defineProps<Props>();

const messfahigkeiten = defineModel<Array<MessfaehigkeitEditDTO>>({
  required: true,
});

function rowClasses(item: MessfaehigkeitEditDTO) {
  return isEmpty(item.gueltigBis) ? { class: "bg-indigo-lighten-5" } : {};
}

const header = [
  {
    title: "Fahrzeugklassen",
    align: "start",
    sortable: false,
    value: "fahrzeugklassen",
    lastFixed: true,
  },
  {
    title: "Intervallwert",
    align: "start",
    sortable: false,
    value: "intervall",
    lastFixed: true,
  },
  {
    title: "gültig ab",
    align: "start",
    sortable: false,
    value: "gueltigAb",
    lastFixed: true,
  },
  {
    title: "gültig bis",
    align: "start",
    sortable: false,
    value: "gueltigBis",
  },
];
</script>
