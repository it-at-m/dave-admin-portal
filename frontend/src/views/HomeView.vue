<template>
  <v-main class="dave-default">
    <zaehlstelle-map
      height="100%"
      width="100%"
      :zoom="mapConfigStore.getMapConfig.zoom"
    />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import { useMapConfigStore } from "@/store/MapConfigStore";

const mapConfigStore = useMapConfigStore();

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>
