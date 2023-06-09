<template>
    <v-sheet
        width="100%"
        :height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <v-card-text>
            <v-row dense>
                <zaehlung-card-map
                    height="200px"
                    width="100%"
                    :lat-lng-zaehlstelle="coordsZaehlstelle"
                    :lat-lng-zaehlung="coordsZaehlung"
                    :show-luftbild="false"
                    :edit-zaehlung-marker="true"
                    @updateZaehlungCoords="updateZaehlungCoords"
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
                        color="grey darken-1"
                        hide-details
                        dense
                        @change="updateStore"
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
                        outlined
                        dense
                        @blur="updateStore"
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
                            dense
                            prepend-icon="mdi-numeric-1"
                            clearable
                            @click:clear="deleteKnotenarm(1)"
                            @blur="addOrUpdateStrassenname(1, strassen[0])"
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
                            dense
                            prepend-icon="mdi-numeric-2"
                            clearable
                            @click:clear="deleteKnotenarm(2)"
                            @blur="addOrUpdateStrassenname(2, strassen[1])"
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
                            dense
                            prepend-icon="mdi-numeric-3"
                            clearable
                            @click:clear="deleteKnotenarm(3)"
                            @blur="addOrUpdateStrassenname(3, strassen[2])"
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
                            dense
                            prepend-icon="mdi-numeric-4"
                            clearable
                            @click:clear="deleteKnotenarm(4)"
                            @blur="addOrUpdateStrassenname(4, strassen[3])"
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
                            dense
                            prepend-icon="mdi-numeric-5"
                            clearable
                            @click:clear="deleteKnotenarm(5)"
                            @blur="addOrUpdateStrassenname(5, strassen[4])"
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
                            dense
                            prepend-icon="mdi-numeric-6"
                            clearable
                            @click:clear="deleteKnotenarm(6)"
                            @blur="addOrUpdateStrassenname(6, strassen[5])"
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
                            dense
                            prepend-icon="mdi-numeric-7"
                            clearable
                            @click:clear="deleteKnotenarm(7)"
                            @blur="addOrUpdateStrassenname(7, strassen[6])"
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
                            dense
                            prepend-icon="mdi-numeric-8"
                            clearable
                            @click:clear="deleteKnotenarm(8)"
                            @blur="addOrUpdateStrassenname(8, strassen[7])"
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
                        id="geo"
                        height="100%"
                        width="100%"
                        active-color="#1565C0"
                        passive-color="#EEEEEE"
                        :knotenarme="knotenarmeStore"
                    ></zaehlung-geometrie>
                </v-col>
                <v-spacer />
            </v-row>
        </v-card-text>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import ZaehlungGeometrie from "@/components/zaehlung/ZaehlungGeometrie.vue";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import { LatLng } from "leaflet";
import GeoPoint from "@/domain/GeoPoint";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import ZaehlungCardMap from "@/components/map/ZaehlungCardMap.vue";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import _ from "lodash";
/* eslint-enable no-unused-vars */
@Component({
    components: {
        ZaehlungCardMap,
        ZaehlungGeometrie,
    },
})
export default class KnotenLageForm extends Vue {
    @Prop()
    private zaehlstelle!: ZaehlstelleDTO;

    @Prop()
    private readonly height!: string;

    private zaehlung: ZaehlungDTO =
        DefaultObjectCreator.createDefaultZaehlungDTO();

    private strassen: Array<string> = [];

    mounted() {
        this.updateWorkingCopy();
    }

    get zaehlungStore(): ZaehlungDTO {
        return this.$store.getters.getZaehlung;
    }

    get knotenarmeStore(): Array<KnotenarmDTO> {
        return this.$store.getters.getKnotenarme;
    }

    get defaultHochrechnungsfaktorStore(): HochrechnungsfaktorDTO {
        return this.$store.getters.getStandardHochrechnungsfaktor;
    }

    get resetFormEvent(): boolean {
        return this.$store.getters.getResetformevent;
    }

    @Watch("resetFormEvent")
    private resetForm() {
        // Alle Straßennamen löschen
        this.strassen = ["", "", "", "", "", "", "", ""];

        // Straßennamen neu setzen, wenn vorhanden
        let zaehlung: ZaehlungDTO = this.zaehlungStore;
        zaehlung.knotenarme.forEach((arm: KnotenarmDTO) => {
            this.strassen[arm.nummer - 1] = arm.strassenname;
        });
    }

    @Watch("zaehlungStore", { deep: true, immediate: true })
    updateWorkingCopy(): void {
        this.resetForm();
        this.zaehlung = _.cloneDeep(this.zaehlungStore);
    }

    addOrUpdateStrassenname(nummer: number, name: string) {
        // Kein Text mehr => löschen
        if (name === null || name === undefined || name.trim() === "") {
            // Knotenarm entfernen
            this.$store.dispatch("deleteKnotenarm", nummer);
            // Fahrbeziehung entfernen
            this.$store.dispatch(
                "deleteFahrbeziehungByKnotenarmnummer",
                nummer
            );
        } else {
            // hinzufügen oder aktualisieren
            let knotenarm: KnotenarmDTO = {} as KnotenarmDTO;
            knotenarm.nummer = nummer;
            knotenarm.strassenname = name.trim();
            this.$store.dispatch(
                "addOrUpdateKnotenarm",
                _.cloneDeep(knotenarm)
            );
        }
    }

    deleteKnotenarm(nummer: number) {
        this.$store.dispatch("deleteKnotenarm", nummer);
        // Fahrbeziehung entfernen
        this.$store.dispatch("deleteFahrbeziehungByKnotenarmnummer", nummer);
    }

    updateStore(): void {
        this.$store.dispatch("setZaehlung", _.cloneDeep(this.zaehlung));
    }

    get coordsZaehlstelle(): LatLng {
        let punkt: GeoPoint = this.zaehlstelle.punkt;
        if (punkt)
            return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
        else return DefaultObjectCreator.createCenterOfMunichLatLng();
    }

    get coordsZaehlung(): LatLng {
        let punkt: GeoPoint = this.zaehlung.punkt;
        if (punkt)
            return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
        else return this.coordsZaehlstelle;
    }

    private updateZaehlungCoords(newCoords: LatLng): void {
        if (!this.zaehlung.punkt) {
            this.zaehlung.punkt = {} as GeoPoint;
        }
        this.zaehlung.punkt.lat = newCoords.lat.toString();
        this.zaehlung.punkt.lon = newCoords.lng.toString();
        this.updateStore();
    }
}
</script>