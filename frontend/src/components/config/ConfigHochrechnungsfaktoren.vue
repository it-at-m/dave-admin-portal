<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
  >
    <v-data-table
      :height="tableHeight"
      density="compact"
      :headers="header as Array<any>"
      :items="hochrechnungsfaktoren"
      :items-per-page="-1"
      hide-default-footer
      fixed-header
      :search="filterMatrix"
    >
      <template #top>
        <v-toolbar
          flat
          color="white"
        >
          <v-toolbar-title>
            <!-- Eingabefeld zum Filtern der Matrix -->
            <v-text-field
              v-model="filterMatrix"
              append-inner-icon="mdi-filter"
              label="Matrix nach der gefiltert werden soll"
              single-line
              hide-details
              variant="underlined"
              width="50%"
              density="compact"
            />
          </v-toolbar-title>
          <v-btn
            class="mr-2"
            prepend-icon="mdi-data-matrix-plus"
            text="Hochrechnungsfaktor anlegen"
            variant="elevated"
            color="secondary"
            @click="showEditDialog = true"
          />
        </v-toolbar>
      </template>

      <!-- Für Anzeige der Booleans "active" und "defaultFaktor" als Check (Haken) -->
      <template #[`item.active`]="{ item }">
        <v-icon
          v-if="item.active"
          icon="mdi-check-bold"
        />
      </template>
      <template #[`item.defaultFaktor`]="{ item }">
        <v-icon
          v-if="item.defaultFaktor"
          icon="mdi-check-bold"
        />
      </template>

      <!-- Buttons in Tabellenspalte "Aktionen" -->
      <template #[`item.aktionen`]="{ item }">
        <v-icon
          size="small"
          icon="mdi-pencil"
          @click="editItem(item)"
        />
        <v-icon
          class="ml-3"
          size="small"
          icon="mdi-delete"
          @click="deleteItem(item)"
        />
      </template>
    </v-data-table>
  </v-sheet>
  <!-- Der Editierdialog -->
  <v-dialog
    v-model="showEditDialog"
    max-width="700px"
    persistent
  >
    <v-card>
      <v-card-title>
        <v-icon
          start
          :icon="dialogicon"
        />
        {{ dialogtitle }}
      </v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="8"
          >
            <!-- Der eindeutige Bezeichner -->
            <v-text-field
              v-model="editHochrechnungsfaktor.matrix"
              label="Matrix"
              :rules="[matrixVerwendbar, pflichtfeld]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model.number="editHochrechnungsfaktor.kfz"
              label="KFZ"
              type="number"
              :min="0"
              :rules="[mustBePositivNumber]"
              validate-on-blur
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model.number="editHochrechnungsfaktor.sv"
              label="SV"
              type="number"
              :min="0"
              :rules="[mustBePositivNumber]"
              validate-on-blur
            ></v-text-field>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model.number="editHochrechnungsfaktor.gv"
              label="GV"
              type="number"
              :min="0"
              :rules="[mustBePositivNumber]"
              validate-on-blur
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="4"
          >
            <v-checkbox
              v-model="editHochrechnungsfaktor.active"
              label="Aktiv"
            ></v-checkbox>
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <!-- Es darf nur ein DTO den Wert true annehmen -->
            <v-checkbox
              v-model="editHochrechnungsfaktor.defaultFaktor"
              label="Default"
              :rules="[isDefaultFactorValid]"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Buttons zum speichern und Abbrechen des Editierdialogs -->
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="secondary"
          text="Speichern"
          variant="elevated"
          :disabled="disableSpeicherButton"
          @click="saveEditItemDialog"
        />
        <v-btn
          color="tertiary"
          variant="elevated"
          text="Abbrechen"
          @click="closeEditItemDialog"
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Der Löschdialog -->
  <v-dialog
    v-model="showDeleteDialog"
    max-width="700px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span>Soll der Hochrechnungsfaktor</span>
        <span
          class="mx-1"
          style="color: crimson"
        >
          {{ editHochrechnungsfaktor.matrix }}
        </span>
        <span>gelöscht werden?</span>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red-lighten-1"
          text="Löschen"
          variant="elevated"
          @click="deleteItemConfirm"
        />
        <v-btn
          color="tertiary"
          text="Abbrechen"
          variant="elevated"
          @click="closeDelete"
        />
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type HochrechnungsfaktorDTO from "@/types/config/HochrechnungsfaktorDTO";

import { cloneDeep, isEmpty, isNumber } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import HochrechnungsfaktorService from "@/api/service/HochrechnungsfaktorService";
import { useHochrechnungsfaktorStore } from "@/store/HochrechnungsfaktorStore";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useDaveUtils } from "@/util/DaveUtils";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

interface Props {
  height: string;
}
const props = defineProps<Props>();
const snackbarStore = useSnackbarStore();
const hochrechnungsfaktorStore = useHochrechnungsfaktorStore();
const daveUtils = useDaveUtils();

