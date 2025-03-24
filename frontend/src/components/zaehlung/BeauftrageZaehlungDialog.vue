<template>
    <v-dialog
        v-model="showDialogModel"
        persistent
        max-width="50%"
        height="600px"
    >
        <v-card flat>
            <v-card-title>
                <v-icon left> {{ dialogicon }} </v-icon>
                {{ dialogtitle }}
            </v-card-title>

            <v-card-text>
                <v-data-table
                    v-model="selectedDienstleister"
                    class="overflow-y-auto"
                    :height="tableHeightDienstleister"
                    dense
                    :headers="dienstleisterHeaders"
                    :items="dienstleister"
                    :items-per-page="-1"
                    hide-default-footer
                    fixed-header
                    :search="filterDienstleister"
                    :loading="dienstleisterIsLoading"
                    no-data-text="Keine aktiven Dienstleister vorhanden."
                    :no-results-text="getNoResultText"
                    show-select
                    single-select
                >
                    <template #top>
                        <v-toolbar flat>
                            <!-- Eingabefeld zum Filtern der Dienstleister -->
                            <v-text-field
                                v-model="filterDienstleister"
                                append-icon="mdi-filter"
                                label="Dienstleister nach dem gefiltert werden soll"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-toolbar>
                    </template>
                </v-data-table>
            </v-card-text>

            <v-card-actions>
                <v-spacer />
                <v-btn
                    v-if="showButtonBeauftragen"
                    color="secondary"
                    @click="beauftragen()"
                >
                    Beauftragen
                </v-btn>
                <v-btn
                    v-if="showButtonKorrigieren"
                    color="secondary"
                    @click="korrigieren()"
                >
                    Korrigieren
                </v-btn>
                <v-btn
                    color="grey lighten-1"
                    @click="cancel()"
                >
                    Abbrechen
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import { isEmpty } from "lodash";
import DienstleisterService from "@/api/service/DienstleisterService";

interface Props {
    showDialog: boolean;
    isBeauftragen: boolean;
    dienstleisterkennung?: string;
}
const props = withDefaults(defineProps<Props>(), {
    dienstleisterkennung: "",
});
const showDialogModel = computed(() => {
    return props.showDialog;
});
const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "beauftragen", payload: DienstleisterDTO): void;
    (e: "korrigieren", payload: DienstleisterDTO): void;
}>();

const snackbarStore = useSnackbarStore();

const filterDienstleister = ref("");
const dienstleisterIsLoading = ref(false);
const dienstleister = ref<Array<DienstleisterDTO>>([]);
const selectedDienstleister = ref<Array<DienstleisterDTO>>([]);

watch(
    () => props.showDialog,
    () => {
        if (props.showDialog) {
            filterDienstleister.value = "";
            dienstleister.value = [];
            selectedDienstleister.value = [];
            dienstleisterIsLoading.value = false;
            loadAllActiveDienstleister();
        }
    }
);

function cancel(): void {
    emits("cancel");
}

function beauftragen(): void {
    if (selectedDienstleister.value.length === 1) {
        emits("beauftragen", selectedDienstleister.value[0]);
    }
}

function korrigieren(): void {
    if (selectedDienstleister.value.length === 1) {
        emits("korrigieren", selectedDienstleister.value[0]);
    }
}

const dialogtitle = computed(() => {
    return props.isBeauftragen
        ? "Dienstleister beauftragen"
        : "Dienstleister korrigieren";
});

const dialogicon = computed(() => {
    return props.isBeauftragen
        ? "mdi-account-arrow-right"
        : "mdi-account-convert-outline";
});

function loadAllActiveDienstleister() {
    dienstleister.value = [];
    dienstleisterIsLoading.value = true;
    DienstleisterService.getAllActive()
        .then((dienstleisterDTOS: Array<DienstleisterDTO>) => {
            dienstleister.value = dienstleisterDTOS;
            if (!isEmpty(props.dienstleisterkennung)) {
                selectedDienstleister.value = dienstleister.value.filter(
                    (value) => value.kennung === props.dienstleisterkennung
                );
            }
        })
        .catch((error) => snackbarStore.showApiError(error))
        .finally(() => {
            dienstleisterIsLoading.value = false;
        });
}

const dienstleisterHeaders = [
    {
        text: "Name",
        align: "start",
        value: "name",
        divider: true,
    },
    {
        text: "Kennung",
        value: "kennung",
        divider: true,
    },
    {
        text: "Email",
        value: "emailAddressesAsString",
    },
];

/*
  Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
  64px Suche in Tabelle
  58px Header
  52px Button
   */
const tableHeightDienstleister = computed(() => {
    return 600 - 58 - 64 - 52 + "px";
});

const getNoResultText = computed(() => {
    return `Kein Dienstleister zum Filter '${filterDienstleister.value}' gefunden.`;
});

const showButtonBeauftragen = computed(() => {
    return selectedDienstleister.value.length > 0 && props.isBeauftragen;
});

const showButtonKorrigieren = computed(() => {
    return selectedDienstleister.value.length > 0 && !props.isBeauftragen;
});
</script>