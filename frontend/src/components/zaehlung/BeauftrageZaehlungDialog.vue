<template>
    <v-dialog
        v-model="showDialog"
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
                    :items="getDienstleister"
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

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import DienstleisterService from "@/api/service/DienstleisterService";
import { ApiError } from "@/api/error";
import _ from "lodash";
import { useSnackbarStore } from "@/store/SnackbarStore";
/* eslint-enable no-unused-vars */
@Component
export default class BeauftrageZaehlungDialog extends Vue {
    /**
     * Steuerflag für den Dialog
     */
    @Prop() showDialog!: boolean;
    @Prop({ default: "" }) dienstleisterkennung?: string;
    @Prop() isBeauftragen!: boolean;

    private snackbarStore = useSnackbarStore();

    filterDienstleister = "";
    dienstleisterIsLoading = false;
    private dienstleister: Array<DienstleisterDTO> = [];
    selectedDienstleister: Array<DienstleisterDTO> = [];

    @Watch("showDialog")
    private initOnOpen() {
        if (this.showDialog) {
            this.filterDienstleister = "";
            this.dienstleister = [];
            this.selectedDienstleister = [];
            this.dienstleisterIsLoading = false;
            this.loadAllActiveDienstleister();
        }
    }

    cancel(): void {
        this.$emit("cancel");
    }

    beauftragen(): void {
        if (this.selectedDienstleister.length === 1) {
            this.$emit("beauftragen", this.selectedDienstleister[0]);
        }
    }

    korrigieren(): void {
        if (this.selectedDienstleister.length === 1) {
            this.$emit("korrigieren", this.selectedDienstleister[0]);
        }
    }

    get dialogtitle(): string {
        return this.isBeauftragen
            ? "Dienstleister beauftragen"
            : "Dienstleister korrigieren";
    }

    get dialogicon(): string {
        return this.isBeauftragen
            ? "mdi-account-arrow-right"
            : "mdi-account-convert-outline";
    }

    private loadAllActiveDienstleister() {
        this.dienstleister = [];
        this.dienstleisterIsLoading = true;
        DienstleisterService.getAllActive()
            .then((dienstleisterDTOS: Array<DienstleisterDTO>) => {
                this.dienstleister = dienstleisterDTOS;
                if (!_.isEmpty(this.dienstleisterkennung)) {
                    this.dienstleister.forEach((value: DienstleisterDTO) => {
                        if (value.kennung === this.dienstleisterkennung) {
                            this.selectedDienstleister.push(value);
                        }
                    });
                }
            })
            .catch((error) => this.snackbarStore.showApiError(error))
            .finally(() => {
                this.dienstleisterIsLoading = false;
            });
    }

    get getDienstleister(): Array<DienstleisterDTO> {
        return this.dienstleister;
    }

    get dienstleisterHeaders(): Array<any> {
        return [
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
    }

    /*
  Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
  64px Suche in Tabelle
  20px Padding Bottom
  52px Button
   */
    get tableHeightDienstleister(): string {
        // return parseInt(this.height.replace('px', '')) - 136 + 'px';
        // return '400px'
        return 600 - 58 - 64 - 52 + "px";
    }

    get getNoResultText(): string {
        return `Kein Dienstleister zum Filter '${this.filterDienstleister}' gefunden.`;
    }

    get showButtonBeauftragen(): boolean {
        return this.selectedDienstleister.length > 0 && this.isBeauftragen;
    }

    get showButtonKorrigieren(): boolean {
        return this.selectedDienstleister.length > 0 && !this.isBeauftragen;
    }
}
</script>