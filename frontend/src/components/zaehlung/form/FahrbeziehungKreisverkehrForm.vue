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
import type FahrbeziehungDTO from "@/types/zaehlung/FahrbeziehungDTO";
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

const allPossibleFahrbeziehungen = ref<Array<FahrbeziehungDTO>>([]);
const selectAllModel = ref(false);
const HEADERS = [
  {
    title: "Knotenarm",
    align: "center",
    value: "knotenarm",
    width: "12%",
  },
  { title: "Typ", align: "center", value: "kreisverkehrTyp", width: "15%" },
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
) {
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
  allPossibleFahrbeziehungen.value.forEach((pos: FahrbeziehungDTO) => {
    zaehlung.value.fahrbeziehungen.forEach((fahr: FahrbeziehungDTO) => {
      if (
        pos.knotenarm === fahr.knotenarm &&
        pos.heraus === fahr.heraus &&
        pos.vorbei === fahr.vorbei &&
        pos.hinein === fahr.hinein
      ) {
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

function calculateSelectAllModel() {
  selectAllModel.value =
    zaehlung.value.fahrbeziehungen.length >=
    allPossibleFahrbeziehungen.value.length / 2;
}

function updateFahrbeziehung(toSave: FahrbeziehungDTO): void {
  zaehlung.value.fahrbeziehungen.forEach((fahrbeziehung: FahrbeziehungDTO) => {
    if (
      fahrbeziehung.knotenarm === toSave.knotenarm &&
      fahrbeziehung.heraus === toSave.heraus &&
      fahrbeziehung.hinein === toSave.hinein &&
      fahrbeziehung.vorbei === toSave.vorbei
    ) {
      fahrbeziehung.hochrechnungsfaktor = toSave.hochrechnungsfaktor;
    }
  });
}

function getType(fz: FahrbeziehungDTO): string {
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

/**
 * Erzeugt aus den vorhandenen Knotenarmen alle möglichen Fahrbeziehungen.
 * @private
 */
function calculatePossibleFahrbeziehungen(): Array<FahrbeziehungDTO> {
  const standardFaktor: HochrechnungsfaktorDTO =
    hochrechnungsfaktorenStore.getStandardHochrechnungsfaktor;
  const allPossibleFahrbeziehungen: Array<FahrbeziehungDTO> = [];
  zaehlung.value.knotenarme.forEach((arm: KnotenarmDTO) => {
    const newFzHeraus: FahrbeziehungDTO = {} as FahrbeziehungDTO;
    newFzHeraus.knotenarm = arm.nummer;
    newFzHeraus.hinein = false;
    newFzHeraus.vorbei = false;
    newFzHeraus.heraus = true;
    newFzHeraus.active = false;
    newFzHeraus.hochrechnungsfaktor = cloneDeep(standardFaktor);
    newFzHeraus.kreisverkehrTyp = getType(newFzHeraus);
    newFzHeraus.indexKey = `${newFzHeraus.knotenarm}${newFzHeraus.kreisverkehrTyp}`;
    allPossibleFahrbeziehungen.push(newFzHeraus);
    const newFzVorbei: FahrbeziehungDTO = {} as FahrbeziehungDTO;
    newFzVorbei.knotenarm = arm.nummer;
    newFzVorbei.hinein = false;
    newFzVorbei.vorbei = true;
    newFzVorbei.heraus = false;
    newFzVorbei.active = false;
    newFzVorbei.kreisverkehrTyp = getType(newFzVorbei);
    newFzVorbei.hochrechnungsfaktor = cloneDeep(standardFaktor);
    newFzVorbei.indexKey = `${newFzVorbei.knotenarm}${newFzVorbei.kreisverkehrTyp}`;
    allPossibleFahrbeziehungen.push(newFzVorbei);
    const newFzHinein: FahrbeziehungDTO = {} as FahrbeziehungDTO;
    newFzHinein.knotenarm = arm.nummer;
    newFzHinein.hinein = true;
    newFzHinein.vorbei = false;
    newFzHinein.heraus = false;
    newFzHinein.active = false;
    newFzHinein.kreisverkehrTyp = getType(newFzHinein);
    newFzHinein.hochrechnungsfaktor = cloneDeep(standardFaktor);
    newFzHinein.indexKey = `${newFzHinein.knotenarm}${newFzHinein.kreisverkehrTyp}`;
    allPossibleFahrbeziehungen.push(newFzHinein);
  });
  allPossibleFahrbeziehungen.sort(
    FahrbeziehungComparator.sortKreisverkehrByVonAndNach
  );
  return allPossibleFahrbeziehungen;
}

function getHochrechnungsfaktorAsText(hf: HochrechnungsfaktorDTO): string {
  return ObjectToTextTranslator.getHochrechnungsfaktorAsText(hf);
}

function selectAll() {
  if (selectAllModel.value) {
    zaehlung.value.fahrbeziehungen = [];
    zaehlung.value.fahrbeziehungen = [...allPossibleFahrbeziehungen.value];
    zaehlung.value.fahrbeziehungen.forEach(
      (fahrbeziehung: FahrbeziehungDTO) => {
        fahrbeziehung.active = selectAllModel.value;
      }
    );
  } else {
    zaehlung.value.fahrbeziehungen.forEach(
      (fahrbeziehung: FahrbeziehungDTO) => {
        fahrbeziehung.active = selectAllModel.value;
      }
    );
    zaehlung.value.fahrbeziehungen = [];
  }
}

function selectItem(fahrbeziehung: FahrbeziehungDTO) {
  if (fahrbeziehung.active) {
    zaehlung.value.fahrbeziehungen.push(fahrbeziehung);
  } else {
    removeFahrbeziehung(fahrbeziehung);
  }
  calculateSelectAllModel();
}

function removeFahrbeziehung(toDelete: FahrbeziehungDTO) {
  let deleteIndex = -1;
  zaehlung.value.fahrbeziehungen.forEach(
    (fahrbeziehung: FahrbeziehungDTO, index: number) => {
      if (
        fahrbeziehung.knotenarm === toDelete.knotenarm &&
        fahrbeziehung.heraus === toDelete.heraus &&
        fahrbeziehung.vorbei === toDelete.vorbei &&
        fahrbeziehung.hinein === toDelete.hinein
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
