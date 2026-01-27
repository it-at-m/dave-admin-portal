<template>
  <v-data-table
    v-model="zaehlung.fahrbeziehungen"
    :headers="HEADERS as Array<any>"
    :items="allPossibleFahrbeziehungen"
    show-select
    return-object
    hide-default-footer
    density="compact"
    fixed-header
    :items-per-page="-1"
    :height="height"
  >
    <template #[`header.data-table-select`]="{}">
      <v-checkbox-btn
        v-model="selectAllModel"
        color="quaternary"
        density="compact"
        @update:model-value="selectAll"
      />
    </template>
    <template #[`item.data-table-select`]="{ item }">
      <v-checkbox-btn
        v-model="item.active"
        color="quaternary"
        density="compact"
        @update:model-value="selectItem(item)"
      />
    </template>
    <template #[`item.hochrechnungsfaktor`]="{ item }">
      <v-autocomplete
        v-if="isHochrechnungsfaktorEditable"
        v-model="item.hochrechnungsfaktor"
        variant="outlined"
        :items="hochrechnungsfaktoreDropDown"
        item-title="matrix"
        item-value="matrix"
        return-object
        density="compact"
        required
        single-line
        :disabled="!item.active"
        hide-details
        class="my-1"
        @update:model-value="updateFahrbeziehung(item)"
      />
      <v-autocomplete
        v-else
        :value="getHochrechnungsfaktorAsText(item.hochrechnungsfaktor)"
        variant="outlined"
        menu-icon=""
        density="compact"
        single-line
        readonly
        hide-details
        class="my-1"
        @update:model-value="updateFahrbeziehung(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type HochrechnungsfaktorDTO from "@/types/config/HochrechnungsfaktorDTO";
import type VerkehrsbeziehungDTO from "@/types/zaehlung/VerkehrsbeziehungDTO";
import type KnotenarmDTO from "@/types/zaehlung/KnotenarmDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { cloneDeep, isNil } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import { useHochrechnungsfaktorStore } from "@/store/HochrechnungsfaktorStore";
import Status from "@/types/enum/Status";
import FahrbeziehungComparator from "@/util/FahrbeziehungComparator";
import ObjectToTextTranslator from "@/util/ObjectToTextTranslator";

