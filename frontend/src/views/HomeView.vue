<template>
  <v-main class="dave-default">
    <overview-map
      height="100%"
      width="100%"
      :zoom="configurationStore.getTenantConfiguration.mapConfiguration.zoom"
    />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import OverviewMap from "@/components/map/OverviewMap.vue";
import { useConfigurationStore } from "@/store/ConfigurationStore";

const configurationStore = useConfigurationStore();

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>
