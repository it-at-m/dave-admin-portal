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
            :items="getEmailAddresses"
            :items-per-page="-1"
            hide-default-footer
            fixed-header
            :search="filterEmailaddress"
        >
            <template #top>
                <v-toolbar flat>
                    <v-text-field
                        v-model="filterEmailaddress"
                        append-icon="mdi-filter"
                        label="E-Mail-Adresse nach der gefiltert werden soll"
                        single-line
                        hide-details
                    />

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
                                <span class="text-h5"> {{ getTitle }}</span>
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
                                >Soll folgende E-Mail-Adresse gelöscht
                                werden?</v-card-title
                            >
                            <v-card-text>
                                <v-text-field
                                    v-model="editEmailaddress.emailAddress"
                                    label="E-Mail-Adresse"
                                    readonly
                                />
                            </v-card-text>
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
import { Component, Prop, Vue } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import EmailAddressDTO from "@/domain/dto/EmailAddressDTO";
import EmailAddressService from "@/api/service/EmailAddressService";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import _ from "lodash";
import { useSnackbarStore } from "@/store/snackbar";
/* eslint-enable no-unused-vars */

@Component
export default class ConfigEmailAddress extends Vue {
    @Prop() readonly height!: string;

    private snackbarStore = useSnackbarStore();

    showEditDialog = false;
    showDeleteDialog = false;
    filterEmailaddress = "";
    private editIndex = -1;
    private mailaddressesForDuplicateCheck: Set<string> = new Set<string>();
    editEmailaddress: EmailAddressDTO =
        DefaultObjectCreator.createDefaultEmailaddressDTO();
    private emailaddresses: Array<EmailAddressDTO> = [];

    mounted() {
        this.loadMobilitaetsreferatEmailAddress();
    }

    /* Lädt die Email-Adresse vom Referat */
    private loadMobilitaetsreferatEmailAddress() {
        EmailAddressService.getEmailAddresses()
            .then((result: Array<EmailAddressDTO>) => {
                this.emailaddresses = [];
                this.mailaddressesForDuplicateCheck = new Set<string>();
                this.editEmailaddress =
                    DefaultObjectCreator.createDefaultEmailaddressDTO();
                if (result !== null && result.length > 0) {
                    this.emailaddresses = _.cloneDeep(result);
                    this.emailaddresses.forEach((value) => {
                        this.mailaddressesForDuplicateCheck.add(
                            value.emailAddress
                        );
                    });
                }
            })
            .catch((error) => this.snackbarStore.showApiError(error));
    }

    // Löschen
    /**
     * Öffnet den Löschdialog.
     * Ermittelt den Index des zu löschenden Items.
     *
     * @param item das Item was gelöscht werden soll.
     */
    deleteItem(item: EmailAddressDTO) {
        this.editIndex = this.emailaddresses.indexOf(item);
        this.editEmailaddress = Object.assign({}, item);
        this.showDeleteDialog = true;
    }

    /**
     * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
     * mit einen DELETE-Request an das Backend.
     *
     * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
     */
    deleteItemConfirm() {
        if (this.editIndex > -1 && this.editEmailaddress) {
            EmailAddressService.delete(this.editEmailaddress)
                .then(() => {
                    this.snackbarStore.showSuccess(
                        "Gelöscht",
                        "Die E-Mail-Adresse wurde erfolgreich gelöscht."
                    );
                })
                .catch((error) => this.snackbarStore.showApiError(error))
                .finally(() => {
                    this.loadMobilitaetsreferatEmailAddress();
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
        this.editEmailaddress =
            DefaultObjectCreator.createDefaultEmailaddressDTO();
    }

    // Editieren/Speichern
    /**
     * Öffnet den Dialog zum Ändern eines items.
     * @param item zum Ändern.
     */
    editItem(item: EmailAddressDTO) {
        this.editIndex = this.emailaddresses.indexOf(item);
        this.editEmailaddress = Object.assign({}, item);
        this.mailaddressesForDuplicateCheck.delete(item.emailAddress);
        this.showEditDialog = true;
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
        if (this.editIndex > -1 && this.editEmailaddress) {
            // Bestehende Email
            EmailAddressService.update(this.editEmailaddress)
                .then(() => {
                    this.snackbarStore.showSuccess(
                        "Aktualisiert",
                        "Die E-Mail-Adresse wurde erfolgreich aktualisiert."
                    );
                })
                .catch((error) => this.snackbarStore.showApiError(error))
                .finally(() => {
                    this.loadMobilitaetsreferatEmailAddress();
                });
        } else if (this.editEmailaddress) {
            // Neue Email
            EmailAddressService.save(this.editEmailaddress)
                .then(() => {
                    this.snackbarStore.showSuccess(
                        "Gespeichert",
                        "Die E-Mail-Addresse wurde erfolgreich gespeichert."
                    );
                })
                .catch((error) => this.snackbarStore.showApiError(error))
                .finally(() => {
                    this.loadMobilitaetsreferatEmailAddress();
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
        this.editEmailaddress =
            DefaultObjectCreator.createDefaultEmailaddressDTO();
    }

    // Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
    // 64px Suche in Tabelle
    // 20px Padding Bottom
    // 52px Button
    get tableHeight(): string {
        return parseInt(this.height.replace("px", "")) - 136 + "px";
    }

    get header(): Array<any> {
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

    get disableSpeicherButton(): boolean {
        const mail: string = this.editEmailaddress.emailAddress;

        return (
            _.isEmpty(mail) ||
            this.mailaddressesForDuplicateCheck.has(mail) ||
            mail.length === 0 ||
            !this.isEmailValid(mail)
        );
    }

    get getTitle() {
        return this.editIndex === -1
            ? "E-Mail-Adresse anlegen"
            : "E-Mail-Adresse bearbeiten";
    }

    /* Rules */

    /* Prüft, ob ein Wert gesetzt ist. */
    pflichtfeld(value: any): boolean | string {
        if (!_.isEmpty(value)) {
            return true;
        }
        return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
    }

    /* Prüft,ob die Email valide oder nicht leer ist*/
    isEmailValidOrEmpty(email: string): boolean | string {
        if (_.isEmpty(email) || this.isEmailValid(email)) {
            return true;
        } else {
            return "Die Email-Adresse ist nicht valide.";
        }
    }

    /* Prüft, ob die EMail bereits hinterlegt ist. */
    isEmailADuplicate(email: string): boolean | string {
        if (this.mailaddressesForDuplicateCheck.has(email)) {
            return "Die Email-Adresse exisitert bereits.";
        } else {
            return false;
        }
    }

    /* Prüft, ob eine Email valide ist.  */
    private isEmailValid(email: string): boolean {
        const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(email);
    }
}
</script>