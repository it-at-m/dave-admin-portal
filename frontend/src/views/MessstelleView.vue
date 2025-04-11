<template>
  <v-sheet class="dave-default">
    <v-row no-gutters>
      <v-col cols="3">
        <v-sheet
          :min-height="headerHeightVh"
          width="100%"
          color="grey-lighten-3"
          class="d-flex flex-column"
        >
          <!-- Basisinformation zur Messstelle -->
          <messstelle-info
            v-model="messstelle"
            :height="headerHeightVh"
            :minheight="headerHeightVh"
          />
        </v-sheet>
      </v-col>
      <v-col cols="9">
        <zaehlstelle-map
          :z-id="messstelleId"
          :zoom="17"
          :latlng="latlng"
          :height="headerHeightVh"
          :minheight="headerHeightVh"
          :show-marker="true"
          :reload="reloadMessstelle"
          width="100%"
        />
      </v-col>
    </v-row>

    <v-row
      dense
      class="ma-2"
      no-gutters
    >
      <!--      <update-messstelle-form-->
      <!--        v-model="messstelle"-->
      <!--        :height="heightVh"-->
      <!--        :content-height="contentHeight"-->
      <!--        :reload="reloadMessstelle"-->
      <!--        @reload="loadMessstelle"-->
      <!--      />-->
    </v-row>
  </v-sheet>
</template>
<script setup lang="ts">
import type MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";

import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

import MessstelleService from "@/api/service/MessstelleService";
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import MessstelleInfo from "@/components/messstelle/MessstelleInfo.vue";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

const reloadMessstelle = ref(false);
const messstelle = ref<MessstelleEditDTO>(
  DefaultObjectCreator.createDefaultMessstelleEditDTO()
);
const route = useRoute();
const display = useDisplay();

onMounted(() => {
  loadMessstelle();
});

const headerHeight = computed(() => {
  return 160 / (display.height.value / 100);
});

const headerHeightVh = computed(() => {
  return `${headerHeight.value}vh`;
});

const appBarHeight = computed(() => {
  return 65 / (display.height.value / 100);
});

const marginContentHeight = computed(() => {
  return 16 / (display.height.value / 100);
});

/**
 * Berechnet die Höhe der Inhaltsfläche "vh" - ohne Karte
 */
const heightVh = computed(() => {
  return (
    100 -
    headerHeight.value -
    appBarHeight.value -
    marginContentHeight.value +
    "vh"
  );
});

/**
 * Berechnet die Höhe der Fläche unter den Tabs (72px hoch) in "vh"
 */
const contentHeight = computed(() => {
  return (
    100 -
    headerHeight.value -
    appBarHeight.value -
    72 / (display.height.value / 100)
  );
});

const messstelleId = computed(() => {
  const messstelleId = route.params.messstelleId as string;
  if (!messstelleId) {
    return "";
  }
  return messstelleId;
});

const latlng = computed(() => {
  if (
    messstelle.value.longitude == undefined ||
    messstelle.value.latitude == undefined
  ) {
    return [];
  } else {
    return [
      messstelle.value.latitude.toString(),
      messstelle.value.longitude.toString(),
    ];
  }
});

function loadMessstelle(): void {
  const messstelleId = route.params.messstelleId as string;
  MessstelleService.getMessstelleToEdit(messstelleId).then((messstelleById) => {
    messstelle.value = messstelleById;
    reloadMessstelle.value = !reloadMessstelle.value;
  });
}
</script>
