<template>
  <v-sheet
    width="100%"
    class="d-flex flex-column"
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-form
          ref="form"
          v-model="validZaehlstelle"
        >
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
            >
              <lhm-text-field
                v-if="
                  configurationStore.getZaehlstelleConfiguration
                    .automaticNumberAssignment
                "
                caption="Zählstellennummer"
                :text="zaehlstellenummer"
                add-extra-br
              />
              <v-text-field
                v-else
                v-model="zaehlstelle.nummer"
                label="Zählstellennummer"
                variant="outlined"
                density="compact"
                :rules="[
                  validationUtils.pflichtfeld,
                  validationUtils.mustBePositivNumber,
                ]"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
            >
              <v-autocomplete
                v-model="zaehlstelle.stadtbezirkNummer"
                :items="getStadtbezirke"
                variant="outlined"
                density="compact"
                label="Stadtbezirk"
                :rules="[
                  () => !!zaehlstelle.stadtbezirkNummer || pflichtfeldText,
                ]"
                required
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
            >
              <v-autocomplete
                v-model="stadtbezirksviertelModel"
                variant="outlined"
                :items="getStadtbezirksviertel"
                density="compact"
                label="Stadtbezirksviertel"
                :rules="[() => !!stadtbezirksviertelModel || pflichtfeldText]"
                required
                :disabled="!zaehlstelle.stadtbezirkNummer"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
            >
              <v-textarea
                v-model="zaehlstelle.kommentar"
                label="Kommentar"
                variant="outlined"
                density="compact"
                rows="2"
                row-height="15"
                counter="255"
                maxlength="255"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
            >
              <v-combobox
                v-model="suchwoerter"
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
                @blur="addSuchwortToList"
                @keyup.enter="addSuchwortToList"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-spacer />
            <v-btn
              class="mr-2"
              color="secondary"
              text="Speichern"
              variant="elevated"
              :disabled="!isZaehlstellePersistable"
              @click="save()"
            />
            <v-btn
              color="tertiary"
              text="Abbrechen"
              variant="elevated"
              @click="cancel()"
            />
          </v-row>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <mini-map
          :coords="coords"
          height="100%"
          width="100%"
          @update-zaehlstellen-coords="updateZaehlstellenCoords"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import type BackendIdDTO from "@/types/common/BackendIdDTO";
import type GeoPoint from "@/types/common/GeoPoint";
import type NextZaehlstellennummerDTO from "@/types/zaehlstelle/NextZaehlstellennummerDTO";

import { LatLng } from "leaflet";
import { isEmpty, isEqual, isNil } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import LhmTextField from "@/components/common/LhmTextField.vue";
import MiniMap from "@/components/map/MiniMap.vue";
import { useConfigurationStore } from "@/store/ConfigurationStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useCityInformationStore } from "@/store/CityInformationStore";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import { useValidationUtils } from "@/util/ValidationUtils";

const snackbarStore = useSnackbarStore();
const configurationStore = useConfigurationStore();
const cityInformationStore = useCityInformationStore();
const validationUtils = useValidationUtils();
const validZaehlstelle = ref(false);

const zaehlstelle = ref(DefaultObjectCreator.createDefaultZaehlstelleDTO());

const stadtbezirksviertelModel = ref<string | undefined>(undefined);
const laufendeNummer = ref("");

const newSuchwort = ref("");

const suchwoerter = ref<Array<string>>([]);

interface Props {
  coords: LatLng;
}
const props = withDefaults(defineProps<Props>(), {
  coords: () => DefaultObjectCreator.createCenterOfMunichLatLng(),
});

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "saved", payload: BackendIdDTO): void;
}>();

onMounted(() => {
  zaehlstelle.value = DefaultObjectCreator.createDefaultZaehlstelleDTO();
  validZaehlstelle.value = false;
});

const getStadtbezirke = computed(() => {
  return cityInformationStore.stadtbezirke2;
});

