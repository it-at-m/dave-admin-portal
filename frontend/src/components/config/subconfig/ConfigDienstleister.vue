<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
  >
    <v-data-table
      :height="tableHeightDienstleister"
      density="compact"
      :headers="dienstleisterHeaders"
      :items="dienstleister"
      :items-per-page="-1"
      hide-default-footer
      fixed-header
      :search="filterDienstleister"
      :loading="dienstleisterIsLoading"
    >
      <template #top>
        <v-toolbar
          flat
          color="white"
        >
          <v-toolbar-title>
            <!-- Eingabefeld zum Filtern der Matrix -->
            <v-text-field
              v-model="filterDienstleister"
              append-inner-icon="mdi-filter"
              label="Dienstleister nach dem gefiltert werden soll"
              single-line
              hide-details
              variant="underlined"
              width="50%"
              density="compact"
            />
          </v-toolbar-title>
          <v-btn
            prepend-icon="mdi-account-plus-outline"
            text="Dienstleister anlegen"
            variant="elevated"
            color="secondary"
            @click="showEditDiensleisterDialog = true"
          />
        </v-toolbar>
      </template>
      <!-- Für Anzeige der Booleans "active" als Check (Haken) -->
      <template #[`item.active`]="{ item }">
        <v-icon
          v-if="item.active"
          icon="mdi-check-bold"
        />
      </template>
      <!-- Buttons in Tabellenspalte "Aktionen" -->
      <template #[`item.aktionen`]="{ item }">
        <v-icon
          size="small"
          icon="mdi-pencil"
          @click="editDienstleister(item)"
        />
        <v-icon
          v-if="item.erasable"
          class="ml-3"
          size="small"
          icon="mdi-delete"
          @click="deleteDienstleister(item)"
        />
      </template>
    </v-data-table>
  </v-sheet>

  <!-- Der Editierdialog Dienstleister-->
  <v-dialog
    v-model="showEditDiensleisterDialog"
    width="50%"
    height="600px"
    persistent
  >
    <v-card>
      <v-card-title>
        <v-icon
          start
          :icon="dialogiconDienstleister"
        />
        {{ dialogtitleDienstleister }}
      </v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="8"
          >
            <!-- Der eindeutige Bezeichner -->
            <v-text-field
              v-model="dienstleisterToEdit.name"
              label="Name"
              :rules="[nameVerwendbar, pflichtfeld]"
            />
          </v-col>
          <v-spacer />
          <v-col
            cols="12"
            md="2"
          >
            <v-checkbox
              v-model="dienstleisterToEdit.active"
              label="Aktiv"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="8"
          >
            <v-text-field
              v-model="dienstleisterToEdit.kennung"
              label="Kennung"
              :rules="[kennungVerwendbar, pflichtfeld]"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-data-table
              :height="tableHeightMail"
              density="compact"
              :headers="headerMail"
              :items="emailaddresses"
              :items-per-page="-1"
              hide-default-footer
              fixed-header
              :search="filterEmailaddress"
              no-data-text="Es muss mindestens eine E-Mail-Adresse angegeben werden."
              style="background-color: #e57373"
            >
              <template #top>
                <v-toolbar
                  flat
                  color="white"
                >
                  <v-toolbar-title>
                    <!-- Eingabefeld zum Filtern der Matrix -->
                    <v-text-field
                      v-model="filterEmailaddress"
                      append-inner-icon="mdi-filter"
                      label="E-Mail-Adresse nach der gefiltert werden soll"
                      single-line
                      hide-details
                      variant="underlined"
                      width="50%"
                      density="compact"
                    />
                  </v-toolbar-title>
                  <v-btn
                    prepend-icon="mdi-email-plus-outline"
                    text="E-Mail-Adresse anlegen"
                    variant="elevated"
                    color="secondary"
                    @click="showEditMailDialog = true"
                  />
                </v-toolbar>
              </template>

              <!-- Buttons in Tabellenspalte "Aktionen" -->
              <template #[`item.aktionen`]="{ item }">
                <v-icon
                  size="small"
                  icon="mdi-pencil"
                  @click="editMail(item)"
                />
                <v-icon
                  size="small"
                  icon="mdi-delete"
                  @click="deleteMail(item)"
                />
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Buttons zum speichern und Abbrechen des Editierdialogs -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          text="Speichern"
          variant="elevated"
          :disabled="disableSpeicherButtonDienstleister"
          @click="saveEditDienstleisterDialog"
        />
        <v-btn
          color="grey-lighten-1"
          variant="elevated"
          text="Abbrechen"
          @click="closeEditDienstleisterDialog"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Der Löschdialog Dienstleister-->
  <v-dialog
    v-model="showDeleteDienstleisterDialog"
    max-width="700px"
    persistent
  >
    <v-card>
      <v-card-title>Soll folgender Dienstleister gelöscht werden?</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="dienstleisterToEdit.name"
          label="Name"
          readonly
        />
        <v-text-field
          v-model="dienstleisterToEdit.kennung"
          label="Kennung"
          readonly
        />
        <v-text-field
          v-model="dienstleisterToEdit.emailAddressesAsString"
          label="E-Mail"
          readonly
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red-lighten-1"
          text="Löschen"
          variant="elevated"
          @click="deleteDienstleisterConfirm"
        />
        <v-btn
          color="grey-lighten-1"
          text="Abbrechen"
          variant="elevated"
          @click="closeDeleteDienstleisterDialog"
        />
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Der Editierdialog E-Mail -->
  <v-dialog
    v-model="showEditMailDialog"
    max-width="700px"
    persistent
  >
    <v-card>
      <v-card-title>
        <v-icon
          start
          :icon="dialogiconMail"
        />
        {{ dialogtitleMail }}
      </v-card-title>

      <v-card-text>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="8"
          >
            <!-- Der eindeutige Bezeichner -->
            <v-text-field
              v-model="editEmailaddress.emailAddress"
              label="E-Mail"
              :rules="[pflichtfeld, isEmailValidOrEmpty, isEmailADuplicate]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <!-- Buttons zum speichern und Abbrechen des Editierdialogs -->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          text="Speichern"
          variant="elevated"
          :disabled="disableSpeicherButtonMail"
          @click="saveEditMailDialog"
        />
        <v-btn
          color="grey-lighten-1"
          variant="elevated"
          text="Abbrechen"
          @click="closeEditMailDialog"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Der Löschdialog E-Mail-->
  <v-dialog
    v-model="showDeleteMailDialog"
    max-width="700px"
    persistent
  >
    <v-card>
      <v-card-title>Soll folgende E-Mail-Adresse gelöscht werden?</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="editEmailaddress.emailAddress"
          label="E-Mail-Adresse"
          readonly
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="red-lighten-1"
          text="Löschen"
          variant="elevated"
          @click="deleteMailConfirm"
        />
        <v-btn
          color="grey-lighten-1"
          text="Abbrechen"
          variant="elevated"
          @click="closeMailDelete"
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type DienstleisterDTO from "@/domain/dto/DienstleisterDTO";
import type EmailAddressDTO from "@/domain/dto/EmailAddressDTO";

