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
          size="small"
          icon="mdi-map-marker-plus-outline"
        />
        {{ DIALOG_TITLE }}
      </v-card-title>

      <v-card-text>
        <create-zaehlstelle-form
          :coords="coords"
          @cancel="cancelCreate"
          @saved="saved"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type BackendIdDTO from "@/types/common/BackendIdDTO";

import { LatLng } from "leaflet";
import { computed } from "vue";

import CreateZaehlstelleForm from "@/components/zaehlstelle/CreateZaehlstelleForm.vue";

interface Props {
  showDialog: boolean;
  coords: LatLng;
}
const props = defineProps<Props>();

const showDialogModel = computed(() => {
  return props.showDialog;
});

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "saved", payload: BackendIdDTO): void;
}>();
const DIALOG_TITLE = "Neue Zählstelle anlegen";

function cancelCreate(): void {
  emits("cancel");
}

function saved(backendIdDTO: BackendIdDTO): void {
  emits("saved", backendIdDTO);
}
</script>
