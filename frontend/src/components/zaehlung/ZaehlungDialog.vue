<template>
  <v-dialog
    v-model="showDialogModel"
    persistent
    max-width="50%"
    height="800px"
  >
    <v-card
      width="100%"
      flat
    >
      <v-card-title>
        <v-icon
          end
          :icon="dialogicon"
        />
        {{ dialogtitle }}
      </v-card-title>

      <v-card-text>
        <zaehlung-form
          v-model="zaehlung"
          :zaehlstelle="zaehlstelle"
          @cancel="cancelCreate"
          @saved="saved"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { isEmpty } from "lodash";
import { computed, watch } from "vue";

import ZaehlungForm from "@/components/zaehlung/form/ZaehlungForm.vue";
import { useZaehlungStore } from "@/store/ZaehlungStore";

interface Props {
  showDialog: boolean;
  zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const showDialogModel = computed(() => {
  return props.showDialog;
});
const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "saved"): void;
}>();

const zaehlungStore = useZaehlungStore();

const editZaehlung = computed(() => {
  return !isEmpty(zaehlung.value.id);
});

const dialogicon = computed(() => {
  if (editZaehlung.value) {
    return "mdi-calendar-edit";
  } else {
    return "mdi-calendar-plus";
  }
});

const dialogtitle = computed(() => {
  if (editZaehlung.value) {
    return "Zählung bearbeiten";
  } else {
    return "Neue Zählung anlegen";
  }
});

watch(
  () => props.showDialog,
  () => {
    zaehlungStore.setResetformevent(!props.showDialog);
  }
);

function cancelCreate(): void {
  emits("cancel");
}

function saved(): void {
  emits("saved");
}
</script>
