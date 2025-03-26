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
              md="6"
            >
              <div>
                <span class="text-caption">Zählstellennummer</span><br />
                <span class="text text-info">{{ zaehlstellenummer }}</span
                ><br /><br />
              </div>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col
              cols="12"
              md="12"
            >
              <v-autocomplete
                v-model="zaehlstelle.stadtbezirkNummer"
                outlined
                :items="getStadtbezirke"
                dense
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
                v-model="stadtbezirksviertelKeyVal"
                outlined
                :items="getStadtbezirksviertel"
                dense
                label="Stadtbezirksviertel"
                :rules="[() => !!stadtbezirksviertelModel || pflichtfeldText]"
                required
                :disabled="!zaehlstelle.stadtbezirkNummer"
                return-object
              ></v-autocomplete>
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
                outlined
                dense
                rows="2"
                row-height="15"
                counter="255"
                maxlength="255"
              ></v-textarea>
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
                outlined
                dense
                small-chips
                deletable-chips
                class="tag-input"
                append-icon="mdi-plus"
                @click:append="addSuchwortToList"
                @blur="addSuchwortToList"
                @keyup.enter="addSuchwortToList"
              >
              </v-combobox>
            </v-col>
          </v-row>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="secondary"
              @click="save()"
              >Speichern
            </v-btn>
            <v-btn
              color="grey lighten-1"
              @click="cancel()"
              >Abbrechen
            </v-btn>
          </v-card-actions>
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
import type BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import type NextZaehlstellennummerDTO from "@/domain/dto/laden/NextZaehlstellennummerDTO";
import type GeoPoint from "@/domain/GeoPoint";
import type KeyVal from "@/domain/KeyVal";

import { LatLng } from "leaflet";
import { isEmpty, isNil } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import MiniMap from "@/components/map/MiniMap.vue";
import { stadtbezirke } from "@/domain/enums/Stadtbezirk";
import { stadtbezirksviertel } from "@/domain/enums/Stadtbezirksviertel";
import { useSnackbarStore } from "@/store/SnackbarStore";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

const snackbarStore = useSnackbarStore();
const validZaehlstelle = ref(false);

const zaehlstelle = ref(DefaultObjectCreator.createDefaultZaehlstelleDTO());

const stadtbezirksviertelModel = ref("");
const laufendeNummer = ref("");

const newSuchwort = ref("");

const stadtbezirksviertelKeyVal = ref({} as KeyVal);

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
  return stadtbezirke;
});

const getStadtbezirksviertel = computed(() => {
  return stadtbezirksviertel(
    zaehlstelle.value.stadtbezirkNummer
      ? zaehlstelle.value.stadtbezirkNummer.toString()
      : ""
  );
});

const zaehlstellenummer = computed(() => {
  return laufendeNummer.value;
});

const pflichtfeldText = computed(() => {
  return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
});

watch(
  () => zaehlstelle.value.stadtbezirkNummer,
  () => {
    stadtbezirksviertelModel.value = "";
    stadtbezirksviertelKeyVal.value = {} as KeyVal;
  }
);

watch(stadtbezirksviertelKeyVal, (stadtbezirksviertelNew: KeyVal) => {
  if (stadtbezirksviertelNew && stadtbezirksviertelNew.value) {
    stadtbezirksviertelModel.value = stadtbezirksviertelNew.value;
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
});

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
  stadtbezirksviertelModel.value = "";
  stadtbezirksviertelKeyVal.value = {} as KeyVal;
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

<style scoped>
.text-info {
  font-size: 18px;
  color: black;
}
</style>
