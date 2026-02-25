<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
    class="overflow-y-auto"
  >
    <v-card-text>
      <v-form
        ref="form"
        v-model="isValid"
      >
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="zaehlung.projektNummer"
              label="Projektnummer"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="zaehlung.projektName"
              label="Projektname"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-checkbox
              v-model="zaehlung.dauerzaehlung"
              label="Dauerzählung"
              color="quaternary"
              hide-details
            />
          </v-col>
          <v-spacer />
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="zaehlung.zaehldauer"
              :items="zaehldauerDropDown"
              label="Zähldauer"
              :rules="[() => !!zaehlung.zaehldauer || PFLICHTFELD_TEXT]"
              required
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="zaehlung.zaehlart"
              :items="zaehlartenDropDown"
              label="Zählart"
              :rules="[() => !!zaehlung.zaehlart || PFLICHTFELD_TEXT]"
              required
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-menu
              v-model="datepickerMenuModel"
              :close-on-content-click="false"
            >
              <template #activator="{ props }">
                <v-text-field
                  v-bind="props"
                  :model-value="formattedDate"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                />
              </template>
              <v-card>
                <v-card-text>
                  <v-row style="justify-content: center">
                    <v-date-picker
                      v-model="datepickerDate"
                      width="300"
                      hide-header
                      border
                      show-adjacent-months
                      color="primary"
                    />
                  </v-row>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn
                    text="OK"
                    color="secondary"
                    variant="elevated"
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
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="zaehlung.quelle"
              :items="quelleDropDown"
              label="Quelle"
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="zaehlung.zaehlIntervall"
              :items="ZAEHLINTERVALLE_15"
              label="Zählintervall"
            ></v-autocomplete>
          </v-col>
          <v-spacer />
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <v-checkbox
              v-model="zaehlung.sonderzaehlung"
              label="Sonderzählung"
              color="quaternary"
              hide-details
            />
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="12"
          >
            <v-textarea
              v-model="zaehlung.kommentar"
              label="Kommentar"
              variant="outlined"
              density="compact"
              rows="2"
              row-height="10"
              counter="255"
              maxlength="255"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col
            cols="12"
            md="12"
          >
            <v-combobox
              v-model="zaehlung.customSuchwoerter"
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
        <v-row
          v-if="showZaehlsituation"
          dense
        >
          <v-col
            cols="12"
            md="12"
          >
            <v-textarea
              v-model="zaehlung.zaehlsituation"
              label="Zählsituation"
              variant="outlined"
              density="compact"
              rows="2"
              row-height="10"
              counter="255"
              maxlength="255"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row
          v-if="showZaehlsituation"
          dense
        >
          <v-col
            cols="12"
            md="12"
          >
            <v-textarea
              v-model="zaehlung.zaehlsituationErweitert"
              label="erweiterte Zählsituation"
              variant="outlined"
              density="compact"
              rows="2"
              row-height="10"
              counter="255"
              maxlength="255"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-sheet>
</template>

<script setup lang="ts">
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { cloneDeep, isEmpty, isNil } from "lodash";
import { computed, onMounted, ref } from "vue";

import { quelleDropDown } from "@/types/enum/Quelle";
import Status from "@/types/enum/Status";
import { zaehlartenDropDown } from "@/types/enum/Zaehlart";
import { zaehldauerDropDown } from "@/types/enum/Zaehldauer";
import { useDateUtils } from "@/util/DateUtils";

interface Props {
  height: string;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>("zaehlung", {
  required: true,
});
const isValid = defineModel<boolean | null>("isValid", {
  required: true,
});

const dateUtils = useDateUtils();

const PFLICHTFELD_TEXT =
  "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
const ZAEHLINTERVALLE_15 = [{ title: "15 min", value: 15 }];

const newSuchwort = ref("");
const datepickerMenuModel = ref(false);
// Without Time
const datepickerModel = ref<Date>(new Date());

onMounted(() => {
  resetDatumToValueOfZaehlung();
});

const datepickerDate = computed({
  get() {
    return datepickerModel.value;
  },
  set(date: Date) {
    const dateToSet = cloneDeep(date);
    dateToSet.setHours(5);
    datepickerModel.value = dateToSet;
  },
});

const showZaehlsituation = computed(() => {
  const possibleStatus: Array<Status> = [
    Status.ACTIVE,
    Status.ACCOMPLISHED,
    Status.CORRECTION,
    Status.COUNTING,
  ];
  return possibleStatus.includes(zaehlung.value.status);
});

const formattedDate = computed(() => {
  return datepickerDate.value.toLocaleDateString();
});

// Fuegt das eingegebene Wort den Suchwoertern hinzu
function addSuchwortToList(): void {
  if (isNil(zaehlung.value.customSuchwoerter)) {
    zaehlung.value.customSuchwoerter = [];
  }

  if (isNil(newSuchwort.value) || isEmpty(newSuchwort.value.trim())) {
    return;
  }

  if (!zaehlung.value.customSuchwoerter.includes(newSuchwort.value)) {
    zaehlung.value.customSuchwoerter.push(...newSuchwort.value.split(","));
  }
  newSuchwort.value = "";
}

function saveDate(): void {
  datepickerMenuModel.value = false;
  zaehlung.value.datum = dateUtils.formatDateForBackend(datepickerDate.value);
}

function closeMenu(): void {
  datepickerMenuModel.value = false;
  resetDatumToValueOfZaehlung();
}

function resetDatumToValueOfZaehlung(): void {
  datepickerDate.value = dateUtils.getDatumOfString(zaehlung.value.datum);
}
</script>
