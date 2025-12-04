<template>
  <v-card
    width="100%"
    :height="height"
    :max-height="height"
    variant="flat"
  >
    <!-- Eingabefeld -->
    <v-card-title> Anzuzeigende Info-Nachricht </v-card-title>
    <v-card-text>
      <v-sheet
        width="100%"
        :height="cardTextHeight"
        :max-height="cardTextHeight"
      >
        <v-card-text>
          <v-menu
            v-model="datepickerMenuModel"
            :close-on-content-click="false"
          >
            <template #activator="{ props }">
              <v-text-field
                v-bind="props"
                :model-value="bereich"
                prepend-inner-icon="mdi-calendar-range"
                readonly
              />
            </template>
            <v-card width="620">
              <v-card-text>
                <v-row style="justify-content: center">
                  <v-date-picker
                    v-model="datepickerModelVon"
                    width="300"
                    title="Datum 'von' auswählen"
                    border
                    show-adjacent-months
                    color="primary"
                    :max="datepickerModelBis"
                  >
                    <template #header />
                  </v-date-picker>
                  <v-date-picker
                    v-model="datepickerModelBis"
                    class="ml-3"
                    width="300"
                    title="Datum 'bis' auswählen"
                    border
                    show-adjacent-months
                    color="primary"
                    :min="datepickerModelVon"
                  >
                    <template #header />
                  </v-date-picker>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  text="OK"
                  color="secondary"
                  variant="elevated"
                  :disabled="disableMenuButton"
                  @click="saveDate"
                />
                <v-btn
                  text="Abbrechen"
                  color="tertiary"
                  variant="elevated"
                  @click="closeMenu"
                />
              </v-card-actions>
            </v-card>
          </v-menu>
          <v-textarea
            v-model="activeInfoMessage.content"
            label="Infonachricht"
            variant="outlined"
            density="compact"
            rows="10"
            row-height="15"
            counter="255"
            maxlength="255"
          />
        </v-card-text>
      </v-sheet>
    </v-card-text>
    <v-card-actions style="position: absolute; bottom: 0; right: 0">
      <v-spacer></v-spacer>
      <v-btn
        text="Speichern"
        color="secondary"
        variant="elevated"
        :disabled="disableSpeicherButton"
        @click="save"
      />
      <v-btn
        text="Deaktivieren"
        color="tertiary"
        variant="elevated"
        @click="deactivateInfoMessage"
      />
      <v-btn
        text="Abbrechen"
        color="tertiary"
        variant="elevated"
        @click="cancel"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type InfoMessageDTO from "@/types/config/InfoMessageDTO";

import { isEmpty, isNil } from "lodash";
import { computed, ref, watch } from "vue";

import { useDaveUtils } from "@/util/DaveUtils";

interface Props {
  height: string;
}
const properties = defineProps<Props>();

const emits = defineEmits<{
  (e: "save"): void;
  (e: "deactivate"): void;
  (e: "cancel"): void;
}>();

const daveUtils = useDaveUtils();

const datepickerMenuModel = ref(false);
const datepickerModelVon = ref<Date>();
const datepickerModelBis = ref<Date>();

const activeInfoMessage = defineModel<InfoMessageDTO>({
  required: true,
});

watch(
  () => activeInfoMessage.value,
  () => {
    if (activeInfoMessage.value.gueltigVon) {
      datepickerModelVon.value = new Date(activeInfoMessage.value.gueltigVon);
    }
    if (activeInfoMessage.value.gueltigBis) {
      datepickerModelBis.value = new Date(activeInfoMessage.value.gueltigBis);
    }
  },
  { immediate: true }
);

function closeMenu(): void {
  resetDatum();
  datepickerMenuModel.value = false;
}

function resetDatum(): void {
  datepickerModelVon.value = undefined;
  datepickerModelBis.value = undefined;
}

function saveDate(): void {
  if (datepickerModelVon.value && datepickerModelBis.value) {
    activeInfoMessage.value.gueltigVon = datepickerModelVon.value.toISOString();
    activeInfoMessage.value.gueltigBis = datepickerModelBis.value.toISOString();
    datepickerMenuModel.value = false;
  }
}

function cancel(): void {
  emits("cancel");
}

function save(): void {
  emits("save");
}

function deactivateInfoMessage(): void {
  emits("deactivate");
}

const disableSpeicherButton = computed(() => {
  return (
    isNil(activeInfoMessage.value.content) ||
    isEmpty(activeInfoMessage.value.content.trim()) ||
    isEmpty(activeInfoMessage.value.gueltigVon) ||
    isEmpty(activeInfoMessage.value.gueltigBis) ||
    datepickerMenuModel.value
  );
});

// Von der Sheet-Height alles abziehen, was nicht die scrollable sein soll
const cardTextHeight = computed(() => {
  return (
    parseInt(properties.height.replace("vh", "")) -
    daveUtils.cardtitleHeight.value +
    "vh"
  );
});

const bereich = computed(() => {
  let result = "";
  if (datepickerModelVon.value) {
    result = `von: ${datepickerModelVon.value.toLocaleDateString()}`;
  }
  if (datepickerModelBis.value) {
    result = `${result}, bis: ${datepickerModelBis.value.toLocaleDateString()}`;
  }
  return result;
});
const disableMenuButton = computed(() => {
  return !(datepickerModelVon.value && datepickerModelBis.value);
});
</script>