import { cloneDeep, isEmpty } from "lodash";
import { computed, onMounted, ref, watch } from "vue";

import DienstleisterService from "@/api/service/DienstleisterService";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useDaveUtils } from "@/util/DaveUtils";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import { useValidationUtils } from "@/util/validationUtils";

interface Props {
  height: string;
}
const props = defineProps<Props>();
const snackbarStore = useSnackbarStore();
const validationUtils = useValidationUtils();
const daveUtils = useDaveUtils();

// Dienstleister
const dienstleister = ref<Array<DienstleisterDTO>>([]);
const dienstleisterIsLoading = ref(false);
const showDeleteDienstleisterDialog = ref(false);
const showEditDiensleisterDialog = ref(false);
const filterDienstleister = ref("");
const dienstleisterToEdit = ref(
  DefaultObjectCreator.createDefaulDienstleisterDTO()
);
const editDienstleisterIndex = ref(-1);
/* Zur Prüfung ob der Dienstleistername bereits vergeben ist. */
const dienstleisterNamen = ref<Set<string>>(new Set<string>());
/* Zur Prüfung ob die Dienstleisterkennung bereits vergeben ist. */
const dienstleisterKennungen = ref<Set<string>>(new Set<string>());

// E-Mail-Adresse
const filterEmailaddress = ref("");
const mailaddressesForDuplicateCheck = ref<Set<string>>(new Set<string>());
const showDeleteMailDialog = ref(false);
const showEditMailDialog = ref(false);
const editMailIndex = ref(-1);
const editEmailaddress = ref(
  DefaultObjectCreator.createDefaultEmailaddressDTO()
);
const emailaddresses = ref<Array<EmailAddressDTO>>([]);

