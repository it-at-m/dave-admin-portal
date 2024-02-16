<template>
    <v-data-table
        key="indexKey"
        v-model="selectedFahrbeziehungen"
        :headers="headersFahrbeziehungen"
        :items="allPossibleFahrbeziehungen"
        item-key="indexKey"
        show-select
        hide-default-footer
        dense
        fixed-header
        :items-per-page="-1"
        :height="height"
        @toggle-select-all="selectAll"
        @item-selected="selectItem"
    >
        <template #[`item.hochrechnungsfaktor`]="{ item }">
            <v-autocomplete
                v-if="isHochrechnungsfaktorEditable"
                v-model="item.hochrechnungsfaktor"
                outlined
                :items="hochrechnungsfaktoreDropDown"
                item-text="matrix"
                item-value="matrix"
                return-object
                dense
                required
                single-line
                :disabled="!item.active"
                @change="updateFahrbeziehung(item)"
            ></v-autocomplete>
            <lhm-text-field
                v-else
                :text="getHochrechnungsfaktorAsText(item.hochrechnungsfaktor)"
                :fahrbeziehung="true"
            />
        </template>
    </v-data-table>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
/* eslint-disable no-unused-vars */
import ZaehlungGeometrie from "@/components/zaehlung/ZaehlungGeometrie.vue";
import ZaehlungCardMap from "@/components/map/ZaehlungCardMap.vue";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import _ from "lodash";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import LhmTextField from "@/components/common/LhmTextField.vue";
import ObjectToTextTranslator from "@/util/ObjectToTextTranslator";
import FahrbeziehungComparator from "@/util/FahrbeziehungComparator";
/* eslint-enable no-unused-vars */
@Component({
    components: {
        LhmTextField,
        ZaehlungCardMap,
        ZaehlungGeometrie,
    },
})
export default class FahrbeziehungForm extends Vue {
    @Prop()
    readonly height!: string;

    private fahrbeziehungen: Array<FahrbeziehungDTO> = [];

    allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];

    mounted() {
        this.updateWorkingCopy();
    }

    get isHochrechnungsfaktorEditable(): boolean {
        return this.$store.getters.isHochrechnungsfaktorEditable;
    }

    get fahrbeziehungStore(): Array<FahrbeziehungDTO> {
        return this.$store.getters.getFahrbeziehungen;
    }

    get knotenarmStore(): Array<KnotenarmDTO> {
        return this.$store.getters.getKnotenarme;
    }

    @Watch("knotenarmStore", { deep: true, immediate: true })
    updateWorkingCopy(): void {
        this.selectedFahrbeziehungen = [];
        this.allPossibleFahrbeziehungen = _.cloneDeep(
            this.calculatePossibleFahrbeziehungen()
        );
        this.fahrbeziehungen = _.cloneDeep(this.fahrbeziehungStore);
        this.allPossibleFahrbeziehungen.forEach((pos: FahrbeziehungDTO) => {
            this.fahrbeziehungen.forEach((fahr: FahrbeziehungDTO) => {
                if (pos.von === fahr.von && pos.nach === fahr.nach) {
                    pos.hochrechnungsfaktor = _.cloneDeep(
                        fahr.hochrechnungsfaktor
                    );
                    if (fahr.id) {
                        pos.active = true;
                    } else {
                        pos.active = fahr.active;
                    }
                }
            });
            if (pos.active) {
                this.selectedFahrbeziehungen.push(_.cloneDeep(pos));
            }
        });
    }

    private calculatePossibleFahrbeziehungen(): Array<FahrbeziehungDTO> {
        let standardFaktor: HochrechnungsfaktorDTO =
            this.$store.getters.getStandardHochrechnungsfaktor;
        let allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];
        let possibleArms: Array<number> = [];
        this.knotenarmStore.forEach((arm: KnotenarmDTO) => {
            possibleArms.push(arm.nummer);
        });
        possibleArms.forEach((vonNummer: number) => {
            possibleArms.forEach((nachNummer: number) => {
                let newFzVon: FahrbeziehungDTO = {} as FahrbeziehungDTO;
                newFzVon.von = vonNummer;
                newFzVon.nach = nachNummer;
                newFzVon.active = false;
                newFzVon.hochrechnungsfaktor = _.cloneDeep(standardFaktor);
                newFzVon.indexKey = `${vonNummer}${nachNummer}`;
                allPossibleFahrbeziehungen.push(newFzVon);
            });
        });
        allPossibleFahrbeziehungen.sort(
            FahrbeziehungComparator.sortByVonAndNach
        );
        return allPossibleFahrbeziehungen;
    }

    get hochrechnungsfaktorenStore(): Array<HochrechnungsfaktorDTO> {
        return this.$store.getters.getHochrechnungsfaktoren;
    }

    /**
     * Gibt die im Dropdown anzuzeigenden Hochrechnungsfaktoren zurück.
     * Diese umfassen alle Hochrechnungsfaktoren welche "aktiv" sind.
     *
     * Des Weiteren werden die der Fahrbeziehung zugeordneten Hochrechnungsfaktoren
     * hinzugefügt, falls die den Status "inaktiv" haben.
     * Ansonsten würde dieser inaktive Hochrechnungsfaktoren nicht Eingabefeld angezeigt werden.
     */
    get hochrechnungsfaktoreDropDown(): Array<HochrechnungsfaktorDTO> {
        const dropDown: Array<HochrechnungsfaktorDTO> = [];
        this.hochrechnungsfaktorenStore.forEach(
            (faktor: HochrechnungsfaktorDTO) => {
                if (faktor.active) {
                    const copy: HochrechnungsfaktorDTO = _.cloneDeep(faktor);
                    dropDown.push(copy);
                }
            }
        );
        // Falls in Fahrbeziehung gespeicherter HOFA nachträglich inaktiv gesetzt wurde,
        // wird dieser trotzdem dem Dropdown hinzugefügt.
        this.allPossibleFahrbeziehungen.forEach(
            (fahrbeziehung: FahrbeziehungDTO) => {
                if (
                    !_.isNil(fahrbeziehung.hochrechnungsfaktor) &&
                    !dropDown.includes(fahrbeziehung.hochrechnungsfaktor)
                ) {
                    dropDown.push(
                        _.cloneDeep(fahrbeziehung.hochrechnungsfaktor)
                    );
                }
            }
        );
        return dropDown;
    }

    updateFahrbeziehung(fahrbeziehung: FahrbeziehungDTO): void {
        if (fahrbeziehung.active) {
            // aktualisieren
            this.$store.dispatch(
                "updateFahrbeziehung",
                _.cloneDeep(fahrbeziehung)
            );
        } else {
            // löschen
            this.$store.dispatch(
                "deleteFahrbeziehung",
                _.cloneDeep(fahrbeziehung)
            );
        }
        this.updateWorkingCopy();
    }

    getHochrechnungsfaktorAsText(hf: HochrechnungsfaktorDTO): string {
        return ObjectToTextTranslator.getHochrechnungsfaktorAsText(hf);
    }

    // Neu
    selectedFahrbeziehungen = new Array<FahrbeziehungDTO>();
    headersFahrbeziehungen = [
        {
            text: "von",
            align: "start",
            value: "von",
        },
        { text: "nach", value: "nach" },
        { text: "Hochrechnungsfaktor", value: "hochrechnungsfaktor" },
    ];

    selectAll(event: any) {
        if (event.items) {
            event.items.forEach((item: FahrbeziehungDTO) => {
                item.active = event.value;
                this.updateFahrbeziehung(item);
            });
        }
    }

    selectItem(event: any) {
        if (event.item) {
            event.item.active = event.value;
            this.selectedFahrbeziehungen.push(_.cloneDeep(event.item));
            this.updateFahrbeziehung(event.item);
        }
    }
}
</script>