const getStadtbezirksviertel = computed(() => {
  return cityInformationStore.getStadtbezirksviertel(zaehlstelle.value.stadtbezirkNummer);
});

const zaehlstellenummer = computed(() => {
  return laufendeNummer.value;
});

const pflichtfeldText = computed(() => {
  return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
});

const isZaehlstellePersistable = computed(() => {
  return (
    !isEmpty(zaehlstelle.value.nummer) &&
    !isEmpty(stadtbezirksviertelModel.value) &&
    !isEmpty(zaehlstelle.value.stadtbezirkNummer)
  );
});

watch(
  () => zaehlstelle.value.stadtbezirkNummer,
  () => {
    stadtbezirksviertelModel.value = undefined;
    if (
      configurationStore.getZaehlstelleConfiguration.automaticNumberAssignment
    ) {
      zaehlstelle.value.nummer = "";
    }
  }
);

watch(
  () => stadtbezirksviertelModel.value,
  (newViertel, oldViertel) => {
    if (
      configurationStore.getZaehlstelleConfiguration
        .automaticNumberAssignment &&
      !isEqual(newViertel, oldViertel)
    ) {
      zaehlstelle.value.nummer = "";
      if (!isEmpty(newViertel)) {
        setNextZaehlstellennummerToZaehlstelleWhenBezirkAndViertelIsSet();
      }
    }
  }
);

function setNextZaehlstellennummerToZaehlstelleWhenBezirkAndViertelIsSet(): void {
  if (
    !isNil(zaehlstelle.value.stadtbezirkNummer) &&
    !isEmpty(stadtbezirksviertelModel.value)
  ) {
    const idStartsWith = `${zaehlstelle.value.stadtbezirkNummer}${stadtbezirksviertelModel.value}`;
    ZaehlstellenService.getNextZaehlstellennummer(
      idStartsWith,
      zaehlstelle.value.stadtbezirkNummer
    )
      .then((result: NextZaehlstellennummerDTO) => {
        zaehlstelle.value.nummer = result.nummer;
        laufendeNummer.value = result.nummer;
      })
      .catch((error) => snackbarStore.showApiError(error));
  }
}

// Fuegt das eingegebene Wort den Suchwoertern hinzu
function addSuchwortToList() {
  if (isNil(newSuchwort.value) || isEmpty(newSuchwort.value.trim())) {
    return;
  }
  if (!suchwoerter.value.includes(newSuchwort.value)) {
    suchwoerter.value.push(...newSuchwort.value.split(","));
  }
  newSuchwort.value = "";
}

function save(): void {
  if (validZaehlstelle.value) {
    zaehlstelle.value.lat = props.coords.lat;
    zaehlstelle.value.lng = props.coords.lng;
    zaehlstelle.value.customSuchwoerter = suchwoerter.value;
    zaehlstelle.value.sichtbarDatenportal = true;
    ZaehlstellenService.saveZaehlstelle(zaehlstelle.value)
      .then((backendIdDTO) => {
        resetZaehlstelle();
        emits("saved", backendIdDTO);
      })
      .catch((error) => snackbarStore.showApiError(error));
  } else {
    // Fehler Toast, dass kein Marker vorhanden
    snackbarStore.showWarning("Es wurde nicht alle Pflichtfelder ausgefüllt.");
  }
}

function cancel(): void {
  resetZaehlstelle();
  emits("cancel");
}

function resetZaehlstelle() {
  zaehlstelle.value = DefaultObjectCreator.createDefaultZaehlstelleDTO();
  stadtbezirksviertelModel.value = undefined;
  laufendeNummer.value = "";
  suchwoerter.value = [];
  newSuchwort.value = "";
  validZaehlstelle.value = false;
}

function updateZaehlstellenCoords(newCoords: LatLng): void {
  if (!zaehlstelle.value.punkt) {
    zaehlstelle.value.punkt = {} as GeoPoint;
  }
  zaehlstelle.value.punkt.lat = newCoords.lat.toString();
  zaehlstelle.value.punkt.lon = newCoords.lng.toString();
}
</script>
