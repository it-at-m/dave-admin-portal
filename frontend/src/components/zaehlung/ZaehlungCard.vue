<template>
  <v-card
    :loading="loading"
    class="mx-auto my-12"
    max-width="374"
  >
    <template #loader>
      <v-progress-linear
        color="deep-purple"
        height="10"
        indeterminate
      ></v-progress-linear>
    </template>

    <zaehlung-card-map
      :lat-lng-zaehlstelle="coordsZaehlstelle"
      :lat-lng-zaehlung="coordsZaehlung"
      :show-luftbild="true"
    />

    <v-btn
      v-tooltip:bottom="statusDesign.tooltip"
      :color="statusDesign.color"
      :icon="statusDesign.iconPath"
      :size="56"
      elevation="6"
      location="top start"
      position="absolute"
      class="ml-2 mt-2"
      style="z-index: 400; cursor: default"
    />

    <div
      :style="{ cursor: 'pointer' }"
      @click="openZaehlungDialog"
    >
      <v-row>
        <v-col
          cols="12"
          md="8"
        >
          <v-card-title>{{ zaehlung.projektName }}</v-card-title>
          <v-card-subtitle>{{ datum }}</v-card-subtitle>
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <v-card-title>
            <zaehlung-geometrie
              v-model="zaehlung.knotenarme"
              height="60"
              width="60"
              active-color="#1565C0"
              passive-color="#EEEEEE"
            />
          </v-card-title>
        </v-col>
      </v-row>

      <v-card-text>
        <v-row
          align="center"
          class="mx-0 mt-2"
          no-gutters
        >
          <v-spacer />
          <v-col
            cols="12"
            md="1"
          >
            <zaehlart-icon
              :zaehlart="zaehlung.zaehlart"
              :color="ICON_COLOR"
            ></zaehlart-icon>
          </v-col>
          <v-spacer />
          <v-col
            cols="12"
            md="1"
          >
            <wetter-icon
              :wetter="zaehlung.wetter"
              :color="ICON_COLOR"
            ></wetter-icon>
          </v-col>
          <v-spacer />
          <v-col
            cols="12"
            md="1"
          >
            <zaehldauer-icon
              :zaehldauer="zaehlung.zaehldauer"
              :color="ICON_COLOR"
            ></zaehldauer-icon>
          </v-col>
          <v-spacer />
          <v-col
            cols="12"
            md="1"
          >
            <quelle-icon
              :quelle="zaehlung.quelle"
              :color="ICON_COLOR"
            ></quelle-icon>
          </v-col>
          <v-spacer />
        </v-row>

        <v-row
          align="center"
          class="mx-0 mt-2"
          no-gutters
        >
          <v-col md="12">
            <v-data-table
              density="compact"
              :headers="streetsHeader as Array<any>"
              :items="streets"
              item-key="nummer"
              :items-per-page="-1"
              hide-default-footer
              fixed-header
            />
          </v-col>
        </v-row>
      </v-card-text>
    </div>

    <v-card-actions>
      <v-btn
        v-if="showButtonFreigeben"
        class="ml-2 mr-2"
        color="secondary"
        variant="elevated"
        text="Freigeben"
        @click="zaehlungFreigeben"
      />
      <v-btn
        v-if="showButtonKorrektur"
        class="ml-2 mr-2"
        color="secondary"
        variant="elevated"
        text="Korrigieren"
        @click="zaehlungKorrigieren"
      />
      <v-btn
        v-if="showButtonBeauftragen"
        class="ml-2 mr-2"
        color="secondary"
        variant="elevated"
        text="Beauftragen"
        @click="openDienstleisterDialog(true)"
      />
      <v-spacer />

      <v-btn
        v-tooltip:bottom="'Chat'"
        class="ml-2 mr-2"
        icon
        color="secondary"
        @click="openChatDialog"
      >
        <v-badge
          v-if="unreadMessagesMobilitaetsreferat"
          dot
          color="red"
        >
          <v-icon>mdi-tooltip-account</v-icon>
        </v-badge>
        <v-icon v-else>mdi-tooltip-account</v-icon>
      </v-btn>

      <v-menu location="right bottom">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-dots-vertical"
            color="black"
          />
        </template>
        <v-list density="compact">
          <v-list-item density="compact">
            <v-btn
              v-tooltip:end="'Löschen'"
              class="ml-2 mr-2"
              icon="mdi-delete"
              variant="text"
              color="secondary"
              @click="zaehlungLoeschen"
            />
          </v-list-item>
          <v-list-item
            v-if="showButtonDienstleisterKorrigieren"
            density="compact"
          >
            <v-btn
              v-tooltip:end="'Dienstleister korrigieren'"
              class="ml-2 mr-2"
              icon="mdi-account-convert-outline"
              variant="text"
              color="secondary"
              @click="openDienstleisterDialog(false)"
            />
          </v-list-item>
          <v-list-item density="compact">
            <v-btn
              v-tooltip:end="'Kopieren'"
              class="ml-2 mr-2"
              icon="mdi-content-copy"
              variant="text"
              color="secondary"
              @click="zaehlungKopieren"
            />
          </v-list-item>
          <v-list-item
            v-if="showButtonDatenportal"
            density="compact"
          >
            <v-btn
              v-tooltip:end="'Datenportal'"
              class="ml-2 mr-2"
              icon="mdi-link-variant"
              variant="text"
              color="secondary"
              @click="openZaehlungInDatenportal"
            />
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>

    <delete-zaehlung-dialog
      v-model="deleteDialog"
      :dialogtext="deleteDialogText"
      @cancel="deleteDialog = false"
      @delete-it="deleteZaehlung"
    />

    <beauftrage-zaehlung-dialog
      v-model="showBeauftragenDialog"
      :dienstleisterkennung="zaehlung.dienstleisterkennung"
      :is-beauftragen="isBeauftragen"
      @cancel="showBeauftragenDialog = false"
      @beauftragen="zaehlungBeauftragen"
      @korrigieren="dienstleisterKorrigieren"
    />
  </v-card>
