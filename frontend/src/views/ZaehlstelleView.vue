<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters>
      <v-col
          cols="3"
      >
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
              :stadtbezirkNummer="zaehlstelle.stadtbezirkNummer"
              :stadtbezirk="zaehlstelle.stadtbezirk"
              @edit-zaehlstelle="editZaehlstelle"
              :style="{cursor: 'pointer'}"
          ></zaehlstelle-info>
        </v-sheet>
      </v-col>
      <v-col
          cols="9"
      >
        <zaehlstelle-map
            :z-id="zaehlstelleId"
            :latlng="latlng"
            :zoom="17"
            :height="headerHeightVh"
            :minheight="headerHeightVh"
            show-marker=true
            :reload="reloadZaehlstellenMap"
            width="100%"
        />
      </v-col>
    </v-row>
    <v-row dense justify="center">
      <v-banner
          single-line
          v-if="hasNoZaehlung"
          width="100%"
      >
        <v-icon
            slot="icon"
            color="error"
            size="36"
        >
          mdi-alert-decagram-outline
        </v-icon>
        Zählstelle besitzt aktuell keine Zählungen.
      </v-banner>
      <v-col cols="12" md="6" v-else>
        <v-spacer/>
        <v-tooltip
            right
            class="pl-5"
        >
          <template v-slot:activator="{on, attrs}">
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
              <template v-slot:append>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                >mdi-information-outline
                </v-icon>
              </template>
            </v-text-field>
          </template>
          <span>
        <b>Beispiele, wonach gefiltert werden kann:</b><br>
        * Datum (24.12.2009)<br>
        * Monat (Januar, Februar, ...)<br>
        * Jahreszeit (Frühling, Sommer, ...)<br>
        * Projektname / -nummer (U1022, VZ Stadtgrenzen 2019, ...)<br>
        * Zählart (Q, QS, ...)<br>
        * Wetter (sonnig, neblig, ...)<br>
      </span>
        </v-tooltip>
        <v-spacer/>
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

    <v-speed-dial v-model="fab"
                  absolute
                  bottom
                  fixed
                  right
                  open-on-hover
    >
      <template v-slot:activator>
        <v-btn
            v-model="fab"
            dark
            fab
            :color="fabColor"
        >
          <v-icon v-if="fab">
            mdi-close-thick
          </v-icon>
          <v-icon v-else>
            mdi-plus-thick
          </v-icon>
        </v-btn>
      </template>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              @click.stop="createZaehlung"
              dark
              fab
              small
              color="secondary"
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>
              mdi-calendar-plus
            </v-icon>
          </v-btn>
        </template>
        <span>Neue Zählung anlegen</span>
      </v-tooltip>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
              fab
              dark
              small
              color="secondary"
              @click="editZaehlstelle"
              v-bind="attrs"
              v-on="on"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
        <span>Zählstelle bearbeiten</span>
      </v-tooltip>
    </v-speed-dial>

    <update-zaehlstelle-dialog
        v-model="showUpdateZaehlstelleDialog"
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

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'

// Komponenten
import ZaehlstelleInfo from "@/components/zaehlstelle/ZaehlstelleInfo.vue"
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue"
import UpdateZaehlstelleDialog from "@/components/zaehlstelle/UpdateZaehlstelleDialog.vue";
import ZaehlungCard from "@/components/zaehlung/ZaehlungCard.vue";
import ZaehlungDialog from "@/components/zaehlung/ZaehlungDialog.vue";

import ChatDialog from "@/components/chat/ChatDialog.vue";

// Typen
/* eslint-disable no-unused-vars */
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO"
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import ZaehlungCardObject from "@/domain/ZaehlungCardObject";
import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
/* eslint-enable no-unused-vars */
// API Services
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import PkwEinheitenService from "@/api/service/PkwEinheitenService";
import HochrechnungsfaktorService from "@/api/service/HochrechnungsfaktorService";
import BaseUrlProvider from "@/api/util/BaseUrlProvider";

// Util
import ZaehlungCardObjectComparator from "@/util/ZaehlungCardObjectComparator";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import _ from 'lodash';
import {zaehlartText} from "@/domain/enums/Zaehlart";
import {wetterText} from "@/domain/enums/Wetter";


