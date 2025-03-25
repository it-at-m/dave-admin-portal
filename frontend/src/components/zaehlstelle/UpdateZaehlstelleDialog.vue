<template>
  <v-dialog
    v-model="showDialogModel"
    persistent
    max-width="900px"
  >
    <v-card
      width="900px"
      flat
    >
      <v-card-title>
        <v-icon left>mdi-map-marker-plus-outline</v-icon>
        {{ DIALOG_TITLE }}
      </v-card-title>

      <v-card-text>
        <update-zaehlstelle-form
          :zaehlstelle="zaehlstelle"
          @cancel="cancelCreate"
          @saved="saved"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";

interface Props {
  showDialog: boolean;
  zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();

const showDialogModel = computed(() => {
  return props.showDialog;
});

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "saved"): void;
}>();
const DIALOG_TITLE = "Zählstelle bearbeiten";

function cancelCreate(): void {
  emits("cancel");
}

function saved(): void {
  emits("saved");
}
</script>
