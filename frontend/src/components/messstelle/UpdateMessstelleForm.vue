<template>
  <v-tabs
    v-model="activeTab"
    fixed-tabs
    bg-color="grey-darken-1"
    slider-color="grey-lighten-1"
    stacked
    density="compact"
    color="white"
    class="text-grey-lighten-1"
  >
    <!-- Kopfzeile -->
    <v-tab :value="TAB_MESSSTELLE">
      Messstelle
      <v-icon>mdi-information-outline</v-icon>
    </v-tab>
    <v-tab :value="TAB_MESSQUERSCHNITT">
      Messquerschnitt
      <v-icon>mdi-routes</v-icon>
    </v-tab>
    <v-tab :value="TAB_MESSFAEHIGKEIT">
      Messfähigkeit
      <v-icon>mdi-car-multiple</v-icon>
    </v-tab>
    <v-tab :value="TAB_STANDORT">
      Standort
      <v-icon>mdi-map-marker-outline</v-icon>
    </v-tab>
  </v-tabs>

  <v-banner
    v-if="isMessstelleReadonly"
    lines="one"
    width="100%"
    text="Zählstelle besitzt aktuell keine Zählungen."
    style="justify-items: center"
  >
    <template #text>
      <v-icon
        icon="mdi-alert-decagram-outline"
        size="36"
        color="error"
      />
      Solange eine Messstelle den Status
      <strong>In Planung</strong> hat, kann diese nicht bearbeitet werden.
    </template>
  </v-banner>

  <v-tabs-window
    v-model="activeTab"
    class="d-flex flex-column align-stretch"
  >
    <v-tabs-window-item :value="TAB_MESSSTELLE">
      <messstelle-form
        v-model="messstelle"
        :height="contentHeight"
        :disabled="isMessstelleReadonly"
      />
    </v-tabs-window-item>
    <v-tabs-window-item :value="TAB_MESSQUERSCHNITT">
      <messquerschnitt-form
        v-model="messstelle"
        :height="contentHeight"
        :disabled="isMessstelleReadonly"
      />
    </v-tabs-window-item>
    <v-tabs-window-item :value="TAB_MESSFAEHIGKEIT">
      <messfaehigkeit-form
        v-model="messstelle.messfaehigkeiten"
        :height="contentHeight"
      />
    </v-tabs-window-item>
    <v-tabs-window-item :value="TAB_STANDORT">
      <standort-tab-item
        v-model="messstelle"
        :height="contentHeight"
        :draggable="!isMessstelleReadonly"
      />
    </v-tabs-window-item>
  </v-tabs-window>
  <v-card-actions v-if="!isMessstelleReadonly">
    <v-spacer />
    <v-btn
      color="secondary"
      text="Speichern"
      variant="elevated"
      @click="save()"
    />
    <v-btn
      color="grey-lighten-1"
      variant="elevated"
      text="Abbrechen"
      @click="cancel()"
    />
  </v-card-actions>
</template>

<script setup lang="ts">
import type MessquerschnittEditDTO from "@/types/messstelle/MessquerschnittEditDTO";
import type MessstelleEditDTO from "@/types/messstelle/MessstelleEditDTO";

import { isEmpty, isNil } from "lodash";
import { computed, ref } from "vue";

import MessstelleService from "@/api/service/MessstelleService";
import MessfaehigkeitForm from "@/components/messstelle/MessfaehigkeitForm.vue";
import MessquerschnittForm from "@/components/messstelle/MessquerschnittForm.vue";
import MessstelleForm from "@/components/messstelle/MessstelleForm.vue";
import StandortTabItem from "@/components/messstelle/StandortTabItem.vue";
import { useSnackbarStore } from "@/store/SnackbarStore";
import MessstelleStatus from "@/types/enum/MessstelleStatus";
import { useDaveUtils } from "@/util/DaveUtils";

const activeTab = ref(0);

interface Props {
  height: number;
}

const props = defineProps<Props>();

const messstelle = defineModel<MessstelleEditDTO>({
  required: true,
});

const snackbarStore = useSnackbarStore();
const daveUtils = useDaveUtils();

const emits = defineEmits<{
  (e: "reload"): void;
}>();

const TAB_MESSSTELLE = 0;
const TAB_MESSQUERSCHNITT = 1;
const TAB_MESSFAEHIGKEIT = 2;
const TAB_STANDORT = 3;

const isMessstelleReadonly = computed(() => {
  return messstelle.value.status === MessstelleStatus.IN_PLANUNG;
});
/**
 * Berechnet die Höhe der Fläche unter den Tabs in "vh"
 */
const contentHeight = computed(() => {
  let height = props.height - daveUtils.tabHeight.value;
  if (isMessstelleReadonly.value) {
    height = height - daveUtils.pxToVh(55);
  }
  return `${height}vh`;
});

function save(): void {
  if (areAllFormsValid()) {
    MessstelleService.saveMessstelle(messstelle.value)
      .then(() => {
        snackbarStore.showInfo(
          `Die Messstelle ${messstelle.value.mstId} wurde erfolgreich aktualisiert.`
        );
      })
      .catch((error) => snackbarStore.showApiError(error))
      .finally(() => {
        cancel();
      });
  }
}

function cancel(): void {
  activeTab.value = 0;
  emits("reload");
}

function areAllFormsValid(): boolean {
  const invalidMqs = messstelle.value.messquerschnitte
    .filter((mq) => {
      return isNil(mq.standort) || isEmpty(mq.standort);
    })
    .map((messquerschnitt: MessquerschnittEditDTO) => {
      return messquerschnitt.mqId;
    });
  const invalidMst =
    isNil(messstelle.value.standort) || isEmpty(messstelle.value.standort);
  const isInvalid = invalidMst || !isEmpty(invalidMqs);
  if (isInvalid) {
    let errorText = "Der Standort";
    if (invalidMst) {
      errorText = `${errorText} der Messstelle ${messstelle.value.mstId}`;
      if (!isEmpty(invalidMqs)) {
        errorText = `${errorText} und`;
      }
    }
    if (invalidMqs.length === 1) {
      errorText = `${errorText} des Messquerschnittes ${invalidMqs[0]}`;
    } else if (invalidMqs.length > 1) {
      errorText = `${errorText} der Messquerschnitte ${invalidMqs.join(", ")}`;
    }
    errorText = `${errorText} wurde nicht ausgefüllt.`;
    snackbarStore.showError(errorText);
  }
  return !isInvalid;
}
</script>
