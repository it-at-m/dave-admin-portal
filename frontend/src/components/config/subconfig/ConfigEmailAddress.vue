<template>
  <v-sheet width="100%" :height="height" :max-height="height">

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
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-text-field
              v-model="filterEmailaddress"
              append-icon="mdi-filter"
              label="E-Mail-Adresse nach der gefiltert werden soll"
              single-line
              hide-details
          />

          <v-spacer/>

          <!-- Der Editierdialog -->
          <v-dialog
              v-model="showEditDialog"
              max-width="700px"
              persistent
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-plus-box
              </v-icon>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline"> {{getTitle}}</span>
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
                          v-model="editEmailaddress.emailAddress"
                          label="E-Mail"
                          :rules="[pflichtfeld, isEmailValidOrEmpty, isEmailADuplicate]"
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
                    @click="saveEditItemDialog"
                    :disabled="disableSpeicherButton"
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

          <!-- Der L??schdialog -->
          <v-dialog
              v-model="showDeleteDialog"
              max-width="700px"
              persistent
          >
            <v-card>
              <v-card-title>Soll folgende E-Mail-Adresse gel??scht werden?</v-card-title>
              <v-card-text>
                <v-text-field
                    label="E-Mail-Adresse"
                    v-model="editEmailaddress.emailAddress"
                    readonly
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red lighten-1"
                       @click="deleteItemConfirm">
                  L??schen
                </v-btn>
                <v-btn color="grey lighten-1"
                       @click="closeDelete">
                  Abbrechen
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>

        </v-toolbar>
      </template>

      <!-- Buttons in Tabellenspalte "Aktionen" -->
      <template v-slot:[`item.aktionen`]="{ item }">
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
import {Component, Prop, Vue} from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import EmailAddressDTO from "@/domain/dto/EmailAddressDTO";
import {ApiError, Levels} from "@/api/error";
import EmailAddressService from "@/api/service/EmailAddressService";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import _ from "lodash";
/* eslint-enable no-unused-vars */

@Component
export default class ConfigEmailAddress extends Vue {

  @Prop() private readonly height!: string;

  private showEditDialog: boolean = false;
  private showDeleteDialog: boolean = false;
  private filterEmailaddress:string = "";
  private editIndex: number = -1;
  private mailaddressesForDuplicateCheck:Set<string> = new Set<string>();
  private editEmailaddress:EmailAddressDTO = DefaultObjectCreator.createDefaultEmailaddressDTO();
  private emailaddresses: Array<EmailAddressDTO> = [];

  mounted() {
    this.loadMobilitaetsreferatEmailAddress();
  }

  /* L??dt die Email-Adresse vom Referat */
  private loadMobilitaetsreferatEmailAddress() {
    EmailAddressService.getEmailAddresses().then((result: Array<EmailAddressDTO>) => {
      this.emailaddresses = [];
      this.mailaddressesForDuplicateCheck = new Set<string>();
      this.editEmailaddress = DefaultObjectCreator.createDefaultEmailaddressDTO();
      if(result !== null && result.length > 0) {
        this.emailaddresses = _.cloneDeep(result);
        this.emailaddresses.forEach(value => {
          this.mailaddressesForDuplicateCheck.add(value.emailAddress);
        })
      }
    }).catch((error: ApiError) => {
      this.$store.dispatch('snackbar/showError', error);
    })
  }

  // L??schen
  /**
   * ??ffnet den L??schdialog.
   * Ermittelt den Index des zu l??schenden Items.
   *
   * @param item das Item was gel??scht werden soll.
   */
  private deleteItem(item: EmailAddressDTO) {
    this.editIndex = this.emailaddresses.indexOf(item);
    this.editEmailaddress = Object.assign({}, item);
    this.showDeleteDialog = true;
  }

  /**
   * L??scht das gew??hlte Item bei Klick auf den Button L??schen im L??schdialog
   * mit einen DELETE-Request an das Backend.
   *
   * Nach Ausf??hrung des Requests an das Backend werden die Daten neu vom Backend geladen.
   */
  private deleteItemConfirm() {
    if (this.editIndex > -1 && this.editEmailaddress) {
      EmailAddressService.delete(this.editEmailaddress)
          .then(() => {
            this.$store.dispatch('snackbar/showError',
                new ApiError(
                    Levels.SUCCESS,
                    "Gel??scht",
                    "Die E-Mail-Adresse wurde erfolgreich gel??scht."
                )
            );
          }).catch((error: ApiError) => {
        this.$store.dispatch('snackbar/showError', error);
      }).finally(() => {
        this.loadMobilitaetsreferatEmailAddress();
      });
    }
    this.closeDelete();
  }

