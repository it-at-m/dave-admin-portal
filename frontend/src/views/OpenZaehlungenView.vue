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
        </v-sheet>
    </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// Komponenten
// Typen
/* eslint-disable no-unused-vars */
import OpenZaehlungDTO from "@/domain/dto/OpenZaehlungDTO";
import Status, { statusIcon } from "@/domain/enums/Status";
import IconOptions from "@/components/icons/IconOptions";
/* eslint-enable no-unused-vars */
// API Services
import ZaehlungService from "@/api/service/ZaehlungService";

// Util
import ZaehlungComparator from "@/util/ZaehlungComparator";
import OpenZaehlungPanel from "@/components/zaehlung/OpenZaehlungPanel.vue";

@Component({
    components: { OpenZaehlungPanel },
})
export default class OpenZaehlungenView extends Vue {
    // Die Basisinformationen zur Zählstelle
    createdZaehlungen: Array<OpenZaehlungDTO> = [] as Array<OpenZaehlungDTO>;
    instructedZaehlungen: Array<OpenZaehlungDTO> = [] as Array<OpenZaehlungDTO>;
    countingZaehlungen: Array<OpenZaehlungDTO> = [] as Array<OpenZaehlungDTO>;
    accomplishedZaehlungen: Array<OpenZaehlungDTO> =
        [] as Array<OpenZaehlungDTO>;
    correctionZaehlungen: Array<OpenZaehlungDTO> = [] as Array<OpenZaehlungDTO>;

    isNotEmpty = false;

    /**
     * Die Daten der offenen Zählungen werden über die
     * API geladen.
     */
    mounted() {
        this.loadOpenZaehlungen();
    }

    private loadOpenZaehlungen(): void {
        this.resetDataArrays();
        this.isNotEmpty = false;
        ZaehlungService.getAllOpenZaehlungen()
            .then((zaehlungen: Array<OpenZaehlungDTO>) => {
                zaehlungen.forEach((zaehlung: OpenZaehlungDTO) => {
                    switch (zaehlung.status) {
                        case Status.CREATED:
                            this.createdZaehlungen.push(zaehlung);
                            break;
                        case Status.INSTRUCTED:
                            this.instructedZaehlungen.push(zaehlung);
                            break;
                        case Status.COUNTING:
                            this.countingZaehlungen.push(zaehlung);
                            break;
                        case Status.ACCOMPLISHED:
                            this.accomplishedZaehlungen.push(zaehlung);
                            break;
                        case Status.CORRECTION:
                            this.correctionZaehlungen.push(zaehlung);
                            break;
                    }
                });
                this.isNotEmpty = zaehlungen.length > 0;
                this.sortDataArrays();
            })
            .catch((error) =>
                this.$store.dispatch("snackbar/showError", error)
            );
    }

    private sortDataArrays(): void {
        this.createdZaehlungen = this.createdZaehlungen.sort(
            ZaehlungComparator.sortByDatumDesc
        );
        this.instructedZaehlungen = this.instructedZaehlungen.sort(
            ZaehlungComparator.sortByDatumDesc
        );
        this.countingZaehlungen = this.countingZaehlungen.sort(
            ZaehlungComparator.sortByDatumDesc
        );
        this.accomplishedZaehlungen = this.accomplishedZaehlungen.sort(
            ZaehlungComparator.sortByDatumDesc
        );
        this.correctionZaehlungen = this.correctionZaehlungen.sort(
            ZaehlungComparator.sortByDatumDesc
        );
    }

    private resetDataArrays(): void {
        this.createdZaehlungen = [];
        this.instructedZaehlungen = [];
        this.countingZaehlungen = [];
        this.accomplishedZaehlungen = [];
        this.correctionZaehlungen = [];
    }

    private getStatusDesign(status: Status): IconOptions {
        let design: IconOptions | undefined = statusIcon.get(status);
        if (!design) {
            design = {} as IconOptions;
            design.color = "deep-orange lighten-4";
            design.iconPath = "mdi-calendar-question";
            design.tooltip = "Status unbekannt";
        }
        return design;
    }

    get createdStatusDesign(): IconOptions {
        return this.getStatusDesign(Status.CREATED);
    }

    get instructedStatusDesign(): IconOptions {
        return this.getStatusDesign(Status.INSTRUCTED);
    }

    get countingStatusDesign(): IconOptions {
        return this.getStatusDesign(Status.COUNTING);
    }

    get accomplishedStatusDesign(): IconOptions {
        return this.getStatusDesign(Status.ACCOMPLISHED);
    }

    get correctionStatusDesign(): IconOptions {
        return this.getStatusDesign(Status.CORRECTION);
    }

    get getCreatedHeader() {
        return `Angelegte Zählungen: ${this.createdZaehlungen.length}`;
    }

    get getInstructedHeader() {
        return `Beauftragte Zählungen: ${this.instructedZaehlungen.length}`;
    }

    get getCountingHeader() {
        return `Laufende Zählungen: ${this.countingZaehlungen.length}`;
    }

    get getAccomplishedHeader() {
        return `Durchgeführte Zählungen: ${this.accomplishedZaehlungen.length}`;
    }

    get getCorrectionHeader() {
        return `Fehlerhafte Zählungen: ${this.correctionZaehlungen.length}`;
    }
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