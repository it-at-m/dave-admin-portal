<template>
    <v-sheet
        width="100%"
        :height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <!-- Eingabefeld -->
        <div v-if="!showHistory">
            <v-card-subtitle> Anzuzeigende Info-Nachricht </v-card-subtitle>

            <v-sheet
                width="100%"
                :height="cardTextHeight"
                :max-height="cardTextHeight"
            >
                <v-card-text>
                    <v-menu
                        v-model="datepickerMenuModel"
                        :close-on-content-click="false"
                        :close-on-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="auto"
                    >
                        <template #activator="{ on, attrs }">
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
                            <v-spacer />
                            <v-btn
                                text
                                color="primary"
                                :disabled="dates.length !== 2"
                                @click="saveDate"
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
                        v-model="activeInfoMessage.content"
                        label="Infonachricht"
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
        <div v-if="showHistory">
            <v-card-subtitle>
                Historisierung der letzten
                {{ inactiveInfoMessages.length }} deaktivierten
                Info-Nachrichten.
            </v-card-subtitle>

            <v-sheet
                width="100%"
                :height="cardTextHeight"
                :max-height="cardTextHeight"
                class="overflow-y-auto"
            >
                <v-list>
                    <template
                        v-for="(infoMessage, index) in inactiveInfoMessages"
                    >
                        <v-list-item :key="index">
                            <v-list-item-content>
                                <v-text-field
                                    :value="
                                        computedDateFormattedForList(
                                            infoMessage
                                        )
                                    "
                                    label="Gültigkeitsbereich"
                                    prepend-inner-icon="mdi-calendar-range"
                                    outlined
                                    dense
                                    disabled
                                />

                                <v-spacer />

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
                {{ buttonNameShowHistory }}
            </v-btn>
        </v-card-actions>

        <v-card-actions style="position: absolute; bottom: 0; right: 0">
            <v-spacer></v-spacer>
            <v-btn
                v-if="!showHistory"
                color="secondary"
                :disabled="disableSpeicherButton"
                @click="save"
            >
                Speichern
            </v-btn>
            <v-btn
                v-if="!showHistory"
                color="grey lighten-1"
                @click="inactivateInfoMessage"
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

<script setup lang="ts">
import { useSnackbarStore } from "@/store/SnackbarStore";
import { computed, onMounted, ref } from "vue";
import InfoMessageDTO from "@/domain/dto/InfoMessageDTO";
import InfoMessageService from "@/api/service/InfoMessageService";
import { takeRight } from "lodash";
import { useDateUtils } from "@/util/DateUtils";

interface Props {
    height: string;
}
const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "cancel"): void;
}>();

const snackbarStore = useSnackbarStore();
const dateUtils = useDateUtils();

const showHistory = ref(false);

const dates = ref<Array<string>>([]);

const datepickerMenuModel = ref(false);

const activeInfoMessage = ref({} as InfoMessageDTO);

const inactiveInfoMessages = ref<Array<InfoMessageDTO>>([]);

onMounted(() => {
    loadInfoMessages();
});

function loadInfoMessages() {
    InfoMessageService.getAllInfoMessages()
        .then((infoMessages: Array<InfoMessageDTO>) => {
            setActiveInfoMessage(infoMessages[0]);
            setInactiveInfoMessages(
                takeRight(infoMessages, infoMessages.length - 1)
            );
        })
        .catch((error) => snackbarStore.showApiError(error));
}

function setActiveInfoMessage(infoMessage: InfoMessageDTO): void {
    resetDatum();
    activeInfoMessage.value = infoMessage;
    dates.value = infoMessageToDateArray(infoMessage);
}

function infoMessageToDateArray(infoMessage: InfoMessageDTO): Array<string> {
    const dates: Array<string> = [];
    if (infoMessage.gueltigVon) {
        dates.push(infoMessage.gueltigVon.substring(0, 10));
    }
    if (infoMessage.gueltigBis) {
        dates.push(infoMessage.gueltigBis.substring(0, 10));
    }
    return dates;
}

function setInactiveInfoMessages(infoMessages: Array<InfoMessageDTO>) {
    inactiveInfoMessages.value = infoMessages;
}

function closeMenu(): void {
    datepickerMenuModel.value = false;
    resetDatum();
}

function resetDatum(): void {
    dates.value = [];
}

function saveDate(): void {
    datepickerMenuModel.value = false;
    activeInfoMessage.value.gueltigVon = dateUtils.formatDateForBackend(
        dates.value[0]
    );
    activeInfoMessage.value.gueltigBis = dateUtils.formatDateForBackend(
        dates.value[1]
    );
}

const computedDateFormatted = computed(() => {
    return createComputedDateFormatted(dates.value);
});

function computedDateFormattedForList(infoMessage: InfoMessageDTO): string {
    const dates: Array<string> = infoMessageToDateArray(infoMessage);
    return createComputedDateFormatted(dates);
}

function createComputedDateFormatted(dates: Array<string>): string {
    if (dates.length === 0) {
        return "";
    }
    if (dates.length === 1) {
        return `von: ${dateUtils.formatDate(dates[0])}`;
    } else {
        dates = sortDates(dates);
        return `von: ${dateUtils.formatDate(
            dates[0]
        )}, bis: ${dateUtils.formatDate(dates[1])}`;
    }
}

// Wenn das zweite Datum vor dem ersten liegt, werden beide getauscht
// 'von' muss vor 'bis' liegen
function sortDates(dates: Array<string>): Array<string> {
    let sortedDates: Array<string> = dates;
    let date0: number = parseInt(sortedDates[0].replace(/-/g, ""));
    let date1: number = parseInt(sortedDates[1].replace(/-/g, ""));
    if (date0 > date1) {
        sortedDates = sortedDates.reverse();
    }
    return sortedDates;
}

function cancel(): void {
    loadInfoMessages();
    emits("cancel");
}

function save(): void {
    InfoMessageService.save(activeInfoMessage.value)
        .then((infoMessages: Array<InfoMessageDTO>) => {
            setActiveInfoMessage(infoMessages[0]);
            setInactiveInfoMessages(
                takeRight(infoMessages, infoMessages.length - 1)
            );
            snackbarStore.showSuccess("Die Infonachricht wurde gespeichert.");
        })
        .catch((error) => snackbarStore.showApiError(error));
}

function inactivateInfoMessage(): void {
    InfoMessageService.setAllInfoMessagesInactive()
        .then(() => {
            snackbarStore.showSuccess(`Die Infonachricht wurde inaktiviert.`);
        })
        .catch((error) => snackbarStore.showApiError(error))
        .finally(() => {
            loadInfoMessages();
        });
}

const disableSpeicherButton = computed(() => {
    return (
        activeInfoMessage.value.content == null ||
        activeInfoMessage.value.content.trim().length === 0 ||
        dates.value.length !== 2 ||
        datepickerMenuModel.value
    );
});

function changeInfoMessageView(): void {
    showHistory.value = !showHistory.value;
}
const buttonNameShowHistory = computed(() => {
    return showHistory.value ? "Eingabe" : "Historie";
});

// Von der Sheet-Height alles abziehen, was nicht die scrollable sein soll
// 54px Subtitle
// 52px Buttonbar
const cardTextHeight = computed(() => {
    return parseInt(props.height.replace("px", "")) - 106 + "px";
});
</script>