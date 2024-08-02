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
                                <span class="text-caption"
                                    >Zählstellennummer</span
                                ><br />
                                <span class="text text-info">{{
                                    zaehlstellenummer
                                }}</span
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
                                    () =>
                                        !!zaehlstelle.stadtbezirkNummer ||
                                        pflichtfeldText,
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
                                v-model="stadtbezirksviertel"
                                outlined
                                :items="getStadtbezirksviertel"
                                dense
                                label="Stadtbezirksviertel"
                                :rules="[
                                    () =>
                                        !!stadtbezirksviertelModel ||
                                        pflichtfeldText,
                                ]"
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
                                multiple
                                label="Suchwörter"
                                outlined
                                dense
                                small-chips
                                deletable-chips
                                class="tag-input"
                                :search-input.sync="newSuchwort"
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
                    @updateZaehlstellenCoords="updateZaehlstellenCoords"
                />
            </v-col>
        </v-row>
    </v-sheet>
</template>

<script lang="ts">
import { stadtbezirke } from "@/domain/enums/Stadtbezirk";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import { LatLng } from "leaflet";
import { stadtbezirksviertel } from "@/domain/enums/Stadtbezirksviertel";
import KeyVal from "@/domain/KeyVal";
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import NextZaehlstellennummerDTO from "@/domain/dto/laden/NextZaehlstellennummerDTO";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import GeoPoint from "@/domain/GeoPoint";
import MiniMap from "@/components/map/MiniMap.vue";
import { useSnackbarStore } from "@/store/snackbar";
/* eslint-enable no-unused-vars */
@Component({
    components: { MiniMap },
})
export default class ZaehlstelleForm extends Vue {
    private snackbarStore = useSnackbarStore();
    validZaehlstelle = false;

    zaehlstelle: ZaehlstelleDTO =
        DefaultObjectCreator.createDefaultZaehlstelleDTO();

    stadtbezirksviertelModel = "";
    private laufendeNummer = "";

    newSuchwort = "";

    stadtbezirksviertel: KeyVal = {} as KeyVal;

    @Prop({ default: DefaultObjectCreator.createCenterOfMunichLatLng() })
    coords!: LatLng;

    suchwoerter: Array<string> = [];

    mounted() {
        this.zaehlstelle = DefaultObjectCreator.createDefaultZaehlstelleDTO();
        this.validZaehlstelle = false;
    }

    get getStadtbezirke(): Array<KeyVal> {
        return stadtbezirke;
    }

    get getStadtbezirksviertel(): Array<KeyVal> {
        return stadtbezirksviertel(
            this.zaehlstelle.stadtbezirkNummer
                ? this.zaehlstelle.stadtbezirkNummer.toString()
                : ""
        );
    }

    get zaehlstellenummer(): string {
        return this.laufendeNummer;
    }

    get pflichtfeldText(): string {
        return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
    }

    @Watch("zaehlstelle.stadtbezirkNummer")
    updateStadtbezirk(): void {
        this.stadtbezirksviertelModel = "";
        this.stadtbezirksviertel = {} as KeyVal;
    }

    @Watch("stadtbezirksviertel")
    createZaehlstellennummer(stadtbezirksviertel: KeyVal): void {
        if (stadtbezirksviertel && stadtbezirksviertel.value) {
            this.stadtbezirksviertelModel = stadtbezirksviertel.value;
            const idStartsWith = `${this.zaehlstelle.stadtbezirkNummer}${this.stadtbezirksviertelModel}`;
            ZaehlstellenService.getNextZaehlstellennummer(
                idStartsWith,
                this.zaehlstelle.stadtbezirkNummer
            )
                .then((result: NextZaehlstellennummerDTO) => {
                    this.zaehlstelle.nummer = result.nummer;
                    this.laufendeNummer = result.nummer;
                })
                .catch((error) => this.snackbarStore.showApiError(error));
        }
    }

    // Fuegt das eingegebene Wort den Suchwoertern hinzu
    addSuchwortToList() {
        if (this.newSuchwort == null || this.newSuchwort.trim() === "") {
            return;
        }
        if (!this.suchwoerter.includes(this.newSuchwort)) {
            this.suchwoerter.push(...this.newSuchwort.split(","));
        }
        this.newSuchwort = "";
    }

    save(): void {
        if (this.validZaehlstelle) {
            this.zaehlstelle.lat = this.coords.lat;
            this.zaehlstelle.lng = this.coords.lng;
            this.zaehlstelle.customSuchwoerter = this.suchwoerter;
            this.zaehlstelle.sichtbarDatenportal = true;
            ZaehlstellenService.saveZaehlstelle(this.zaehlstelle)
                .then((backendIdDTO) => {
                    this.resetZaehlstelle();
                    this.$emit("saved", backendIdDTO);
                })
                .catch((error) => this.snackbarStore.showApiError(error));
        } else {
            // Fehler Toast, dass kein Marker vorhanden
            this.snackbarStore.showWarning(
                "Es wurde nicht alle Pflichtfelder ausgefüllt."
            );
        }
    }

    cancel(): void {
        this.resetZaehlstelle();
        this.$emit("cancel");
    }

    private resetZaehlstelle() {
        this.zaehlstelle = DefaultObjectCreator.createDefaultZaehlstelleDTO();
        this.stadtbezirksviertelModel = "";
        this.stadtbezirksviertel = {} as KeyVal;
        this.laufendeNummer = "";
        this.suchwoerter = [];
        this.newSuchwort = "";
        this.validZaehlstelle = false;
    }

    updateZaehlstellenCoords(newCoords: LatLng): void {
        if (!this.zaehlstelle.punkt) {
            this.zaehlstelle.punkt = {} as GeoPoint;
        }
        this.zaehlstelle.punkt.lat = newCoords.lat.toString();
        this.zaehlstelle.punkt.lon = newCoords.lng.toString();
    }
}
</script>

<style scoped>
.text-info {
    font-size: 18px;
    color: black;
}
</style>