@Component({
  components: {
    ZaehlungDialog,
    ZaehlungCard,
    ZaehlstelleInfo,
    ZaehlstelleMap,
    UpdateZaehlstelleDialog,
    ChatDialog
  }
})
export default class ZaehlstelleView extends Vue {

  // Die Basisinformationen zur Zählstelle
  private zaehlstelle: ZaehlstelleDTO = DefaultObjectCreator.createDefaultZaehlstelleDTO();
  private zaehlungen: Array<ZaehlungDTO> = [] as Array<ZaehlungDTO>;

  private showUpdateZaehlstelleDialog: boolean = false;
  private showZaehlungDialog: boolean = false;
  private showChatDialog: boolean = false;

  private zaehlungCards: Array<ZaehlungCardObject> = [];

  private fab: boolean = false;
  private query: string = "";

  private reloadZaehlstellenMap: boolean = false;

  /**
   * Die Daten zur Zählstelle und der ausgewählten Zählung wird über die
   * API geladen.
   */
  mounted() {
    this.loadZaehlstelle();
    this.loadHochrechnungsfaktoren();
    this.loadPkwEinheiten();
    const zaehlungId = this.$route.params.zaehlungId;
    if (zaehlungId) {
      // Da die Daten erst geladen werden müssen, muss man kurz warten bevor die Zählung aufgemacht werden kann
      setTimeout(() => this.openZaehlungWithId(zaehlungId), 400);
    }
  }

  private loadHochrechnungsfaktoren() {
    HochrechnungsfaktorService.getAllHochrechnungsfaktoren().then((faktoren: Array<HochrechnungsfaktorDTO>) => {
      this.$store.dispatch("setHochrechnungsfaktoren", _.cloneDeep(faktoren));
    }).catch((error) => this.$store.dispatch('snackbar/showError', error));
  }

  private loadPkwEinheiten() {
    PkwEinheitenService.getPkweinheiten().then((latest: PkwEinheitDTO) => {
      this.$store.dispatch("setPkwEinheit", _.cloneDeep(latest));
    }).catch((error) => this.$store.dispatch('snackbar/showError', error));
  }

  get fabColor(): string {
    return this.fab ? "grey darken-1" : "secondary"
  }

  get kreuzungsname(): string {
    let zaehlungCardObjects: Array<ZaehlungCardObject> = this.getZaehlungenForCards;
    let kreuzungsname: string = "";
    if (zaehlungCardObjects.length > 0) {
      kreuzungsname = zaehlungCardObjects[0].zaehlung.kreuzungsname;
    }
    return kreuzungsname;
  }

  /**
   * Erzeugt aus dem übergebenen Punkt ein Array aus lat und lon.
   */
  get latlng(): string[] {
    if (this.zaehlstelle.punkt != null) {
      return [this.zaehlstelle.punkt.lat, this.zaehlstelle.punkt.lon];
    } else {
      return [];
    }
  }

  get getZaehlungenForCards(): Array<ZaehlungCardObject> {
    return this.zaehlungCards;
  }

  // =============
  // Höhenberechnungen
  // =============

  /**
   * Berechnet die Höhe des Headers (fix 160px) in "vh" (Höhe Viewport in Hundert)
   */
  get headerHeight(): number {
    return 160 / (this.$vuetify.breakpoint.height / 100)
  }

  // ===================
  // Ab hier werden dann die VH Werte als String zurück gegeben
  // ===================

  /**
   * Wandelt die Header Höhe in VH um.
   */
  get headerHeightVh(): string {
    return this.headerHeight + "vh"
  }

  private editZaehlstelle() {
    this.showUpdateZaehlstelleDialog = true;
  }

  private createDefaultZaehlungDTO(): ZaehlungDTO {
    let zaehlung: ZaehlungDTO = DefaultObjectCreator.createDefaultZaehlungDTO();
    zaehlung.punkt = _.cloneDeep(this.zaehlstelle.punkt);
    zaehlung.zaehlIntervall = 15;
    let time = new Date().toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
    zaehlung.datum = new Date(new Date().toISOString().substr(0, 10) + 'T' + time).toISOString();
    return zaehlung;
  }

