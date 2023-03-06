<template>
  <v-sheet width="100%" :height="height" :max-height="height">
    <!-- Eingabefeld -->
    <div v-if="!showHistoryList">
      <v-card-subtitle>
        Anzuzeigende Info-Nachricht
      </v-card-subtitle>

      <v-sheet width="100%" :height="cardTextHeight" :max-height="cardTextHeight" class="overflow-y-auto">
        <v-card-text>
          <v-menu
              v-model="datepickerMenuModel"
              ref="datepickerMenu"
              :close-on-content-click="false"
              :close-on-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                  v-model="computedDateFormatted"
                  label="Gültigkeitsbereich"
                  prepend-inner-icon="mdi-calendar-range"
                  readonly
                  outlined
                  dense
                  v-bind="attrs"
                  v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
                v-model="dates"
                no-title
                range
                locale="de"
                :first-day-of-week="1"
            >
              <v-spacer/>
              <v-btn
                  text
                  color="primary"
                  @click="saveDate"
                  :disabled="dates.length !== 2"
              >
                OK
              </v-btn>
              <v-btn
                  text
                  color="primary"
                  @click="closeMenu"
              >
                Abbrechen
              </v-btn>
            </v-date-picker>
          </v-menu>

          <v-textarea
              label="Infonachricht"
              v-model="activeInfoMessage.content"
              outlined
              dense
              rows="6"
              row-height="15"
              counter="255"
              maxlength="255"
          ></v-textarea>
        </v-card-text>
      </v-sheet>
    </div>

    <!-- Historisierung -->
    <div v-if="showHistoryList">
      <v-card-subtitle>
        Historisierung der letzten {{ inactiveInfoMessages.length }} deaktivierten Info-Nachrichten.
      </v-card-subtitle>

      <v-sheet width="100%" :height="cardTextHeight" :max-height="cardTextHeight" class="overflow-y-auto">
        <v-list>
          <template v-for="(infoMessage, index) in inactiveInfoMessages">

            <v-list-item :key="index">
              <v-list-item-content>

                <v-text-field
                    :value="computedDateFormattedForList(infoMessage)"
                    label="Gültigkeitsbereich"
                    prepend-inner-icon="mdi-calendar-range"
                    outlined
                    dense
                    disabled
                />

                <v-spacer/>

                <v-textarea
                    label="Infonachricht"
                    :value="infoMessage.content"
                    outlined
                    dense
                    readonly
                    rows="4"
                    row-height="15"
                />

              </v-list-item-content>
            </v-list-item>

          </template>
        </v-list>
      </v-sheet>
    </div>

    <v-card-actions style="position: absolute; bottom: 0; left: 0">
      <v-btn
          color="grey lighten-1"
          @click="changeInfoMessageView"
      >
        {{ this.buttonNameShowHistory }}
      </v-btn>
    </v-card-actions>

    <v-card-actions style="position: absolute; bottom: 0; right: 0">
      <v-spacer></v-spacer>
      <v-btn
          color="secondary"
          @click="save"
          :disabled="disableSpeicherButton"
          v-if="!showHistoryList"
      >
        Speichern
      </v-btn>
      <v-btn
          color="grey lighten-1"
          @click="inactivateInfoMessage"
          v-if="!showHistoryList"
      >
        Deaktivieren
      </v-btn>
      <v-btn
          color="grey lighten-1"
          @click="cancel"
      >
        Abbrechen
      </v-btn>
    </v-card-actions>
  </v-sheet>
</template>

<script lang="ts">
import {Component, Prop, Ref, Vue} from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import {ApiError, Levels} from "@/api/error";
import InfoMessageDTO from "@/domain/dto/InfoMessageDTO";
import InfoMessageService from "@/api/service/InfoMessageService";
import _ from "lodash";
/* eslint-enable no-unused-vars */


@Component
export default class ConfigInfoMessage extends Vue {

  @Prop() private readonly height!: string;

  private showHistory: boolean = false;

  private dates: Array<string> = [];

  private datepickerMenuModel: boolean = false;

  private activeInfoMessage: InfoMessageDTO = {} as InfoMessageDTO;

  private inactiveInfoMessages: Array<InfoMessageDTO> = [];

  @Ref('datepickerMenu') private datepickerMenu: any;

  mounted() {
    this.loadInfoMessages();
  }

  private loadInfoMessages() {
    InfoMessageService.getAllInfoMessages().then((infoMessages: Array<InfoMessageDTO>) => {
      this.setActiveInfoMessage(infoMessages[0]);
      this.setInactiveInfoMessages(_.takeRight(infoMessages, infoMessages.length - 1));
    }).catch((error: ApiError) => {
      this.$store.dispatch('snackbar/showError', error);
    })
  }

