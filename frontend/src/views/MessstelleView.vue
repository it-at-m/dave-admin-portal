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
          width="100%"
        />
      </v-col>
    </v-row>

    <v-row
      dense
      no-gutters
    >
      <v-sheet
        :height="contentHeightVh"
        width="100%"
      >
        <update-messstelle-form
          v-model="messstelle"
          :height="contentHeight"
          @reload="loadMessstelle"
        />
      </v-sheet>
    </v-row>
    <v-row no-gutters>
      <v-spacer />
    </v-row>
  </v-sheet>
</template>
<script setup lang="ts">
import type MessstelleEditDTO from "@/types/messstelle/MessstelleEditDTO";

import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import MessstelleService from "@/api/service/MessstelleService";
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import MessstelleInfo from "@/components/messstelle/MessstelleInfo.vue";
import UpdateMessstelleForm from "@/components/messstelle/UpdateMessstelleForm.vue";
import { useEventbus } from "@/store/Eventbus";
import { useDaveUtils } from "@/util/DaveUtils";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

const messstelle = ref<MessstelleEditDTO>(
  DefaultObjectCreator.createDefaultMessstelleEditDTO()
);
const route = useRoute();
const daveUtils = useDaveUtils();
const eventbus = useEventbus();

onMounted(() => {
  loadMessstelle();
});

/** Berechnet die Höhe der Karte*/
const headerHeight = computed(() => {
  return daveUtils.pxToVh(160);
});

const headerHeightVh = computed(() => {
  return `${headerHeight.value}vh`;
});

/**
 * Berechnet die Höhe der Fläche unter der Karte in "vh"
 */
const contentHeight = computed(() => {
  return (
    100 -
    daveUtils.appBarHeight.value -
    daveUtils.cardactionHeight.value -
    headerHeight.value
  );
});
const contentHeightVh = computed(() => {
  return `${contentHeight.value}vh`;
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
    eventbus.setReloadEvent();
  });
}
</script>
