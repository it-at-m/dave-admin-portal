<template>
    <v-sheet
        width="100%"
        class="d-flex flex-column"
    >
        <v-tabs
            v-model="activeTab"
            fixed-tabs
            background-color="grey darken-1"
            dark
            icons-and-text
            slider-color="grey lighten-1"
            slider-size="8"
        >
            <!-- Kopfzeile -->
            <v-tab>
                Allgemeine Info
                <v-icon>mdi-information-outline</v-icon>
            </v-tab>
            <v-tab>
                Knoten & Lage
                <v-icon>mdi-routes</v-icon>
            </v-tab>
            <v-tab>
                Fahrbeziehungen
                <v-icon>mdi-routes</v-icon>
            </v-tab>
            <v-tab>
                Fahrzeuge
                <v-icon>mdi-car-multiple</v-icon>
            </v-tab>
        </v-tabs>
        <v-tabs-items
            v-model="activeTab"
            class="d-flex flex-column align-stretch"
        >
            <!-- Inhalte -->
            <v-tab-item ref="allgemeineInfo">
                <allgemeine-info-form
                    :height="SHEETHEIGHT"
                    @isValid="setAllgemeineFormValid"
                />
            </v-tab-item>
            <v-tab-item ref="knotenUndLage">
                <knoten-richtung-form
                    :height="SHEETHEIGHT"
                    :zaehlstelle="zaehlstelle"
                />
            </v-tab-item>
            <v-tab-item ref="fahrbeziehungen">
                <fahrbeziehung-kreisverkehr-form
                    v-if="isKreisverkehr"
                    :height="SHEETHEIGHT"
                />
                <fahrbeziehung-form
                    v-else
                    :height="SHEETHEIGHT"
                />
            </v-tab-item>
            <v-tab-item ref="fahrzeuge">
                <fahrzeuge-form :height="SHEETHEIGHT" />
            </v-tab-item>
        </v-tabs-items>

        <v-card-actions>
            <v-spacer />
            <v-btn
                color="secondary"
                :disabled="!isZaehlungValid"
                @click="save()"
            >
                Speichern
            </v-btn>
            <v-btn
                color="grey lighten-1"
                @click="cancel()"
            >
                Abbrechen
            </v-btn>
        </v-card-actions>
    </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import { ApiError } from "@/api/error";
/* eslint-enable no-unused-vars */
// Components
import AllgemeineInfoForm from "@/components/zaehlung/form/AllgemeineInfoForm.vue";
import KontaktForm from "@/components/zaehlung/form/KontaktForm.vue";
import KnotenRichtungForm from "@/components/zaehlung/form/KnotenLageForm.vue";
import FahrzeugeForm from "@/components/zaehlung/form/FahrzeugeForm.vue";
import FahrbeziehungForm from "@/components/zaehlung/form/FahrbeziehungForm.vue";

// Api
import ZaehlungService from "@/api/service/ZaehlungService";

// Util
import _ from "lodash";
import FahrbeziehungKreisverkehrForm from "@/components/zaehlung/form/FahrbeziehungKreisverkehrForm.vue";

@Component({
    components: {
        FahrbeziehungKreisverkehrForm,
        FahrbeziehungForm,
        FahrzeugeForm,
        KnotenRichtungForm,
        KontaktForm,
        AllgemeineInfoForm,
    },
})
export default class ZaehlungForm extends Vue {
    @Prop() zaehlstelle!: ZaehlstelleDTO;

    readonly SHEETHEIGHT: string = "580px";

    activeTab = 0;
    private isAllgemeinFormValid = false;

    /**
     * Erzeugt eine vorübergehende ID, um die Knotenarme identifizieren zu können.
     * Diese ID wird vor dem Speichern gelöscht
     */
    public static generateId(): string {
        return "xyyxyyx-yxxyxxy".replace(/[xy]/g, function (c) {
            let r: number = (Math.random() * 16) | 0,
                v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }

    save(): void {
        let copy: ZaehlungDTO = _.cloneDeep(this.$store.getters.getZaehlung);
        let selfIdLength: number = ZaehlungForm.generateId().length;
        copy.knotenarme.forEach((arm: KnotenarmDTO) => {
            // Alle Id's entfernen, die ich selber gesetzt habe
            if (arm.id && arm.id.length === selfIdLength) {
                arm.id = "";
            }
        });
        ZaehlungService.saveZaehlung(copy, this.zaehlstelle.id)
            .then(() => {
                this.$emit("saved");
            })
            .catch((error: ApiError) => {
                this.$store.dispatch("snackbar/showError", error);
            })
            .finally(() => {
                this.activeTab = 0;
                this.$store.dispatch("setResetformevent", true);
            });
    }

    cancel(): void {
        this.activeTab = 0;
        this.$store.dispatch("setResetformevent", true);
        this.$emit("cancel");
    }

    setAllgemeineFormValid(isPartValid: boolean) {
        this.isAllgemeinFormValid = isPartValid;
    }

    get isZaehlungValid(): boolean {
        return this.isAllgemeinFormValid;
    }

    get isKreisverkehr(): boolean {
        return this.$store.getters.getZaehlung.kreisverkehr;
    }
}
</script>