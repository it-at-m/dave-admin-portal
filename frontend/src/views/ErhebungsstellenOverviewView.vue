<template>
  <v-sheet class="dave-default">
    <zaehlstelle-overview />
    <messstelle-overview />
  </v-sheet>
</template>

<script setup lang="ts">
import MessstelleOverview from "@/components/messstelle/MessstelleOverview.vue";
import ZaehlstelleOverview from "@/components/zaehlstelle/ZaehlstelleOverview.vue";
</script>
