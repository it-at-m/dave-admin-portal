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
import type MessfaehigkeitEditDTO from "@/types/messstelle/MessfaehigkeitEditDTO";

import { isNil } from "lodash";

import { FahrzeugklasseToBeschreibung } from "@/domain/enums/Fahrzeugklasse";
import { ZaehldatenIntervallToBeschreibung } from "@/domain/enums/ZaehldatenIntervall";

interface Props {
  height: string;
}

defineProps<Props>();

const messfahigkeiten = defineModel<Array<MessfaehigkeitEditDTO>>({
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
    value: (messfaehigkeit: MessfaehigkeitEditDTO) =>
      getDescriptionFahrzeugklasse(messfaehigkeit.fahrzeugklasse),
    lastFixed: true,
  },
  {
    title: "Intervallwert",
    align: "start",
    sortable: false,
    key: "intervall",
    value: (messfaehigkeit: MessfaehigkeitEditDTO) =>
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
