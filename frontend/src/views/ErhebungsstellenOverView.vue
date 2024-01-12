<template>
    <v-container
        fluid
        class="pa-0"
    >
        <v-sheet
            v-if="!isNotEmpty"
            id="empty"
            class="d-flex align-center justify-center pa-4 mx-auto"
        >
            <span class="text-caption grey--text text--lighten-1"
                >Es sind aktuell keine offenen Zählungen vorhanden.</span
            >
        </v-sheet>
        <v-sheet
            v-if="isNotEmpty"
            width="100%"
            color="transparent"
            class="overflow-y-auto"
        >
            <v-card-title style="font-weight: bold; font-size: x-large"
                >Zählstellen
            </v-card-title>
            <v-expansion-panels
                hover
                focusable
            >
                <open-zaehlung-panel
                    :header="getCreatedHeader"
                    :status-design="createdStatusDesign"
                    :zaehlungen="createdZaehlungen"
                />
                <open-zaehlung-panel
                    :header="getInstructedHeader"
                    :status-design="instructedStatusDesign"
                    :zaehlungen="instructedZaehlungen"
                />
                <open-zaehlung-panel
                    :header="getCountingHeader"
                    :status-design="countingStatusDesign"
                    :zaehlungen="countingZaehlungen"
                />
                <open-zaehlung-panel
                    :header="getAccomplishedHeader"
                    :status-design="accomplishedStatusDesign"
                    :zaehlungen="accomplishedZaehlungen"
                />
                <open-zaehlung-panel
                    :header="getCorrectionHeader"
                    :status-design="correctionStatusDesign"
                    :zaehlungen="correctionZaehlungen"
                />
            </v-expansion-panels>
            <v-card-title style="font-weight: bold; font-size: x-large"
                >Messstellen
            </v-card-title>
            <v-expansion-panels
                hover
                focusable
            >
                <open-messstelle-panel
                    :header="neueMessstellenHeader"
                    color="blue lighten-4"
                    icon="mdi-clipboard-edit-outline"
                    :messstellen="neueMessstellen"
                />
                <open-messstelle-panel
                    :header="nichtSichtbareMessstellenHeader"
                    color="purple lighten-4"
                    icon="mdi-eye-off-outline"
                    :messstellen="nichtSichtbareMessstellen"
                />
            </v-expansion-panels>
        </v-sheet>
    </v-container>
</template>

<script setup lang="ts">
import OpenZaehlungDTO from "@/domain/dto/OpenZaehlungDTO";
import Status, { statusIcon } from "@/domain/enums/Status";
import IconOptions from "@/components/icons/IconOptions";
import ZaehlungService from "@/api/service/ZaehlungService";
import ZaehlungComparator from "@/util/ZaehlungComparator";
import OpenZaehlungPanel from "@/components/zaehlung/OpenZaehlungPanel.vue";
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import { useStore } from "@/util/useStore";
import OpenMessstellePanel from "@/components/messstelle/OpenMessstellePanel.vue";
import MessstelleService from "@/api/service/MessstelleService";
import MessstelleOverviewDTO from "@/domain/dto/messstelle/MessstelleOverviewDTO";

const store = useStore();

const createdZaehlungen: Ref<Array<OpenZaehlungDTO>> = ref(
    [] as Array<OpenZaehlungDTO>
);
const instructedZaehlungen: Ref<Array<OpenZaehlungDTO>> = ref(
    [] as Array<OpenZaehlungDTO>
);
const countingZaehlungen: Ref<Array<OpenZaehlungDTO>> = ref(
    [] as Array<OpenZaehlungDTO>
);
const accomplishedZaehlungen: Ref<Array<OpenZaehlungDTO>> = ref(
    [] as Array<OpenZaehlungDTO>
);
const correctionZaehlungen: Ref<Array<OpenZaehlungDTO>> = ref(
    [] as Array<OpenZaehlungDTO>
);
const neueMessstellen: Ref<Array<MessstelleOverviewDTO>> = ref(
    [] as Array<MessstelleOverviewDTO>
);
const nichtSichtbareMessstellen: Ref<Array<MessstelleOverviewDTO>> = ref(
    [] as Array<MessstelleOverviewDTO>
);

const isNotEmpty: Ref<boolean> = ref(false);

const createdStatusDesign: ComputedRef<IconOptions> = computed(() => {
    return getStatusDesign(Status.CREATED);
});
const instructedStatusDesign: ComputedRef<IconOptions> = computed(() => {
    return getStatusDesign(Status.INSTRUCTED);
});
const countingStatusDesign: ComputedRef<IconOptions> = computed(() => {
    return getStatusDesign(Status.COUNTING);
});
const accomplishedStatusDesign: ComputedRef<IconOptions> = computed(() => {
    return getStatusDesign(Status.ACCOMPLISHED);
});
const correctionStatusDesign: ComputedRef<IconOptions> = computed(() => {
    return getStatusDesign(Status.CORRECTION);
});

