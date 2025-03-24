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

<script setup lang="ts">
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { computed, ref } from "vue";
import { StadtbezirkToBeschreibung } from "@/domain/enums/Stadtbezirk";
import { StadtbezirksviertelToBeschreibung } from "@/domain/enums/Stadtbezirksviertel";
import { cloneDeep, isEmpty, isNil } from "lodash";
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import { LatLng } from "leaflet";
import GeoPoint from "@/domain/GeoPoint";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

interface Props {
    zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "saved"): void;
}>();

const snackbarStore = useSnackbarStore();

const newSuchwort = ref("");

const cloneOfZaehlstelle = computed(() => {
    return cloneDeep(props.zaehlstelle);
});

const coords = computed(() => {
    const punkt: GeoPoint = cloneOfZaehlstelle.value.punkt;
    if (punkt) return new LatLng(parseFloat(punkt.lat), parseFloat(punkt.lon));
    else return DefaultObjectCreator.createCenterOfMunichLatLng();
});

const getStadtbezirksnummer = computed(() => {
    const stadtbezirksnummer: string | undefined =
        StadtbezirkToBeschreibung.get(
            cloneOfZaehlstelle.value.stadtbezirkNummer
        );
    if (!isNil(stadtbezirksnummer)) {
        return stadtbezirksnummer;
    }
    return "Der Stadtbezirk konnte nicht ermittelt werden.";
});

const getStadtbezirksviertel = computed(() => {
    const stadtbezirksviertelMap: Map<number, string> | undefined =
        StadtbezirksviertelToBeschreibung.get(
            cloneOfZaehlstelle.value.stadtbezirkNummer
        );
    if (!isNil(stadtbezirksviertelMap)) {
        const stadtbezirksviertelnummer: string | undefined =
            stadtbezirksviertelMap.get(getStadtbezirksviertelNummer.value);
        if (!isNil(stadtbezirksviertelnummer)) {
            return stadtbezirksviertelnummer;
        }
    }
    return "Das Stadtbezirksviertel konnte nicht ermittelt werden.";
});

const getStadtbezirksviertelNummer = computed(() => {
    if (!isNil(cloneOfZaehlstelle.value.nummer)) {
        if (cloneOfZaehlstelle.value.nummer.length === 5) {
            return parseInt(cloneOfZaehlstelle.value.nummer.substring(1, 3));
        } else if (cloneOfZaehlstelle.value.nummer.length === 6) {
            return parseInt(cloneOfZaehlstelle.value.nummer.substring(2, 4));
        }
    }
    return -1;
});

// Fuegt das eingegebene Wort den Suchwoertern hinzu
function addSuchwortToList() {
    if (isNil(cloneOfZaehlstelle.value.customSuchwoerter)) {
        cloneOfZaehlstelle.value.customSuchwoerter = [];
    }
    if (isNil(newSuchwort.value) || isEmpty(newSuchwort.value.trim())) {
        return;
    }
    if (
        !cloneOfZaehlstelle.value.customSuchwoerter.includes(newSuchwort.value)
    ) {
        cloneOfZaehlstelle.value.customSuchwoerter.push(
            ...newSuchwort.value.split(",")
        );
    }
    newSuchwort.value = "";
}

function save(): void {
    ZaehlstellenService.saveZaehlstelle(cloneOfZaehlstelle.value)
        .then(() => {
            emits("saved");
        })
        .catch((error) => snackbarStore.showApiError(error));
}

function cancel(): void {
    emits("cancel");
}

function updateZaehlstellenCoords(newCoords: LatLng): void {
    if (!cloneOfZaehlstelle.value.punkt) {
        cloneOfZaehlstelle.value.punkt = {} as GeoPoint;
    }
    cloneOfZaehlstelle.value.punkt.lat = newCoords.lat.toString();
    cloneOfZaehlstelle.value.punkt.lon = newCoords.lng.toString();
}
</script>


<style scoped>
.text-info {
    font-size: 18px;
    color: black;
}
</style>
