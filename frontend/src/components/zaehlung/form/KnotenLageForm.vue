<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
    class="overflow-y-auto"
  >
    <v-banner
      v-if="!isKnotenLageFormValid"
      lines="one"
      width="100%"
      text="Es müssen exakt 2 gegenüberliegende Knotenarme ausgewählt werden."
    >
      <template #prepend>
        <v-icon
          icon="mdi-alert-decagram-outline"
          size="36"
          color="error"
        />
      </template>
    </v-banner>
    <v-card-text>
      <v-row dense>
        <zaehlung-card-map
          height="200px"
          width="100%"
          :lat-lng-zaehlstelle="coordsZaehlstelle"
          :lat-lng-zaehlung="coordsZaehlung"
          :show-luftbild="false"
          :edit-zaehlung-marker="true"
          @update-zaehlung-coords="updateZaehlungCoords"
        />
      </v-row>
      <v-row dense>
        <v-col
          cols="12"
          md="4"
        >
          <v-checkbox
            v-model="zaehlung.kreisverkehr"
            label="Kreisverkehr"
            color="quaternary"
            hide-details
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="zaehlung.kreuzungsname"
            label="Kreuzungsname"
          />
        </v-col>
      </v-row>
      <v-row
        no-gutters
        dense
      >
        <v-col
          cols="12"
          md="7"
        >
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[0]"
              label="Straßenname Knotenarm 1"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-1"
              clearable
              @click:clear="updateModel(1, strassen[0])"
              @blur="updateModel(1, strassen[0])"
            />
          </v-row>
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[1]"
              label="Straßenname Knotenarm 2"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-2"
              clearable
              @click:clear="updateModel(2, strassen[1])"
              @blur="updateModel(2, strassen[1])"
            />
          </v-row>
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[2]"
              label="Straßenname Knotenarm 3"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-3"
              clearable
              @click:clear="updateModel(3, strassen[2])"
              @blur="updateModel(3, strassen[2])"
            />
          </v-row>
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[3]"
              label="Straßenname Knotenarm 4"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-4"
              clearable
              @click:clear="updateModel(4, strassen[3])"
              @blur="updateModel(4, strassen[3])"
            />
          </v-row>
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[4]"
              label="Straßenname Knotenarm 5"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-5"
              clearable
              @click:clear="updateModel(5, strassen[4])"
              @blur="updateModel(5, strassen[4])"
            />
          </v-row>
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[5]"
              label="Straßenname Knotenarm 6"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-6"
              clearable
              @click:clear="deleteKnotenarm(6)"
              @blur="updateModel(6, strassen[5])"
            />
          </v-row>
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[6]"
              label="Straßenname Knotenarm 7"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-7"
              clearable
              @click:clear="deleteKnotenarm(7)"
              @blur="updateModel(7, strassen[6])"
            />
          </v-row>
          <v-row
            no-gutters
            dense
          >
            <v-text-field
              v-model="strassen[7]"
              label="Straßenname Knotenarm 8"
              single-line
              variant="underlined"
              prepend-icon="mdi-numeric-8"
              clearable
              @click:clear="deleteKnotenarm(8)"
              @blur="updateModel(8, strassen[7])"
            />
          </v-row>
        </v-col>
        <v-spacer />
        <v-col
          cols="12"
          md="3"
          align-self="start"
        >
          <zaehlung-geometrie
            v-model="zaehlung.knotenarme"
            height="100%"
            width="100%"
            active-color="#1565C0"
            passive-color="#EEEEEE"
          />
        </v-col>
        <v-spacer />
      </v-row>
    </v-card-text>
  </v-sheet>
</template>

<script setup lang="ts">
import type GeoPoint from "@/types/common/GeoPoint";
import type ZaehlstelleDTO from "@/types/zaehlstelle/ZaehlstelleDTO";
import type KnotenarmDTO from "@/types/zaehlung/KnotenarmDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { LatLng } from "leaflet";
import { isEmpty, isNil } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import ZaehlungCardMap from "@/components/map/ZaehlungCardMap.vue";
import ZaehlungGeometrie from "@/components/zaehlung/ZaehlungGeometrie.vue";
import { useEventbus } from "@/store/Eventbus";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

