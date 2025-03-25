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

<script setup lang="ts">
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import { computed, onMounted, ref, watch } from "vue";
import { useZaehlungStore } from "@/store/ZaehlungStore";
import { cloneDeep, isEmpty, isNil } from "lodash";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import GeoPoint from "@/domain/GeoPoint";
import { LatLng } from "leaflet";

interface Props {
    height: string;
    zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();

const zaehlung = ref(DefaultObjectCreator.createDefaultZaehlungDTO());

const strassen = ref<Array<string>>([]);

const zaehlungStore = useZaehlungStore();

onMounted(() => {
    updateWorkingCopy();
});

const knotenarmeStore = computed(() => {
    return zaehlungStore.getKnotenarme;
});

watch(
    () => zaehlungStore.getResetformevent,
    () => {
        resetForm();
    }
);

function resetForm() {
    // Alle Straßennamen löschen
    strassen.value = ["", "", "", "", "", "", "", ""];

    // Straßennamen neu setzen, wenn vorhanden
    const zaehlung: ZaehlungDTO = zaehlungStore.getZaehlung;
    zaehlung.knotenarme.forEach((arm: KnotenarmDTO) => {
        strassen.value[arm.nummer - 1] = arm.strassenname;
    });
}

watch(
    () => zaehlungStore.getZaehlung,
    () => {
        updateWorkingCopy();
    },
    { immediate: true, deep: true }
);

function updateWorkingCopy(): void {
    resetForm();
    zaehlung.value = cloneDeep(zaehlungStore.getZaehlung);
}

function addOrUpdateStrassenname(nummer: number, name: string) {
    // Kein Text mehr => löschen
    if (isNil(name) || isEmpty(name.trim())) {
        // Knotenarm entfernen
        zaehlungStore.deleteKnotenarm(nummer);
        // Fahrbeziehung entfernen
        zaehlungStore.deleteFahrbeziehungByKnotenarmnummer(nummer);
    } else {
        // hinzufügen oder aktualisieren
        const knotenarm: KnotenarmDTO = {} as KnotenarmDTO;
        knotenarm.nummer = nummer;
        knotenarm.strassenname = name.trim();
        zaehlungStore.addOrUpdateKnotenarm(cloneDeep(knotenarm));
    }
}

function deleteKnotenarm(nummer: number) {
    zaehlungStore.deleteKnotenarm(nummer);
    // Fahrbeziehung entfernen
    zaehlungStore.deleteFahrbeziehungByKnotenarmnummer(nummer);
}

function updateStore(): void {
    zaehlungStore.setZaehlung(cloneDeep(zaehlung.value));
}

const coordsZaehlstelle = computed(() => {
    const punkt: GeoPoint = props.zaehlstelle.punkt;
    if (punkt) {
        return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
    } else {
        return DefaultObjectCreator.createCenterOfMunichLatLng();
    }
});

const coordsZaehlung = computed(() => {
    const punkt: GeoPoint = zaehlung.value.punkt;
    if (punkt) {
        return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
    } else {
        return coordsZaehlstelle.value;
    }
});

function updateZaehlungCoords(newCoords: LatLng): void {
    if (!zaehlung.value.punkt) {
        zaehlung.value.punkt = {} as GeoPoint;
    }
    zaehlung.value.punkt.lat = newCoords.lat.toString();
    zaehlung.value.punkt.lon = newCoords.lng.toString();
    updateStore();
}
</script>