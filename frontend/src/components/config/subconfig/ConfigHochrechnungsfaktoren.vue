<template>
    <v-sheet
        width="100%"
        :height="height"
        :max-height="height"
    >
        <v-data-table
            class="overflow-y-auto"
            :height="tableHeight"
            dense
            :headers="header"
            :items="getHochrechnungsfaktoren"
            :items-per-page="-1"
            hide-default-footer
            fixed-header
            :search="filterMatrix"
        >
            <template #top>
                <v-toolbar flat>
                    <!-- Eingabefeld zum Filtern der Matrix -->
                    <v-text-field
                        v-model="filterMatrix"
                        append-icon="mdi-filter"
                        label="Matrix nach der gefiltert werden soll"
                        single-line
                        hide-details
                    ></v-text-field>

                    <v-spacer />

                    <!-- Der Editierdialog -->
                    <v-dialog
                        v-model="showEditDialog"
                        max-width="700px"
                        persistent
                    >
                        <template #activator="{ on, attrs }">
                            <v-icon
                                v-bind="attrs"
                                v-on="on"
                            >
                                mdi-plus-box
                            </v-icon>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="text-h5"
                                    >Hochrechnungsfaktor anlegen</span
                                >
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="8"
                                        >
                                            <!-- Der eindeutige Bezeichner -->
                                            <v-text-field
                                                v-model="
                                                    editHochrechnungsfaktor.matrix
                                                "
                                                label="Matrix"
                                                :rules="[
                                                    matrixVerwendbar,
                                                    pflichtfeld,
                                                ]"
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model.number="
                                                    editHochrechnungsfaktor.kfz
                                                "
                                                label="KFZ"
                                                type="number"
                                                :rules="[mustBeNumber]"
                                                validate-on-blur
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model.number="
                                                    editHochrechnungsfaktor.sv
                                                "
                                                label="SV"
                                                type="number"
                                                :rules="[mustBeNumber]"
                                                validate-on-blur
                                            ></v-text-field>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model.number="
                                                    editHochrechnungsfaktor.gv
                                                "
                                                label="GV"
                                                type="number"
                                                :rules="[mustBeNumber]"
                                                validate-on-blur
                                            ></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <v-checkbox
                                                v-model="
                                                    editHochrechnungsfaktor.active
                                                "
                                                label="Aktiv"
                                            ></v-checkbox>
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            md="4"
                                        >
                                            <!-- Es darf nur ein DTO den Wert true annehmen -->
                                            <v-checkbox
                                                v-model="
                                                    editHochrechnungsfaktor.defaultFaktor
                                                "
                                                label="Default"
                                                :rules="[isDefaultFactorValid]"
                                            ></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <!-- Buttons zum speichern und Abbrechen des Editierdialogs -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="secondary"
                                    :disabled="disableSpeicherButton"
                                    @click="saveEditItemDialog"
                                >
                                    Speichern
                                </v-btn>
                                <v-btn
                                    color="grey lighten-1"
                                    @click="closeEditItemDialog"
                                >
                                    Abbrechen
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Der Löschdialog -->
                    <v-dialog
                        v-model="showDeleteDialog"
                        max-width="700px"
                        persistent
                    >
                        <v-card>
                            <v-card-title
                                >Soll der Hochrechnungsfaktor gelöscht
                                werden?</v-card-title
                            >
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="red lighten-1"
                                    @click="deleteItemConfirm"
                                >
                                    Löschen
                                </v-btn>
                                <v-btn
                                    color="grey lighten-1"
                                    @click="closeDelete"
                                >
                                    Abbrechen
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>

            <!-- Für Anzeige der Booleans "active" und "defaultFaktor" als Check (Haken) -->
            <template #[`item.active`]="{ item }">
                <v-icon v-if="item.active"> mdi-check-bold </v-icon>
            </template>
            <template #[`item.defaultFaktor`]="{ item }">
                <v-icon v-if="item.defaultFaktor"> mdi-check-bold </v-icon>
            </template>

            <!-- Buttons in Tabellenspalte "Aktionen" -->
            <template #[`item.aktionen`]="{ item }">
                <v-icon
                    small
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    class="ml-3"
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import HochrechnungsfaktorService from "@/api/service/HochrechnungsfaktorService";
import _ from "lodash";
import { useSnackbarStore } from "@/store/snackbarStore";
import { useHochrechnungsfaktorStore } from "@/store/hochrechnungsfaktorStore";

@Component
export default class ConfigHochrechnungsfaktoren extends Vue {
    @Prop() readonly height!: string;

    private snackbarStore = useSnackbarStore();
    private hochrechnungsfaktorStore = useHochrechnungsfaktorStore();

    filterMatrix = "";

    // Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
    // 64px Suche in Tabelle
    // 20px Padding Bottom
    // 52px Button
    get tableHeight(): string {
        return parseInt(this.height.replace("px", "")) - 136 + "px";
    }

