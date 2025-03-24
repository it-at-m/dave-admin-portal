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
                            v-if="unreadMessagesMobilitaetsreferat"
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

<script setup lang="ts">
import { computed, ref } from "vue";
import { useZaehlungStore } from "@/store/ZaehlungStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import GeoPoint from "@/domain/GeoPoint";
import i18n from "@/i18n";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import { cloneDeep } from "lodash";
import KnotenarmComparator from "@/util/KnotenarmComparator";
import IconOptions from "@/components/icons/IconOptions";
import Status, { statusIcon } from "@/domain/enums/Status";
import { LatLng } from "leaflet";
import UpdateStatusDTO from "@/domain/dto/bearbeiten/UpdateStatusDTO";
import ZaehlungService from "@/api/service/ZaehlungService";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";
import Wetter from "@/domain/enums/Wetter";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";

const ICON_COLOR = "black";
const deleteDialogText = ref("Wollen Sie die Zählung wirklich löschen?");

interface Props {
    geoPointZaehlstelle: GeoPoint;
    zaehlung: ZaehlungDTO;
    zaehlstelleId: string;
}
const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "deleted"): void;
    (e: "openZaehlungDialog"): void;
    (e: "openZaehlungDatenportal", zaehlungId: string): void;
    (e: "openChatDialog", zaehlungId: string): void;
    (e: "saved", payload: BackendIdDTO): void;
}>();

const snackbarStore = useSnackbarStore();
const zaehlungStore = useZaehlungStore();
const fab = ref(false);
const loading = ref(false);
const deleteDialog = ref(false);
const isBeauftragen = ref(true);

const unreadMessagesMobilitaetsreferat = ref(
    props.zaehlung.unreadMessagesMobilitaetsreferat
);

const showBeauftragenDialog = ref(false);

const coordsZaehlstelle = computed(() => {
    return createLatLngFromString(
        props.geoPointZaehlstelle.lat,
        props.geoPointZaehlstelle.lon
    );
});

const coordsZaehlung = computed(() => {
    let geoPoint: GeoPoint = props.zaehlung.punkt;
    return createLatLngFromString(geoPoint.lat, geoPoint.lon);
});

const title = computed(() => {
    return props.zaehlung.projektName;
});

const datum = computed(() => {
    return `${i18n.d(new Date(props.zaehlung.datum), "short", "de-DE")}`;
});

const streets = computed(() => {
    return cloneDeep(props.zaehlung.knotenarme).sort(
        KnotenarmComparator.sortByNumber
    );
});

const streetsHeader = [
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

const statusDesign = computed(() => {
    let design: IconOptions | undefined = statusIcon.get(props.zaehlung.status);
    if (!design) {
        design = {} as IconOptions;
        design.color = "deep-orange lighten-4";
        design.iconPath = "mdi-calendar-question";
        design.tooltip = "Status unbekannt";
    }
    return design;
});

const showButtonKorrektur = computed(() => {
    return props.zaehlung.status === Status.ACCOMPLISHED;
});

const showButtonFreigeben = computed(() => {
    return props.zaehlung.status === Status.ACCOMPLISHED;
});

const showButtonBeauftragen = computed(() => {
    return (
        props.zaehlung.status === Status.CREATED &&
        props.zaehlung.knotenarme &&
        props.zaehlung.knotenarme.length > 0
    );
});

const showButtonDatenportal = computed(() => {
    return (
        props.zaehlung.status === Status.ACCOMPLISHED ||
        props.zaehlung.status === Status.ACTIVE
    );
});

const showButtonDienstleisterKorrigieren = computed(() => {
    return (
        props.zaehlung.status === Status.INSTRUCTED ||
        props.zaehlung.status === Status.COUNTING ||
        props.zaehlung.status === Status.CORRECTION
    );
});

// Erzeugt aus den String Koordinaten ein Objekt von Typ LatLng
function createLatLngFromString(lat: string, lng: string): LatLng {
    return new LatLng(parseFloat(lat), parseFloat(lng));
}

function zaehlungBeauftragen(dienstleister: DienstleisterDTO) {
    loading.value = true;
    const update: UpdateStatusDTO = {} as UpdateStatusDTO;
    update.zaehlungId = props.zaehlung.id;
    update.status = Status.INSTRUCTED;
    update.dienstleisterkennung = dienstleister.kennung;
    ZaehlungService.updateStatus(update)
        .then((backendIdDTO) => {
            snackbarStore.showInfo(
                `Der Zähldienstleister ${dienstleister.name} wurde beauftragt die Zählung ${props.zaehlung.projektName} durchzuführen.`
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
    ZaehlungService.deleteZaehlungById(props.zaehlung.id)
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
    update.zaehlungId = props.zaehlung.id;
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
    update.zaehlungId = props.zaehlung.id;
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
    zaehlungStore.setZaehlung(cloneDeep(props.zaehlung));
    emits("openZaehlungDialog");
}

function openZaehlungInDatenportal() {
    emits("openZaehlungDatenportal", props.zaehlung.id);
}

function zaehlungKopieren() {
    loading.value = true;
    const zaehlungCopy: ZaehlungDTO = cloneDeep(props.zaehlung);
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
    ZaehlungService.saveZaehlung(zaehlungCopy, props.zaehlstelleId)
        .then((backendIdDTO: BackendIdDTO) => {
            snackbarStore.showInfo(
                `Die Zählung vom ${datum.value} wurde kopiert.`
            );
            emits("saved", backendIdDTO);
        })
        .catch((error) => snackbarStore.showApiError(error))
        .finally(() => {
            loading.value = false;
        });
}

function openChatDialog() {
    zaehlungStore.setZaehlung(cloneDeep(props.zaehlung));
    unreadMessagesMobilitaetsreferat.value = false;
    emits("openChatDialog", props.zaehlung.id);
}

function dienstleisterKorrigieren(dienstleister: DienstleisterDTO) {
    loading.value = true;
    ZaehlungService.updateDienstleisterkennung(props.zaehlung.id, dienstleister)
        .then((backendIdDTO) => {
            snackbarStore.showInfo(
                `Der Zähldienstleister ${dienstleister.name} wurde beauftragt die Zählung ${props.zaehlung.projektName} durchzuführen. (Korrektur)`
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