interface Props {
  height: string;
  zaehlstelle: ZaehlstelleDTO;
  isKnotenLageFormValid: boolean;
}
const props = defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>("zaehlung", {
  required: true,
});

const strassen = ref<Array<string>>([]);

const eventbus = useEventbus();

onMounted(() => {
  resetForm();
});

watch(
  () => eventbus.getReloadEvent,
  () => {
    resetForm();
  }
);

function resetForm() {
  // Alle Straßennamen löschen
  strassen.value = ["", "", "", "", "", "", "", ""];

  // Straßennamen neu setzen, wenn vorhanden
  zaehlung.value.knotenarme.forEach((arm: KnotenarmDTO) => {
    strassen.value[arm.nummer - 1] = arm.strassenname;
  });
}

function updateModel(knotenarmnummer: number, strassenname: string) {
  if (isNil(strassenname) || isEmpty(strassenname.trim())) {
    // Knotenarm entfernen
    deleteKnotenarm(knotenarmnummer);
  } else {
    // Add or update
    let updated = false;
    zaehlung.value.knotenarme.forEach((arm: KnotenarmDTO) => {
      if (arm.nummer === knotenarmnummer) {
        arm.strassenname = strassenname;
        updated = true;
      }
    });
    if (!updated) {
      const knotenarm: KnotenarmDTO = {} as KnotenarmDTO;
      knotenarm.nummer = knotenarmnummer;
      knotenarm.strassenname = strassenname.trim();
      zaehlung.value.knotenarme.push(knotenarm);
    }
  }
}

function deleteKnotenarm(nummer: number) {
  let toDelete = -1;
  zaehlung.value.knotenarme.forEach(
    (knotenarm: KnotenarmDTO, index: number) => {
      if (knotenarm.nummer === nummer) {
        toDelete = index;
      }
    }
  );
  if (toDelete > -1) {
    zaehlung.value.knotenarme.splice(toDelete, 1);
  }
  deleteAllVerkehrsbeziehungenByKnotenarmnummer(nummer);
}

function deleteAllVerkehrsbeziehungenByKnotenarmnummer(nummer: number) {
  const filtered = zaehlung.value.verkehrsbeziehungen.filter(
    (verkehrsbeziehung) => {
      if (verkehrsbeziehung.knotenarm === nummer) {
      if (
        (zaehlung.value.kreisverkehr &&
          verkehrsbeziehung.knotenarm === nummer) ||
        verkehrsbeziehung.von === nummer ||
        verkehrsbeziehung.nach === nummer
      ) {
        verkehrsbeziehung.active = false;
      }
      return (
        (zaehlung.value.kreisverkehr &&
          verkehrsbeziehung.knotenarm !== nummer) ||
        (!zaehlung.value.kreisverkehr &&
          verkehrsbeziehung.von !== nummer &&
          verkehrsbeziehung.nach !== nummer)
      );
    }
  );

  zaehlung.value.verkehrsbeziehungen = [];
  zaehlung.value.verkehrsbeziehungen = [...filtered];
}

const coordsZaehlstelle = computed(() => {
  const punkt: GeoPoint = props.zaehlstelle.punkt;
  if (punkt) {
    return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
  } else {
    return DefaultObjectCreator.createCenterOfMunichLatLng();
  }
});

const coordsZaehlung = computed(() => {
  const punkt: GeoPoint = zaehlung.value.punkt;
  if (punkt) {
    return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
  } else {
    return coordsZaehlstelle.value;
  }
});

function updateZaehlungCoords(newCoords: LatLng): void {
  if (!zaehlung.value.punkt) {
    zaehlung.value.punkt = {} as GeoPoint;
  }
  zaehlung.value.punkt.lat = newCoords.lat.toString();
  zaehlung.value.punkt.lon = newCoords.lng.toString();
}
</script>