</template>

<script setup lang="ts">
import type BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import type UpdateStatusDTO from "@/domain/dto/bearbeiten/UpdateStatusDTO";
import type DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import type FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import type ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import type GeoPoint from "@/domain/GeoPoint";
import type KnotenarmDTO from "@/domain/KnotenarmDTO";

import { LatLng } from "leaflet";
import { cloneDeep } from "lodash";
import { computed, ref } from "vue";

import ZaehlungService from "@/api/service/ZaehlungService";
import IconOptions from "@/components/icons/IconOptions";
import QuelleIcon from "@/components/icons/QuelleIcon.vue";
import WetterIcon from "@/components/icons/WetterIcon.vue";
import ZaehlartIcon from "@/components/icons/ZaehlartIcon.vue";
import ZaehldauerIcon from "@/components/icons/ZaehldauerIcon.vue";
import ZaehlungCardMap from "@/components/map/ZaehlungCardMap.vue";
import BeauftrageZaehlungDialog from "@/components/zaehlung/BeauftrageZaehlungDialog.vue";
import DeleteZaehlungDialog from "@/components/zaehlung/DeleteZaehlungDialog.vue";
import ZaehlungGeometrie from "@/components/zaehlung/ZaehlungGeometrie.vue";
import Status, { statusIcon } from "@/domain/enums/Status";
import Wetter from "@/domain/enums/Wetter";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useDateUtils } from "@/util/DateUtils";
import KnotenarmComparator from "@/util/KnotenarmComparator";

const ICON_COLOR = "black";
const deleteDialogText = ref("Wollen Sie die Zählung wirklich löschen?");