    /**
     * Zur Prüfung ob Matrix bereits vergeben.
     */
    private hofaMatrizen: Set<string> = new Set<string>();

    /**
     * Zur Prüfung ob defaultFaktor maximal nur einmal vergeben ist.
     */
    private defaultFaktorPerMatrix: Map<string, boolean> = new Map<
        string,
        boolean
    >();

    private hochrechnungsfaktoren: Array<HochrechnungsfaktorDTO> = [];

    editHochrechnungsfaktor: HochrechnungsfaktorDTO =
        DefaultObjectCreator.createDefaultHochrechnungsfaktor();

    private editIndex = -1;

    showEditDialog = false;

    showDeleteDialog = false;

    mounted() {
        this.getAllHochrechnungsfaktoren();
        this.editHochrechnungsfaktor =
            DefaultObjectCreator.createDefaultHochrechnungsfaktor();
    }

    @Watch("showEditDialog", { immediate: true })
    private onChangeShowEditDialog() {
        if (!this.showEditDialog) {
            this.initDataStructureForInputValidation();
            this.editHochrechnungsfaktor =
                DefaultObjectCreator.createDefaultHochrechnungsfaktor();
        }
    }

    get getHochrechnungsfaktoren(): Array<HochrechnungsfaktorDTO> {
        return this.hochrechnungsfaktoren;
    }

    get header(): Array<any> {
        return [
            {
                text: "Matrix",
                align: "center",
                sortable: true,
                filterable: true,
                value: "matrix",
                width: "24%",
                divider: true,
            },
            {
                text: "KFZ",
                align: "center",
                sortable: false,
                filterable: false,
                value: "kfz",
                width: "10%",
                divider: true,
            },
            {
                text: "SV",
                align: "center",
                sortable: false,
                filterable: false,
                value: "sv",
                width: "10%",
                divider: true,
            },
            {
                text: "GV",
                align: "center",
                sortable: false,
                filterable: false,
                value: "gv",
                width: "10%",
                divider: true,
            },
            {
                text: "Aktiv",
                align: "center",
                sortable: true,
                filterable: false,
                value: "active",
                width: "8%",
                divider: true,
            },
            {
                text: "Default",
                align: "center",
                sortable: true,
                filterable: false,
                value: "defaultFaktor",
                width: "8%",
                divider: true,
            },
            {
                text: "Aktionen",
                align: "center",
                sortable: false,
                filterable: false,
                value: "aktionen",
                width: "10%",
            },
        ];
    }

    // Löschen
    /**
     * Öffnet den Löschdialog.
     * Ermittelt den Index des zu löschenden Items.
     *
     * @param item das Item was gelöscht werden soll.
     */
    deleteItem(item: HochrechnungsfaktorDTO) {
        this.editIndex = this.hochrechnungsfaktoren.indexOf(item);
        this.editHochrechnungsfaktor = Object.assign({}, item);
        this.showDeleteDialog = true;
    }

    /**
     * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
     * mit einen DELETE-Request an das Backend.
     *
     * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
     */
    deleteItemConfirm() {
        if (this.editIndex > -1 && this.editHochrechnungsfaktor) {
            HochrechnungsfaktorService.deleteHochrechnungsfaktor(
                this.editHochrechnungsfaktor
            )
                .then(() => {
                    this.snackbarStore.showSuccess(
                        "Gelöscht",
                        "Der Hochrechnungsfaktor wurde erfolgreich gelöscht."
                    );
                })
                .catch((error) => this.snackbarStore.showApiError(error))
                .finally(() => {
                    this.getAllHochrechnungsfaktoren();
                });
        }
        this.closeDelete();
    }

    /**
     * Schließt den Löschdialog und setzt den Index des gelöschten Items zurück.
     */
    closeDelete() {
        this.showDeleteDialog = false;
        this.editIndex = -1;
        this.editHochrechnungsfaktor =
            DefaultObjectCreator.createDefaultHochrechnungsfaktor();
    }

    // Editieren/Speichern
    /**
     * Öffnet den Dialog zum Ändern eines items.
     * @param item zum Ändern.
     */
    editItem(item: HochrechnungsfaktorDTO) {
        this.editIndex = this.hochrechnungsfaktoren.indexOf(item);
        this.editHochrechnungsfaktor = Object.assign({}, item);
        this.showEditDialog = true;
        this.hofaMatrizen.delete(item.matrix);
        this.defaultFaktorPerMatrix.delete(item.matrix);
    }

