<template>
  <v-sheet class="dave-default">
    <v-row no-gutters>
      <v-col cols="3">
        <v-sheet
          :min-height="headerHeightVh"
          width="100%"
          color="grey-lighten-3"
          class="d-flex flex-column"
        >
          <!-- Basisinformation zur Zählstelle -->
          <zaehlstelle-info
            :height="headerHeightVh"
            :minheight="headerHeightVh"
            :nummer="zaehlstelle.nummer"
            :kreuzungsname="kreuzungsname"
            :stadtbezirk-nummer="`${zaehlstelle.stadtbezirkNummer}`"
            :stadtbezirk="zaehlstelle.stadtbezirk"
            :style="{ cursor: 'pointer' }"
            @edit-zaehlstelle="editZaehlstelle"
          ></zaehlstelle-info>
        </v-sheet>
      </v-col>
      <v-col cols="9">
        <zaehlstelle-map
          :z-id="zaehlstelleId"
          :latlng="latlng"
          :zoom="17"
          :height="headerHeightVh"
          :minheight="headerHeightVh"
          :show-marker="true"
          :reload="reloadZaehlstellenMap"
          width="100%"
        />
      </v-col>
    </v-row>
    <v-banner
      v-if="hasNoZaehlung"
      lines="one"
      width="100%"
      text="Zählstelle besitzt aktuell keine Zählungen."
    >
      <template #prepend>
        <v-icon
          icon="mdi-alert-decagram-outline"
          size="36"
          color="error"
        />
      </template>
    </v-banner>
    <v-row
      v-else
      dense
    >
      <v-spacer />
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="query"
          color="grey-darken-1"
          label="Zählung suchen"
          density="compact"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          hide-details
          class="px-4 my-2"
        >
          <template #append-inner>
            <v-tooltip
              v-model="showtooltip"
              location="end top"
              :open-on-hover="true"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  icon="mdi-information-outline"
                >
                </v-btn>
              </template>
              <span>
                <b>Beispiele, wonach gefiltert werden kann:</b><br />
                * Datum (24.12.2009)<br />
                * Monat (Januar, Februar, ...)<br />
                * Jahreszeit (Frühling, Sommer, ...)<br />
                * Projektname / -nummer (U1022, VZ Stadtgrenzen 2019, ...)<br />
                * Zählart (Q, QS, ...)<br />
                * Wetter (sonnig, neblig, ...)<br />
              </span>
            </v-tooltip>
          </template>
        </v-text-field>
      </v-col>
      <v-spacer />
    </v-row>
    <v-row dense>
      <v-col
        v-for="card in filteredZaehlungCardObjects"
        :key="card.zaehlung.id"
        :cols="card.flex"
      >
        <zaehlung-card
          v-model="card.zaehlung"
          :zaehlstelle-id="zaehlstelle.id"
          :geo-point-zaehlstelle="zaehlstelle.punkt"
          @open-zaehlung-dialog="openZaehlungDialog"
          @open-zaehlung-datenportal="openZaehlungDatenportal"
          @open-chat-dialog="openChatDialog"
          @saved="reloadDataAndCloseDialog"
          @deleted="loadZaehlstelle"
        />
      </v-col>
    </v-row>

    <v-speed-dial
      v-model="speedDialOpen"
      persistent
      location="top"
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          key="speedDial"
          :color="speedDialColor"
          :icon="speedDialIcon"
          size="x-large"
          elevation="6"
          location="bottom end"
          position="absolute"
          class="mr-4 mb-4"
          style="z-index: 400"
          :data-x="activatorProps"
        />
      </template>
      <v-btn
        key="createZaehlung"
        v-tooltip:start="'Neue Zählung anlegen'"
        icon="mdi-calendar-plus"
        size="large"
        color="secondary"
        @click="createZaehlung"
      />
      <v-btn
        key="editZaehlstelle"
        v-tooltip:start="'Zählstelle bearbeiten'"
        icon="mdi-pencil"
        size="large"
        color="secondary"
        @click="editZaehlstelle"
      />
    </v-speed-dial>

    <update-zaehlstelle-dialog
      v-model="zaehlstelle"
      :show-dialog="showUpdateZaehlstelleDialog"
      @saved="reloadDataAndCloseDialog"
      @cancel="cancelUpdateZaehlstelleDialog"
    />

    <zaehlung-dialog
      v-model="zaehlung"
      :show-dialog="showZaehlungDialog"
      :zaehlstelle="zaehlstelle"
      @saved="reloadDataAndCloseDialog"
      @cancel="cancelZaehlungDialog"
    />

    <chat-dialog
      v-model="zaehlung"
      :show-dialog="showChatDialog"
      @close-dialog="closeChatDialog"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import type HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import type PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";
