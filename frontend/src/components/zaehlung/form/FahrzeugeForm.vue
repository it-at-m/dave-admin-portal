<template>
    <v-sheet
        width="100%"
        :height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <v-card-text>
            <v-row dense>
                <v-col>
                    <v-checkbox
                        v-model="pkw"
                        :label="pkwLabel"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="updateKategorieWithPkw"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="lkw"
                        :label="lkwLabel"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="updateKategorieWithLkw"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="lz"
                        :label="lzLabel"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="updateKategorieWithLz"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="bus"
                        :label="busLabel"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="updateKategorieWithBus"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="krad"
                        :label="kradLabel"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="updateKategorieWithKrad"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="rad"
                        :label="radLabel"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="updateKategorieWithRad"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="fuss"
                        :label="fussLabel"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="updateKategorieWithFuss"
                    ></v-checkbox>
                    <v-checkbox
                        v-model="selectOrDeselectAllVmodel"
                        value=""
                        :label="labelSelectOrDeselectAll"
                        color="grey darken-1"
                        hide-details
                        dense
                        @click="selectOrDeselectAll()"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </v-card-text>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import Fahrzeug from "@/domain/enums/Fahrzeug";
import _ from "lodash";
import PkwEinheitDTO from "@/domain/dto/PkwEinheitDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
/* eslint-enable no-unused-vars */

@Component
export default class FahrzeugeForm extends Vue {
    @Prop()
    private readonly height!: string;

    // Variablen für die Checkboxen
    private pkw = false;
    private lkw = false;
    private lz = false;
    private bus = false;
    private krad = false;
    private rad = false;
    private fuss = false;
    private selectOrDeselectAllVmodel = false;

    mounted() {
        this.resetForm();
    }

    get zaehlungStore(): ZaehlungDTO {
        return this.$store.getters.getZaehlung;
    }

    get kategorienStore(): Array<Fahrzeug> {
        return this.$store.getters.getKategorien;
    }

    get pkwEinheitenStore(): PkwEinheitDTO {
        return this.$store.getters.getPkwEinheit;
    }

    get labelSelectOrDeselectAll(): string {
        return this.selectOrDeselectAllVmodel
            ? "Alles abwählen"
            : "Alles auswählen";
    }

    get pkwLabel(): string {
        return `Personenkraftwagen (Pkw) - PKW-Einheit-Faktor: ${this.pkwEinheitenStore.pkw}`;
    }

    get lkwLabel(): string {
        return `Lastkraftwagen (Lkw) - PKW-Einheit-Faktor: ${this.pkwEinheitenStore.lkw}`;
    }

    get lzLabel(): string {
        return `Lastzüge (Lz) - PKW-Einheit-Faktor: ${this.pkwEinheitenStore.lastzuege}`;
    }

    get busLabel(): string {
        return `Bus - PKW-Einheit-Faktor: ${this.pkwEinheitenStore.busse}`;
    }

    get kradLabel(): string {
        return `Krafträder (Krad) - PKW-Einheit-Faktor: ${this.pkwEinheitenStore.kraftraeder}`;
    }

    get radLabel(): string {
        return `Radfahrer - PKW-Einheit-Faktor: ${this.pkwEinheitenStore.fahrradfahrer}`;
    }

    get fussLabel(): string {
        return `Fußgänger - PKW-Einheit-Faktor: nicht existent`;
    }

    @Watch("kategorienStore")
    updateSelectDeselectAll() {
        this.selectOrDeselectAllVmodel = this.kategorienStore.length === 7;
    }

    updateKategorieWithPkw() {
        if (this.pkw) {
            this.addKategorie(Fahrzeug.PKW);
        } else {
            this.removeKategorie(Fahrzeug.PKW);
        }
    }

    updateKategorieWithLkw() {
        if (this.lkw) {
            this.addKategorie(Fahrzeug.LKW);
        } else {
            this.removeKategorie(Fahrzeug.LKW);
        }
    }

    updateKategorieWithLz() {
        if (this.lz) {
            this.addKategorie(Fahrzeug.LZ);
        } else {
            this.removeKategorie(Fahrzeug.LZ);
        }
    }

    updateKategorieWithBus() {
        if (this.bus) {
            this.addKategorie(Fahrzeug.BUS);
        } else {
            this.removeKategorie(Fahrzeug.BUS);
        }
    }

    updateKategorieWithKrad() {
        if (this.krad) {
            this.addKategorie(Fahrzeug.KRAD);
        } else {
            this.removeKategorie(Fahrzeug.KRAD);
        }
    }

    updateKategorieWithRad() {
        if (this.rad) {
            this.addKategorie(Fahrzeug.RAD);
        } else {
            this.removeKategorie(Fahrzeug.RAD);
        }
    }

    updateKategorieWithFuss() {
        if (this.fuss) {
            this.addKategorie(Fahrzeug.FUSS);
        } else {
            this.removeKategorie(Fahrzeug.FUSS);
        }
    }

    /**
     * Hilfsmethode, um alle Checkboxen der Fahrzeugkategorien aufeinmal
     * aus- oder abzuwählen, wenn diese nicht disabled sind.
     * @private
     */
    private selectOrDeselectAll() {
        this.pkw = this.selectOrDeselectAllVmodel;
        this.lkw = this.selectOrDeselectAllVmodel;
        this.lz = this.selectOrDeselectAllVmodel;
        this.bus = this.selectOrDeselectAllVmodel;
        this.krad = this.selectOrDeselectAllVmodel;
        this.rad = this.selectOrDeselectAllVmodel;
        this.fuss = this.selectOrDeselectAllVmodel;
        // in den Store schreiben//löschen
        if (this.selectOrDeselectAllVmodel) {
            let allFahrzeuge: Array<Fahrzeug> = [];
            allFahrzeuge.push(Fahrzeug.PKW);
            allFahrzeuge.push(Fahrzeug.LKW);
            allFahrzeuge.push(Fahrzeug.LZ);
            allFahrzeuge.push(Fahrzeug.BUS);
            allFahrzeuge.push(Fahrzeug.KRAD);
            allFahrzeuge.push(Fahrzeug.RAD);
            allFahrzeuge.push(Fahrzeug.FUSS);
            this.$store.dispatch("addAllKategorien", allFahrzeuge);
        } else {
            this.$store.dispatch("deleteAllKategorien");
        }
    }

    private addKategorie(kategorie: Fahrzeug) {
        this.$store.dispatch("addKategorie", _.cloneDeep(kategorie));
    }

    private removeKategorie(kategorie: Fahrzeug) {
        this.$store.dispatch("deleteKategorie", _.cloneDeep(kategorie));
    }

    get resetFormEvent(): boolean {
        return this.$store.getters.getResetformevent;
    }

    @Watch("resetFormEvent")
    private resetForm() {
        let zaehlung: ZaehlungDTO = this.zaehlungStore;
        this.pkw = zaehlung.kategorien.includes(Fahrzeug.PKW);
        this.lkw = zaehlung.kategorien.includes(Fahrzeug.LKW);
        this.lz = zaehlung.kategorien.includes(Fahrzeug.LZ);
        this.bus = zaehlung.kategorien.includes(Fahrzeug.BUS);
        this.krad = zaehlung.kategorien.includes(Fahrzeug.KRAD);
        this.rad = zaehlung.kategorien.includes(Fahrzeug.RAD);
        this.fuss = zaehlung.kategorien.includes(Fahrzeug.FUSS);
        this.selectOrDeselectAllVmodel = zaehlung.kategorien.length === 7;
    }
}
</script>