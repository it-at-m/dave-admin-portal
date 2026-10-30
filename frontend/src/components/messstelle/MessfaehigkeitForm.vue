<template>
  <v-data-table
    density="compact"
    :headers="header as Array<any>"
    :items="messfahigkeiten"
    :items-per-page="-1"
    hide-default-footer
    fixed-header
    :height="height"
  />
</template>

<script setup lang="ts">
import type MessfaehigkeitEdit from "@/types/messstelle/MessfaehigkeitEdit";

import { isNil } from "lodash";

import { FahrzeugklasseToBeschreibung } from "@/domain/enums/FahrzeugklasseText";
import { ZaehldatenIntervallToBeschreibung } from "@/domain/enums/ZaehldatenIntervallText";

interface Props {
  height: string;
}

defineProps<Props>();

const messfahigkeiten = defineModel<Array<MessfaehigkeitEdit>>({
  required: true,
});

function getDescriptionFahrzeugklasse(fahrzeugklasse: string | undefined) {
  return isNil(fahrzeugklasse)
    ? "Keine Fahrzeugklasse vorhanden"
    : FahrzeugklasseToBeschreibung.get(fahrzeugklasse);
}

function getDescriptionIntervall(intervall: string | undefined) {
  return isNil(intervall)
    ? "Keine Fahrzeugklasse vorhanden"
    : ZaehldatenIntervallToBeschreibung.get(intervall);
}

const header = [
  {
    title: "Fahrzeugklasse",
    align: "start",
    sortable: false,
    key: "fahrzeugklasse",
    value: (messfaehigkeit: MessfaehigkeitEdit) =>
      getDescriptionFahrzeugklasse(messfaehigkeit.fahrzeugklasse),
    lastFixed: true,
  },
  {
    title: "Intervallwert",
    align: "start",
    sortable: false,
    key: "intervall",
    value: (messfaehigkeit: MessfaehigkeitEdit) =>
      getDescriptionIntervall(messfaehigkeit.intervall),
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
