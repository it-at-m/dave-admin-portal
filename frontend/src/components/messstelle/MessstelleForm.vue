<template>
  <v-sheet
    width="100%"
    :min-height="height"
    :max-height="height"
    class="overflow-y-auto"
  >
    <v-card elevation="0">
      <v-card-text>
        <v-form v-model="isFormValid">
          <v-row dense>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                caption="ID Messstelle"
                :text="messstelle.mstId"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="messstelle.name"
                caption="Bezeichnung"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="messstelle.detektierteVerkehrsarten"
                caption="Detektierte Fahrzeuge"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="stadtbezirk"
                caption="Stadtbezirk"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="aufbaudatum"
                caption="Aufbau"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="abbaudatum"
                caption="Abbau"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="messstelleStatusText.get(messstelle.status)"
                caption="Status"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="messstelle.hersteller"
                caption="Hersteller"
              />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <lhm-text-field
                :text="messstelle.fahrzeugKlassen"
                caption="FZ-Klassen"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              md="12"
            >
              <v-checkbox
                v-model="messstelle.sichtbarDatenportal"
                color="grey-darken-1"
                hide-details
                class="mb-5"
                :disabled="disabled"
              >
                <template #label>
                  <v-icon
                    class="mr-1"
                    color="red darken-1"
                  >
                    mdi-alert-outline
                  </v-icon>
                  <div>Sichtbarkeitsstatus Datenportal<br /></div>
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              md="12"
            >
              <v-textarea
                v-model="messstelle.standort"
                label="Standort MS"
                :disabled="disabled"
                variant="outlined"
                density="compact"
                :rules="[validationUtils.pflichtfeld]"
                rows="2"
                row-height="10"
                counter="60"
                maxlength="60"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              md="12"
            >
              <v-textarea
                v-model="messstelle.bemerkung"
                label="Bemerkung"
                variant="outlined"
                disabled
                density="compact"
                rows="1"
                row-height="10"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              md="12"
            >
              <v-combobox
                v-model="messstelle.customSuchwoerter"
                v-model:search-input="newSuchwort"
                multiple
                label="Suchwörter"
                variant="outlined"
                density="compact"
                chips
                closable-chips
                class="tag-input"
                append-icon="mdi-plus"
                @click:append="addSuchwortToList"
                @keyup.enter="addSuchwortToList"
                @blur="addSuchwortToList"
              />
            </v-col>
          </v-row>
          <v-row dense>
            <v-col
              cols="12"
              md="12"
            >
              <v-textarea
                v-model="messstelle.kommentar"
                label="Kommentar"
                :disabled="disabled"
                variant="outlined"
                density="compact"
                rows="2"
                row-height="10"
                counter="255"
                maxlength="255"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script setup lang="ts">
import type MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";

import { isEmpty, isNil } from "lodash";
import { computed, ref } from "vue";

import LhmTextField from "@/components/common/LhmTextField.vue";
import { messstelleStatusText } from "@/domain/enums/MessstelleStatus";
import { useDateUtils } from "@/util/DateUtils";
import { useValidationUtils } from "@/util/validationUtils";

const validationUtils = useValidationUtils();
const dateUtils = useDateUtils();

const newSuchwort = ref("");

interface Props {
  height: string;
  disabled: boolean;
  valid: boolean;
}

const props = defineProps<Props>();
const messstelle = defineModel<MessstelleEditDTO>({
  required: true,
});

const emits = defineEmits<{
  (e: "update:valid", v: boolean): void;
}>();

const isFormValid = computed({
  get: () => props.valid,
  set: (v) => emits("update:valid", v),
});

const stadtbezirk = computed(() => {
  return `${messstelle.value.stadtbezirkNummer} - ${messstelle.value.stadtbezirk}`;
});

const aufbaudatum = computed(() => {
  return dateUtils.formatDate(messstelle.value.realisierungsdatum);
});

const abbaudatum = computed(() => {
  return dateUtils.formatDate(messstelle.value.abbaudatum);
});

function addSuchwortToList(): void {
  if (isNil(messstelle.value.customSuchwoerter)) {
    messstelle.value.customSuchwoerter = [];
  }

  if (isNil(newSuchwort.value) || isEmpty(newSuchwort.value.trim())) {
    return;
  }

  if (!messstelle.value.customSuchwoerter.includes(newSuchwort.value)) {
    messstelle.value.customSuchwoerter.push(...newSuchwort.value.split(","));
  }
  newSuchwort.value = "";
}
</script>
