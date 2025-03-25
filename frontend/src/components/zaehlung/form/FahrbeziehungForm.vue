<template>
    <v-data-table
        key="indexKey"
        v-model="selectedFahrbeziehungen"
        :headers="HEADERS"
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
                caption=""
            />
        </template>
    </v-data-table>
</template>

<script setup lang="ts">
import { useHochrechnungsfaktorStore } from "@/store/HochrechnungsfaktorStore";
import { useZaehlungStore } from "@/store/ZaehlungStore";
import FahrbeziehungDTO from "@/domain/dto/FahrbeziehungDTO";
import { computed, onMounted, ref, watch } from "vue";
import { cloneDeep, isNil } from "lodash";
import HochrechnungsfaktorDTO from "@/domain/dto/HochrechnungsfaktorDTO";
import KnotenarmDTO from "@/domain/KnotenarmDTO";
import FahrbeziehungComparator from "@/util/FahrbeziehungComparator";
import ObjectToTextTranslator from "@/util/ObjectToTextTranslator";

interface Props {
    height: string;
}
defineProps<Props>();

const hochrechnungsfaktorenStore = useHochrechnungsfaktorStore();
const zaehlungStore = useZaehlungStore();

const fahrbeziehungen = ref<Array<FahrbeziehungDTO>>([]);
const allPossibleFahrbeziehungen = ref<Array<FahrbeziehungDTO>>([]);
const selectedFahrbeziehungen = ref<Array<FahrbeziehungDTO>>([]);
const HEADERS = [
    {
        text: "von",
        align: "start",
        value: "von",
    },
    { text: "nach", value: "nach" },
    { text: "Hochrechnungsfaktor", value: "hochrechnungsfaktor" },
];

onMounted(() => {
    updateWorkingCopy();
});

watch(
    () => zaehlungStore.getKnotenarme,
    () => {
        updateWorkingCopy();
    },
    { deep: true, immediate: true }
);

const isHochrechnungsfaktorEditable = computed(() => {
    return zaehlungStore.isHochrechnungsfaktorEditable;
});
/**
 * Gibt die im Dropdown anzuzeigenden Hochrechnungsfaktoren zurück.
 * Diese umfassen alle Hochrechnungsfaktoren welche "aktiv" sind.
 *
 * Des Weiteren werden die der Fahrbeziehung zugeordneten Hochrechnungsfaktoren
 * hinzugefügt, falls die den Status "inaktiv" haben.
 * Ansonsten würde dieser inaktive Hochrechnungsfaktoren nicht Eingabefeld angezeigt werden.
 */
const hochrechnungsfaktoreDropDown = computed(() => {
    const activeFactors = hochrechnungsfaktorenStore.getHochrechnungsfaktoren
        .filter((value) => value.active)
        .flatMap((value) => {
            return cloneDeep(value);
        });
    const dropDown: Array<HochrechnungsfaktorDTO> = [...activeFactors];

    // Falls in Fahrbeziehung gespeicherter HOFA nachträglich inaktiv gesetzt wurde,
    // wird dieser trotzdem dem Dropdown hinzugefügt.
    const possible = allPossibleFahrbeziehungen.value
        .filter(
            (value) =>
                !isNil(value.hochrechnungsfaktor) &&
                !dropDown.includes(value.hochrechnungsfaktor)
        )
        .flatMap((value) => {
            return cloneDeep(value.hochrechnungsfaktor);
        });

    dropDown.push(...possible);
    return dropDown;
});

function updateWorkingCopy(): void {
    selectedFahrbeziehungen.value = [];
    allPossibleFahrbeziehungen.value = cloneDeep(
        calculatePossibleFahrbeziehungen()
    );
    fahrbeziehungen.value = cloneDeep(zaehlungStore.getFahrbeziehungen);
    allPossibleFahrbeziehungen.value.forEach((pos: FahrbeziehungDTO) => {
        fahrbeziehungen.value.forEach((fahr: FahrbeziehungDTO) => {
            if (pos.von === fahr.von && pos.nach === fahr.nach) {
                pos.hochrechnungsfaktor = cloneDeep(fahr.hochrechnungsfaktor);
                if (fahr.id) {
                    pos.active = true;
                } else {
                    pos.active = fahr.active;
                }
            }
        });
        if (pos.active) {
            selectedFahrbeziehungen.value.push(cloneDeep(pos));
        }
    });
}

function calculatePossibleFahrbeziehungen(): Array<FahrbeziehungDTO> {
    const standardFaktor: HochrechnungsfaktorDTO =
        hochrechnungsfaktorenStore.getStandardHochrechnungsfaktor;
    const allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];
    const possibleArms: Array<number> = [];
    zaehlungStore.getKnotenarme.forEach((arm: KnotenarmDTO) => {
        possibleArms.push(arm.nummer);
    });
    possibleArms.forEach((vonNummer: number) => {
        possibleArms.forEach((nachNummer: number) => {
            let newFzVon: FahrbeziehungDTO = {} as FahrbeziehungDTO;
            newFzVon.von = vonNummer;
            newFzVon.nach = nachNummer;
            newFzVon.active = false;
            newFzVon.hochrechnungsfaktor = cloneDeep(standardFaktor);
            newFzVon.indexKey = `${vonNummer}${nachNummer}`;
            allPossibleFahrbeziehungen.push(newFzVon);
        });
    });
    allPossibleFahrbeziehungen.sort(FahrbeziehungComparator.sortByVonAndNach);
    return allPossibleFahrbeziehungen;
}

function updateFahrbeziehung(fahrbeziehung: FahrbeziehungDTO): void {
    if (fahrbeziehung.active) {
        // aktualisieren
        zaehlungStore.updateFahrbeziehung(cloneDeep(fahrbeziehung));
    } else {
        // löschen
        zaehlungStore.deleteFahrbeziehung(cloneDeep(fahrbeziehung));
    }
    updateWorkingCopy();
}

function getHochrechnungsfaktorAsText(hf: HochrechnungsfaktorDTO): string {
    return ObjectToTextTranslator.getHochrechnungsfaktorAsText(hf);
}

function selectAll(event: any) {
    if (event.items) {
        event.items.forEach((item: FahrbeziehungDTO) => {
            item.active = event.value;
            updateFahrbeziehung(item);
        });
    }
}

function selectItem(event: any) {
    if (event.item) {
        event.item.active = event.value;
        selectedFahrbeziehungen.value.push(cloneDeep(event.item));
        updateFahrbeziehung(event.item);
    }
}
</script>