const filterMatrix = ref("");
/**
 * Zur Prüfung ob Matrix bereits vergeben.
 */
const hofaMatrizen = ref<Set<string>>(new Set<string>());
/**
 * Zur Prüfung ob defaultFaktor maximal nur einmal vergeben ist.
 */
const defaultFaktorPerMatrix = ref<Map<string, boolean>>(
  new Map<string, boolean>()
);
const hochrechnungsfaktoren = ref<Array<HochrechnungsfaktorDTO>>([]);
const editHochrechnungsfaktor = ref(
  DefaultObjectCreator.createDefaultHochrechnungsfaktor()
);
const editIndex = ref(-1);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

const header = [
  {
    title: "Matrix",
    align: "center",
    sortable: true,
    filterable: true,
    value: "matrix",
    width: "24%",
    lastFixed: true,
  },
  {
    title: "KFZ",
    align: "center",
    sortable: false,
    filterable: false,
    value: "kfz",
    width: "10%",
    lastFixed: true,
  },
  {
    title: "SV",
    align: "center",
    sortable: false,
    filterable: false,
    value: "sv",
    width: "10%",
    lastFixed: true,
  },
  {
    title: "GV",
    align: "center",
    sortable: false,
    filterable: false,
    value: "gv",
    width: "10%",
    lastFixed: true,
  },
  {
    title: "Aktiv",
    align: "center",
    sortable: true,
    filterable: false,
    value: "active",
    width: "8%",
    lastFixed: true,
  },
  {
    title: "Default",
    align: "center",
    sortable: true,
    filterable: false,
    value: "defaultFaktor",
    width: "8%",
    lastFixed: true,
  },
  {
    title: "Aktionen",
    align: "center",
    sortable: false,
    filterable: false,
    value: "aktionen",
    width: "10%",
  },
];

onMounted(() => {
  getAllHochrechnungsfaktoren();
  editHochrechnungsfaktor.value =
    DefaultObjectCreator.createDefaultHochrechnungsfaktor();
});

watch(
  showEditDialog,
  () => {
    if (!showEditDialog.value) {
      initDataStructureForInputValidation();
      editHochrechnungsfaktor.value =
        DefaultObjectCreator.createDefaultHochrechnungsfaktor();
    }
  },
  { immediate: true }
);

// Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
const tableHeight = computed(() => {
  return (
    parseInt(props.height.replace("vh", "")) -
    daveUtils.datatableFilterHeight.value +
    "vh"
  );
});
const dialogtitle = computed(() => {
  return `Hochrechnungsfaktor ${editIndex.value > -1 ? "bearbeiten" : "anlegen"}`;
});
const dialogicon = computed(() => {
  return editIndex.value > -1 ? "mdi-data-matrix-edit" : "mdi-data-matrix-plus";
});

const disableSpeicherButton = computed(() => {
  const matrix: string = editHochrechnungsfaktor.value.matrix;
  return (
    isEmpty(matrix) ||
    hofaMatrizen.value.has(matrix) ||
    mustBePositivNumber(editHochrechnungsfaktor.value.kfz) !== true ||
    mustBePositivNumber(editHochrechnungsfaktor.value.sv) !== true ||
    mustBePositivNumber(editHochrechnungsfaktor.value.gv) !== true ||
    !checkForValidDefaultFactor(editHochrechnungsfaktor.value.defaultFaktor)
  );
});

// Löschen
/**
 * Öffnet den Löschdialog.
 * Ermittelt den Index des zu löschenden Items.
 *
 * @param item das Item was gelöscht werden soll.
 */
function deleteItem(item: HochrechnungsfaktorDTO) {
  editIndex.value = hochrechnungsfaktoren.value.indexOf(item);
  editHochrechnungsfaktor.value = cloneDeep(item);
  showDeleteDialog.value = true;
}

/**
 * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
 * mit einen DELETE-Request an das Backend.
 *
 * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
 */