interface Props {
  geoPointZaehlstelle: GeoPoint;
  zaehlstelleId: string;
}
const properties = defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "deleted"): void;
  (e: "openZaehlungDialog", zaehlung: ZaehlungDTO): void;
  (e: "openZaehlungDatenportal", zaehlungId: string): void;
  (e: "openChatDialog", zaehlungId: string): void;
  (e: "saved", payload: BackendIdDTO): void;
}>();

const snackbarStore = useSnackbarStore();
const dateUtils = useDateUtils();
const loading = ref(false);
const deleteDialog = ref(false);
const isBeauftragen = ref(true);

const unreadMessagesMobilitaetsreferat = ref(
  zaehlung.value.unreadMessagesMobilitaetsreferat
);

const showBeauftragenDialog = ref(false);

const coordsZaehlstelle = computed(() => {
  return createLatLngFromString(
    properties.geoPointZaehlstelle.lat,
    properties.geoPointZaehlstelle.lon
  );
});

const coordsZaehlung = computed(() => {
  const geoPoint: GeoPoint = zaehlung.value.punkt;
  return createLatLngFromString(geoPoint.lat, geoPoint.lon);
});

const datum = computed(() => {
  return dateUtils.getShortVersionOfDate(zaehlung.value.datum);
});

const streets = computed(() => {
  return cloneDeep(zaehlung.value.knotenarme).sort(
    KnotenarmComparator.sortByNumber
  );
});

const streetsHeader = [
  {
    title: "Nummer",
    align: "center",
    sortable: false,
    value: "nummer",
    lastFixed: true,
  },
  {
    title: "Straßenname",
    align: "center",
    sortable: false,
    value: "strassenname",
  },
];

const statusDesign = computed(() => {
  let design: IconOptions | undefined = statusIcon.get(zaehlung.value.status);
  if (!design) {
    design = {} as IconOptions;
    design.color = "deep-orange lighten-4";
    design.iconPath = "mdi-calendar-question";
    design.tooltip = "Status unbekannt";
  }
  return design;
});

const showButtonKorrektur = computed(() => {
  return zaehlung.value.status === Status.ACCOMPLISHED;
});

const showButtonFreigeben = computed(() => {
  return zaehlung.value.status === Status.ACCOMPLISHED;
});

const showButtonBeauftragen = computed(() => {
  return (
    zaehlung.value.status === Status.CREATED &&
    zaehlung.value.knotenarme &&
    zaehlung.value.knotenarme.length > 0
  );
});

const showButtonDatenportal = computed(() => {
  return (
    zaehlung.value.status === Status.ACCOMPLISHED ||
    zaehlung.value.status === Status.ACTIVE
  );
});

const showButtonDienstleisterKorrigieren = computed(() => {
  return (
    zaehlung.value.status === Status.INSTRUCTED ||
    zaehlung.value.status === Status.COUNTING ||
    zaehlung.value.status === Status.CORRECTION
  );
});

// Erzeugt aus den String Koordinaten ein Objekt von Typ LatLng
function createLatLngFromString(lat: string, lng: string): LatLng {
  return new LatLng(parseFloat(lat), parseFloat(lng));
}

function zaehlungBeauftragen(dienstleister: DienstleisterDTO) {
  loading.value = true;
  const update: UpdateStatusDTO = {} as UpdateStatusDTO;
  update.zaehlungId = zaehlung.value.id;
  update.status = Status.INSTRUCTED;
  update.dienstleisterkennung = dienstleister.kennung;
  ZaehlungService.updateStatus(update)
    .then((backendIdDTO) => {
      snackbarStore.showInfo(
        `Der Zähldienstleister ${dienstleister.name} wurde beauftragt die Zählung ${zaehlung.value.projektName} durchzuführen.`
      );
      emits("saved", backendIdDTO);
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      loading.value = false;
      isBeauftragen.value = true;
    });
}

function zaehlungLoeschen() {
  deleteDialogText.value = `Wollen Sie die Zählung vom ${datum.value} wirklich löschen?`;
  deleteDialog.value = true;
}