  private setActiveInfoMessage(infoMessage: InfoMessageDTO): void {
    this.resetDatum();
    this.activeInfoMessage = infoMessage;
    this.dates = this.infoMessageToDateArray(infoMessage);
  }

  public infoMessageToDateArray(infoMessage: InfoMessageDTO): Array<string> {
    const dates: Array<string> = [];
    if (infoMessage.gueltigVon) {
      dates.push(infoMessage.gueltigVon.substr(0, 10));
    }
    if (infoMessage.gueltigBis) {
      dates.push(infoMessage.gueltigBis.substr(0, 10));
    }
    return dates;
  }

  private setInactiveInfoMessages(inactiveInfoMessages: Array<InfoMessageDTO>) {
    this.inactiveInfoMessages = inactiveInfoMessages;
  }

  private closeMenu(): void {
    this.datepickerMenuModel = false;
    this.resetDatum();
  }

  private resetDatum(): void {
    this.dates = [];
  }

  private saveDate(): void {
    this.datepickerMenu.save(this.dates);
    this.activeInfoMessage.gueltigVon = this.formatDateForBackend(this.dates[0]);
    this.activeInfoMessage.gueltigBis = this.formatDateForBackend(this.dates[1]);
  }

  get computedDateFormatted(): string {
    return this.createComputedDateFormatted(this.dates);
  }

  private computedDateFormattedForList(infoMessage: InfoMessageDTO): string {
    const dates: Array<string> = this.infoMessageToDateArray(infoMessage)
    return this.createComputedDateFormatted(dates);
  }

  public createComputedDateFormatted(dates: Array<string>): string {
    if (dates.length === 0) {
      return "";
    }
    if (dates.length === 1) {
      return `von: ${this.formatDate(dates[0])}`;
    } else {
      dates = this.sortDates(dates);
      return `von: ${this.formatDate(dates[0])}, bis: ${this.formatDate(dates[1])}`;
    }
  }

  public formatDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  }

  // Wenn das zweite Datum vor dem ersten liegt, werden beide getauscht
  // 'von' muss vor 'bis' liegen
  private sortDates(dates: Array<string>): Array<string> {
    let sortedDates: Array<string> = dates
    let date0: number = parseInt(sortedDates[0].replace(/-/g, ''));
    let date1: number = parseInt(sortedDates[1].replace(/-/g, ''));
    if (date0 > date1) {
      sortedDates = sortedDates.reverse();
    }
    return sortedDates;
  }

  private formatDateForBackend(datum: string): string {
    let time = new Date().toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
    return new Date(datum + 'T' + time).toISOString();
  }

  private cancel(): void {
    this.loadInfoMessages();
    this.$emit("cancel")
  }

  private save(): void {
    InfoMessageService.save(this.activeInfoMessage).then((infoMessages: Array<InfoMessageDTO>) => {
      this.setActiveInfoMessage(infoMessages[0]);
      this.setInactiveInfoMessages(_.takeRight(infoMessages, infoMessages.length - 1));
      this.$store.dispatch('snackbar/showToast', {
        level: Levels.SUCCESS,
        snackbarTextPart1: 'Die Infonachricht wurde gespeichert.'
      });
    }).catch((error: ApiError) => {
      this.$store.dispatch('snackbar/showError', error);
    })
  }

  private inactivateInfoMessage(): void {
    InfoMessageService.setAllInfoMessagesInactive().then(() => {
      this.$store.dispatch('snackbar/showToast', {
        level: Levels.SUCCESS,
        snackbarTextPart1: `Die Infonachricht wurde inaktiviert.`
      });
    }).catch((error: ApiError) => {
      this.$store.dispatch('snackbar/showError', error);
    }).finally(() => {
      this.loadInfoMessages();
    });
  }

  get disableSpeicherButton(): boolean {
    return (this.activeInfoMessage.content == null
        || this.activeInfoMessage.content.trim().length === 0
        || this.dates.length !== 2)
        || this.datepickerMenuModel;
  }

  private changeInfoMessageView(): void {
    this.showHistory = !this.showHistory;
  }

  get showHistoryList(): boolean {
    return this.showHistory;
  }

  get buttonNameShowHistory(): string {
    if (this.showHistory) {
      return "Eingabe";
    } else {
      return "Historie";
    }
  }

  // Von der Sheet-Height alles abziehen, was nicht die scrollable sein soll
  // 54px Subtitle
  // 52px Buttonbar
  get cardTextHeight(): string {
    return parseInt(this.height.replace('px', '')) - 106 + 'px';
  }

}

</script>