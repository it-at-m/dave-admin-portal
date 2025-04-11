<!-- TODO muss ein neues Framework gesucht werden, da das alte nicht mehr unterstützt wird. -->
<template>
  <v-dialog
    v-model="showDialogModel"
    persistent
    max-width="50%"
    height="800px"
  >
    <v-card
      width="100%"
      flat
    >
      <v-card-title>
        <v-icon
          end
          icon="mdi-skull-crossbones-outline"
        />
        {{ dialogtitle }}
      </v-card-title>

      <v-card-text>
        TODO: Es muss ein neues Framework gesucht werden, da das alte nicht mehr
        unterstützt wird.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-lighten-1"
          variant="elevated"
          text="Abbrechen"
          @click="closeDialog()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type ZaehlungDTO from "@/domain/dto/ZaehlungDTO";

import { computed } from "vue";

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

const showDialogModel = computed(() => {
  return props.showDialog;
});

const dialogtitle = computed(() => {
  return `${zaehlung.value.projektName} - ${zaehlung.value.datum}`;
});

function closeDialog(): void {
  emits("closeDialog");
}
</script>
<!--  <v-dialog-->
<!--    v-model="showDialogModel"-->
<!--    max-width="50%"-->
<!--    height="600px"-->
<!--    persistent-->
<!--    :scrollable="false"-->
<!--  >-->
<!--    <Chat-->
<!--      :participants="participants"-->
<!--      :myself="mobilitaetsreferat"-->
<!--      :messages="messages"-->
<!--      :chat-title="chatTitle"-->
<!--      :placeholder="placeholder"-->
<!--      :colors="colors"-->
<!--      :border-style="borderStyle"-->
<!--      :hide-close-button="HIDE_CLOSE_BUTTON"-->
<!--      :close-button-icon-size="CLOSE_BUTTON_ICON_SIZE"-->
<!--      :submit-icon-size="SUBMIT_ICON_SIZE"-->
<!--      :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"-->
<!--      :async-mode="ASYNC_MODE"-->
<!--      :scroll-bottom="scrollBottom"-->
<!--      :display-header="true"-->
<!--      :send-images="false"-->
<!--      :profile-picture-config="profilePictureConfig"-->
<!--      :timestamp-config="timestampConfig"-->
<!--      :link-options="linkOptions"-->
<!--      :accept-image-types="'.png, .jpeg'"-->
<!--      style="height: 600px"-->
<!--      @onMessageSubmit="onMessageSubmit"-->
<!--    >-->
<!--      <template #header>-->
<!--        <div-->
<!--          class="header-title-text"-->
<!--          :style="{ color: colors.header.text }"-->
<!--        >-->
<!--          {{ chatTitle }}-->
<!--        </div>-->
<!--        <v-spacer />-->
<!--        <div class="header-exit">-->
<!--          <slot name="close-button">-->
<!--            <a-->
<!--              class="header-exit-button"-->
<!--              href="#"-->
<!--              :style="{-->
<!--                fontSize: CLOSE_BUTTON_ICON_SIZE,-->
<!--                color: colors.header.text,-->
<!--              }"-->
<!--              @click.prevent="onClose"-->
<!--              >✕</a-->
<!--            >-->
<!--          </slot>-->
<!--        </div>-->
<!--      </template>-->
<!--    </Chat>-->
<!--  </v-dialog>-->
<!--</template>-->

<!--<script setup lang="ts">-->
<!--import { computed, ref, watch } from "vue";-->
<!--import { Chat } from "vue-quick-chat";-->

<!--import ChatMessageService from "@/api/service/ChatMessageService";-->
<!--import accountTieUrl from "@/assets/account-tie.png";-->
<!--import kindlUrl from "@/assets/kindl.jpg";-->
<!--import Message from "@/domain/chat/Message";-->
<!--import Participant from "@/domain/chat/Participant";-->
<!--import ChatMessageDTO from "@/domain/dto/ChatMessageDTO";-->
<!--import i18n from "@/i18n";-->
<!--import { useChatStore } from "@/store/ChatStore";-->
<!--import { useSnackbarStore } from "@/store/SnackbarStore";-->
<!--import { useZaehlungStore } from "@/store/ZaehlungStore";-->

