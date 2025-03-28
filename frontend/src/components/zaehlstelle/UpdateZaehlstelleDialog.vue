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
        <v-icon
          start
          icon="mdi-map-marker-plus-outline"
        />
        {{ DIALOG_TITLE }}
      </v-card-title>

      <v-card-text>
        <update-zaehlstelle-form
          v-model="zaehlstelle"
          @cancel="cancelCreate"
          @saved="saved"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";

import { computed } from "vue";

import UpdateZaehlstelleForm from "@/components/zaehlstelle/UpdateZaehlstelleForm.vue";

interface Props {
  showDialog: boolean;
}
const props = defineProps<Props>();

const zaehlstelle = defineModel<ZaehlstelleDTO>({
  required: true,
});

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
