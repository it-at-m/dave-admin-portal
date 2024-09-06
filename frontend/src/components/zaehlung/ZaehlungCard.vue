<template>
    <v-card
        :loading="loading"
        class="mx-auto my-12"
        max-width="374"
    >
        <template slot="progress">
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

        <v-speed-dial
            v-model="fab"
            absolute
            top
            left
        >
            <template #activator>
                <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                        <v-avatar
                            v-bind="attrs"
                            :color="statusDesign.color"
                            size="56"
                            v-on="on"
                        >
                            <v-icon x-large>{{ statusDesign.iconPath }}</v-icon>
                        </v-avatar>
                    </template>
                    <span>
                        {{ statusDesign.tooltip }}
                    </span>
                </v-tooltip>
            </template>
        </v-speed-dial>

        <div
            :style="{ cursor: 'pointer' }"
            @click="openZaehlungDialog"
        >
            <v-row>
                <v-col
                    cols="12"
                    md="8"
                >
                    <v-card-title>{{ title }}</v-card-title>
                    <v-card-subtitle>{{ datum }}</v-card-subtitle>
                </v-col>
                <v-col
                    cols="12"
                    md="4"
                >
                    <v-card-title>
                        <zaehlung-geometrie
                            height="60"
                            width="60"
                            active-color="#1565C0"
                            passive-color="#EEEEEE"
                            :knotenarme="zaehlung.knotenarme"
                        ></zaehlung-geometrie>
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
                            :color="iconColor"
                        ></zaehlart-icon>
                    </v-col>
                    <v-spacer />
                    <v-col
                        cols="12"
                        md="1"
                    >
                        <wetter-icon
                            :wetter="zaehlung.wetter"
                            :color="iconColor"
                        ></wetter-icon>
                    </v-col>
                    <v-spacer />
                    <v-col
                        cols="12"
                        md="1"
                    >
                        <zaehldauer-icon
                            :zaehldauer="zaehlung.zaehldauer"
                            :color="iconColor"
                        ></zaehldauer-icon>
                    </v-col>
                    <v-spacer />
                    <v-col
                        cols="12"
                        md="1"
                    >
                        <quelle-icon
                            :quelle="zaehlung.quelle"
                            :color="iconColor"
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
                            dense
                            :headers="streetsHeader"
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
                @click="zaehlungFreigeben"
            >
                Freigeben
            </v-btn>
            <v-btn
                v-if="showButtonKorrektur"
                class="ml-2 mr-2"
                color="secondary"
                @click="zaehlungKorrigieren"
            >
                Korrigieren
            </v-btn>
            <v-btn
                v-if="showButtonBeauftragen"
                class="ml-2 mr-2"
                color="secondary"
                @click="openDienstleisterDialog(true)"
            >
                Beauftragen
            </v-btn>
            <v-spacer />

            <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                    <v-btn
                        v-bind="attrs"
                        class="ml-2 mr-2"
                        icon
                        color="secondary"
                        v-on="on"
                        @click="openChatDialog"
                    >
                        <v-badge
                            v-if="zaehlung.unreadMessagesMobilitaetsreferat"
                            dot
                            color="red"
                        >
                            <v-icon>mdi-tooltip-account</v-icon>
                        </v-badge>
                        <v-icon v-else>mdi-tooltip-account</v-icon>
                    </v-btn>
                </template>
                <span> Chat </span>
            </v-tooltip>

            <v-menu
                top
                right
                offset-x
                offset-y
            >
                <template #activator="{ on, attrs }">
                    <v-btn
                        color="black"
                        icon
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>

                <v-list dense>
                    <v-list-item dense>
                        <v-tooltip right>
                            <template #activator="{ on, attrs }">
                                <v-btn
                                    v-bind="attrs"
                                    class="ml-2 mr-2"
                                    icon
                                    small
                                    color="secondary"
                                    v-on="on"
                                    @click="zaehlungLoeschen"
                                >
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </template>
                            <span> Löschen </span>
                        </v-tooltip>
                    </v-list-item>
                    <v-list-item
                        v-if="showButtonDienstleisterKorrigieren"
                        dense
                    >
                        <v-tooltip right>
                            <template #activator="{ on, attrs }">
                                <v-btn
                                    v-bind="attrs"
                                    class="ml-2 mr-2"
                                    icon
                                    color="secondary"
                                    v-on="on"
                                    @click="openDienstleisterDialog(false)"
                                >
                                    <v-icon>mdi-account-convert-outline</v-icon>
                                </v-btn>
                            </template>
                            <span> Dienstleister korrigieren </span>
                        </v-tooltip>
                    </v-list-item>
                    <v-list-item dense>
                        <v-tooltip right>
                            <template #activator="{ on, attrs }">
                                <v-btn
                                    v-bind="attrs"
                                    class="ml-2 mr-2"
                                    icon
                                    small
                                    color="secondary"
                                    v-on="on"
                                    @click="zaehlungKopieren"
                                >
                                    <v-icon>mdi-content-copy</v-icon>
                                </v-btn>
                            </template>
                            <span> Kopieren </span>
                        </v-tooltip>
                    </v-list-item>
                    <v-list-item
                        v-if="showButtonDatenportal"
                        dense
                    >
                        <v-tooltip right>
                            <template #activator="{ on, attrs }">
                                <v-btn
                                    v-bind="attrs"
                                    class="ml-2 mr-2"
                                    icon
                                    color="secondary"
                                    v-on="on"
                                    @click="openZaehlungInDatenportal"
                                >
                                    <v-icon>mdi-link-variant</v-icon>
                                </v-btn>
                            </template>
                            <span> Datenportal </span>
                        </v-tooltip>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-card-actions>

        <delete-zaehlung-dialog
            :show-dialog="deleteDialog"
            :dialogtext="deleteDialogText"
            @cancel="deleteDialog = false"
            @deleteIt="deleteZaehlung"
        />

        <beauftrage-zaehlung-dialog
            :show-dialog="showBeauftragenDialog"
            :dienstleisterkennung="zaehlung.dienstleisterkennung"
            :is-beauftragen="isBeauftragen"
            @cancel="showBeauftragenDialog = false"
            @beauftragen="zaehlungBeauftragen"
            @korrigieren="dienstleisterKorrigieren"
        />
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import ZaehlungCardMap from "@/components/map/ZaehlungCardMap.vue";
import { latLng, LatLng } from "leaflet";
import GeoPoint from "@/domain/GeoPoint";
import ZaehlartIcon from "@/components/icons/ZaehlartIcon.vue";
import WetterIcon from "@/components/icons/WetterIcon.vue";
import ZaehldauerIcon from "@/components/icons/ZaehldauerIcon.vue";
import QuelleIcon from "@/components/icons/QuelleIcon.vue";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import KnotenarmComparator from "@/util/KnotenarmComparator";
import Status, { statusIcon } from "@/domain/enums/Status";
import ZaehlungGeometrie from "@/components/zaehlung/ZaehlungGeometrie.vue";
import IconOptions from "@/components/icons/IconOptions";
import ZaehlungService from "@/api/service/ZaehlungService";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import { cloneDeep } from "lodash";
import DeleteZaehlungDialog from "@/components/zaehlung/DeleteZaehlungDialog.vue";
import Wetter from "@/domain/enums/Wetter";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import UpdateStatusDTO from "@/domain/dto/bearbeiten/UpdateStatusDTO";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import BeauftrageZaehlungDialog from "@/components/zaehlung/BeauftrageZaehlungDialog.vue";
import { useSnackbarStore } from "@/store/snackbarStore";
import { useZaehlungStore } from "@/store/zaehlungStore";
@Component({
    components: {
        BeauftrageZaehlungDialog,
        DeleteZaehlungDialog,
        ZaehlungGeometrie,
        QuelleIcon,
        ZaehldauerIcon,
        WetterIcon,
        ZaehlartIcon,
        ZaehlungCardMap,
        ZaehlstelleMap,
    },
})
export default class ZaehlungCard extends Vue {
    fab = false;
    loading = false;
    iconColor = "black";
    deleteDialog = false;
    deleteDialogText = "Wollen Sie die Zählung wirklich löschen?";
    isBeauftragen = true;

