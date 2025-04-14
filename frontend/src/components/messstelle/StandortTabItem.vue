<template>
  <mini-map
    :coords="coords"
    :height="height"
    width="100%"
    :is-messstelle="true"
    :show-attribution="true"
    :reset-marker="resetMarker"
    :draggable="draggable"
    @update-zaehlstellen-coords="updateZaehlstellenCoords"
  />
</template>

<script setup lang="ts">
import type MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";

import { LatLng } from "leaflet";
import { computed } from "vue";

import MiniMap from "@/components/map/MiniMap.vue";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

interface Props {
  height: string;
  resetMarker: boolean;
  draggable: boolean;
}

defineProps<Props>();
const messstelle = defineModel<MessstelleEditDTO>({
  required: true,
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