import type ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import type ZaehlungCardObject from "@/domain/ZaehlungCardObject";

import { cloneDeep } from "lodash";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useDisplay } from "vuetify";

import HochrechnungsfaktorService from "@/api/service/HochrechnungsfaktorService";
import PkwEinheitenService from "@/api/service/PkwEinheitenService";
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import ChatDialog from "@/components/chat/ChatDialog.vue";
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import UpdateZaehlstelleDialog from "@/components/zaehlstelle/UpdateZaehlstelleDialog.vue";
import ZaehlstelleInfo from "@/components/zaehlstelle/ZaehlstelleInfo.vue";
import ZaehlungCard from "@/components/zaehlung/ZaehlungCard.vue";
import ZaehlungDialog from "@/components/zaehlung/ZaehlungDialog.vue";
import { wetterText } from "@/domain/enums/Wetter";
import { zaehlartText } from "@/domain/enums/Zaehlart";
import { useHochrechnungsfaktorStore } from "@/store/HochrechnungsfaktorStore";
import { usePkweinheitStore } from "@/store/PkweinheitStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import ZaehlungCardObjectComparator from "@/util/ZaehlungCardObjectComparator";

const snackbarStore = useSnackbarStore();
const pkweinheitStore = usePkweinheitStore();
const hochrechnungsfaktorStore = useHochrechnungsfaktorStore();
const route = useRoute();
const display = useDisplay();

const zaehlstelle = ref(DefaultObjectCreator.createDefaultZaehlstelleDTO());
const zaehlungen = ref([] as Array<ZaehlungDTO>);
const showUpdateZaehlstelleDialog = ref(false);
const showZaehlungDialog = ref(false);
const showChatDialog = ref(false);
const zaehlungCards = ref([] as Array<ZaehlungCardObject>);
const speedDialOpen = ref(false);
const query = ref("");
const reloadZaehlstellenMap = ref(false);
const showtooltip = ref(false);

const zaehlung = ref<ZaehlungDTO>(createDefaultZaehlungDTO());

/**
 * Die Daten zur Zählstelle und der ausgewählten Zählung wird über die
 * API geladen.
 */
onMounted(() => {
  zaehlung.value = createDefaultZaehlungDTO();
  loadZaehlstelle(true);
  loadHochrechnungsfaktoren();
  loadPkwEinheiten();
});