    showBeauftragenDialog = false;

    private snackbarStore = useSnackbarStore();
    private zaehlungStore = useZaehlungStore();

    @Prop()
    readonly zaehlung!: ZaehlungDTO;

    @Prop()
    private readonly zaehlstelleId!: string;

    @Prop()
    private readonly geoPointZaehlstelle!: GeoPoint;

    get getZaehlung(): ZaehlungDTO {
        return this.zaehlung;
    }

    get coordsZaehlstelle(): LatLng {
        return this.createLatLngFromString(
            this.geoPointZaehlstelle.lat,
            this.geoPointZaehlstelle.lon
        );
    }

    get coordsZaehlung(): LatLng {
        let geoPoint: GeoPoint = this.zaehlung.punkt;
        return this.createLatLngFromString(geoPoint.lat, geoPoint.lon);
    }

    get title(): string {
        return this.getZaehlung.projektName;
    }

    get datum(): string {
        return `${this.$d(new Date(this.getZaehlung.datum), "short", "de-DE")}`;
    }

    get streets(): Array<KnotenarmDTO> {
        let knotenarme: Array<KnotenarmDTO> = [];
        Object.assign(knotenarme, this.getZaehlung.knotenarme);
        return knotenarme.sort(KnotenarmComparator.sortByNumber);
    }