function deleteItemConfirm() {
  if (editIndex.value > -1 && editHochrechnungsfaktor.value) {
    HochrechnungsfaktorService.deleteHochrechnungsfaktor(
      editHochrechnungsfaktor.value
    )
      .then(() => {
        snackbarStore.showSuccess(
          "Gelöscht",
          "Der Hochrechnungsfaktor wurde erfolgreich gelöscht."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        getAllHochrechnungsfaktoren();
      });
  }
  closeDelete();
}

/**
 * Schließt den Löschdialog und setzt den Index des gelöschten Items zurück.
 */
function closeDelete() {
  showDeleteDialog.value = false;
  editIndex.value = -1;
  editHochrechnungsfaktor.value =
    DefaultObjectCreator.createDefaultHochrechnungsfaktor();
}

// Editieren/Speichern
/**
 * Öffnet den Dialog zum Ändern eines items.
 * @param item zum Ändern.
 */
function editItem(item: HochrechnungsfaktorDTO) {
  editIndex.value = hochrechnungsfaktoren.value.indexOf(item);
  editHochrechnungsfaktor.value = cloneDeep(item);
  showEditDialog.value = true;
  hofaMatrizen.value.delete(item.matrix);
  defaultFaktorPerMatrix.value.delete(item.matrix);
}

// Speichern
/**
 * Speichert das geänderte oder neu angelegte Item.
 *
 * Beim Erstellen eines neuen Items wird ein POST-Request an das Backend durchgeführt.
 * Beim Ändern eines bestehenden Items wird ein PUT-Request an das Backend durchgeführt.
 *
 * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
 */
function saveEditItemDialog() {
  if (editIndex.value > -1 && editHochrechnungsfaktor.value) {
    // Bestehender HOFA
    HochrechnungsfaktorService.putHochrechnungsfaktor(
      editHochrechnungsfaktor.value
    )
      .then(() => {
        snackbarStore.showSuccess(
          "Aktualisiert",
          "Der Hochrechnungsfaktor wurde erfolgreich aktualisiert."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        getAllHochrechnungsfaktoren();
      });
  } else if (editHochrechnungsfaktor.value) {
    // Neuer HOFA
    HochrechnungsfaktorService.postHochrechnungsfaktor(
      editHochrechnungsfaktor.value
    )
      .then(() => {
        snackbarStore.showSuccess(
          "Gespeichert",
          "Der Hochrechnungsfaktor wurde erfolgreich gespeichert."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        getAllHochrechnungsfaktoren();
      });
  }
  closeEditItemDialog();
}

/**
 * Schließt den Editdialog und setzt den Index des geänderten Items zurück.
 */
function closeEditItemDialog() {
  showEditDialog.value = false;
  editIndex.value = -1;
  editHochrechnungsfaktor.value =
    DefaultObjectCreator.createDefaultHochrechnungsfaktor();
}

/**
 * Holt mit einen GET-Request alle Hochrechnungsfaktoren vom Backend.
 */
function getAllHochrechnungsfaktoren() {
  HochrechnungsfaktorService.getAllHochrechnungsfaktoren()
    .then((faktoren: Array<HochrechnungsfaktorDTO>) => {
      hochrechnungsfaktorStore.setHochrechnungsfaktoren(cloneDeep(faktoren));
      hochrechnungsfaktoren.value =
        hochrechnungsfaktorStore.getHochrechnungsfaktorenWithDefaultAtFirstPosition;
      initDataStructureForInputValidation();
    })
    .catch((error) => snackbarStore.showApiError(error));
}

/**
 * Prüft, ob der Matrixname bereits vergeben ist.
 */
function matrixVerwendbar(matrix: string): boolean | string {
  const matrixBereitsVorhanden = hofaMatrizen.value.has(matrix);
  if (!matrixBereitsVorhanden) {
    return true;
  }
  return "Diese Matrixbezeichnung existiert bereits.";
}

/**
 * Prüft, ob ein Wert gesetzt ist.
 */
function pflichtfeld(value: string | number): boolean | string {
  if (!isEmpty(value)) {
    return true;
  }
  return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
}

/**
 * Prüft, ob der übergebene Wert eine Zahl ist.
 */
function mustBePositivNumber(value: string | number): boolean | string {
  if (!isNumber(value) || value < 0) {
    return "Bitte eine Zahl >= 0 eingeben";
  }
  return true;
}

/**
 * Prüft, ob bei Markierung als DefaultFaktor bereits ein
 * anderer Hochrechnungsfaktor als Default markiert ist.
 *
 * Es darf nur ein Hochrechnungsfaktor den Wert "true" annehmen.
 */
function isDefaultFactorValid(value: boolean): boolean | string {
  let result: string | boolean;
  if (checkForValidDefaultFactor(value)) {
    result = true;
  } else {
    result = "Es ist bereits ein Hochrechnungsfaktor als Default gesetzt.";
  }
  return result;
}

/**
 * Prüft, ob bei Markierung als DefaultFaktor bereits ein
 * anderer Hochrechnungsfaktor als Default markiert ist.
 */
function checkForValidDefaultFactor(value: boolean): boolean {
  let numberOfDefaults = 0;
  defaultFaktorPerMatrix.value.forEach((defaultFaktor) => {
    if (defaultFaktor) {
      numberOfDefaults++;
    }
  });
  return (value && numberOfDefaults < 1) || !value;
}

/**
 * Initialisiert die Datenstrukturen zur Duplikatsprüfung für die Attribute
 * Matrix und DefaultFaktor.
 */
function initDataStructureForInputValidation(): void {
  hofaMatrizen.value.clear();
  defaultFaktorPerMatrix.value.clear();
  hochrechnungsfaktoren.value.forEach((hofa) => {
    hofaMatrizen.value.add(hofa.matrix);
    defaultFaktorPerMatrix.value.set(hofa.matrix, hofa.defaultFaktor);
  });
}
</script>