const getCreatedHeader: ComputedRef<string> = computed(() => {
    return `Angelegte Zählungen: ${createdZaehlungen.value.length}`;
});
const getInstructedHeader: ComputedRef<string> = computed(() => {
    return `Beauftragte Zählungen: ${instructedZaehlungen.value.length}`;
});
const getCountingHeader: ComputedRef<string> = computed(() => {
    return `Laufende Zählungen: ${countingZaehlungen.value.length}`;
});
const getAccomplishedHeader: ComputedRef<string> = computed(() => {
    return `Durchgeführte Zählungen: ${accomplishedZaehlungen.value.length}`;
});
const getCorrectionHeader: ComputedRef<string> = computed(() => {
    return `Fehlerhafte Zählungen: ${correctionZaehlungen.value.length}`;
});
const neueMessstellenHeader: ComputedRef<string> = computed(() => {
    return `Neue Messstellen: ${neueMessstellen.value.length}`;
});
const nichtSichtbareMessstellenHeader: ComputedRef<string> = computed(() => {
    return `Nicht sichtbare Messstellen: ${nichtSichtbareMessstellen.value.length}`;
});

onMounted(() => {
    resetDataArrays();
    isNotEmpty.value = false;
    loadOpenZaehlungen();
    loadOpenMessstellen();
});

function loadOpenZaehlungen(): void {
    ZaehlungService.getAllOpenZaehlungen()
        .then((zaehlungen: Array<OpenZaehlungDTO>) => {
            zaehlungen.forEach((zaehlung: OpenZaehlungDTO) => {
                switch (zaehlung.status) {
                    case Status.CREATED:
                        createdZaehlungen.value.push(zaehlung);
                        break;
                    case Status.INSTRUCTED:
                        instructedZaehlungen.value.push(zaehlung);
                        break;
                    case Status.COUNTING:
                        countingZaehlungen.value.push(zaehlung);
                        break;
                    case Status.ACCOMPLISHED:
                        accomplishedZaehlungen.value.push(zaehlung);
                        break;
                    case Status.CORRECTION:
                        correctionZaehlungen.value.push(zaehlung);
                        break;
                }
            });
            isNotEmpty.value = isNotEmpty.value || zaehlungen.length > 0;
            sortDataArrays();
        })
        .catch((error) => store.dispatch("snackbar/showError", error));
}

function loadOpenMessstellen(): void {
    MessstelleService.getAllMessstellenForOverview()
        .then((messstellen: Array<MessstelleOverviewDTO>) => {
            messstellen.forEach((messstelle: MessstelleOverviewDTO) => {
                if (!messstelle.geprueft) {
                    neueMessstellen.value.push(messstelle);
                } else if (!messstelle.sichtbarDatenportal) {
                    nichtSichtbareMessstellen.value.push(messstelle);
                }
            });
            isNotEmpty.value = isNotEmpty.value || messstellen.length > 0;
            sortDataArrays();
        })
        .catch((error) => store.dispatch("snackbar/showError", error));
}

function sortDataArrays(): void {
    createdZaehlungen.value = sortByDatumDesc(createdZaehlungen.value);
    instructedZaehlungen.value = sortByDatumDesc(instructedZaehlungen.value);
    countingZaehlungen.value = sortByDatumDesc(countingZaehlungen.value);
    accomplishedZaehlungen.value = sortByDatumDesc(
        accomplishedZaehlungen.value
    );
    correctionZaehlungen.value = sortByDatumDesc(correctionZaehlungen.value);
    neueMessstellen.value = sortByMstId(neueMessstellen.value);
    nichtSichtbareMessstellen.value = sortByMstId(
        nichtSichtbareMessstellen.value
    );
}

function sortByDatumDesc(
    toSort: Array<OpenZaehlungDTO>
): Array<OpenZaehlungDTO> {
    return toSort.sort(ZaehlungComparator.sortByDatumDesc);
}

function sortByMstId(
    toSort: Array<MessstelleOverviewDTO>
): Array<MessstelleOverviewDTO> {
    return toSort.sort((a, b) => (a.mstId > b.mstId ? 1 : -1));
}

function resetDataArrays(): void {
    createdZaehlungen.value = [];
    instructedZaehlungen.value = [];
    countingZaehlungen.value = [];
    accomplishedZaehlungen.value = [];
    correctionZaehlungen.value = [];
}

function getStatusDesign(status: Status): IconOptions {
    let design: IconOptions | undefined = statusIcon.get(status);
    if (!design) {
        design = {} as IconOptions;
        design.color = "deep-orange lighten-4";
        design.iconPath = "mdi-calendar-question";
        design.tooltip = "Status unbekannt";
    }
    return design;
}
</script>

<style lang="sass">
// Entfernt die Elevation beim ExpansionPanel. Die Build-In-Funktion (flat) kann leider nicht genutzt werden,
// da dann auch die Trennstriche zwischen den Panels entfernt werden.
@import 'vuetify/src/components/VExpansionPanel/_variables.scss'
.v-expansion-panel
  &::before
    +elevation(0)
</style>