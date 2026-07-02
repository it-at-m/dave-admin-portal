<template>
  <v-sheet
    class="dave-default overflow-y-auto"
    :height="contentHeight"
  >
    <zaehlstelle-overview />
    <messstelle-overview />
  </v-sheet>
</template>

<script setup lang="ts">
import { computed } from "vue";

import MessstelleOverview from "@/components/messstelle/MessstelleOverview.vue";
import ZaehlstelleOverview from "@/components/zaehlstelle/ZaehlstelleOverview.vue";
import { useDaveUtils } from "@/util/DaveUtils";

const daveUtils = useDaveUtils();

const contentHeight = computed(() => {
  const height = 100 - daveUtils.appBarHeight.value;
  return `${height}vh`;
});
</script>
