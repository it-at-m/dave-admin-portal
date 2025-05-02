<template>
  <v-main class="dave-default">
    <zaehlstelle-map
      height="100%"
      width="100%"
      :zoom="12"
    />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>
