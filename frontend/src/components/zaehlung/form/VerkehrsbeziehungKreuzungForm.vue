<template>
  <v-data-table
    v-model="zaehlung.verkehrsbeziehungen"
    :headers="HEADERS as Array<any>"
    :items="allPossibleVerkehrsbeziehungen"
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
        @update:model-value="updateVerkehrsbeziehung(item)"
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
        @update:model-value="updateVerkehrsbeziehung(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type HochrechnungsfaktorDTO from "@/types/config/HochrechnungsfaktorDTO";
import type KnotenarmDTO from "@/types/zaehlung/KnotenarmDTO";
import type VerkehrsbeziehungDTO from "@/types/zaehlung/VerkehrsbeziehungDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { cloneDeep, isNil } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import { useHochrechnungsfaktorStore } from "@/store/HochrechnungsfaktorStore";
import Status from "@/types/enum/Status";
import ObjectToTextTranslator from "@/util/ObjectToTextTranslator";
import VerkehrsbeziehungComparator from "@/util/VerkehrsbeziehungComparator";

interface Props {
  height: string;
}
defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const hochrechnungsfaktorenStore = useHochrechnungsfaktorStore();

const allPossibleVerkehrsbeziehungen = ref<Array<VerkehrsbeziehungDTO>>([]);
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
  updatePossibleVerkehrsbeziehungen();
});

watch(
  () => zaehlung.value.knotenarme,
  () => {
    updatePossibleVerkehrsbeziehungen();
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
 * Des Weiteren werden die der Verkehrsbeziehung zugeordneten Hochrechnungsfaktoren
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

  // Falls in Verkehrsbeziehung gespeicherter HOFA nachträglich inaktiv gesetzt wurde,
  // wird dieser trotzdem dem Dropdown hinzugefügt.
  allPossibleVerkehrsbeziehungen.value.forEach((verkehrsbeziehung) => {
    if (
      !isNil(verkehrsbeziehung.hochrechnungsfaktor) &&
      !containsHochrechnungsfaktor(
        dropDown,
        verkehrsbeziehung.hochrechnungsfaktor
      )
    ) {
      dropDown.push(cloneDeep(verkehrsbeziehung.hochrechnungsfaktor));
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

function updatePossibleVerkehrsbeziehungen(): void {
  allPossibleVerkehrsbeziehungen.value = cloneDeep(
    calculatePossibleVerkehrsbeziehung()
  );
  allPossibleVerkehrsbeziehungen.value.forEach((pos: VerkehrsbeziehungDTO) => {
    zaehlung.value.verkehrsbeziehungen.forEach((fahr: VerkehrsbeziehungDTO) => {
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
    zaehlung.value.verkehrsbeziehungen.length >=
    allPossibleVerkehrsbeziehungen.value.length / 2;
}

function calculatePossibleVerkehrsbeziehung(): Array<VerkehrsbeziehungDTO> {
  const standardFaktor: HochrechnungsfaktorDTO =
    hochrechnungsfaktorenStore.getStandardHochrechnungsfaktor;
  const allPossibleVerkehrsbeziehungen: Array<VerkehrsbeziehungDTO> = [];
  const possibleArms: Array<number> = [];
  zaehlung.value.knotenarme.forEach((arm: KnotenarmDTO) => {
    possibleArms.push(arm.nummer);
  });
  possibleArms.forEach((vonNummer: number) => {
    possibleArms.forEach((nachNummer: number) => {
      const newVzVon: VerkehrsbeziehungDTO = {} as VerkehrsbeziehungDTO;
      newVzVon.von = vonNummer;
      newVzVon.nach = nachNummer;
      newVzVon.active = false;
      newVzVon.hochrechnungsfaktor = cloneDeep(standardFaktor);
      newVzVon.indexKey = `${vonNummer}${nachNummer}`;
      allPossibleVerkehrsbeziehungen.push(newVzVon);
    });
  });
  allPossibleVerkehrsbeziehungen.sort(
    VerkehrsbeziehungComparator.sortByVonAndNach
  );
  return allPossibleVerkehrsbeziehungen;
}

function updateVerkehrsbeziehung(toSave: VerkehrsbeziehungDTO): void {
  zaehlung.value.verkehrsbeziehungen.forEach(
    (verkehrsbeziehung: VerkehrsbeziehungDTO) => {
      if (
        verkehrsbeziehung.von === toSave.von &&
        verkehrsbeziehung.nach === toSave.nach
      ) {
        verkehrsbeziehung.hochrechnungsfaktor = toSave.hochrechnungsfaktor;
      }
    }
  );
}

function getHochrechnungsfaktorAsText(hf: HochrechnungsfaktorDTO): string {
  return ObjectToTextTranslator.getHochrechnungsfaktorAsText(hf);
}

function selectAll(): void {
  if (selectAllModel.value) {
    zaehlung.value.verkehrsbeziehungen = [];
    zaehlung.value.verkehrsbeziehungen = [
      ...allPossibleVerkehrsbeziehungen.value,
    ];
    zaehlung.value.verkehrsbeziehungen.forEach(
      (verkehrsbeziehung: VerkehrsbeziehungDTO) => {
        verkehrsbeziehung.active = selectAllModel.value;
      }
    );
  } else {
    zaehlung.value.verkehrsbeziehungen.forEach(
      (verkehrsbeziehung: VerkehrsbeziehungDTO) => {
        verkehrsbeziehung.active = selectAllModel.value;
      }
    );
    zaehlung.value.verkehrsbeziehungen = [];
  }
}

function selectItem(verkehrsbeziehung: VerkehrsbeziehungDTO): void {
  if (verkehrsbeziehung.active) {
    zaehlung.value.verkehrsbeziehungen.push(verkehrsbeziehung);
  } else {
    removeVerkehrsbeziehung(verkehrsbeziehung);
  }
  calculateSelectAllModel();
}

function removeVerkehrsbeziehung(toDelete: VerkehrsbeziehungDTO): void {
  let deleteIndex = -1;
  zaehlung.value.verkehrsbeziehungen.forEach(
    (verkehrsbeziehung: VerkehrsbeziehungDTO, index: number) => {
      if (
        verkehrsbeziehung.von === toDelete.von &&
        verkehrsbeziehung.nach === toDelete.nach
      ) {
        deleteIndex = index;
        verkehrsbeziehung.active = false;
      }
    }
  );
  if (deleteIndex > -1) {
    zaehlung.value.verkehrsbeziehungen.splice(deleteIndex, 1);
  }
}
</script>
