<template>
  <v-dialog
    v-model="showDialogModel"
    persistent
    max-width="50%"
    height="800px"
  >
    <v-card
      width="100%"
      variant="flat"
    >
      <v-card-title>
        <v-icon
          end
          :icon="dialogicon"
        />
        {{ dialogtitle }}
      </v-card-title>

      <v-card-text class="py-0">
        <zaehlung-form
          v-model:zaehlung="zaehlung"
          v-model:is-valid="isValid"
          :zaehlstelle="zaehlstelle"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          text="Speichern"
          variant="elevated"
          :disabled="!isValid"
          @click="save()"
        />
        <v-btn
          color="tertiary"
          variant="elevated"
          text="Abbrechen"
          @click="cancel()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { isEmpty } from "lodash";
import { computed, ref, watch } from "vue";

import ZaehlungService from "@/api/service/ZaehlungService";
import ZaehlungForm from "@/components/zaehlung/form/ZaehlungForm.vue";
import { useEventbus } from "@/store/Eventbus";
import { useSnackbarStore } from "@/store/SnackbarStore";

interface Props {
  showDialog: boolean;
  zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const isValid = ref(false);
// function setAllgemeineFormValid(isPartValid: boolean) {
//   isValid.value = isPartValid;
// }

const showDialogModel = computed(() => {
  return props.showDialog;
});
const emits = defineEmits<{
  (e: "close-dialog"): void;
  (e: "saved"): void;
}>();

const snackbarStore = useSnackbarStore();
const eventbus = useEventbus();

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
    eventbus.setReloadEvent();
  }
);

function save(): void {
  ZaehlungService.saveZaehlung(zaehlung.value, props.zaehlstelle.id)
    .then(() => {
      snackbarStore.showSuccess(`Die Zählung wurde erfolgreich gespeichert.`);
      emits("saved");
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      eventbus.setReloadEvent();
    });
}

function cancel(): void {
  eventbus.setReloadEvent();
  emits("close-dialog");
}
</script>
