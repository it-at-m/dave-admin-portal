<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <v-row no-gutters>
        <div style="align-self: center">
          <v-avatar
            :color="statusDesign.color"
            size="x-large"
          >
            <v-icon
              size="xx-large"
              :icon="statusDesign.iconPath"
            />
          </v-avatar>
        </div>
        <div
          style="font-size: x-large; align-self: center"
          class="pl-5"
        >
          {{ header }}
        </div>
        <v-spacer />
      </v-row>
    </v-expansion-panel-title>
    <v-expansion-panel-text class="mt-1">
      <v-list>
        <v-list-item
          v-for="(zaehlung, index) in zaehlungen"
          :key="index"
          @click="openZaehlung(zaehlung)"
        >
          <v-list-item-title> {{ getItemTitle(zaehlung) }} </v-list-item-title>
          <v-list-item-subtitle>
            {{ getItemSubtitle(zaehlung) }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type OpenZaehlungDTO from "@/types/zaehlung/OpenZaehlungDTO";

import { useRouter } from "vue-router";

import IconOptions from "@/components/icons/IconOptions";
import { zaehlartText } from "@/types/enum/Zaehlart";
import { useDateUtils } from "@/util/DateUtils";

interface Props {
  header: string;
  statusDesign: IconOptions;
  zaehlungen: Array<OpenZaehlungDTO>;
}

defineProps<Props>();

const router = useRouter();
const dateUtils = useDateUtils();

function getItemTitle(zaehlung: OpenZaehlungDTO) {
  return `Zählung vom ${dateUtils.getShortVersionOfDate(zaehlung.datum)} an Zählstelle ${zaehlung.zaehlstellenNummer} in ${zaehlung.stadtbezirk}`;
}

function getItemSubtitle(zaehlung: OpenZaehlungDTO) {
  return `Projektnummer: ${zaehlung.projektNummer}, Projektname: ${
    zaehlung.projektName
  }, Zählart: ${zaehlartText.get(zaehlung.zaehlart)}`;
}

function openZaehlung(zaehlung: OpenZaehlungDTO): void {
  router.push(`/zaehlstelle/${zaehlung.zaehlstellenId}/${zaehlung.id}`);
}
</script>
