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
                    <v-row no-gutters>
                        <v-col
                            cols="12"
                            md="6"
                        >
                            <span class="text-caption">Zählstellennummer</span
                            ><br />
                            <span class="text text-info">{{
                                cloneOfZaehlstelle.nummer
                            }}</span
                            ><br />
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col
                            cols="12"
                            md="12"
                        >
                            <span class="text-caption">Stadtbezirk</span><br />
                            <span class="text text-info">{{
                                getStadtbezirksnummer
                            }}</span
                            ><br />
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col
                            cols="12"
                            md="12"
                        >
                            <span class="text-caption">Stadtbezirksviertel</span
                            ><br />
                            <span class="text text-info">{{
                                getStadtbezirksviertel
                            }}</span
                            ><br />
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col
                            cols="12"
                            md="12"
                        >
                            <v-textarea
                                v-model="cloneOfZaehlstelle.kommentar"
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
                                v-model="cloneOfZaehlstelle.customSuchwoerter"
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
                                @keyup.enter="addSuchwortToList"
                                @blur="addSuchwortToList"
                            >
                            </v-combobox>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col
                            cols="12"
                            md="12"
                        >
                            <v-checkbox
                                v-model="cloneOfZaehlstelle.sichtbarDatenportal"
                                color="grey darken-1"
                                hide-details
                                dense
                            >
                                <template #label>
                                    <v-icon
                                        class="mr-1"
                                        color="red darken-1"
                                    >
                                        mdi-alert-outline
                                    </v-icon>
                                    <div>
                                        Sichtbarkeitsstatus Datenportal<br />
                                    </div>
                                </template>
                            </v-checkbox>
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
import { Component, Prop, Vue } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import { StadtbezirkToBeschreibung } from "@/domain/enums/Stadtbezirk";
import { StadtbezirksviertelToBeschreibung } from "@/domain/enums/Stadtbezirksviertel";
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import _ from "lodash";
import { LatLng } from "leaflet";
import GeoPoint from "@/domain/GeoPoint";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import MiniMap from "@/components/map/MiniMap.vue";
import { useSnackbarStore } from "@/store/snackbarStore";
/* eslint-enable no-unused-vars */
@Component({
    components: { MiniMap },
})
export default class UpdateZaehlstelleForm extends Vue {
    @Prop({ default: {} }) zaehlstelle!: ZaehlstelleDTO;

    private snackbarStore = useSnackbarStore();

    newSuchwort = "";

    get cloneOfZaehlstelle(): ZaehlstelleDTO {
        return _.cloneDeep(this.zaehlstelle);
    }

    get getStadtbezirksnummer(): string {
        const stadtbezirksnummer: string | undefined =
            StadtbezirkToBeschreibung.get(
                this.cloneOfZaehlstelle.stadtbezirkNummer
            );
        if (stadtbezirksnummer != undefined) {
            return stadtbezirksnummer;
        }
        return "Der Stadtbezirk konnte nicht ermittelt werden.";
    }

    get getStadtbezirksviertel(): string {
        const stadtbezirksviertelMap: Map<number, string> | undefined =
            StadtbezirksviertelToBeschreibung.get(
                this.cloneOfZaehlstelle.stadtbezirkNummer
            );
        if (stadtbezirksviertelMap != undefined) {
            const stadtbezirksviertelnummer: string | undefined =
                stadtbezirksviertelMap.get(this.getStadtbezirksviertelNummer);
            if (stadtbezirksviertelnummer != undefined) {
                return stadtbezirksviertelnummer;
            }
        }
        return "Das Stadtbezirksviertel konnte nicht ermittelt werden.";
    }

    get getStadtbezirksviertelNummer(): number {
        if (this.cloneOfZaehlstelle.nummer != null) {
            if (this.cloneOfZaehlstelle.nummer.length == 5) {
                return parseInt(this.cloneOfZaehlstelle.nummer.substr(1, 2));
            } else if (this.cloneOfZaehlstelle.nummer.length == 6) {
                return parseInt(this.cloneOfZaehlstelle.nummer.substr(2, 2));
            }
        }
        return -1;
    }

    // Fuegt das eingegebene Wort den Suchwoertern hinzu
    addSuchwortToList() {
        if (_.isNil(this.cloneOfZaehlstelle.customSuchwoerter)) {
            this.cloneOfZaehlstelle.customSuchwoerter = [];
        }

        if (this.newSuchwort == null || this.newSuchwort.trim() === "") {
            return;
        }

        if (
            !this.cloneOfZaehlstelle.customSuchwoerter.includes(
                this.newSuchwort
            )
        ) {
            this.cloneOfZaehlstelle.customSuchwoerter.push(
                ...this.newSuchwort.split(",")
            );
        }
        this.newSuchwort = "";
    }

    save(): void {
        ZaehlstellenService.saveZaehlstelle(this.cloneOfZaehlstelle)
            .then(() => {
                this.$emit("saved");
            })
            .catch((error) => this.snackbarStore.showApiError(error));
    }

    cancel(): void {
        this.$emit("cancel");
    }

    get coords(): LatLng {
        let punkt: GeoPoint = this.cloneOfZaehlstelle.punkt;
        if (punkt)
            return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
        else return DefaultObjectCreator.createCenterOfMunichLatLng();
    }

    updateZaehlstellenCoords(newCoords: LatLng): void {
        if (!this.cloneOfZaehlstelle.punkt) {
            this.cloneOfZaehlstelle.punkt = {} as GeoPoint;
        }
        this.cloneOfZaehlstelle.punkt.lat = newCoords.lat.toString();
        this.cloneOfZaehlstelle.punkt.lon = newCoords.lng.toString();
    }
}
</script>


<style scoped>
.text-info {
    font-size: 18px;
    color: black;
}
</style>
