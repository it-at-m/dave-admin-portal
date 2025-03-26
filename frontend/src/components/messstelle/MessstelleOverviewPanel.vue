<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <v-row no-gutters>
        <div style="align-self: center">
          <v-avatar
            :color="color"
            size="x-large"
          >
            <v-icon
              size="xx-large"
              :icon="icon"
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
          v-for="(messstelle, index) in messstellen"
          :key="index"
          @click="openMessstelle(messstelle)"
        >
          <v-list-item-title>
            {{ getItemTitle(messstelle) }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<script setup lang="ts">
import type MessstelleOverviewDTO from "@/domain/dto/messstelle/MessstelleOverviewDTO";

import { useRouter } from "vue-router";

interface Props {
  header: string;
  icon: string;
  color: string;
  messstellen: Array<MessstelleOverviewDTO>;
}

defineProps<Props>();
const router = useRouter();

function getItemTitle(messstelle: MessstelleOverviewDTO): string {
  return `${messstelle.mstId}, ${messstelle.name}, Stadtbezirk ${messstelle.stadtbezirkNummer}, ${messstelle.stadtbezirk}`;
}

function openMessstelle(messstelle: MessstelleOverviewDTO): void {
  router.push(`/messstelle/${messstelle.id}`);
}
</script>