  private loadZaehlstelle(): void {
    // ID der Zählstelle aus der URL holen (oder Warnung ausgeben, falls keine vorhanden ist)
    const zaehlstelleId = this.$route.params.zaehlstelleId
    if (!zaehlstelleId) {
      console.warn("Es muss eine Zählstellen ID übergeben werden!")
    }
    // Die Informationen zur Zählstelle werden geladen
    this.zaehlungCards = [];
    ZaehlstellenService.getZaehlstelleById(zaehlstelleId).then(zaehlstelle => {
      this.zaehlstelle = zaehlstelle;
      this.zaehlungen = zaehlstelle.zaehlungen;
      zaehlstelle.zaehlungen.forEach((zaehlung: ZaehlungDTO) => {
        this.zaehlungCards.push({flex: 3, zaehlung: zaehlung})
      });
      this.zaehlungCards.sort(ZaehlungCardObjectComparator.sortByDatumDesc);
    }).catch((error) => this.$store.dispatch('snackbar/showError', error));
  }

  get hasNoZaehlung(): boolean {
    return this.zaehlungen.length === 0;
  }

  get zaehlstelleId() {
    const zaehlstelleId: string = this.$route.params.zaehlstelleId;
    if (!zaehlstelleId) {
      return "";
    }
    return zaehlstelleId;
  }

  private reloadDataAndCloseDialog() {
    this.loadZaehlstelle();
    this.reloadZaehlstellenMap = !this.reloadZaehlstellenMap;
    this.showUpdateZaehlstelleDialog = false;
    this.showZaehlungDialog = false;
  }

  private cancelUpdateZaehlstelleDialog() {
    this.showUpdateZaehlstelleDialog = false;
    this.loadZaehlstelle();
  }

  private cancelZaehlungDialog() {
    this.showZaehlungDialog = false;
  }

  private openZaehlungDialog() {
    this.showZaehlungDialog = true;
  }

  private createZaehlung() {
    this.$store.dispatch("setZaehlung", _.cloneDeep(this.createDefaultZaehlungDTO()));
    this.showZaehlungDialog = true;
  }

  private openZaehlungDatenportal(zaehlungId: string) {
    let url: string = `${BaseUrlProvider.getBaseUrlDatenportal()}#/zaehlstelle/${this.zaehlstelle.id}/${zaehlungId}`;
    window.open(url);
  }

  private openChatDialog() {
    this.showChatDialog = true;
  }

  private closeChatDialog() {
    this.showChatDialog = false;
  }

  private openZaehlungWithId(zaehlungId: string): void {
    this.zaehlungCards.forEach((cardObject: ZaehlungCardObject) => {
      if (cardObject.zaehlung.id === zaehlungId) {
        this.$store.dispatch("setZaehlung", _.cloneDeep(cardObject.zaehlung));
        this.openZaehlungDialog();
      }
    })
  }

  /**
   * Filtert die ZählungCardObjects nach den Suchwörter.
   */
  get filteredZaehlungCardObjects(): ZaehlungCardObject[] {
    let filteredZs: Array<ZaehlungCardObject> = this.getZaehlungenForCards;
    if (this.query.length > 0) {
      let words: String[] = this.query.split(" ");
      words.forEach(w => {
        const searchString: string = w.toLocaleLowerCase();
        filteredZs = filteredZs.filter(z =>
            new Date(z.zaehlung.datum).toLocaleDateString('de-De', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric'
            }).includes(searchString) ||
            z.zaehlung.projektNummer.toLocaleLowerCase().includes(searchString) ||
            z.zaehlung.kreuzungsname.toLocaleLowerCase().includes(searchString) ||
            z.zaehlung.projektName.toLocaleLowerCase().includes(searchString) ||
            z.zaehlung.monat.toLocaleLowerCase().includes(searchString) ||
            z.zaehlung.jahreszeit.toLocaleLowerCase().includes(searchString) ||
            wetterText.get(z.zaehlung.wetter)?.toLocaleLowerCase().includes(searchString) ||
            z.zaehlung.zaehlart.toLocaleLowerCase().includes(searchString) ||
            // Suche nach einem Zählartbuchstaben ist manchaml schwierig,
            // deshalb kann hier nach dem ganzen Text gesucht werden
            zaehlartText.get(z.zaehlung.zaehlart)?.toLocaleLowerCase().includes(searchString)
        );
      });
    }
    return filteredZs;
  }
}
</script>
