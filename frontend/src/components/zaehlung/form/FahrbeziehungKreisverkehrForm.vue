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
import ZaehlungGeometrie from "@/components/zaehlung/ZaehlungGeometrie.vue";
import ZaehlungCardMap from "@/components/map/ZaehlungCardMap.vue";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import { cloneDeep, isNil } from "lodash";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import LhmTextField from "@/components/common/LhmTextField.vue";
import ObjectToTextTranslator from "@/util/ObjectToTextTranslator";
import FahrbeziehungComparator from "@/util/FahrbeziehungComparator";
import { useHochrechnungsfaktorStore } from "@/store/hochrechnungsfaktorStore";
import { useZaehlungStore } from "@/store/zaehlungStore";
@Component({
    components: {
        LhmTextField,
        ZaehlungCardMap,
        ZaehlungGeometrie,
    },
})
export default class FahrbeziehungKreisverkehrForm extends Vue {
    @Prop()
    readonly height!: string;

    private fahrbeziehungen: Array<FahrbeziehungDTO> = [];

    allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];

    private hochrechnungsfaktorenStore = useHochrechnungsfaktorStore();
    private zaehlungStore = useZaehlungStore();

    mounted() {
        this.updateWorkingCopy();
    }

    get isHochrechnungsfaktorEditable(): boolean {
        return this.zaehlungStore.isHochrechnungsfaktorEditable;
    }

    get fahrbeziehungStore(): Array<FahrbeziehungDTO> {
        return this.zaehlungStore.getFahrbeziehungen;
    }

    get knotenarmStore(): Array<KnotenarmDTO> {
        return this.zaehlungStore.getKnotenarme;
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
        this.hochrechnungsfaktorenStore.getHochrechnungsfaktoren.forEach(
            (faktor: HochrechnungsfaktorDTO) => {
                if (faktor.active) {
                    const copy: HochrechnungsfaktorDTO = cloneDeep(faktor);
                    dropDown.push(copy);
                }
            }
        );
        // Falls in Fahrbeziehung gespeicherter HOFA nachträglich inaktiv gesetzt wurde,
        // wird dieser trotzdem dem Dropdown hinzugefügt.
        this.allPossibleFahrbeziehungen.forEach(
            (fahrbeziehung: FahrbeziehungDTO) => {
                if (
                    !isNil(fahrbeziehung.hochrechnungsfaktor) &&
                    !dropDown.includes(fahrbeziehung.hochrechnungsfaktor)
                ) {
                    dropDown.push(cloneDeep(fahrbeziehung.hochrechnungsfaktor));
                }
            }
        );
        return dropDown;
    }

    @Watch("knotenarmStore", { deep: true, immediate: true })
    updateWorkingCopy(): void {
        this.selectedFahrbeziehungen = [];
        this.allPossibleFahrbeziehungen = cloneDeep(
            this.calculatePossibleFahrbeziehungen()
        );
        this.fahrbeziehungen = cloneDeep(this.fahrbeziehungStore);
        this.allPossibleFahrbeziehungen.forEach((pos: FahrbeziehungDTO) => {
            this.fahrbeziehungen.forEach((fahr: FahrbeziehungDTO) => {
                if (
                    pos.knotenarm === fahr.knotenarm &&
                    pos.heraus === fahr.heraus &&
                    pos.vorbei === fahr.vorbei &&
                    pos.hinein === fahr.hinein
                ) {
                    pos.hochrechnungsfaktor = cloneDeep(
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
                this.selectedFahrbeziehungen.push(cloneDeep(pos));
            }
        });
    }

    updateFahrbeziehung(fahrbeziehung: FahrbeziehungDTO): void {
        if (fahrbeziehung.active) {
            // aktualisieren
            this.zaehlungStore.updateFahrbeziehungKreisverkehr(
                cloneDeep(fahrbeziehung)
            );
        } else {
            // löschen
            this.zaehlungStore.deleteFahrbeziehungKreisverkehr(
                cloneDeep(fahrbeziehung)
            );
        }
        this.updateWorkingCopy();
    }

    // private getKey(fz: FahrbeziehungDTO): string {
    //   return `${fz.knotenarm}${fz.hinein}${fz.vorbei}${fz.heraus}`;
    // }

    private getType(fz: FahrbeziehungDTO): string {
        if (fz.hinein) {
            return "in den Kreis";
        } else if (fz.vorbei) {
            return "Vorbeifahrend";
        } else if (fz.heraus) {
            return "aus dem Kreis";
        } else {
            return "unbekannt";
        }
    }

    // private disableCheckboxAndDropDown(fz: FahrbeziehungDTO): boolean {
    //   let vonExists: boolean = false;
    //   this.knotenarmStore.forEach((arm: KnotenarmDTO) => {
    //     vonExists = vonExists || arm.nummer === fz.knotenarm;
    //   })
    //   return !(vonExists);
    // }

    /**
     * Erzeugt aus den vorhandenen Knotenarmen alle möglichen Fahrbeziehungen.
     * @private
     */
    private calculatePossibleFahrbeziehungen(): Array<FahrbeziehungDTO> {
        let standardFaktor: HochrechnungsfaktorDTO =
            this.hochrechnungsfaktorenStore.getStandardHochrechnungsfaktor;
        let allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];
        this.knotenarmStore.forEach((arm: KnotenarmDTO) => {
            const newFzHeraus: FahrbeziehungDTO = {} as FahrbeziehungDTO;
            newFzHeraus.knotenarm = arm.nummer;
            newFzHeraus.hinein = false;
            newFzHeraus.vorbei = false;
            newFzHeraus.heraus = true;
            newFzHeraus.active = false;
            newFzHeraus.hochrechnungsfaktor = cloneDeep(standardFaktor);
            newFzHeraus.kreisverkehrTyp = this.getType(newFzHeraus);
            newFzHeraus.indexKey = `${newFzHeraus.knotenarm}${newFzHeraus.kreisverkehrTyp}`;
            allPossibleFahrbeziehungen.push(newFzHeraus);
            const newFzVorbei: FahrbeziehungDTO = {} as FahrbeziehungDTO;
            newFzVorbei.knotenarm = arm.nummer;
            newFzVorbei.hinein = false;
            newFzVorbei.vorbei = true;
            newFzVorbei.heraus = false;
            newFzVorbei.active = false;
            newFzVorbei.kreisverkehrTyp = this.getType(newFzVorbei);
            newFzVorbei.hochrechnungsfaktor = cloneDeep(standardFaktor);
            newFzVorbei.indexKey = `${newFzVorbei.knotenarm}${newFzVorbei.kreisverkehrTyp}`;
            allPossibleFahrbeziehungen.push(newFzVorbei);
            const newFzHinein: FahrbeziehungDTO = {} as FahrbeziehungDTO;
            newFzHinein.knotenarm = arm.nummer;
            newFzHinein.hinein = true;
            newFzHinein.vorbei = false;
            newFzHinein.heraus = false;
            newFzHinein.active = false;
            newFzHinein.kreisverkehrTyp = this.getType(newFzHinein);
            newFzHinein.hochrechnungsfaktor = cloneDeep(standardFaktor);
            newFzHinein.indexKey = `${newFzHinein.knotenarm}${newFzHinein.kreisverkehrTyp}`;
            allPossibleFahrbeziehungen.push(newFzHinein);
        });
        allPossibleFahrbeziehungen.sort(
            FahrbeziehungComparator.sortKreisverkehrByVonAndNach
        );
        return allPossibleFahrbeziehungen;
    }

    getHochrechnungsfaktorAsText(hf: HochrechnungsfaktorDTO): string {
        return ObjectToTextTranslator.getHochrechnungsfaktorAsText(hf);
    }

    // Neu
    selectedFahrbeziehungen = new Array<FahrbeziehungDTO>();
    headersFahrbeziehungen = [
        {
            text: "Knotenarm",
            align: "start",
            value: "knotenarm",
        },
        { text: "Typ", value: "kreisverkehrTyp" },
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
            this.selectedFahrbeziehungen.push(cloneDeep(event.item));
            this.updateFahrbeziehung(event.item);
        }
    }
}
</script>