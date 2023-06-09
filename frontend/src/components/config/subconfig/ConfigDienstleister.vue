<template>
    <v-sheet
        width="100%"
        :height="height"
        :max-height="height"
    >
        <v-data-table
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
                    <v-spacer />

                    <!-- Der Editierdialog Dienstleister-->
                    <v-dialog
                        v-model="showEditDiensleisterDialog"
                        width="50%"
                        height="600px"
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
                        <v-card
                            width="100%"
                            height="100%"
                        >
                            <v-card-title>
                                <span class="text-h5">
                                    {{ getDienstleisterTitle }}</span
                                >
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row dense>
                                        <v-col
                                            cols="12"
                                            md="8"
                                        >
                                            <!-- Der eindeutige Bezeichner -->
                                            <v-text-field
                                                v-model="
                                                    dienstleisterToEdit.name
                                                "
                                                label="Name"
                                                :rules="[
                                                    nameVerwendbar,
                                                    pflichtfeld,
                                                ]"
                                            />
                                        </v-col>
                                        <v-spacer />
                                        <v-col
                                            cols="12"
                                            md="2"
                                        >
                                            <v-checkbox
                                                v-model="
                                                    dienstleisterToEdit.active
                                                "
                                                label="Aktiv"
                                            />
                                        </v-col>
                                    </v-row>
                                    <v-row dense>
                                        <v-col
                                            cols="12"
                                            md="8"
                                        >
                                            <v-text-field
                                                v-model="
                                                    dienstleisterToEdit.kennung
                                                "
                                                label="Kennung"
                                                :rules="[
                                                    kennungVerwendbar,
                                                    pflichtfeld,
                                                ]"
                                            />
                                        </v-col>
                                    </v-row>
                                    <v-row dense>
                                        <v-col>
                                            <v-data-table
                                                class="overflow-y-auto"
                                                :height="tableHeightMail"
                                                dense
                                                :headers="headerMail"
                                                :items="getEmailAddresses"
                                                :items-per-page="-1"
                                                hide-default-footer
                                                fixed-header
                                                :search="filterEmailaddress"
                                                no-data-text="Es muss mindestens eine E-Mail-Adresse angegeben werden."
                                            >
                                                <template #top>
                                                    <v-toolbar flat>
                                                        <v-text-field
                                                            v-model="
                                                                filterEmailaddress
                                                            "
                                                            append-icon="mdi-filter"
                                                            label="E-Mail-Adresse nach der gefiltert werden soll"
                                                            single-line
                                                            hide-details
                                                        />

                                                        <v-spacer />

                                                        <!-- Der Editierdialog E-Mail -->
                                                        <v-dialog
                                                            v-model="
                                                                showEditMailDialog
                                                            "
                                                            max-width="700px"
                                                            persistent
                                                        >
                                                            <template
                                                                #activator="{
                                                                    on,
                                                                    attrs,
                                                                }"
                                                            >
                                                                <v-icon
                                                                    v-bind="
                                                                        attrs
                                                                    "
                                                                    v-on="on"
                                                                >
                                                                    mdi-plus-box
                                                                </v-icon>
                                                            </template>
                                                            <v-card>
                                                                <v-card-title>
                                                                    <span
                                                                        class="text-h5"
                                                                    >
                                                                        {{
                                                                            getTitleMail
                                                                        }}</span
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
                                                                                        editEmailaddress.emailAddress
                                                                                    "
                                                                                    label="E-Mail"
                                                                                    :rules="[
                                                                                        pflichtfeld,
                                                                                        isEmailValidOrEmpty,
                                                                                        isEmailADuplicate,
                                                                                    ]"
                                                                                ></v-text-field>
                                                                            </v-col>
                                                                        </v-row>
                                                                    </v-container>
                                                                </v-card-text>

                                                                <!-- Buttons zum speichern und Abbrechen des Editierdialogs -->
                                                                <v-card-actions>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn
                                                                        color="secondary"
                                                                        :disabled="
                                                                            disableSpeicherButtonMail
                                                                        "
                                                                        @click="
                                                                            saveEditMailDialog
                                                                        "
                                                                    >
                                                                        Speichern
                                                                    </v-btn>
                                                                    <v-btn
                                                                        color="grey lighten-1"
                                                                        @click="
                                                                            closeEditMailDialog
                                                                        "
                                                                    >
                                                                        Abbrechen
                                                                    </v-btn>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-dialog>

                                                        <!-- Der Löschdialog E-Mail-->
                                                        <v-dialog
                                                            v-model="
                                                                showDeleteMailDialog
                                                            "
                                                            max-width="700px"
                                                            persistent
                                                        >
                                                            <v-card>
                                                                <v-card-title
                                                                    >Soll
                                                                    folgende
                                                                    E-Mail-Adresse
                                                                    gelöscht
                                                                    werden?</v-card-title
                                                                >
                                                                <v-card-text>
                                                                    <v-text-field
                                                                        v-model="
                                                                            editEmailaddress.emailAddress
                                                                        "
                                                                        label="E-Mail-Adresse"
                                                                        readonly
                                                                    />
                                                                </v-card-text>
                                                                <v-card-actions>
                                                                    <v-spacer></v-spacer>
                                                                    <v-btn
                                                                        color="red lighten-1"
                                                                        @click="
                                                                            deleteMailConfirm
                                                                        "
                                                                    >
                                                                        Löschen
                                                                    </v-btn>
                                                                    <v-btn
                                                                        color="grey lighten-1"
                                                                        @click="
                                                                            closeMailDelete
                                                                        "
                                                                    >
                                                                        Abbrechen
                                                                    </v-btn>
                                                                    <v-spacer></v-spacer>
                                                                </v-card-actions>
                                                            </v-card>
                                                        </v-dialog>
                                                    </v-toolbar>
                                                </template>

                                                <!-- Buttons in Tabellenspalte "Aktionen" -->
                                                <template
                                                    #[`item.aktionen`]="{
                                                        item,
                                                    }"
                                                >
                                                    <v-icon
                                                        small
                                                        @click="editMail(item)"
                                                    >
                                                        mdi-pencil
                                                    </v-icon>
                                                    <v-icon
                                                        small
                                                        @click="
                                                            deleteMail(item)
                                                        "
                                                    >
                                                        mdi-delete
                                                    </v-icon>
                                                </template>
                                            </v-data-table>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <!-- Buttons zum speichern und Abbrechen des Editierdialogs -->
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="secondary"
                                    :disabled="
                                        disableSpeicherButtonDienstleister
                                    "
                                    @click="saveEditDienstleisterDialog"
                                >
                                    Speichern
                                </v-btn>
                                <v-btn
                                    color="grey lighten-1"
                                    @click="closeEditDienstleisterDialog"
                                >
                                    Abbrechen
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>

                    <!-- Der Löschdialog Dienstleister-->
                    <v-dialog
                        v-model="showDeleteDienstleisterDialog"
                        max-width="50%"
                        height="600px"
                        persistent
                    >
                        <v-card>
                            <v-card-title
                                >Soll folgender Dienstleister gelöscht
                                werden?</v-card-title
                            >
                            <v-card-text>
                                <v-text-field
                                    v-model="dienstleisterToEdit.name"
                                    label="Name"
                                    readonly
                                />
                                <v-text-field
                                    v-model="dienstleisterToEdit.kennung"
                                    label="Kennung"
                                    readonly
                                />
                                <v-text-field
                                    v-model="
                                        dienstleisterToEdit.emailAddressesAsString
                                    "
                                    label="E-Mail"
                                    readonly
                                />
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                    color="red lighten-1"
                                    @click="deleteDienstleisterConfirm"
                                >
                                    Löschen
                                </v-btn>
                                <v-btn
                                    color="grey lighten-1"
                                    @click="closeDeleteDienstleisterDialog"
                                >
                                    Abbrechen
                                </v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <!-- Für Anzeige der Booleans "active" als Check (Haken) -->
            <template #[`item.active`]="{ item }">
                <v-icon v-if="item.active"> mdi-check-bold </v-icon>
            </template>
            <!-- Buttons in Tabellenspalte "Aktionen" -->
            <template #[`item.aktionen`]="{ item }">
                <v-icon
                    small
                    @click="editDienstleister(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    v-if="item.erasable"
                    class="ml-3"
                    small
                    @click="deleteDienstleister(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import { ApiError, Levels } from "@/api/error";
import DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import DienstleisterService from "@/api/service/DienstleisterService";
import _ from "lodash";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import EmailAddressDTO from "@/domain/dto/EmailAddressDTO";
/* eslint-enable no-unused-vars */

@Component
export default class ConfigDienstleister extends Vue {
    @Prop() private readonly height!: string;

    // Dienstleister
    private dienstleister: Array<DienstleisterDTO> = [];
    private dienstleisterIsLoading = false;
    private showDeleteDienstleisterDialog = false;
    private showEditDiensleisterDialog = false;
    private filterDienstleister = "";
    private dienstleisterToEdit: DienstleisterDTO =
        DefaultObjectCreator.createDefaulDienstleisterDTO();
    private editDienstleisterIndex = -1;
    /* Zur Prüfung ob der Dienstleistername bereits vergeben ist. */
    private dienstleisterNamen: Set<string> = new Set<string>();
    /* Zur Prüfung ob die Dienstleisterkennung bereits vergeben ist. */
    private dienstleisterKennungen: Set<string> = new Set<string>();

    // E-Mail-Adresse
    private filterEmailaddress = "";
    private mailaddressesForDuplicateCheck: Set<string> = new Set<string>();
    private showDeleteMailDialog = false;
    private showEditMailDialog = false;
    private editMailIndex = -1;
    private editEmailaddress: EmailAddressDTO =
        DefaultObjectCreator.createDefaultEmailaddressDTO();
    private emailaddresses: Array<EmailAddressDTO> = [];