    get streetsHeader(): Array<any> {
        return [
            {
                text: "Nummer",
                align: "center",
                sortable: false,
                value: "nummer",
                divider: "true",
            },
            {
                text: "Straßenname",
                align: "center",
                sortable: false,
                value: "strassenname",
            },
        ];
    }

    get statusDesign(): IconOptions {
        let design: IconOptions | undefined = statusIcon.get(
            this.zaehlung.status
        );
        if (!design) {
            design = {} as IconOptions;
            design.color = "deep-orange lighten-4";
            design.iconPath = "mdi-calendar-question";
            design.tooltip = "Status unbekannt";
        }
        return design;
    }

    get showButtonKorrektur(): boolean {
        return this.zaehlung.status === Status.ACCOMPLISHED;
    }

    get showButtonFreigeben(): boolean {
        return this.zaehlung.status === Status.ACCOMPLISHED;
    }

    get showButtonBeauftragen(): boolean {
        return (
            this.zaehlung.status === Status.CREATED &&
            this.zaehlung.knotenarme &&
            this.zaehlung.knotenarme.length > 0
        );
    }

    get showButtonDatenportal(): boolean {
        return (
            this.zaehlung.status === Status.ACCOMPLISHED ||
            this.zaehlung.status === Status.ACTIVE
        );
    }

    get showButtonDienstleisterKorrigieren(): boolean {
        return (
            this.zaehlung.status === Status.INSTRUCTED ||
            this.zaehlung.status === Status.COUNTING ||
            this.zaehlung.status === Status.CORRECTION
        );
    }

    // Erzeugt aus den String Koordinaten ein Objekt von Typ LatLng
    private createLatLngFromString(lat: string, lng: string): LatLng {
        return latLng(parseFloat(lat), parseFloat(lng));
    }

    zaehlungBeauftragen(dienstleister: DienstleisterDTO) {
        this.loading = true;
        const update: UpdateStatusDTO = {} as UpdateStatusDTO;
        update.zaehlungId = this.zaehlung.id;
        update.status = Status.INSTRUCTED;
        update.dienstleisterkennung = dienstleister.kennung;
        ZaehlungService.updateStatus(update)
            .then((backendIdDTO) => {
                this.snackbarStore.showInfo(
                    `Der Zähldienstleister ${dienstleister.name} wurde beauftragt die Zählung ${this.getZaehlung.projektName} durchzuführen.`
                );
                this.$emit("saved", backendIdDTO);
            })
            .catch((error) => this.snackbarStore.showApiError(error))
            .finally(() => {
                this.loading = false;
                this.isBeauftragen = true;
            });
    }

    zaehlungLoeschen() {
        this.deleteDialogText = `Wollen Sie die Zählung vom ${this.datum} wirklich löschen?`;
        this.deleteDialog = true;
    }

    deleteZaehlung() {
        this.deleteDialog = false;
        this.loading = true;
        ZaehlungService.deleteZaehlungById(this.zaehlung.id)
            .then((isDeleted: boolean) => {
                if (isDeleted) {
                    this.snackbarStore.showInfo(
                        `Die Zählung vom ${this.datum} wurde gelöscht.`
                    );
                    this.$emit("deleted");
                } else {
                    this.snackbarStore.showError(
                        `Die Zählung vom ${this.datum} konnte nicht gelöscht werden.`
                    );
                }
            })
            .catch((error) => this.snackbarStore.showApiError(error))
            .finally(() => {
                this.loading = false;
            });
    }