  /**
   * Schlie??t den L??schdialog und setzt den Index des gel??schten Items zur??ck.
   */
  private closeDelete() {
    this.showDeleteDialog = false;
    this.editIndex = -1;
    this.editEmailaddress = DefaultObjectCreator.createDefaultEmailaddressDTO();
  }

  // Editieren/Speichern
  /**
   * ??ffnet den Dialog zum ??ndern eines items.
   * @param item zum ??ndern.
   */
  private editItem(item: EmailAddressDTO) {
    this.editIndex = this.emailaddresses.indexOf(item);
    this.editEmailaddress = Object.assign({}, item);
    this.mailaddressesForDuplicateCheck.delete(item.emailAddress);
    this.showEditDialog = true;
  }

  // Speichern
  /**
   * Speichert das ge??nderte oder neu angelegte Item.
   *
   * Beim Erstellen eines neuen Items wird ein POST-Request an das Backend durchgef??hrt.
   * Beim ??ndern eines bestehenden Items wird ein PUT-Request an das Backend durchgef??hrt.
   *
   * Nach Ausf??hrung des Requests an das Backend werden die Daten neu vom Backend geladen.
   */
  private saveEditItemDialog() {
    if (this.editIndex > -1 && this.editEmailaddress) {
      // Bestehende Email
      EmailAddressService.update(this.editEmailaddress)
          .then(() => {
            this.$store.dispatch('snackbar/showError',
                new ApiError(
                    Levels.SUCCESS,
                    "Aktualisiert",
                    "Die E-Mail-Adresse wurde erfolgreich aktualisiert."
                )
            );
          }).catch((error: ApiError) => {
        this.$store.dispatch('snackbar/showError', error);
      }).finally(() => {
        this.loadMobilitaetsreferatEmailAddress();
      });
    } else if (this.editEmailaddress) {
      // Neue Email
      EmailAddressService.save(this.editEmailaddress)
          .then(() => {
            this.$store.dispatch('snackbar/showError',
                new ApiError(
                    Levels.SUCCESS,
                    "Gespeichert",
                    "Die E-Mail-Addresse wurde erfolgreich gespeichert."
                )
            );
          }).catch((error: ApiError) => {
        this.$store.dispatch('snackbar/showError', error);
      }).finally(() => {
        this.loadMobilitaetsreferatEmailAddress();
      });
    }
    this.closeEditItemDialog();
  }

  /**
   * Schlie??t den Editdialog und setzt den Index des ge??nderten Items zur??ck.
   */
  private closeEditItemDialog() {
    this.showEditDialog = false;
    this.editIndex = -1;
    this.editEmailaddress = DefaultObjectCreator.createDefaultEmailaddressDTO();
  }


  // Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
  // 64px Suche in Tabelle
  // 20px Padding Bottom
  // 52px Button
  get tableHeight(): string {
    return parseInt(this.height.replace('px', '')) - 136 + 'px';
  }

  get header(): Array<any> {
    return [
      {
        text: 'E-Mail-Adressen',
        align: 'start',
        sortable: true,
        value: 'emailAddress',
        divider: true
      },
      {
        text: 'Aktionen',
        align: 'center',
        sortable: false,
        filterable: false,
        value: 'aktionen',
        width: '10%'
      }
    ];
  }

  get getEmailAddresses(): Array<EmailAddressDTO> {
    return this.emailaddresses;
  }

  get disableSpeicherButton(): boolean {
    const mail: string = this.editEmailaddress.emailAddress;

    return _.isEmpty(mail)
        || this.mailaddressesForDuplicateCheck.has(mail)
        || mail.length === 0
        || !this.isEmailValid(mail);
  }

  get getTitle () {
    return this.editIndex === -1 ? 'E-Mail-Adresse anlegen' : 'E-Mail-Adresse bearbeiten'
  }

  /* Rules */

  /* Pr??ft, ob ein Wert gesetzt ist. */
  private pflichtfeld(value: any): boolean | string {
    if (!_.isEmpty(value)) {
      return true;
    }
    return 'Hierbei handelt es sich um ein Pflichtfeld. Bitte ausf??llen';
  }

  /* Pr??ft,ob die Email valide oder nicht leer ist*/
  private isEmailValidOrEmpty(email:string): boolean | string {
    if (_.isEmpty(email) || this.isEmailValid(email)) {
      return true;
    } else {
      return 'Die Email-Adresse ist nicht valide.';
    }
  }

  /* Pr??ft, ob die EMail bereits hinterlegt ist. */
  private isEmailADuplicate(email:string): boolean | string {
    if (this.mailaddressesForDuplicateCheck.has(email)) {
      return 'Die Email-Adresse exisitert bereits.';
    } else {
      return false;
    }
  }

  /* Pr??ft, ob eine Email valide ist.  */
  private isEmailValid(email: string): boolean {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(email);
  }
}

</script>