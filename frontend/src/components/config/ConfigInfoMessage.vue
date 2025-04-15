<template>
  <v-sheet
    width="100%"
    :height="height"
    :max-height="height"
  >
    <!-- Historisierung -->
    <config-info-message-history
      v-if="showHistory"
      v-model="inactiveInfoMessages"
      :height="height"
    />

    <!-- Eingabefeld -->
    <config-info-message-edit
      v-else
      v-model="activeInfoMessage"
      :height="height"
      @save="save"
      @cancel="loadInfoMessages"
      @deactivate="deactivateInfoMessage"
    />

    <v-card-actions style="position: absolute; top: 0; right: 0">
      <v-btn
        color="secondary"
        :text="buttonNameShowHistory"
        variant="elevated"
        @click="changeInfoMessageView"
      />
    </v-card-actions>
  </v-sheet>
</template>

<script setup lang="ts">
import type InfoMessageDTO from "@/types/config/InfoMessageDTO";

import { first } from "lodash";
import { computed, onMounted, ref } from "vue";

import InfoMessageService from "@/api/service/InfoMessageService";
import ConfigInfoMessageEdit from "@/components/config/ConfigInfoMessageEdit.vue";
import ConfigInfoMessageHistory from "@/components/config/ConfigInfoMessageHistory.vue";
import { useSnackbarStore } from "@/store/SnackbarStore";

interface Props {
  height: string;
}
defineProps<Props>();

const snackbarStore = useSnackbarStore();

const showHistory = ref(false);

const activeInfoMessage = ref({} as InfoMessageDTO);

const inactiveInfoMessages = ref<Array<InfoMessageDTO>>([]);

onMounted(() => {
  loadInfoMessages();
});

function loadInfoMessages() {
  InfoMessageService.getAllInfoMessages()
    .then((infoMessages: Array<InfoMessageDTO>) => {
      setActiveInfoMessage(infoMessages);
      setInactiveInfoMessages(infoMessages);
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function save(): void {
  InfoMessageService.save(activeInfoMessage.value)
    .then((infoMessages: Array<InfoMessageDTO>) => {
      setActiveInfoMessage(infoMessages);
      setInactiveInfoMessages(infoMessages);
      snackbarStore.showSuccess("Die Infonachricht wurde gespeichert.");
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function deactivateInfoMessage(): void {
  InfoMessageService.setAllInfoMessagesInactive()
    .then(() => {
      snackbarStore.showSuccess(`Die Infonachricht wurde deaktiviert.`);
    })
    .catch((error) => snackbarStore.showApiError(error))
    .finally(() => {
      loadInfoMessages();
    });
}

function setInactiveInfoMessages(infoMessages: Array<InfoMessageDTO>): void {
  inactiveInfoMessages.value = infoMessages.filter((value) => !value.aktiv);
}

function setActiveInfoMessage(infoMessages: Array<InfoMessageDTO>) {
  const firstActiveMessage = first(infoMessages.filter((value) => value.aktiv));
  if (firstActiveMessage) {
    activeInfoMessage.value = firstActiveMessage;
  }
}

function changeInfoMessageView(): void {
  showHistory.value = !showHistory.value;
}
const buttonNameShowHistory = computed(() => {
  return showHistory.value ? "Eingabe" : "Historie";
});
</script>