// E-Mail

onMounted(() => {
  loadAllDienstleister();
});

// Dienstleister
watch(
  showEditDiensleisterDialog,
  () => {
    if (!showEditDiensleisterDialog.value) {
      initDataStructureForInputValidation();
      dienstleisterToEdit.value =
        DefaultObjectCreator.createDefaulDienstleisterDTO();
    }
  },
  { immediate: true }
);

const dienstleisterHeaders: Array<any> = [
  {
    title: "Name",
    align: "start",
    value: "name",
    lastFixed: true,
  },
  {
    title: "Kennung",
    value: "kennung",
    lastFixed: true,
  },
  {
    title: "Email",
    value: "emailAddressesAsString",
    lastFixed: true,
  },
  {
    title: "Aktiv",
    value: "active",
    align: "center",
    filterable: false,
    lastFixed: true,
    width: "8%",
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

// Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
// 64px Suche in Tabelle
const tableHeightDienstleister = computed(() => {
  return parseInt(props.height.replace("vh", "")) - daveUtils.pxToVh(64) + "vh";
});

const dialogtitleDienstleister = computed(() => {
  return `Dienstleister ${editDienstleisterIndex.value > -1 ? "bearbeiten" : "anlegen"}`;
});
const dialogiconDienstleister = computed(() => {
  return editDienstleisterIndex.value > -1
    ? "mdi-account-edit-outline"
    : "mdi-account-plus-outline";
});

/* Lädt alle Dienstleister */
function loadAllDienstleister() {
  dienstleisterIsLoading.value = true;
  DienstleisterService.getAll()
    .then((dienstleisterDTOS: Array<DienstleisterDTO>) => {
      dienstleister.value = dienstleisterDTOS;
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      dienstleisterIsLoading.value = false;
      initDataStructureForInputValidation();
    });
}

/*
    öffnet den Edit-Dialog des Dienstleisters und
    lädt die entsprechenden Daten.
  */
function editDienstleister(dienstleisterParam: DienstleisterDTO) {
  editDienstleisterIndex.value =
    dienstleister.value.indexOf(dienstleisterParam);
  dienstleisterToEdit.value = cloneDeep(dienstleisterParam);
  showEditDiensleisterDialog.value = true;
  dienstleisterNamen.value.delete(dienstleisterParam.name);
  dienstleisterKennungen.value.delete(dienstleisterParam.kennung);

  resetEmailFields();
  dienstleisterParam.emailAddresses.forEach((value) => {
    const dto: EmailAddressDTO = {} as EmailAddressDTO;
    dto.emailAddress = value;
    emailaddresses.value.push(dto);
    mailaddressesForDuplicateCheck.value.add(value);
  });
}

/* Prüft, ob der Dienstleistername bereits vergeben ist. */
function nameVerwendbar(name: string): boolean | string {
  if (!dienstleisterNamen.value.has(name)) {
    return true;
  }
  return "Dieser Name existiert bereits.";
}

/* Prüft, ob die Dienstleisterkennung bereits vergeben ist. */
function kennungVerwendbar(kennung: string): boolean | string {
  if (!dienstleisterKennungen.value.has(kennung)) {
    return true;
  }
  return "Diese Kennung existiert bereits.";
}

/* Prüft, ob ein Wert gesetzt ist. */
function pflichtfeld(value: string | number): boolean | string {
  if (!isEmpty(value)) {
    return true;
  }
  return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
}

/* Schließt den Editdialog und setzt den Index des geänderten Items zurück. */
function closeEditDienstleisterDialog() {
  showEditDiensleisterDialog.value = false;
  editDienstleisterIndex.value = -1;
  dienstleisterToEdit.value =
    DefaultObjectCreator.createDefaulDienstleisterDTO();
  resetEmailFields();
}

const disableSpeicherButtonDienstleister = computed(() => {
  const kennung: string = dienstleisterToEdit.value.kennung;
  const name: string = dienstleisterToEdit.value.name;

  return (
    isEmpty(name) ||
    isEmpty(kennung) ||
    dienstleisterNamen.value.has(name) ||
    dienstleisterKennungen.value.has(kennung) ||
    dienstleisterToEdit.value.emailAddresses.length === 0
  );
});

/**
 * Speichert das geänderte oder neu angelegte Item.
 *
 * Beim Erstellen eines neuen Items wird ein POST-Request an das Backend durchgeführt.
 * Beim Ändern eines bestehenden Items wird ein PUT-Request an das Backend durchgeführt.
 *
 * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
 */
function saveEditDienstleisterDialog() {
  if (editDienstleisterIndex.value > -1 && dienstleisterToEdit.value) {
    // Bestehender Dienstleister
    DienstleisterService.update(dienstleisterToEdit.value)
      .then(() => {
        snackbarStore.showSuccess(
          "Aktualisiert",
          "Der Dienstleister wurde erfolgreich aktualisiert."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        loadAllDienstleister();
      });
  } else if (dienstleisterToEdit.value) {
    // Neuer Dienstleister
    DienstleisterService.save(dienstleisterToEdit.value)
      .then(() => {
        snackbarStore.showSuccess(
          "Gespeichert",
          "Der Dienstleister wurde erfolgreich gespeichert."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        loadAllDienstleister();
      });
  }
  closeEditDienstleisterDialog();
}

/**
 * Öffnet den Löschdialog.
 * Ermittelt den Index des zu löschenden Items.
 *
 * @param dienstleisterToDelete das Item was gelöscht werden soll.
 */
function deleteDienstleister(dienstleisterToDelete: DienstleisterDTO) {
  editDienstleisterIndex.value = dienstleister.value.indexOf(
    dienstleisterToDelete
  );
  dienstleisterToEdit.value = cloneDeep(dienstleisterToDelete);
  showDeleteDienstleisterDialog.value = true;
}

/**
 * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
 * mit einen DELETE-Request an das Backend.
 *
 * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
 */
function deleteDienstleisterConfirm() {
  if (editDienstleisterIndex.value > -1 && dienstleisterToEdit.value) {
    DienstleisterService.delete(dienstleisterToEdit.value)
      .then(() => {
        snackbarStore.showSuccess(
          "Gelöscht",
          "Der Dienstleister wurde erfolgreich gelöscht."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        loadAllDienstleister();
      });
  }
  closeDeleteDienstleisterDialog();
}

/**
 * Schließt den Löschdialog und setzt den Index des gelöschten Items zurück.
 */
function closeDeleteDienstleisterDialog() {
  showDeleteDienstleisterDialog.value = false;
  editDienstleisterIndex.value = -1;
  dienstleisterToEdit.value =
    DefaultObjectCreator.createDefaulDienstleisterDTO();
  resetEmailFields();
}

/**
 * Initialisiert die Datenstrukturen zur Duplikatsprüfung für die Attribute
 * Name und Kennung des Dienstleisters.
 */
function initDataStructureForInputValidation(): void {
  dienstleisterKennungen.value.clear();
  dienstleisterNamen.value.clear();
  dienstleister.value.forEach((dienstleister2: DienstleisterDTO) => {
    dienstleisterNamen.value.add(dienstleister2.name);
    dienstleisterKennungen.value.add(dienstleister2.kennung);
  });
}

// E-Mail-Adressen

// Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
const tableHeightMail = computed(() => {
  return (
    daveUtils.pxToVh(600) -
    daveUtils.cardtitleHeight.value -
    daveUtils.cardactionHeight.value -
    // Zeile 1
    daveUtils.pxToVh(62) -
    // Zeile 2
    daveUtils.pxToVh(62) -
    // Padding
    daveUtils.pxToVh(40) -
    // Tabellenfilter
    daveUtils.pxToVh(64) +
    "vh"
  );
});

const dialogtitleMail = computed(() => {
  return `E-Mail-Adresse ${editMailIndex.value > -1 ? "bearbeiten" : "anlegen"}`;
});
const dialogiconMail = computed(() => {
  return editMailIndex.value > -1
    ? "mdi-email-edit-outline"
    : "mdi-email-plus-outline";
});

const headerMail: Array<any> = [
  {
    title: "E-Mail-Adressen",
    align: "start",
    sortable: true,
    value: "emailAddress",
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

const disableSpeicherButtonMail = computed(() => {
  const mail: string = editEmailaddress.value.emailAddress;
  return (
    isEmpty(mail) ||
    mailaddressesForDuplicateCheck.value.has(mail) ||
    mail.length === 0 ||
    !validationUtils.isEmailValid(mail)
  );
});

// Speichern
/**
 * Speichert das geänderte oder neu angelegte Item.
 *
 * Beim Erstellen eines neuen Items wird ein POST-Request an das Backend durchgeführt.
 * Beim Ändern eines bestehenden Items wird ein PUT-Request an das Backend durchgeführt.
 *
 * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
 */
function saveEditMailDialog() {
  if (editMailIndex.value > -1 && editEmailaddress.value) {
    // Bestehende Email
    const deletedEmail = emailaddresses.value.splice(editMailIndex.value, 1)[0];
    dienstleisterToEdit.value.emailAddresses.splice(
      dienstleisterToEdit.value.emailAddresses.indexOf(
        deletedEmail.emailAddress
      ),
      1
    );
    mailaddressesForDuplicateCheck.value.delete(deletedEmail.emailAddress);
    emailaddresses.value.push(editEmailaddress.value);
    dienstleisterToEdit.value.emailAddresses.push(
      editEmailaddress.value.emailAddress
    );
    mailaddressesForDuplicateCheck.value.add(
      editEmailaddress.value.emailAddress
    );
  } else if (editEmailaddress.value) {
    // Neue Email
    emailaddresses.value.push(editEmailaddress.value);
    dienstleisterToEdit.value.emailAddresses.push(
      editEmailaddress.value.emailAddress
    );
    mailaddressesForDuplicateCheck.value.add(
      editEmailaddress.value.emailAddress
    );
  }
  closeEditMailDialog();
}

/**
 * Schließt den Editdialog und setzt den Index des geänderten Items zurück.
 */
function closeEditMailDialog() {
  showEditMailDialog.value = false;
  editMailIndex.value = -1;
  editEmailaddress.value = DefaultObjectCreator.createDefaultEmailaddressDTO();
}

// Löschen
/**
 * Öffnet den Löschdialog.
 * Ermittelt den Index des zu löschenden Items.
 *
 * @param item das Item was gelöscht werden soll.
 */
function deleteMail(item: EmailAddressDTO) {
  editMailIndex.value = emailaddresses.value.indexOf(item);
  editEmailaddress.value = cloneDeep(item);
  showDeleteMailDialog.value = true;
}

/**
 * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
 * mit einen DELETE-Request an das Backend.
 *
 * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
 */
function deleteMailConfirm() {
  if (editMailIndex.value > -1 && editEmailaddress.value) {
    const index: number = dienstleisterToEdit.value.emailAddresses.indexOf(
      editEmailaddress.value.emailAddress
    );
    if (index > -1) {
      dienstleisterToEdit.value.emailAddresses.splice(index, 1);
      emailaddresses.value.splice(editMailIndex.value, 1);
      mailaddressesForDuplicateCheck.value.delete(
        editEmailaddress.value.emailAddress
      );
    }
  }
  closeMailDelete();
}

/**
 * Schließt den Löschdialog und setzt den Index des gelöschten Items zurück.
 */
function closeMailDelete() {
  showDeleteMailDialog.value = false;
  editMailIndex.value = -1;
  editEmailaddress.value = DefaultObjectCreator.createDefaultEmailaddressDTO();
}

/**
 * Öffnet den Dialog zum Ändern eines items.
 * @param emailaddressDTO zum Ändern.
 */
function editMail(emailaddressDTO: EmailAddressDTO) {
  editMailIndex.value = emailaddresses.value.indexOf(emailaddressDTO);
  editEmailaddress.value = cloneDeep(emailaddressDTO);
  mailaddressesForDuplicateCheck.value.delete(emailaddressDTO.emailAddress);
  showEditMailDialog.value = true;
}

function resetEmailFields() {
  filterEmailaddress.value = "";
  emailaddresses.value = [];
  mailaddressesForDuplicateCheck.value = new Set<string>();
}

/* Prüft, ob die Email valide oder leer ist. */
function isEmailValidOrEmpty(email: string): boolean | string {
  if (isEmpty(email) || validationUtils.isEmailValid(email)) {
    return true;
  } else {
    return "Die Email-Adresse ist nicht valide.";
  }
}

/* Prúft, ob die Email bereits gespeichert ist */
function isEmailADuplicate(email: string): boolean | string {
  if (mailaddressesForDuplicateCheck.value.has(email)) {
    return "Die Email-Adresse exisitert bereits.";
  } else {
    return false;
  }
}
</script>
