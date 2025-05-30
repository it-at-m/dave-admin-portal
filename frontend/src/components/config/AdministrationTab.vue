<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
    class="overflow-y-auto overflow-x-hidden"
  >
    <v-row dense>
      <v-col cols="3">
        <reload-auffaelligkeiten-card :max-width="MAX_CARD_WIDTH" />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import ReloadAuffaelligkeitenCard from "@/components/administration/ReloadAuffaelligkeitenCard.vue";

interface Props {
  height: string;
}
defineProps<Props>();

const MAX_CARD_WIDTH = "374";
</script>