function loadHochrechnungsfaktoren() {
  HochrechnungsfaktorService.getAllHochrechnungsfaktoren()
    .then((faktoren: Array<HochrechnungsfaktorDTO>) => {
      hochrechnungsfaktorStore.setHochrechnungsfaktoren(cloneDeep(faktoren));
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function loadPkwEinheiten() {
  PkwEinheitenService.getPkweinheiten()
    .then((latest: PkwEinheitDTO) => {
      pkweinheitStore.setPkwEinheit(cloneDeep(latest));
    })
    .catch((error) => snackbarStore.showApiError(error));
}

const speedDialColor = computed(() => {
  return speedDialOpen.value ? "grey-darken-1" : "secondary";
});

const speedDialIcon = computed(() => {
  let icon = "mdi-plus-thick";
  if (speedDialOpen.value) {
    icon = "mdi-close-thick";
  }
  return icon;
});

const kreuzungsname = computed(() => {
  const zaehlungCardObjects: Array<ZaehlungCardObject> =
    getZaehlungenForCards.value;
  let kreuzungsname = "";
  if (zaehlungCardObjects.length > 0) {
    kreuzungsname = zaehlungCardObjects[0].zaehlung.kreuzungsname;
  }
  return kreuzungsname;
});

/**
 * Erzeugt aus dem übergebenen Punkt ein Array aus lat und lon.
 */
const latlng = computed(() => {
  if (zaehlstelle.value.punkt != null) {
    return [zaehlstelle.value.punkt.lat, zaehlstelle.value.punkt.lon];
  } else {
    return [];
  }
});

const getZaehlungenForCards = computed(() => {
  return zaehlungCards.value;
});

// =============
// Höhenberechnungen
// =============

/**
 * Berechnet die Höhe des Headers (fix 160px) in "vh" (Höhe Viewport in Hundert)
 */
const headerHeight = computed(() => {
  return 160 / (display.height.value / 100);
});

// ===================
// Ab hier werden dann die VH Werte als String zurück gegeben
// ===================

/**
 * Wandelt die Header Höhe in VH um.
 */
const headerHeightVh = computed(() => {
  return headerHeight.value + "vh";
});

function editZaehlstelle() {
  showUpdateZaehlstelleDialog.value = true;
}

function createDefaultZaehlungDTO(): ZaehlungDTO {
  const zaehlung: ZaehlungDTO = DefaultObjectCreator.createDefaultZaehlungDTO();
  zaehlung.punkt = cloneDeep(zaehlstelle.value.punkt);
  zaehlung.zaehlIntervall = 15;
  const time = new Date().toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
  zaehlung.datum = new Date(
    new Date().toISOString().substr(0, 10) + "T" + time
  ).toISOString();
  return zaehlung;
}

function loadZaehlstelle(openDialog = false): void {
  // ID der Zählstelle aus der URL holen (oder Warnung ausgeben, falls keine vorhanden ist)
  const zaehlstelleId = route.params.zaehlstelleId as string;

  // Die Informationen zur Zählstelle werden geladen
  zaehlungCards.value = [];
  ZaehlstellenService.getZaehlstelleById(zaehlstelleId)
    .then((response) => {
      zaehlstelle.value = response;
      zaehlungen.value = response.zaehlungen;
      response.zaehlungen.forEach((zaehlung: ZaehlungDTO) => {
        zaehlungCards.value.push({ flex: 3, zaehlung: zaehlung });
      });
      zaehlungCards.value.sort(ZaehlungCardObjectComparator.sortByDatumDesc);
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      const zaehlungId = route.params.zaehlungId as string;
      if (zaehlungId && openDialog) {
        openZaehlungWithId(zaehlungId);
      }
    });
}

const hasNoZaehlung = computed(() => {
  return zaehlungen.value.length === 0;
});

const zaehlstelleId = computed(() => {
  const zaehlstelleId: string = route.params.zaehlstelleId as string;
  if (!zaehlstelleId) {
    return "";
  }
  return zaehlstelleId;
});

function reloadDataAndCloseDialog() {
  loadZaehlstelle();
  reloadZaehlstellenMap.value = !reloadZaehlstellenMap.value;
  showUpdateZaehlstelleDialog.value = false;
  showZaehlungDialog.value = false;
}

function cancelUpdateZaehlstelleDialog() {
  showUpdateZaehlstelleDialog.value = false;
  loadZaehlstelle();
}

function cancelZaehlungDialog() {
  showZaehlungDialog.value = false;
}

function openZaehlungDialog(zaehlungToEdit: ZaehlungDTO) {
  zaehlung.value = cloneDeep(zaehlungToEdit);
  showZaehlungDialog.value = true;
}

function createZaehlung() {
  zaehlung.value = createDefaultZaehlungDTO();
  showZaehlungDialog.value = true;
}

function openZaehlungDatenportal(zaehlungId: string) {
  const url = `${BaseUrlProvider.getBaseUrlDatenportal()}#/zaehlstelle/${
    zaehlstelle.value.id
  }/${zaehlungId}`;
  window.open(url);
}

function openChatDialog(zaehlungToChat: ZaehlungDTO) {
  zaehlung.value = cloneDeep(zaehlungToChat);
  showChatDialog.value = true;
}

function closeChatDialog() {
  showChatDialog.value = false;
}

function openZaehlungWithId(zaehlungId: string): void {
  zaehlungCards.value.forEach((cardObject: ZaehlungCardObject) => {
    if (cardObject.zaehlung.id === zaehlungId) {
      openZaehlungDialog(cardObject.zaehlung);
    }
  });
}

/**
 * Filtert die ZählungCardObjects nach den Suchwörter.
 */
const filteredZaehlungCardObjects = computed(() => {
  let filteredZs: Array<ZaehlungCardObject> = getZaehlungenForCards.value;
  if (query.value.length > 0) {
    const words: string[] = query.value.split(" ");
    words.forEach((w) => {
      const searchString: string = w.toLocaleLowerCase();
      filteredZs = filteredZs.filter(
        (z) =>
          new Date(z.zaehlung.datum)
            .toLocaleDateString("de-De", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })
            .includes(searchString) ||
          z.zaehlung.projektNummer.toLocaleLowerCase().includes(searchString) ||
          z.zaehlung.kreuzungsname.toLocaleLowerCase().includes(searchString) ||
          z.zaehlung.projektName.toLocaleLowerCase().includes(searchString) ||
          z.zaehlung.monat.toLocaleLowerCase().includes(searchString) ||
          z.zaehlung.jahreszeit.toLocaleLowerCase().includes(searchString) ||
          wetterText
            .get(z.zaehlung.wetter)
            ?.toLocaleLowerCase()
            .includes(searchString) ||
          z.zaehlung.zaehlart.toLocaleLowerCase().includes(searchString) ||
          // Suche nach einem Zählartbuchstaben ist manchaml schwierig,
          // deshalb kann hier nach dem ganzen Text gesucht werden
          zaehlartText
            .get(z.zaehlung.zaehlart)
            ?.toLocaleLowerCase()
            .includes(searchString)
      );
    });
  }
  return filteredZs;
});
</script>
