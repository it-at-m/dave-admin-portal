<template>
  <v-main class="dave-default">
    <zaehlstelle-map
      height="100%"
      width="100%"
      :zoom="configurationStore.getMapConfiguration.zoom"
    />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import { useConfigrationStore } from "@/store/ConfigrationStore";

const configurationStore = useConfigrationStore();

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>
