<template>
  <my-map
    width="100%"
    :height="height"
    :lat-lng-marker="coords"
    :zoom="18"
    :is-messstelle="true"
    :draggable="draggable"
    :reset-marker="resetMarker"
    :show-overlay-layers="false"
    @update-zaehlstellen-coords="updateZaehlstellenCoords"
  />
</template>

<script setup lang="ts">
import type MessstelleEditDTO from "@/types/messstelle/MessstelleEditDTO";

import { LatLng } from "leaflet";
import { computed } from "vue";

import MyMap from "@/components/map/MyMap.vue";
import { useEventbus } from "@/store/Eventbus";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

interface Props {
  height: string;
  draggable: boolean;
}

defineProps<Props>();
const messstelle = defineModel<MessstelleEditDTO>({
  required: true,
});

const eventbus = useEventbus();

const resetMarker = computed(() => {
  return eventbus.getReloadEvent;
});

const coords = computed(() => {
  const coords = DefaultObjectCreator.createCenterOfMunichLatLng();
  if (messstelle.value.latitude && messstelle.value.longitude) {
    return new LatLng(messstelle.value.latitude, messstelle.value.longitude);
  }
  return coords;
});

function updateZaehlstellenCoords(newCoords: LatLng): void {
  messstelle.value.latitude = newCoords.lat;
  messstelle.value.longitude = newCoords.lng;
}
</script>