    zaehlungFreigeben() {
        this.loading = true;
        const update: UpdateStatusDTO = {} as UpdateStatusDTO;
        update.zaehlungId = this.zaehlung.id;
        update.status = Status.ACTIVE;
        ZaehlungService.updateStatus(update)
            .then((backendIdDTO) => {
                this.snackbarStore.showInfo(
                    `Die Zählung vom ${this.datum} wurde freigegeben.`
                );
                this.$emit("saved", backendIdDTO);
            })
            .catch((error) => this.snackbarStore.showApiError(error))
            .finally(() => {
                this.loading = false;
            });
    }

    zaehlungKorrigieren() {
        this.loading = true;
        const update: UpdateStatusDTO = {} as UpdateStatusDTO;
        update.zaehlungId = this.zaehlung.id;
        update.status = Status.CORRECTION;
        ZaehlungService.updateStatus(update)
            .then((backendIdDTO) => {
                this.snackbarStore.showInfo(
                    `Die Zählung vom ${this.datum} wurde dem Zähldienstleister zur Korrektur übermittelt.`
                );
                this.$emit("saved", backendIdDTO);
            })
            .catch((error) => this.snackbarStore.showApiError(error))
            .finally(() => {
                this.loading = false;
            });
    }

    openZaehlungDialog() {
        this.zaehlungStore.setZaehlung(cloneDeep(this.zaehlung));
        this.$emit("openZaehlungDialog");
    }

    openZaehlungInDatenportal() {
        this.$emit("openZaehlungDatenportal", this.getZaehlung.id);
    }

    zaehlungKopieren() {
        this.loading = true;
        let zaehlungCopy: ZaehlungDTO = cloneDeep(this.zaehlung);
        zaehlungCopy.id = "";
        zaehlungCopy.kommentar = "";
        zaehlungCopy.zaehlsituation = "";
        zaehlungCopy.zaehlsituationErweitert = "";
        zaehlungCopy.wetter = Wetter.NO_INFORMATION;
        zaehlungCopy.status = Status.CREATED;
        zaehlungCopy.dienstleisterkennung = "";
        zaehlungCopy.datum = new Date().toISOString().substr(0, 10);
        zaehlungCopy.knotenarme.forEach((arm: KnotenarmDTO) => {
            arm.id = "";
        });
        zaehlungCopy.fahrbeziehungen.forEach((fz: FahrbeziehungDTO) => {
            fz.id = "";
            fz.hochrechnungsfaktor.id = "";
        });
        ZaehlungService.saveZaehlung(zaehlungCopy, this.zaehlstelleId)
            .then((backendIdDTO: BackendIdDTO) => {
                this.snackbarStore.showInfo(
                    `Die Zählung vom ${this.datum} wurde kopiert.`
                );
                this.$emit("saved", backendIdDTO);
            })
            .catch((error) => this.snackbarStore.showApiError(error))
            .finally(() => {
                this.loading = false;
            });
    }

    openChatDialog() {
        this.zaehlungStore.setZaehlung(cloneDeep(this.zaehlung));
        this.zaehlung.unreadMessagesMobilitaetsreferat = false;
        this.$emit("openChatDialog", this.zaehlung.id);
    }

    dienstleisterKorrigieren(dienstleister: DienstleisterDTO) {
        this.loading = true;
        ZaehlungService.updateDienstleisterkennung(
            this.getZaehlung.id,
            dienstleister
        )
            .then((backendIdDTO) => {
                this.snackbarStore.showInfo(
                    `Der Zähldienstleister ${dienstleister.name} wurde beauftragt die Zählung ${this.getZaehlung.projektName} durchzuführen. (Korrektur)`
                );
                this.$emit("saved", backendIdDTO);
            })
            .catch((error) => this.snackbarStore.showApiError(error))
            .finally(() => {
                this.loading = false;
                this.isBeauftragen = true;
            });
    }

    openDienstleisterDialog(isBeauftragen: boolean): void {
        this.showBeauftragenDialog = true;
        this.isBeauftragen = isBeauftragen;
    }
}
</script>