function deleteZaehlung() {
  deleteDialog.value = false;
  loading.value = true;
  ZaehlungService.deleteZaehlungById(zaehlung.value.id)
    .then((isDeleted: boolean) => {
      if (isDeleted) {
        snackbarStore.showInfo(
          `Die Zählung vom ${datum.value} wurde gelöscht.`
        );
        emits("deleted");
      } else {
        snackbarStore.showError(
          `Die Zählung vom ${datum.value} konnte nicht gelöscht werden.`
        );
      }
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      loading.value = false;
    });
}

function zaehlungFreigeben() {
  loading.value = true;
  const update: UpdateStatusDTO = {} as UpdateStatusDTO;
  update.zaehlungId = zaehlung.value.id;
  update.status = Status.ACTIVE;
  ZaehlungService.updateStatus(update)
    .then((backendIdDTO) => {
      snackbarStore.showInfo(
        `Die Zählung vom ${datum.value} wurde freigegeben.`
      );
      emits("saved", backendIdDTO);
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      loading.value = false;
    });
}

function zaehlungKorrigieren() {
  loading.value = true;
  const update: UpdateStatusDTO = {} as UpdateStatusDTO;
  update.zaehlungId = zaehlung.value.id;
  update.status = Status.CORRECTION;
  ZaehlungService.updateStatus(update)
    .then((backendIdDTO) => {
      snackbarStore.showInfo(
        `Die Zählung vom ${datum.value} wurde dem Zähldienstleister zur Korrektur übermittelt.`
      );
      emits("saved", backendIdDTO);
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      loading.value = false;
    });
}

function openZaehlungDialog() {
  emits("openZaehlungDialog", zaehlung.value);
}

function openZaehlungInDatenportal() {
  emits("openZaehlungDatenportal", zaehlung.value.id);
}

function zaehlungKopieren() {
  loading.value = true;
  const zaehlungCopy: ZaehlungDTO = cloneDeep(zaehlung.value);
  zaehlungCopy.id = "";
  zaehlungCopy.kommentar = "";
  zaehlungCopy.zaehlsituation = "";
  zaehlungCopy.zaehlsituationErweitert = "";
  zaehlungCopy.wetter = Wetter.NO_INFORMATION;
  zaehlungCopy.status = Status.CREATED;
  zaehlungCopy.dienstleisterkennung = "";
  zaehlungCopy.datum = new Date().toISOString().substring(0, 10);
  zaehlungCopy.knotenarme.forEach((arm: KnotenarmDTO) => {
    arm.id = "";
  });
  zaehlungCopy.fahrbeziehungen.forEach((fz: FahrbeziehungDTO) => {
    fz.id = "";
    fz.hochrechnungsfaktor.id = "";
  });
  ZaehlungService.saveZaehlung(zaehlungCopy, properties.zaehlstelleId)
    .then((backendIdDTO: BackendIdDTO) => {
      snackbarStore.showInfo(`Die Zählung vom ${datum.value} wurde kopiert.`);
      emits("saved", backendIdDTO);
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      loading.value = false;
    });
}

function openChatDialog() {
  // zaehlungStore.setZaehlung(cloneDeep(zaehlung.value));
  unreadMessagesMobilitaetsreferat.value = false;
  emits("openChatDialog", zaehlung.value.id);
}

function dienstleisterKorrigieren(dienstleister: DienstleisterDTO) {
  loading.value = true;
  ZaehlungService.updateDienstleisterkennung(zaehlung.value.id, dienstleister)
    .then((backendIdDTO) => {
      snackbarStore.showInfo(
        `Der Zähldienstleister ${dienstleister.name} wurde beauftragt die Zählung ${zaehlung.value.projektName} durchzuführen. (Korrektur)`
      );
      emits("saved", backendIdDTO);
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      loading.value = false;
      isBeauftragen.value = true;
    });
}

function openDienstleisterDialog(isBeauftragenParam: boolean): void {
  showBeauftragenDialog.value = true;
  isBeauftragen.value = isBeauftragenParam;
}
</script>
