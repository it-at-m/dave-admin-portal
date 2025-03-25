<template>
  <v-sheet
    height="100%"
    width="100%"
  >
    <zaehlstelle-map
      height="100%"
      width="100%"
      :zoom="12"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>