<!--import "vue-quick-chat/dist/vue-quick-chat.css";-->

<!--interface Props {-->
<!--  showDialog: boolean;-->
<!--}-->

<!--const emits = defineEmits<{-->
<!--  (e: "closeDialog"): void;-->
<!--}>();-->

<!--const props = defineProps<Props>();-->

<!--const messages = ref<Array<Message>>([]);-->
<!--const zaehlungId = ref("");-->
<!--const toLoad = ref<Array<Message>>([]);-->

<!--const snackbarStore = useSnackbarStore();-->
<!--const chatStore = useChatStore();-->
<!--const zaehlungStore = useZaehlungStore();-->

<!--const placeholder = "Nachricht...";-->
<!--const HIDE_CLOSE_BUTTON = false;-->
<!--const SUBMIT_ICON_SIZE = 25;-->
<!--const CLOSE_BUTTON_ICON_SIZE = "20px";-->
<!--const ASYNC_MODE = false;-->
<!--const DIENSTLEISTER_ID = 1;-->
<!--const MOBILITAETSREFERAT_ID = 2;-->

<!--const dienstleister: Participant = {-->
<!--  name: "Dienstleister",-->
<!--  id: DIENSTLEISTER_ID,-->
<!--  profilePicture: accountTieUrl,-->
<!--};-->
<!--const mobilitaetsreferat: Participant = {-->
<!--  name: "Mobilitätsreferat",-->
<!--  id: MOBILITAETSREFERAT_ID,-->
<!--  profilePicture: kindlUrl,-->
<!--};-->

<!--// Hier ist myself das Mobilitätsreferat-->
<!--const participants: Array<Participant> = [dienstleister];-->

<!--const colors: any = {-->
<!--  header: {-->
<!--    bg: "#C62828",-->
<!--    text: "#fff",-->
<!--  },-->
<!--  message: {-->
<!--    myself: {-->
<!--      bg: "#fff",-->
<!--      text: "#000000",-->
<!--    },-->
<!--    others: {-->
<!--      bg: "#fff",-->
<!--      text: "#000000",-->
<!--    },-->
<!--    messagesDisplay: {-->
<!--      bg: "#f7f3f3",-->
<!--    },-->
<!--  },-->
<!--  submitIcon: "#f57c00",-->
<!--  submitImageIcon: "#f57c00",-->
<!--};-->
<!--const borderStyle: any = {-->
<!--  topLeft: "10px",-->
<!--  topRight: "10px",-->
<!--  bottomLeft: "10px",-->
<!--  bottomRight: "10px",-->
<!--};-->
<!--const scrollBottom: any = {-->
<!--  messageSent: true,-->
<!--  messageReceived: false,-->
<!--};-->
<!--const profilePictureConfig: any = {-->
<!--  others: true,-->
<!--  myself: true,-->
<!--  styles: {-->
<!--    width: "30px",-->
<!--    height: "30px",-->
<!--    borderRadius: "50%",-->
<!--  },-->
<!--};-->
<!--const timestampConfig: any = {-->
<!--  format: "HH:mm",-->
<!--  relative: false,-->
<!--};-->
<!--// there are other options, you can check them here-->
<!--// https://soapbox.github.io/linkifyjs/docs/options.html-->
<!--const linkOptions: any = {-->
<!--  myself: {-->
<!--    className: "myLinkClass",-->
<!--    events: {-->
<!--      click: () => {-->
<!--        //alert('Link clicked!');-->
<!--      },-->
<!--      mouseover: () => {-->
<!--        //alert('Link hovered!');-->
<!--      },-->
<!--    },-->
<!--    format: function (value: string, type: string) {-->
<!--      if (type === "url" && value.length > 50) {-->
<!--        value = value.slice(0, 50) + "…";-->
<!--      }-->
<!--      return value;-->
<!--    },-->
<!--  },-->
<!--  others: {-->
<!--    className: "othersLinkClass",-->
<!--    events: {-->
<!--      click: () => {-->
<!--        //alert('Link clicked!');-->
<!--      },-->
<!--      mouseover: () => {-->
<!--        //alert('Link hovered!');-->
<!--      },-->
<!--    },-->
<!--    format: function (value: string, type: string) {-->
<!--      if (type === "url" && value.length > 50) {-->
<!--        value = value.slice(0, 50) + "…";-->
<!--      }-->
<!--      return value;-->
<!--    },-->
<!--  },-->
<!--};-->