    // Speichern
    /**
     * Speichert das geänderte oder neu angelegte Item.
     *
     * Beim Erstellen eines neuen Items wird ein POST-Request an das Backend durchgeführt.
     * Beim Ändern eines bestehenden Items wird ein PUT-Request an das Backend durchgeführt.
     *
     * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
     */
    saveEditItemDialog() {
        if (this.editIndex > -1 && this.editHochrechnungsfaktor) {
            // Bestehender HOFA
            HochrechnungsfaktorService.putHochrechnungsfaktor(
                this.editHochrechnungsfaktor
            )
                .then(() => {
                    this.snackbarStore.showSuccess(
                        "Aktualisiert",
                        "Der Hochrechnungsfaktor wurde erfolgreich aktualisiert."
                    );
                })
                .catch((error) => this.snackbarStore.showApiError(error))
                .finally(() => {
                    this.getAllHochrechnungsfaktoren();
                });
        } else if (this.editHochrechnungsfaktor) {
            // Neuer HOFA
            HochrechnungsfaktorService.postHochrechnungsfaktor(
                this.editHochrechnungsfaktor
            )
                .then(() => {
                    this.snackbarStore.showSuccess(
                        "Gespeichert",
                        "Der Hochrechnungsfaktor wurde erfolgreich gespeichert."
                    );
                })
                .catch((error) => this.snackbarStore.showApiError(error))
                .finally(() => {
                    this.getAllHochrechnungsfaktoren();
                });
        }
        this.closeEditItemDialog();
    }

    /**
     * Schließt den Editdialog und setzt den Index des geänderten Items zurück.
     */
    closeEditItemDialog() {
        this.showEditDialog = false;
        this.editIndex = -1;
        this.editHochrechnungsfaktor =
            DefaultObjectCreator.createDefaultHochrechnungsfaktor();
    }

    /**
     * Holt mit einen GET-Request alle Hochrechnungsfaktoren vom Backend.
     */
    private getAllHochrechnungsfaktoren() {
        HochrechnungsfaktorService.getAllHochrechnungsfaktoren()
            .then((faktoren: Array<HochrechnungsfaktorDTO>) => {
                this.hochrechnungsfaktorStore.setHochrechnungsfaktoren(
                    _.cloneDeep(faktoren)
                );
                this.hochrechnungsfaktoren =
                    this.hochrechnungsfaktorStore.getHochrechnungsfaktoren;
                this.initDataStructureForInputValidation();
            })
            .catch((error) => this.snackbarStore.showApiError(error));
    }

    get disableSpeicherButton(): boolean {
        const matrix: string = this.editHochrechnungsfaktor.matrix;
        return (
            _.isEmpty(matrix) ||
            this.hofaMatrizen.has(matrix) ||
            !_.isNumber(this.editHochrechnungsfaktor.kfz) ||
            !_.isNumber(this.editHochrechnungsfaktor.sv) ||
            !_.isNumber(this.editHochrechnungsfaktor.gv) ||
            !this.checkForValidDefaultFactor(
                this.editHochrechnungsfaktor.defaultFaktor
            )
        );
    }

    /**
     * Prüft, ob der Matrixname bereits vergeben ist.
     */
    matrixVerwendbar(matrix: any): boolean | string {
        const matrixBereitsVorhanden = this.hofaMatrizen.has(matrix);
        if (!matrixBereitsVorhanden) {
            return true;
        }
        return "Diese Matrixbezeichnung existiert bereits.";
    }

    /**
     * Prüft, ob ein Wert gesetzt ist.
     */
    pflichtfeld(value: any): boolean | string {
        if (!_.isEmpty(value)) {
            return true;
        }
        return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
    }

    /**
     * Prüft, ob der übergebene Wert eine Zahl ist.
     */
    mustBeNumber(value: any): boolean | string {
        if (_.isNumber(value)) {
            return true;
        }
        return "Bitte eine Zahl angeben.";
    }

    /**
     * Prüft, ob bei Markierung als DefaultFaktor bereits ein
     * anderer Hochrechnungsfaktor als Default markiert ist.
     *
     * Es darf nur ein Hochrechnungsfaktor den Wert "true" annehmen.
     */
    isDefaultFactorValid(value: boolean): boolean | string {
        let result: any;
        if (this.checkForValidDefaultFactor(value)) {
            result = true;
        } else {
            result =
                "Es ist bereits ein Hochrechnungsfaktor als Default gesetzt.";
        }
        return result;
    }

    /**
     * Prüft, ob bei Markierung als DefaultFaktor bereits ein
     * anderer Hochrechnungsfaktor als Default markiert ist.
     */
    private checkForValidDefaultFactor(value: boolean): boolean {
        let numberOfDefaults = 0;
        this.defaultFaktorPerMatrix.forEach((defaultFaktor) => {
            if (defaultFaktor) {
                numberOfDefaults++;
            }
        });
        return (value && numberOfDefaults < 1) || !value;
    }

    /**
     * Initialisiert die Datenstrukturen zur Duplikatsprüfung für die Attribute
     * Matrix und DefaultFaktor.
     */
    private initDataStructureForInputValidation(): void {
        this.hofaMatrizen.clear();
        this.defaultFaktorPerMatrix.clear();
        this.hochrechnungsfaktoren.forEach((hofa) => {
            this.hofaMatrizen.add(hofa.matrix);
            this.defaultFaktorPerMatrix.set(hofa.matrix, hofa.defaultFaktor);
        });
    }
}
</script>
