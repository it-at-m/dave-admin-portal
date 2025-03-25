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
        v-model="validZaehlung"
      >
        <v-row dense>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="zaehlung.projektNummer"
              label="Projektnummer"
              outlined
              dense
              @blur="updateStore"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="zaehlung.projektName"
              label="Projektname"
              outlined
              dense
              @blur="updateStore"
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
              outlined
              :items="zaehldauerDropDown"
              dense
              label="Zähldauer"
              :rules="[() => !!zaehlung.zaehldauer || PFLICHTFELD_TEXT]"
              required
              @blur="updateStore"
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="zaehlung.zaehlart"
              outlined
              :items="zaehlartenDropDown"
              dense
              label="Zählart"
              :rules="[() => !!zaehlung.zaehlart || PFLICHTFELD_TEXT]"
              required
              @blur="updateStore"
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-menu
              v-model="datepickerMenuModel"
              :close-on-content-click="false"
              :close-on-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="computedDateFormatted"
                  label="Datum"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="date"
                no-title
                locale="de"
                :first-day-of-week="1"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="primary"
                  @click="saveDate"
                >
                  OK
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="closeMenu"
                >
                  Abbrechen
                </v-btn>
              </v-date-picker>
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
              outlined
              :items="quelleDropDown"
              dense
              label="Quelle"
              @blur="updateStore"
            ></v-autocomplete>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-autocomplete
              v-model="zaehlung.zaehlIntervall"
              outlined
              :items="ZAEHLINTERVALLE_15"
              dense
              label="Zählintervall"
              @blur="updateStore"
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
              color="grey darken-1"
              hide-details
              dense
              @change="updateStore"
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
              outlined
              dense
              rows="2"
              row-height="10"
              counter="255"
              maxlength="255"
              @blur="updateStore"
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
              multiple
              label="Suchwörter"
              outlined
              dense
              small-chips
              deletable-chips
              class="tag-input"
              :search-input.sync="newSuchwort"
              append-icon="mdi-plus"
              @click:append="addSuchwortToList"
              @keyup.enter="addSuchwortToList"
              @blur="addSuchwortToListAndUpdateStore"
            >
            </v-combobox>
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
              outlined
              dense
              rows="2"
              row-height="10"
              counter="255"
              maxlength="255"
              @blur="updateStore"
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
              outlined
              dense
              rows="2"
              row-height="10"
              counter="255"
              maxlength="255"
              @blur="updateStore"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-sheet>
</template>

<script setup lang="ts">
import { cloneDeep, isEmpty, isNil } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import { quelleDropDown } from "@/domain/enums/Quelle";
import Status from "@/domain/enums/Status";
import { zaehlartenDropDown } from "@/domain/enums/Zaehlart";
import { zaehldauerDropDown } from "@/domain/enums/Zaehldauer";
import { useZaehlungStore } from "@/store/ZaehlungStore";
import { useDateUtils } from "@/util/DateUtils";

interface Props {
  height: string;
}
defineProps<Props>();

const emits = defineEmits<{
  (e: "isValid", payload: boolean): void;
}>();

const zaehlungStore = useZaehlungStore();
const dateUtils = useDateUtils();

const PFLICHTFELD_TEXT =
  "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
const ZAEHLINTERVALLE_15 = [{ text: "15 min", value: 15 }];

const newSuchwort = ref("");
const datepickerMenuModel = ref(false);
const validZaehlung = ref(false);
// Without Time
const date = ref(new Date().toISOString().substring(0, 10));
const zaehlung = ref({} as ZaehlungDTO);

onMounted(() => {
  validZaehlung.value = false;
  updateWorkingCopy();
});

watch(
  () => validZaehlung.value,
  () => {
    emits("isValid", validZaehlung.value);
  }
);

watch(
  () => zaehlungStore.getZaehlung,
  () => {
    updateWorkingCopy();
  }
);

const zaehlungOfStore = computed(() => {
  return zaehlungStore.getZaehlung;
});

const showZaehlsituation = computed(() => {
  const possibleStatus: Array<Status> = [
    Status.ACTIVE,
    Status.ACCOMPLISHED,
    Status.CORRECTION,
    Status.COUNTING,
  ];
  return possibleStatus.includes(zaehlungOfStore.value.status);
});

const computedDateFormatted = computed(() => {
  return dateUtils.formatDate(date.value);
});

function updateWorkingCopy(): void {
  zaehlung.value = cloneDeep(zaehlungOfStore.value);
  resetDatum();
}

function updateStore(): void {
  zaehlungStore.setZaehlung(cloneDeep(zaehlung.value));
}

// Fuegt das eingegebene Wort den Suchwoertern hinzu
function addSuchwortToList(): void {
  if (
    zaehlung.value.customSuchwoerter === undefined ||
    zaehlung.value.customSuchwoerter === null
  ) {
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

function addSuchwortToListAndUpdateStore(): void {
  addSuchwortToList();
  updateStore();
}

function saveDate(): void {
  datepickerMenuModel.value = false;
  zaehlung.value.datum = dateUtils.formatDateForBackend(date.value);
  updateStore();
}

function closeMenu(): void {
  datepickerMenuModel.value = false;
  resetDatum();
}

function resetDatum(): void {
  date.value = zaehlung.value.datum.substring(0, 10);
}
</script>