<!--watch(-->
<!--  () => props.showDialog,-->
<!--  () => {-->
<!--    loadMessages();-->
<!--  }-->
<!--);-->

<!--const showDialogModel = computed(() => {-->
<!--  return props.showDialog;-->
<!--});-->

<!--const chatTitle = computed(() => {-->
<!--  const zaehlung = zaehlungStore.getZaehlung;-->
<!--  let chatTitle = "Chat";-->
<!--  if (zaehlung.datum) {-->
<!--    chatTitle =-->
<!--      zaehlung.projektName +-->
<!--      " - " +-->
<!--      `${i18n.d(new Date(zaehlung.datum), "short", "de-DE")}`;-->
<!--  }-->
<!--  return chatTitle;-->
<!--});-->

<!--// Wird (noch) nicht verwendet-->
<!--function loadMoreMessages(resolve: any) {-->
<!--  setTimeout(() => {-->
<!--    resolve(toLoad.value); //We end the loading state and add the messages-->
<!--    //Make sure the loaded messages are also added to our local messages copy or they will be lost-->
<!--    messages.value.unshift(...toLoad.value);-->
<!--    toLoad.value = [];-->
<!--  }, 1000);-->
<!--}-->

<!--function onMessageSubmit(message: Message) {-->
<!--  messages.value.push(message);-->
<!--  let messageDTO: ChatMessageDTO = {} as ChatMessageDTO;-->
<!--  //Timestamp wird erst im Backend gesetzt (Zeitverzug ist unbedeutend)-->
<!--  messageDTO.content = message.content;-->
<!--  messageDTO.zaehlungId = zaehlungId.value;-->
<!--  messageDTO.participantId = message.participantId;-->
<!--  messageDTO.type = message.type;-->
<!--  messageDTO.uploaded = true;-->
<!--  messageDTO.viewed = false;-->

<!--  let response: Promise<ChatMessageDTO> = ChatMessageService.save(messageDTO);-->
<!--  response-->
<!--    .then((message) => {-->
<!--      message.uploaded = true;-->
<!--    })-->
<!--    .catch((error) => snackbarStore.showApiError(error));-->
<!--}-->

<!--function onClose() {-->
<!--  emits("closeDialog");-->
<!--}-->

<!--function loadMessages() {-->
<!--  if (props.showDialog) {-->
<!--    zaehlungId.value = zaehlungStore.getZaehlung.id;-->
<!--    messages.value = [];-->
<!--    ChatMessageService.getAllByZaehlungId(zaehlungId.value)-->
<!--      .then((messageDTOs) => {-->
<!--        messageDTOs.forEach((messageDTO) => {-->
<!--          messages.value.push({-->
<!--            content: messageDTO.content,-->
<!--            myself: messageDTO.participantId === mobilitaetsreferat.id,-->
<!--            participantId: messageDTO.participantId,-->
<!--            timestamp: messageDTO.messageTimeDTO,-->
<!--            type: messageDTO.type,-->
<!--            uploaded: messageDTO.uploaded,-->
<!--            viewed: messageDTO.viewed,-->
<!--          });-->
<!--        });-->
<!--      })-->
<!--      .catch((error) => snackbarStore.showApiError(error));-->

<!--    ChatMessageService.updateUnreadMessages(-->
<!--      zaehlungId.value,-->
<!--      mobilitaetsreferat.id-->
<!--    )-->
<!--      .then(() => {-->
<!--        chatStore.resetNotificationsEventSwitch();-->
<!--      })-->
<!--      .catch((error) => snackbarStore.showApiError(error));-->
<!--  } else {-->
<!--    messages.value = [];-->
<!--    zaehlungId.value = "";-->
<!--  }-->
<!--}-->
<!--</script>-->