interface Props {
  height: string;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const hochrechnungsfaktorenStore = useHochrechnungsfaktorStore();

const allPossibleFahrbeziehungen = ref<Array<VerkehrsbeziehungDTO>>([]);
const selectAllModel = ref(false);
const HEADERS = [
  {
    title: "von",
    align: "center",
    value: "von",
    width: "12%",
  },
  { title: "nach", align: "center", value: "nach", width: "15%" },
  { title: "Hochrechnungsfaktor", value: "hochrechnungsfaktor" },
];

onMounted(() => {
  updatePossibleFahrbeziehungen();
});

watch(
  () => zaehlung.value.knotenarme,
  () => {
    updatePossibleFahrbeziehungen();
  },
  { deep: true, immediate: true }
);

const isHochrechnungsfaktorEditable = computed(() => {
  return [Status.CREATED, Status.INSTRUCTED].includes(zaehlung.value.status);
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
  const activeFactors =
    hochrechnungsfaktorenStore.getHochrechnungsfaktorenWithDefaultAtFirstPosition
      .filter((value) => value.active)
      .flatMap((value) => {
        return cloneDeep(value);
      });
  const dropDown: Array<HochrechnungsfaktorDTO> = [...activeFactors];

  // Falls in Fahrbeziehung gespeicherter HOFA nachträglich inaktiv gesetzt wurde,
  // wird dieser trotzdem dem Dropdown hinzugefügt.
  allPossibleFahrbeziehungen.value.forEach((fahrbeziehung) => {
    if (
      !isNil(fahrbeziehung.hochrechnungsfaktor) &&
      !containsHochrechnungsfaktor(dropDown, fahrbeziehung.hochrechnungsfaktor)
    ) {
      dropDown.push(cloneDeep(fahrbeziehung.hochrechnungsfaktor));
    }
  });
  return dropDown;
});

function containsHochrechnungsfaktor(
  activeFaktors: Array<HochrechnungsfaktorDTO>,
  faktor: HochrechnungsfaktorDTO
): boolean {
  let contains = false;
  activeFaktors.forEach((value) => {
    if (value.matrix === faktor.matrix) {
      contains = true;
    }
  });
  return contains;
}

function updatePossibleFahrbeziehungen(): void {
  allPossibleFahrbeziehungen.value = cloneDeep(
    calculatePossibleFahrbeziehungen()
  );
  allPossibleFahrbeziehungen.value.forEach((pos: VerkehrsbeziehungDTO) => {
    zaehlung.value.fahrbeziehungen.forEach((fahr: VerkehrsbeziehungDTO) => {
      if (pos.von === fahr.von && pos.nach === fahr.nach) {
        pos.hochrechnungsfaktor = cloneDeep(fahr.hochrechnungsfaktor);
        if (fahr.id) {
          pos.active = true;
        } else {
          pos.active = fahr.active;
        }
      }
    });
  });
  calculateSelectAllModel();
}

function calculateSelectAllModel(): void {
  selectAllModel.value =
    zaehlung.value.fahrbeziehungen.length >=
    allPossibleFahrbeziehungen.value.length / 2;
}

function calculatePossibleFahrbeziehungen(): Array<VerkehrsbeziehungDTO> {
  const standardFaktor: HochrechnungsfaktorDTO =
    hochrechnungsfaktorenStore.getStandardHochrechnungsfaktor;
  const allPossibleFahrbeziehungen: Array<VerkehrsbeziehungDTO> = [];
  const possibleArms: Array<number> = [];
  zaehlung.value.knotenarme.forEach((arm: KnotenarmDTO) => {
    possibleArms.push(arm.nummer);
  });
  possibleArms.forEach((vonNummer: number) => {
    possibleArms.forEach((nachNummer: number) => {
      const newFzVon: VerkehrsbeziehungDTO = {} as VerkehrsbeziehungDTO;
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

function updateFahrbeziehung(toSave: VerkehrsbeziehungDTO): void {
  zaehlung.value.fahrbeziehungen.forEach((fahrbeziehung: VerkehrsbeziehungDTO) => {
    if (
      fahrbeziehung.von === toSave.von &&
      fahrbeziehung.nach === toSave.nach
    ) {
      fahrbeziehung.hochrechnungsfaktor = toSave.hochrechnungsfaktor;
    }
  });
}

function getHochrechnungsfaktorAsText(hf: HochrechnungsfaktorDTO): string {
  return ObjectToTextTranslator.getHochrechnungsfaktorAsText(hf);
}

function selectAll(): void {
  if (selectAllModel.value) {
    zaehlung.value.fahrbeziehungen = [];
    zaehlung.value.fahrbeziehungen = [...allPossibleFahrbeziehungen.value];
    zaehlung.value.fahrbeziehungen.forEach(
      (fahrbeziehung: VerkehrsbeziehungDTO) => {
        fahrbeziehung.active = selectAllModel.value;
      }
    );
  } else {
    zaehlung.value.fahrbeziehungen.forEach(
      (fahrbeziehung: VerkehrsbeziehungDTO) => {
        fahrbeziehung.active = selectAllModel.value;
      }
    );
    zaehlung.value.fahrbeziehungen = [];
  }
}

function selectItem(fahrbeziehung: VerkehrsbeziehungDTO): void {
  if (fahrbeziehung.active) {
    zaehlung.value.fahrbeziehungen.push(fahrbeziehung);
  } else {
    removeFahrbeziehung(fahrbeziehung);
  }
  calculateSelectAllModel();
}

function removeFahrbeziehung(toDelete: VerkehrsbeziehungDTO): void {
  let deleteIndex = -1;
  zaehlung.value.fahrbeziehungen.forEach(
    (fahrbeziehung: VerkehrsbeziehungDTO, index: number) => {
      if (
        fahrbeziehung.von === toDelete.von &&
        fahrbeziehung.nach === toDelete.nach
      ) {
        deleteIndex = index;
        fahrbeziehung.active = false;
      }
    }
  );
  if (deleteIndex > -1) {
    zaehlung.value.fahrbeziehungen.splice(deleteIndex, 1);
  }
}
</script>
