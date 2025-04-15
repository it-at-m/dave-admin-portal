<template>
  <v-dialog
    v-model="showDialogModel"
    persistent
    max-width="50%"
    height="800px"
  >
    <v-card
      width="100%"
      variant="flat"
      style="background-color: #f5f5f5"
    >
      <v-layout>
        <v-app-bar color="primary">
          <v-toolbar-title :text="dialogtitle" />
          <v-btn
            icon="mdi-close"
            @click="closeDialog"
          />
        </v-app-bar>

        <v-container
          class="fill-height overflow-y-auto"
          height="400px"
        >
          <v-row
            class="fill-height pb-14"
            align="end"
          >
            <v-col>
              <div
                v-for="(item, index) in items"
                :key="index"
                :class="[
                  'd-flex flex-row align-center my-2',
                  item.participantId === MOBILITAETSREFERAT_ID
                    ? 'justify-end'
                    : null,
                ]"
              >
                <v-list-item
                  v-if="item.participantId === MOBILITAETSREFERAT_ID"
                  rounded
                  variant="elevated"
                  class="mr-2"
                  :title="getTitle(item)"
                  :subtitle="item.content"
                  width="30%"
                />
                <v-avatar
                  :image="
                    item.participantId === MOBILITAETSREFERAT_ID
                      ? kindlUrl
                      : accountTieUrl
                  "
                  size="36"
                >
                </v-avatar>
                <v-list-item
                  v-if="item.participantId === DIENSTLEISTER_ID"
                  rounded
                  variant="elevated"
                  class="ml-3"
                  :title="getTitle(item)"
                  :subtitle="item.content"
                  width="30%"
                />
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-layout>
      <v-footer>
        <v-container class="ma-0 pa-0">
          <v-row no-gutters>
            <v-col>
              <div class="d-flex flex-row align-center">
                <v-text-field
                  v-model="message"
                  placeholder="Type Something"
                  @keyup.enter="sendMessage"
                >
                  <template #append-inner>
                    <v-btn
                      icon="mdi-send"
                      variant="text"
                      color="secondary"
                      @click="sendMessage"
                    />
                  </template>
                </v-text-field>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </v-footer>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type ChatMessageDTO from "@/types/chat/ChatMessageDTO";
import type ZaehlungDTO from "@/types/zaehlung/ZaehlungDTO";

import { computed, ref, watch } from "vue";

import ChatMessageService from "@/api/service/ChatMessageService";
import accountTieUrl from "@/assets/account-tie.png";
import kindlUrl from "@/assets/kindl.jpg";
import { useChatStore } from "@/store/ChatStore";
import { useSnackbarStore } from "@/store/SnackbarStore";

interface Props {
  showDialog: boolean;
}
const props = defineProps<Props>();

const zaehlung = defineModel<ZaehlungDTO>({
  required: true,
});

const emits = defineEmits<{
  (e: "closeDialog"): void;
}>();

const DIENSTLEISTER_ID = 1;
const MOBILITAETSREFERAT_ID = 2;

const showDialogModel = computed(() => {
  return props.showDialog;
});

const dialogtitle = computed(() => {
  return `${zaehlung.value.projektName} - ${zaehlung.value.datum}`;
});

watch(
  () => props.showDialog,
  () => {
    loadMessages();
  }
);

const items = ref<Array<ChatMessageDTO>>([]);
const message = ref("");
const snackbarStore = useSnackbarStore();
const chatStore = useChatStore();

function getTitle(item: ChatMessageDTO) {
  return item.participantId === DIENSTLEISTER_ID
    ? "Dienstleister"
    : "Mobilitätsreferat";
}

function loadMessages() {
  if (props.showDialog) {
    items.value = [];
    ChatMessageService.getAllByZaehlungId(zaehlung.value.id)
      .then((messageDTOs) => {
        items.value = messageDTOs;
      })
      .catch((error) => snackbarStore.showApiError(error));

    ChatMessageService.updateUnreadMessages(
      zaehlung.value.id,
      MOBILITAETSREFERAT_ID
    )
      .then(() => {
        chatStore.resetNotificationsEventSwitch();
      })
      .catch((error) => snackbarStore.showApiError(error));
  } else {
    items.value = [];
  }
}

function sendMessage() {
  const messageDTO: ChatMessageDTO = {} as ChatMessageDTO;
  //Timestamp wird erst im Backend gesetzt (Zeitverzug ist unbedeutend)
  messageDTO.content = message.value;
  messageDTO.zaehlungId = zaehlung.value.id;
  messageDTO.participantId = MOBILITAETSREFERAT_ID;
  messageDTO.type = "text";
  messageDTO.uploaded = true;
  messageDTO.viewed = false;

  ChatMessageService.save(messageDTO)
    .then((response) => {
      response.uploaded = true;
      items.value.push(response);
      message.value = "";
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function closeDialog(): void {
  emits("closeDialog");
}
</script>
