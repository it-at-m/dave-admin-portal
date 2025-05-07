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
            :text="getStadtbezirksnummer"
          />
          <lhm-text-field
            caption="Stadtbezirksviertel"
            :text="getStadtbezirksviertel"
            add-extra-br
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
import type GeoPoint from "@/types/common/GeoPoint";
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";

import { LatLng } from "leaflet";
import { isEmpty, isNil } from "lodash";
import { computed, ref } from "vue";

import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import LhmTextField from "@/components/common/LhmTextField.vue";
import MiniMap from "@/components/map/MiniMap.vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { StadtbezirkToBeschreibung } from "@/types/enum/Stadtbezirk";
import { StadtbezirksviertelToBeschreibung } from "@/types/enum/Stadtbezirksviertel";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

const zaehlstelle = defineModel<ZaehlstelleDTO>({
  required: true,
});

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "saved"): void;
}>();

const snackbarStore = useSnackbarStore();

const newSuchwort = ref("");

const coords = computed(() => {
  const punkt: GeoPoint = zaehlstelle.value.punkt;
  if (punkt) return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
  else return DefaultObjectCreator.createCenterOfMunichLatLng();
});

const getStadtbezirksnummer = computed(() => {
  const stadtbezirksnummer: string | undefined = StadtbezirkToBeschreibung.get(
    zaehlstelle.value.stadtbezirkNummer
  );
  if (!isNil(stadtbezirksnummer)) {
    return stadtbezirksnummer;
  }
  return "Der Stadtbezirk konnte nicht ermittelt werden.";
});

const getStadtbezirksviertel = computed(() => {
  const stadtbezirksviertelMap: Map<number, string> | undefined =
    StadtbezirksviertelToBeschreibung.get(zaehlstelle.value.stadtbezirkNummer);
  if (!isNil(stadtbezirksviertelMap)) {
    const stadtbezirksviertelnummer: string | undefined =
      stadtbezirksviertelMap.get(getStadtbezirksviertelNummer.value);
    if (!isNil(stadtbezirksviertelnummer)) {
      return stadtbezirksviertelnummer;
    }
  }
  return "Das Stadtbezirksviertel konnte nicht ermittelt werden.";
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
  zaehlstelle.value.punkt.lat = newCoords.lat.toString();
  zaehlstelle.value.punkt.lon = newCoords.lng.toString();
}
</script>
