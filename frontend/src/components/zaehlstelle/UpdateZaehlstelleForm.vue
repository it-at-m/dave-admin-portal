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
        <v-form ref="form">
          <lhm-text-field
            caption="Zählstellennummer"
            :text="zaehlstelle.nummer"
          />
          <lhm-text-field
            caption="Stadtbezirk"
            :text="getStadtbezirkText"
            :disabled="isEmpty(stadtbezirkStore.getStadtbezirke)"
          />
          <lhm-text-field
            caption="Stadtbezirksviertel"
            :text="getStadtbezirksviertelText"
            add-extra-br
            :disabled="isEmpty(stadtbezirkStore.getStadtbezirksviertel)"
          />
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
          <v-combobox
            v-model="zaehlstelle.customSuchwoerter"
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
          <v-checkbox
            v-model="zaehlstelle.sichtbarDatenportal"
            color="quaternary"
            hide-details
          >
            <template #label>
              <v-icon
                class="mr-1"
                color="red-darken-1"
                icon="mdi-alert-outline"
              />
              <div>Sichtbarkeitsstatus Datenportal<br /></div>
            </template>
          </v-checkbox>

          <v-card-actions>
            <v-spacer />
            <v-btn
              class="mr-2"
              color="secondary"
              text="Speichern"
              variant="elevated"
              @click="save()"
            />
            <v-btn
              color="tertiary"
              text="Abbrechen"
              variant="elevated"
              @click="cancel()"
            />
          </v-card-actions>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <location-map
          width="100%"
          height="100%"
          :lat-lng-marker="coords"
          :zoom="18"
          @update-zaehlstellen-coords="updateZaehlstellenCoords"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import type { GeoPoint } from "@/api/client";
import type Zaehlstelle from "@/types/zaehlstelle/Zaehlstelle";

import { LatLng } from "leaflet";
import { isEmpty, isNil } from "lodash";
import { computed, ref } from "vue";

import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import LhmTextField from "@/components/common/LhmTextField.vue";
import LocationMap from "@/components/map/LocationMap.vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useStadtbezirkStore } from "@/store/StadtbezirkStore";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import StadtbezirksviertelUtils from "@/util/StadtbezirksviertelUtils";

const zaehlstelle = defineModel<Zaehlstelle>({
  required: true,
});

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "saved"): void;
}>();

const snackbarStore = useSnackbarStore();
const stadtbezirkStore = useStadtbezirkStore();

const newSuchwort = ref("");

const coords = computed(() => {
  const punkt: GeoPoint = zaehlstelle.value.punkt;
  if (punkt) return new LatLng(punkt.lat || 0, punkt.lon || 0);
  else return DefaultObjectCreator.createCenterOfMunichLatLng();
});

const getStadtbezirkText = computed(() => {
  if (!zaehlstelle.value.stadtbezirkNummer) return "Keine Angabe";
  const stadtbezirkName = stadtbezirkStore.getStadtbezirkName(
    zaehlstelle.value.stadtbezirkNummer
  );
  return !isNil(stadtbezirkName)
    ? `${zaehlstelle.value.stadtbezirkNummer} ${stadtbezirkName}`
    : zaehlstelle.value.stadtbezirkNummer.toString();
});

const getStadtbezirksviertelText = computed(() => {
  if (!zaehlstelle.value.stadtbezirkNummer) return "Keine Angabe";
  const stadtbezirksviertel = stadtbezirkStore.getStadtbezirksviertel.find(
    (viertel) =>
      viertel.stadtbezirkNummer === zaehlstelle.value.stadtbezirkNummer &&
      StadtbezirksviertelUtils.convertToSequentialNumber(viertel.nummer) ===
        getStadtbezirksviertelNummer.value
  );
  if (!stadtbezirksviertel)
    return "Das Stadtbezirksviertel konnte nicht ermittelt werden.";
  else
    return stadtbezirksviertel.name
      ? `${stadtbezirksviertel.nummer} ${stadtbezirksviertel.name}`
      : stadtbezirksviertel.nummer;
});

const getStadtbezirksviertelNummer = computed(() => {
  if (!isNil(zaehlstelle.value.nummer)) {
    if (zaehlstelle.value.nummer.length === 5) {
      return parseInt(zaehlstelle.value.nummer.substring(1, 3));
    } else if (zaehlstelle.value.nummer.length === 6) {
      return parseInt(zaehlstelle.value.nummer.substring(2, 4));
    }
  }
  return -1;
});

// Fuegt das eingegebene Wort den Suchwoertern hinzu
function addSuchwortToList() {
  if (isNil(zaehlstelle.value.customSuchwoerter)) {
    zaehlstelle.value.customSuchwoerter = [];
  }
  if (isNil(newSuchwort.value) || isEmpty(newSuchwort.value.trim())) {
    return;
  }
  if (!zaehlstelle.value.customSuchwoerter.includes(newSuchwort.value)) {
    zaehlstelle.value.customSuchwoerter.push(...newSuchwort.value.split(","));
  }
  newSuchwort.value = "";
}

function save(): void {
  ZaehlstellenService.saveZaehlstelle(zaehlstelle.value)
    .then(() => {
      emits("saved");
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function cancel(): void {
  emits("cancel");
}

function updateZaehlstellenCoords(newCoords: LatLng): void {
  if (!zaehlstelle.value.punkt) {
    zaehlstelle.value.punkt = {} as GeoPoint;
  }
  zaehlstelle.value.punkt.lat = newCoords.lat;
  zaehlstelle.value.punkt.lon = newCoords.lng;
}
</script>