    // E-Mail

    mounted() {
        this.loadAllDienstleister();
    }

    // Dienstleister

    @Watch("showEditDiensleisterDialog", { immediate: true })
    private onChangeShowEditDialog() {
        if (!this.showEditDiensleisterDialog) {
            this.initDataStructureForInputValidation();
            this.dienstleisterToEdit =
                DefaultObjectCreator.createDefaulDienstleisterDTO();
        }
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
                divider: true,
            },
            {
                text: "Aktiv",
                value: "active",
                align: "center",
                filterable: false,
                divider: true,
                width: "8%",
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

    get getDienstleister(): Array<DienstleisterDTO> {
        return this.dienstleister;
    }

    /*
  Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
  64px Suche in Tabelle
  20px Padding Bottom
  52px Button
   */
    get tableHeightDienstleister(): string {
        return parseInt(this.height.replace("px", "")) - 136 + "px";
    }

    get getDienstleisterTitle() {
        return this.editDienstleisterIndex === -1
            ? "Dienstleister anlegen"
            : "Dienstleister bearbeiten";
    }

    /* Lädt alle Dienstleister */
    private loadAllDienstleister() {
        this.dienstleisterIsLoading = true;
        DienstleisterService.getAll()
            .then((dienstleisterDTOS: Array<DienstleisterDTO>) => {
                this.dienstleister = dienstleisterDTOS;
            })
            .catch((error: ApiError) => {
                this.$store.dispatch("snackbar/showError", error);
            })
            .finally(() => {
                this.dienstleisterIsLoading = false;
                this.initDataStructureForInputValidation();
            });
    }

    /*
    öffnet den Edit-Dialog des Dienstleisters und
    lädt die entsprechenden Daten.
  */
    private editDienstleister(dienstleister: DienstleisterDTO) {
        this.editDienstleisterIndex = this.dienstleister.indexOf(dienstleister);
        this.dienstleisterToEdit = Object.assign({}, dienstleister);
        this.showEditDiensleisterDialog = true;
        this.dienstleisterNamen.delete(dienstleister.name);
        this.dienstleisterKennungen.delete(dienstleister.kennung);

        this.resetEmailFields();
        dienstleister.emailAddresses.forEach((value) => {
            let dto: EmailAddressDTO = {} as EmailAddressDTO;
            dto.emailAddress = value;
            this.emailaddresses.push(dto);
            this.mailaddressesForDuplicateCheck.add(value);
        });
    }

    /* Prüft, ob der Dienstleistername bereits vergeben ist. */
    private nameVerwendbar(name: string): boolean | string {
        if (!this.dienstleisterNamen.has(name)) {
            return true;
        }
        return "Dieser Name existiert bereits.";
    }

    /* Prüft, ob die Dienstleisterkennung bereits vergeben ist. */
    private kennungVerwendbar(kennung: string): boolean | string {
        if (!this.dienstleisterKennungen.has(kennung)) {
            return true;
        }
        return "Diese Kennung existiert bereits.";
    }

    /* Prüft, ob ein Wert gesetzt ist. */
    private pflichtfeld(value: any): boolean | string {
        if (!_.isEmpty(value)) {
            return true;
        }
        return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
    }

    /* Schließt den Editdialog und setzt den Index des geänderten Items zurück. */
    private closeEditDienstleisterDialog() {
        this.showEditDiensleisterDialog = false;
        this.editDienstleisterIndex = -1;
        this.dienstleisterToEdit =
            DefaultObjectCreator.createDefaulDienstleisterDTO();
        this.resetEmailFields();
    }

    get disableSpeicherButtonDienstleister(): boolean {
        const kennung: string = this.dienstleisterToEdit.kennung;
        const name: string = this.dienstleisterToEdit.name;

        return (
            _.isEmpty(name) ||
            _.isEmpty(kennung) ||
            this.dienstleisterNamen.has(name) ||
            this.dienstleisterKennungen.has(kennung) ||
            this.dienstleisterToEdit.emailAddresses.length === 0
        );
    }

    /**
     * Speichert das geänderte oder neu angelegte Item.
     *
     * Beim Erstellen eines neuen Items wird ein POST-Request an das Backend durchgeführt.
     * Beim Ändern eines bestehenden Items wird ein PUT-Request an das Backend durchgeführt.
     *
     * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
     */
    private saveEditDienstleisterDialog() {
        if (this.editDienstleisterIndex > -1 && this.dienstleisterToEdit) {
            // Bestehender Dienstleister
            DienstleisterService.update(this.dienstleisterToEdit)
                .then(() => {
                    this.$store.dispatch(
                        "snackbar/showError",
                        new ApiError(
                            Levels.SUCCESS,
                            "Aktualisiert",
                            "Der Dienstleister wurde erfolgreich aktualisiert."
                        )
                    );
                })
                .catch((error: ApiError) => {
                    this.$store.dispatch("snackbar/showError", error);
                })
                .finally(() => {
                    this.loadAllDienstleister();
                });
        } else if (this.dienstleisterToEdit) {
            // Neuer Dienstleister
            DienstleisterService.save(this.dienstleisterToEdit)
                .then(() => {
                    this.$store.dispatch(
                        "snackbar/showError",
                        new ApiError(
                            Levels.SUCCESS,
                            "Gespeichert",
                            "Der Dienstleister wurde erfolgreich gespeichert."
                        )
                    );
                })
                .catch((error: ApiError) => {
                    this.$store.dispatch("snackbar/showError", error);
                })
                .finally(() => {
                    this.loadAllDienstleister();
                });
        }
        this.closeEditDienstleisterDialog();
    }

    /**
     * Öffnet den Löschdialog.
     * Ermittelt den Index des zu löschenden Items.
     *
     * @param dienstleister das Item was gelöscht werden soll.
     */
    private deleteDienstleister(dienstleister: DienstleisterDTO) {
        this.editDienstleisterIndex = this.dienstleister.indexOf(dienstleister);
        this.dienstleisterToEdit = Object.assign({}, dienstleister);
        this.showDeleteDienstleisterDialog = true;
    }

    /**
     * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
     * mit einen DELETE-Request an das Backend.
     *
     * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
     */
    private deleteDienstleisterConfirm() {
        if (this.editDienstleisterIndex > -1 && this.dienstleisterToEdit) {
            DienstleisterService.delete(this.dienstleisterToEdit)
                .then(() => {
                    this.$store.dispatch(
                        "snackbar/showError",
                        new ApiError(
                            Levels.SUCCESS,
                            "Gelöscht",
                            "Der Dienstleister wurde erfolgreich gelöscht."
                        )
                    );
                })
                .catch((error: ApiError) => {
                    this.$store.dispatch("snackbar/showError", error);
                })
                .finally(() => {
                    this.loadAllDienstleister();
                });
        }
        this.closeDeleteDienstleisterDialog();
    }

    /**
     * Schließt den Löschdialog und setzt den Index des gelöschten Items zurück.
     */
    private closeDeleteDienstleisterDialog() {
        this.showDeleteDienstleisterDialog = false;
        this.editDienstleisterIndex = -1;
        this.dienstleisterToEdit =
            DefaultObjectCreator.createDefaulDienstleisterDTO();
        this.resetEmailFields();
    }

    /**
     * Initialisiert die Datenstrukturen zur Duplikatsprüfung für die Attribute
     * Name und Kennung des Dienstleisters.
     */
    private initDataStructureForInputValidation(): void {
        this.dienstleisterKennungen.clear();
        this.dienstleisterNamen.clear();
        this.getDienstleister.forEach((dienstleister: DienstleisterDTO) => {
            this.dienstleisterNamen.add(dienstleister.name);
            this.dienstleisterKennungen.add(dienstleister.kennung);
        });
    }

    // E-Mail-Adressen

    get tableHeightMail() {
        return "50%";
    }

    get getTitleMail() {
        return this.editMailIndex === -1
            ? "E-Mail-Adresse anlegen"
            : "E-Mail-Adresse bearbeiten";
    }

    get headerMail(): Array<any> {
        return [
            {
                text: "E-Mail-Adressen",
                align: "start",
                sortable: true,
                value: "emailAddress",
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

    get getEmailAddresses(): Array<EmailAddressDTO> {
        return this.emailaddresses;
    }

    get disableSpeicherButtonMail(): boolean {
        const mail: string = this.editEmailaddress.emailAddress;

        return (
            _.isEmpty(mail) ||
            this.mailaddressesForDuplicateCheck.has(mail) ||
            mail.length === 0 ||
            !this.isEmailValid(mail)
        );
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
    private saveEditMailDialog() {
        if (this.editMailIndex > -1 && this.editEmailaddress) {
            // Bestehende Email
            let deletedEmail = this.emailaddresses.splice(
                this.editMailIndex,
                1
            )[0];
            this.dienstleisterToEdit.emailAddresses.splice(
                this.dienstleisterToEdit.emailAddresses.indexOf(
                    deletedEmail.emailAddress
                ),
                1
            );
            this.mailaddressesForDuplicateCheck.delete(
                deletedEmail.emailAddress
            );
            this.emailaddresses.push(this.editEmailaddress);
            this.dienstleisterToEdit.emailAddresses.push(
                this.editEmailaddress.emailAddress
            );
            this.mailaddressesForDuplicateCheck.add(
                this.editEmailaddress.emailAddress
            );
        } else if (this.editEmailaddress) {
            // Neue Email
            this.emailaddresses.push(this.editEmailaddress);
            this.dienstleisterToEdit.emailAddresses.push(
                this.editEmailaddress.emailAddress
            );
            this.mailaddressesForDuplicateCheck.add(
                this.editEmailaddress.emailAddress
            );
        }
        this.closeEditMailDialog();
    }

    /**
     * Schließt den Editdialog und setzt den Index des geänderten Items zurück.
     */
    private closeEditMailDialog() {
        this.showEditMailDialog = false;
        this.editMailIndex = -1;
        this.editEmailaddress =
            DefaultObjectCreator.createDefaultEmailaddressDTO();
    }

    // Löschen
    /**
     * Öffnet den Löschdialog.
     * Ermittelt den Index des zu löschenden Items.
     *
     * @param item das Item was gelöscht werden soll.
     */
    private deleteMail(item: EmailAddressDTO) {
        this.editMailIndex = this.emailaddresses.indexOf(item);
        this.editEmailaddress = Object.assign({}, item);
        this.showDeleteMailDialog = true;
    }

    /**
     * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
     * mit einen DELETE-Request an das Backend.
     *
     * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
     */
    private deleteMailConfirm() {
        if (this.editMailIndex > -1 && this.editEmailaddress) {
            let index: number = this.dienstleisterToEdit.emailAddresses.indexOf(
                this.editEmailaddress.emailAddress
            );
            if (index > -1) {
                this.dienstleisterToEdit.emailAddresses.splice(index, 1);
                this.emailaddresses.splice(this.editMailIndex, 1);
                this.mailaddressesForDuplicateCheck.delete(
                    this.editEmailaddress.emailAddress
                );
            }
        }
        this.closeMailDelete();
    }

    /**
     * Schließt den Löschdialog und setzt den Index des gelöschten Items zurück.
     */
    private closeMailDelete() {
        this.showDeleteMailDialog = false;
        this.editMailIndex = -1;
        this.editEmailaddress =
            DefaultObjectCreator.createDefaultEmailaddressDTO();
    }

    /**
     * Öffnet den Dialog zum Ändern eines items.
     * @param emailaddressDTO zum Ändern.
     */
    private editMail(emailaddressDTO: EmailAddressDTO) {
        this.editMailIndex = this.emailaddresses.indexOf(emailaddressDTO);
        this.editEmailaddress = Object.assign({}, emailaddressDTO);
        this.mailaddressesForDuplicateCheck.delete(
            emailaddressDTO.emailAddress
        );
        this.showEditMailDialog = true;
    }

    private resetEmailFields() {
        this.filterEmailaddress = "";
        this.emailaddresses = [];
        this.mailaddressesForDuplicateCheck = new Set<string>();
    }

    /* Prüft, ob die Email valide oder leer ist. */
    private isEmailValidOrEmpty(email: string): boolean | string {
        if (_.isEmpty(email) || this.isEmailValid(email)) {
            return true;
        } else {
            return "Die Email-Adresse ist nicht valide.";
        }
    }

    /* Prüft, ob die Email valide ist. */
    private isEmailValid(email: string): boolean {
        const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }

    /* Prúft, ob die Email bereits gespeichert ist */
    private isEmailADuplicate(email: string): boolean | string {
        if (this.mailaddressesForDuplicateCheck.has(email)) {
            return "Die Email-Adresse exisitert bereits.";
        } else {
            return false;
        }
    }
}
</script>