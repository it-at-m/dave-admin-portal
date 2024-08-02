<template>
    <v-sheet
        width="100%"
        color="transparent"
        class="overflow-y-auto"
    >
        <v-card-title style="font-weight: bold; font-size: x-large"
            >Zählstellen
        </v-card-title>
        <v-expansion-panels
            v-if="hasOpenZaehlungen"
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
        <v-card-subtitle
            v-else
            class="text-caption grey--text text--lighten-1"
            >Es sind aktuell keine offenen Zählungen vorhanden.
        </v-card-subtitle>
    </v-sheet>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import OpenZaehlungDTO from "@/domain/dto/OpenZaehlungDTO";
import IconOptions from "@/components/icons/IconOptions";
import Status, { statusIcon } from "@/domain/enums/Status";
import ZaehlungService from "@/api/service/ZaehlungService";
import ZaehlungComparator from "@/util/ZaehlungComparator";
import OpenZaehlungPanel from "@/components/zaehlung/OpenZaehlungPanel.vue";
import { useSnackbarStore } from "@/store/snackbar";

const snackbarStore = useSnackbarStore();

const hasOpenZaehlungen: Ref<boolean> = ref(false);

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

onMounted(() => {
    resetDataArrays();
    loadOpenZaehlungen();
});

function loadOpenZaehlungen(): void {
    hasOpenZaehlungen.value = false;
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
            hasOpenZaehlungen.value = zaehlungen.length > 0;
            sortDataArraysZaehlstelle();
        })
        .catch((error) => snackbarStore.showApiError(error));
}

function sortDataArraysZaehlstelle(): void {
    createdZaehlungen.value = sortByDatumDesc(createdZaehlungen.value);
    instructedZaehlungen.value = sortByDatumDesc(instructedZaehlungen.value);
    countingZaehlungen.value = sortByDatumDesc(countingZaehlungen.value);
    accomplishedZaehlungen.value = sortByDatumDesc(
        accomplishedZaehlungen.value
    );
    correctionZaehlungen.value = sortByDatumDesc(correctionZaehlungen.value);
}

function sortByDatumDesc(
    toSort: Array<OpenZaehlungDTO>
): Array<OpenZaehlungDTO> {
    return toSort.sort(ZaehlungComparator.sortByDatumDesc);
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
<style scoped lang="sass">
// Entfernt die Elevation beim ExpansionPanel. Die Build-In-Funktion (flat) kann leider nicht genutzt werden,
// da dann auch die Trennstriche zwischen den Panels entfernt werden.
@import 'vuetify/src/components/VExpansionPanel/_variables.scss'
.v-expansion-panel
  &::before
    +elevation(0)
</style>