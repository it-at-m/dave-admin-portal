<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-row no-gutters>
      <v-col cols="3">
        <v-sheet
          :min-height="headerHeightVh"
          width="100%"
          color="grey lighten-3"
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
    <v-row
      dense
      justify="center"
    >
      <v-banner
        v-if="hasNoZaehlung"
        single-line
        width="100%"
      >
        <v-icon
          color="error"
          size="36"
        >
          mdi-alert-decagram-outline
        </v-icon>
        Zählstelle besitzt aktuell keine Zählungen.
      </v-banner>
      <v-col
        v-else
        cols="12"
        md="6"
      >
        <v-spacer />
        <v-tooltip
          right
          class="pl-5"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="query"
              color="grey darken-1"
              label="Zählung suchen"
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              hide-details
              class="px-4 my-2"
            >
              <template #append>
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                  >mdi-information-outline
                </v-icon>
              </template>
            </v-text-field>
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
        <v-spacer />
      </v-col>
    </v-row>
    <v-row dense>
      <v-col
        v-for="card in filteredZaehlungCardObjects"
        :key="card.zaehlung.id"
        :cols="card.flex"
      >
        <zaehlung-card
          :zaehlung="card.zaehlung"
          :zaehlstelle-id="zaehlstelle.id"
          :geo-point-zaehlstelle="zaehlstelle.punkt"
          @openZaehlungDialog="openZaehlungDialog"
          @openZaehlungDatenportal="openZaehlungDatenportal"
          @openChatDialog="openChatDialog"
          @saved="reloadDataAndCloseDialog"
          @deleted="loadZaehlstelle"
        />
      </v-col>
    </v-row>

    <v-speed-dial
      v-model="fab"
      absolute
      bottom
      fixed
      right
      open-on-hover
    >
      <template #activator>
        <v-btn
          v-model="fab"
          dark
          fab
          :color="fabColor"
        >
          <v-icon v-if="fab"> mdi-close-thick </v-icon>
          <v-icon v-else> mdi-plus-thick </v-icon>
        </v-btn>
      </template>
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            dark
            fab
            small
            color="secondary"
            v-bind="attrs"
            @click.stop="createZaehlung"
            v-on="on"
          >
            <v-icon> mdi-calendar-plus </v-icon>
          </v-btn>
        </template>
        <span>Neue Zählung anlegen</span>
      </v-tooltip>
      <v-tooltip left>
        <template #activator="{ on, attrs }">
          <v-btn
            fab
            dark
            small
            color="secondary"
            v-bind="attrs"
            @click="editZaehlstelle"
            v-on="on"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Zählstelle bearbeiten</span>
      </v-tooltip>
    </v-speed-dial>

    <update-zaehlstelle-dialog
      :show-dialog="showUpdateZaehlstelleDialog"
      :zaehlstelle="zaehlstelle"
      @saved="reloadDataAndCloseDialog"
      @cancel="cancelUpdateZaehlstelleDialog"
    ></update-zaehlstelle-dialog>

    <zaehlung-dialog
      :show-dialog="showZaehlungDialog"
      :zaehlstelle="zaehlstelle"
      @saved="reloadDataAndCloseDialog"
      @cancel="cancelZaehlungDialog"
    ></zaehlung-dialog>

    <chat-dialog
      :show-dialog="showChatDialog"
      @closeDialog="closeChatDialog"
    ></chat-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router/composables";

import HochrechnungsfaktorService from "@/api/service/HochrechnungsfaktorService";
import PkwEinheitenService from "@/api/service/PkwEinheitenService";
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import { wetterText } from "@/domain/enums/Wetter";
import { zaehlartText } from "@/domain/enums/Zaehlart";
import ZaehlungCardObject from "@/domain/ZaehlungCardObject";
import { useHochrechnungsfaktorStore } from "@/store/HochrechnungsfaktorStore";
import { usePkweinheitStore } from "@/store/PkweinheitStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useZaehlungStore } from "@/store/ZaehlungStore";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import { useVuetify } from "@/util/useVuetify";
import ZaehlungCardObjectComparator from "@/util/ZaehlungCardObjectComparator";

const snackbarStore = useSnackbarStore();
const pkweinheitStore = usePkweinheitStore();
const hochrechnungsfaktorStore = useHochrechnungsfaktorStore();
const zaehlungStore = useZaehlungStore();
const route = useRoute();
const vuetify = useVuetify();

const zaehlstelle = ref(DefaultObjectCreator.createDefaultZaehlstelleDTO());
const zaehlungen = ref([] as Array<ZaehlungDTO>);
const showUpdateZaehlstelleDialog = ref(false);
const showZaehlungDialog = ref(false);
const showChatDialog = ref(false);
const zaehlungCards = ref([] as Array<ZaehlungCardObject>);
const fab = ref(false);
const query = ref("");
const reloadZaehlstellenMap = ref(false);

/**
 * Die Daten zur Zählstelle und der ausgewählten Zählung wird über die
 * API geladen.
 */
onMounted(() => {
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

const fabColor = computed(() => {
  return fab.value ? "grey darken-1" : "secondary";
});

const kreuzungsname = computed(() => {
  let zaehlungCardObjects: Array<ZaehlungCardObject> =
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
  return 160 / (vuetify.breakpoint.height / 100);
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
  let zaehlung: ZaehlungDTO = DefaultObjectCreator.createDefaultZaehlungDTO();
  zaehlung.punkt = cloneDeep(zaehlstelle.value.punkt);
  zaehlung.zaehlIntervall = 15;
  let time = new Date().toLocaleTimeString(navigator.language, {
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
  const zaehlstelleId = route.params.zaehlstelleId;

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
      const zaehlungId = route.params.zaehlungId;
      if (zaehlungId && openDialog) {
        openZaehlungWithId(zaehlungId);
      }
    });
}

const hasNoZaehlung = computed(() => {
  return zaehlungen.value.length === 0;
});

const zaehlstelleId = computed(() => {
  const zaehlstelleId: string = route.params.zaehlstelleId;
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

function openZaehlungDialog() {
  showZaehlungDialog.value = true;
}

function createZaehlung() {
  zaehlungStore.setZaehlung(cloneDeep(createDefaultZaehlungDTO()));
  showZaehlungDialog.value = true;
}

function openZaehlungDatenportal(zaehlungId: string) {
  let url = `${BaseUrlProvider.getBaseUrlDatenportal()}#/zaehlstelle/${
    zaehlstelle.value.id
  }/${zaehlungId}`;
  window.open(url);
}

function openChatDialog() {
  showChatDialog.value = true;
}

function closeChatDialog() {
  showChatDialog.value = false;
}

function openZaehlungWithId(zaehlungId: string): void {
  zaehlungCards.value.forEach((cardObject: ZaehlungCardObject) => {
    if (cardObject.zaehlung.id === zaehlungId) {
      zaehlungStore.setZaehlung(cloneDeep(cardObject.zaehlung));
      openZaehlungDialog();
    }
  });
}

/**
 * Filtert die ZählungCardObjects nach den Suchwörter.
 */
const filteredZaehlungCardObjects = computed(() => {
  let filteredZs: Array<ZaehlungCardObject> = getZaehlungenForCards.value;
  if (query.value.length > 0) {
    let words: string[] = query.value.split(" ");
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
