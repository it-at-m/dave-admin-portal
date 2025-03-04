<template>
    <v-sheet
        width="100%"
        :height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <v-card-text>
            <v-form
                ref="form"
                v-model="validZaehlung"
            >
                <v-row dense>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-text-field
                            v-model="zaehlung.projektNummer"
                            label="Projektnummer"
                            outlined
                            dense
                            @blur="updateStore"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-text-field
                            v-model="zaehlung.projektName"
                            label="Projektname"
                            outlined
                            dense
                            @blur="updateStore"
                        />
                    </v-col>
                    <v-spacer />
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-autocomplete
                            v-model="zaehlung.zaehldauer"
                            outlined
                            :items="getZaehldauer"
                            dense
                            label="Zähldauer"
                            :rules="[
                                () => !!zaehlung.zaehldauer || pflichtfeldText,
                            ]"
                            required
                            @blur="updateStore"
                        ></v-autocomplete>
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-autocomplete
                            v-model="zaehlung.zaehlart"
                            outlined
                            :items="getZaehlarten"
                            dense
                            label="Zählart"
                            :rules="[
                                () => !!zaehlung.zaehlart || pflichtfeldText,
                            ]"
                            required
                            @blur="updateStore"
                        ></v-autocomplete>
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-menu
                            ref="menu"
                            v-model="menu"
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
                                    label="Datum"
                                    prepend-inner-icon="mdi-calendar"
                                    readonly
                                    outlined
                                    dense
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                                v-model="date"
                                no-title
                                locale="de"
                                :first-day-of-week="1"
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
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
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-autocomplete
                            v-model="zaehlung.quelle"
                            outlined
                            :items="getQuelle"
                            dense
                            label="Quelle"
                            @blur="updateStore"
                        ></v-autocomplete>
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-autocomplete
                            v-model="zaehlung.zaehlIntervall"
                            outlined
                            :items="getZaehlintervalle"
                            dense
                            label="Zählintervall"
                            @blur="updateStore"
                        ></v-autocomplete>
                    </v-col>
                    <v-spacer />
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-checkbox
                            v-model="zaehlung.sonderzaehlung"
                            label="Sonderzählung"
                            color="grey darken-1"
                            hide-details
                            dense
                            @change="updateStore"
                        />
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-textarea
                            v-model="zaehlung.kommentar"
                            label="Kommentar"
                            outlined
                            dense
                            rows="2"
                            row-height="10"
                            counter="255"
                            maxlength="255"
                            @blur="updateStore"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-combobox
                            v-model="zaehlung.customSuchwoerter"
                            multiple
                            label="Suchwörter"
                            outlined
                            dense
                            small-chips
                            deletable-chips
                            class="tag-input"
                            :search-input.sync="newSuchwort"
                            append-icon="mdi-plus"
                            @click:append="addSuchwortToList"
                            @keyup.enter="addSuchwortToList"
                            @blur="addSuchwortToListAndUpdateStore"
                        >
                        </v-combobox>
                    </v-col>
                </v-row>
                <v-row
                    v-if="showZaehlsituation"
                    dense
                >
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-textarea
                            v-model="zaehlung.zaehlsituation"
                            label="Zählsituation"
                            outlined
                            dense
                            rows="2"
                            row-height="10"
                            counter="255"
                            maxlength="255"
                            @blur="updateStore"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row
                    v-if="showZaehlsituation"
                    dense
                >
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-textarea
                            v-model="zaehlung.zaehlsituationErweitert"
                            label="erweiterte Zählsituation"
                            outlined
                            dense
                            rows="2"
                            row-height="10"
                            counter="255"
                            maxlength="255"
                            @blur="updateStore"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue, Watch } from "vue-property-decorator";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import { zaehlartenDropDown } from "@/domain/enums/Zaehlart";
import KeyVal from "@/domain/KeyVal";
import { zaehldauerDropDown } from "@/domain/enums/Zaehldauer";
import { quelleDropDown } from "@/domain/enums/Quelle";
import { cloneDeep } from "lodash";
import Status from "@/domain/enums/Status";
import { useZaehlungStore } from "@/store/ZaehlungStore";

@Component
export default class AllgemeineInfoForm extends Vue {
    @Prop()
    readonly height!: string;

    newSuchwort = "";

    // Without Time
    date: string = new Date().toISOString().substr(0, 10);
    menu = false;
    validZaehlung = false;

    zaehlung: ZaehlungDTO = {} as ZaehlungDTO;

    private zaehlungStore = useZaehlungStore();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Ref("menu") private vMenu: any;

    mounted() {
        this.validZaehlung = false;
        console.log("mounted");
        this.updateWorkingCopy();
    }

    get zaehlungOfStore(): ZaehlungDTO {
        return this.zaehlungStore.getZaehlung;
    }

    get showZaehlsituation(): boolean {
        let possibleStatus: Array<Status> = [
            Status.ACTIVE,
            Status.ACCOMPLISHED,
            Status.CORRECTION,
            Status.COUNTING,
        ];
        return possibleStatus.includes(this.zaehlungOfStore.status);
    }

    @Watch("zaehlungOfStore")
    updateWorkingCopy(): void {
        console.log("updateWorkingCopy");
        this.zaehlung = cloneDeep(this.zaehlungOfStore);
        this.resetDatum();
    }

    @Watch("validZaehlung")
    sendIsValid(): void {
        this.$emit("isValid", this.validZaehlung);
    }

    updateStore(): void {
        this.zaehlungStore.setZaehlung(cloneDeep(this.zaehlung));
    }

    get computedDateFormatted(): string | null {
        return this.formatDate(this.date);
    }

    private formatDateForBackend(): string {
        let time = new Date().toLocaleTimeString(navigator.language, {
            hour: "2-digit",
            minute: "2-digit",
        });
        return new Date(this.date + "T" + time).toISOString();
    }

    private formatDate(date: string): string | null {
        if (!date) {
            return null;
        }
        const [year, month, day] = date.split("-");
        return `${day}.${month}.${year}`;
    }

    get pflichtfeldText(): string {
        return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
    }

    get getZaehlarten(): Array<KeyVal> {
        return zaehlartenDropDown;
    }

    get getZaehldauer(): Array<KeyVal> {
        return zaehldauerDropDown;
    }

    get getQuelle(): Array<KeyVal> {
        return quelleDropDown;
    }

    /* eslint-disable @typescript-eslint/ban-types */
    get getZaehlintervalle(): Array<Object> {
        return [{ text: "15 min", value: 15 }];
    }
    /* eslint-enable @typescript-eslint/ban-types */

    // Fuegt das eingegebene Wort den Suchwoertern hinzu
    addSuchwortToList(): void {
        if (
            this.zaehlung.customSuchwoerter === undefined ||
            this.zaehlung.customSuchwoerter === null
        ) {
            this.zaehlung.customSuchwoerter = [];
        }

        if (this.newSuchwort == null || this.newSuchwort.trim() === "") {
            return;
        }

        if (!this.zaehlung.customSuchwoerter.includes(this.newSuchwort)) {
            this.zaehlung.customSuchwoerter.push(
                ...this.newSuchwort.split(",")
            );
        }
        this.newSuchwort = "";
    }

    addSuchwortToListAndUpdateStore(): void {
        this.addSuchwortToList();
        this.updateStore();
    }

    saveDate(): void {
        this.vMenu.save(this.date);
        this.zaehlung.datum = this.formatDateForBackend();
        this.updateStore();
    }

    closeMenu(): void {
        this.menu = false;
        this.resetDatum();
    }

    private resetDatum(): void {
        this.date = this.zaehlung.datum.substr(0, 10);
    }
}
</script>