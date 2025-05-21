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
      :items="emailaddresses"
      :items-per-page="-1"
      hide-default-footer
      fixed-header
      :search="filterEmailaddress"
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
            class="mr-2"
            prepend-icon="mdi-email-plus-outline"
            text="E-Mail-Adresse anlegen"
            variant="elevated"
            color="secondary"
            @click="showEditDialog = true"
          />
        </v-toolbar>
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
          :disabled="disableSpeicherButton"
          @click="saveEditItemDialog"
        />
        <v-btn
          color="tertiary"
          variant="elevated"
          text="Abbrechen"
          @click="closeEditItemDialog"
        />
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
          @click="deleteItemConfirm"
        />
        <v-btn
          color="tertiary"
          text="Abbrechen"
          variant="elevated"
          @click="closeDelete"
        />
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type EmailAddressDTO from "@/types/config/EmailAddressDTO";

import { cloneDeep, isEmpty, isNull } from "lodash";
import { computed, onMounted, ref } from "vue";

import EmailAddressService from "@/api/service/EmailAddressService";
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

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const filterEmailaddress = ref("");
const editIndex = ref(-1);
const mailaddressesForDuplicateCheck = ref<Set<string>>(new Set<string>());
const editEmailaddress = ref(
  DefaultObjectCreator.createDefaultEmailaddressDTO()
);
const emailaddresses = ref<Array<EmailAddressDTO>>([]);

onMounted(() => {
  loadMobilitaetsreferatEmailAddress();
});

/* Lädt die Email-Adresse vom Referat */
function loadMobilitaetsreferatEmailAddress() {
  EmailAddressService.getEmailAddresses()
    .then((result: Array<EmailAddressDTO>) => {
      emailaddresses.value = [];
      mailaddressesForDuplicateCheck.value = new Set<string>();
      editEmailaddress.value =
        DefaultObjectCreator.createDefaultEmailaddressDTO();
      if (!isNull(result) && result.length > 0) {
        emailaddresses.value = cloneDeep(result);
        emailaddresses.value.forEach((value) => {
          mailaddressesForDuplicateCheck.value.add(value.emailAddress);
        });
      }
    })
    .catch((error) => snackbarStore.showApiError(error));
}

// Löschen
/**
 * Öffnet den Löschdialog.
 * Ermittelt den Index des zu löschenden Items.
 *
 * @param item das Item was gelöscht werden soll.
 */
function deleteItem(item: EmailAddressDTO) {
  editIndex.value = emailaddresses.value.indexOf(item);
  editEmailaddress.value = cloneDeep(item);
  showDeleteDialog.value = true;
}

/**
 * Löscht das gewählte Item bei Klick auf den Button Löschen im Löschdialog
 * mit einen DELETE-Request an das Backend.
 *
 * Nach Ausführung des Requests an das Backend werden die Daten neu vom Backend geladen.
 */
function deleteItemConfirm() {
  if (editIndex.value > -1 && editEmailaddress.value) {
    EmailAddressService.delete(editEmailaddress.value)
      .then(() => {
        snackbarStore.showSuccess(
          "Gelöscht",
          "Die E-Mail-Adresse wurde erfolgreich gelöscht."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        loadMobilitaetsreferatEmailAddress();
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
  editEmailaddress.value = DefaultObjectCreator.createDefaultEmailaddressDTO();
}

// Editieren/Speichern
/**
 * Öffnet den Dialog zum Ändern eines items.
 * @param item zum Ändern.
 */
function editItem(item: EmailAddressDTO) {
  editIndex.value = emailaddresses.value.indexOf(item);
  editEmailaddress.value = cloneDeep(item);
  mailaddressesForDuplicateCheck.value.delete(item.emailAddress);
  showEditDialog.value = true;
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
  if (editIndex.value > -1 && editEmailaddress.value) {
    // Bestehende Email
    EmailAddressService.update(editEmailaddress.value)
      .then(() => {
        snackbarStore.showSuccess(
          "Aktualisiert",
          "Die E-Mail-Adresse wurde erfolgreich aktualisiert."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        loadMobilitaetsreferatEmailAddress();
      });
  } else if (editEmailaddress.value) {
    // Neue Email
    EmailAddressService.save(editEmailaddress.value)
      .then(() => {
        snackbarStore.showSuccess(
          "Gespeichert",
          "Die E-Mail-Addresse wurde erfolgreich gespeichert."
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        loadMobilitaetsreferatEmailAddress();
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
  editEmailaddress.value = DefaultObjectCreator.createDefaultEmailaddressDTO();
}

// Von der Sheet-Height alles abziehen, was nicht die Tabelle ist
// 64px Suche in Tabelle
const tableHeight = computed(() => {
  return (
    parseInt(props.height.replace("vh", "")) -
    daveUtils.datatableFilterHeight.value +
    "vh"
  );
});

const header = [
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

const disableSpeicherButton = computed(() => {
  const mail: string = editEmailaddress.value.emailAddress;

  return (
    isEmpty(mail) ||
    mailaddressesForDuplicateCheck.value.has(mail) ||
    mail.length === 0 ||
    !validationUtils.isEmailValid(mail)
  );
});

const dialogtitle = computed(() => {
  return `E-Mail-Adresse ${editIndex.value > -1 ? "bearbeiten" : "anlegen"}`;
});
const dialogicon = computed(() => {
  return editIndex.value > -1
    ? "mdi-email-edit-outline"
    : "mdi-email-plus-outline";
});

/* Rules */

/* Prüft, ob ein Wert gesetzt ist. */
function pflichtfeld(value: string): boolean | string {
  if (!isEmpty(value)) {
    return true;
  }
  return "Hierbei handelt es sich um ein Pflichtfeld. Bitte ausfüllen";
}

/* Prüft,ob die Email valide oder nicht leer ist*/
function isEmailValidOrEmpty(email: string): boolean | string {
  if (isEmpty(email) || validationUtils.isEmailValid(email)) {
    return true;
  } else {
    return "Die Email-Adresse ist nicht valide.";
  }
}

/* Prüft, ob die EMail bereits hinterlegt ist. */
function isEmailADuplicate(email: string): boolean | string {
  if (mailaddressesForDuplicateCheck.value.has(email)) {
    return "Die Email-Adresse exisitert bereits.";
  } else {
    return false;
  }
}
</script>
