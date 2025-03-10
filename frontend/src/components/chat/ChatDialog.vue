<template>
    <v-dialog
        v-model="showDialog"
        max-width="50%"
        height="600px"
        persistent
        :scrollable="false"
    >
        <Chat
            :participants="participants"
            :myself="myself"
            :messages="messages"
            :chat-title="chatTitle"
            :placeholder="placeholder"
            :colors="colors"
            :border-style="borderStyle"
            :hide-close-button="hideCloseButton"
            :close-button-icon-size="closeButtonIconSize"
            :submit-icon-size="submitIconSize"
            :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
            :async-mode="asyncMode"
            :scroll-bottom="scrollBottom"
            :display-header="true"
            :send-images="false"
            :profile-picture-config="profilePictureConfig"
            :timestamp-config="timestampConfig"
            :link-options="linkOptions"
            :accept-image-types="'.png, .jpeg'"
            style="height: 600px"
            @onMessageSubmit="onMessageSubmit"
        >
            <template #header>
                <div
                    class="header-title-text"
                    :style="{ color: colors.header.text }"
                >
                    {{ chatTitle }}
                </div>
                <v-spacer />
                <div class="header-exit">
                    <slot name="close-button">
                        <a
                            class="header-exit-button"
                            href="#"
                            :style="{
                                fontSize: closeButtonIconSize,
                                color: colors.header.text,
                            }"
                            @click.prevent="onClose"
                            >✕</a
                        >
                    </slot>
                </div>
            </template>
        </Chat>
    </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { Chat } from "vue-quick-chat";
import { Component, Prop, Watch } from "vue-property-decorator";
import "vue-quick-chat/dist/vue-quick-chat.css";
/* eslint-disable no-unused-vars */
import Participant from "@/domain/chat/Participant";
import ChatMessageService from "@/api/service/ChatMessageService";
import Message from "@/domain/chat/Message";
import ChatMessageDTO from "@/domain/dto/ChatMessageDTO";
import accountTieUrl from "@/assets/account-tie.png";
import kindlUrl from "@/assets/kindl.jpg";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useChatStore } from "@/store/ChatStore";
import { useZaehlungStore } from "@/store/ZaehlungStore";
/* eslint-enable no-unused-vars */

@Component({
    components: { Chat },
})
export default class ChatDialog extends Vue {
    @Prop() showDialog!: boolean;
    messages: Message[] = [];
    private zaehlungId = "";

    private snackbarStore = useSnackbarStore();
    private chatStore = useChatStore();
    private zaehlungStore = useZaehlungStore();

    public static DIENSTLEISTER_ID = 1;
    public static MOBILITAETSREFERAT_ID = 2;

    private dienstleister: Participant = {
        name: "Dienstleister",
        id: ChatDialog.DIENSTLEISTER_ID,
        profilePicture: accountTieUrl,
    };
    private mobilitaetsreferat: Participant = {
        name: "Mobilitätsreferat",
        id: ChatDialog.MOBILITAETSREFERAT_ID,
        profilePicture: kindlUrl,
    };

    // Hier ist myself das Mobilitätsreferat
    myself: Participant = this.mobilitaetsreferat;
    participants: Participant[] = [this.dienstleister];

    placeholder = "Nachricht...";
    colors: any = {
        header: {
            bg: "#C62828",
            text: "#fff",
        },
        message: {
            myself: {
                bg: "#fff",
                text: "#000000",
            },
            others: {
                bg: "#fff",
                text: "#000000",
            },
            messagesDisplay: {
                bg: "#f7f3f3",
            },
        },
        submitIcon: "#f57c00",
        submitImageIcon: "#f57c00",
    };
    borderStyle: any = {
        topLeft: "10px",
        topRight: "10px",
        bottomLeft: "10px",
        bottomRight: "10px",
    };
    hideCloseButton = false;
    submitIconSize = 25;
    closeButtonIconSize = "20px";
    asyncMode = false;
    toLoad: Message[] = [];

    scrollBottom: any = {
        messageSent: true,
        messageReceived: false,
    };
    displayHeader = true;
    profilePictureConfig: any = {
        others: true,
        myself: true,
        styles: {
            width: "30px",
            height: "30px",
            borderRadius: "50%",
        },
    };
    timestampConfig: any = {
        format: "HH:mm",
        relative: false,
    };
    // there are other options, you can check them here
    // https://soapbox.github.io/linkifyjs/docs/options.html
    linkOptions: any = {
        myself: {
            className: "myLinkClass",
            events: {
                click: () => {
                    //alert('Link clicked!');
                },
                mouseover: () => {
                    //alert('Link hovered!');
                },
            },
            format: function (value: string, type: string) {
                if (type === "url" && value.length > 50) {
                    value = value.slice(0, 50) + "…";
                }
                return value;
            },
        },
        others: {
            className: "othersLinkClass",
            events: {
                click: () => {
                    //alert('Link clicked!');
                },
                mouseover: () => {
                    //alert('Link hovered!');
                },
            },
            format: function (value: string, type: string) {
                if (type === "url" && value.length > 50) {
                    value = value.slice(0, 50) + "…";
                }
                return value;
            },
        },
    };

    // Wird (noch) nicht verwendet
    loadMoreMessages(resolve: any) {
        setTimeout(() => {
            resolve(this.toLoad); //We end the loading state and add the messages
            //Make sure the loaded messages are also added to our local messages copy or they will be lost
            this.messages.unshift(...this.toLoad);
            this.toLoad = [];
        }, 1000);
    }

    onMessageSubmit(message: Message) {
        this.messages.push(message);
        let messageDTO: ChatMessageDTO = {} as ChatMessageDTO;
        //Timestamp wird erst im Backend gesetzt (Zeitverzug ist unbedeutend)
        messageDTO.content = message.content;
        messageDTO.zaehlungId = this.zaehlungId;
        messageDTO.participantId = message.participantId;
        messageDTO.type = message.type;
        messageDTO.uploaded = true;
        messageDTO.viewed = false;

        let response: Promise<ChatMessageDTO> =
            ChatMessageService.save(messageDTO);
        response
            .then((message) => {
                message.uploaded = true;
            })
            .catch((error) => this.snackbarStore.showApiError(error));
    }

    onClose() {
        this.$emit("closeDialog");
    }

    get chatTitle() {
        let zaehlung = this.zaehlungStore.getZaehlung;
        let chatTitle = "Chat";
        if (zaehlung.datum) {
            chatTitle =
                zaehlung.projektName +
                " - " +
                `${this.$d(new Date(zaehlung.datum), "short", "de-DE")}`;
        }
        return chatTitle;
    }

    @Watch("showDialog")
    private loadMessages() {
        if (this.showDialog) {
            this.zaehlungId = this.zaehlungStore.getZaehlung.id;
            this.messages = [];
            ChatMessageService.getAllByZaehlungId(this.zaehlungId)
                .then((messageDTOs) => {
                    messageDTOs.forEach((messageDTO) => {
                        this.messages.push({
                            content: messageDTO.content,
                            myself: messageDTO.participantId === this.myself.id,
                            participantId: messageDTO.participantId,
                            timestamp: messageDTO.messageTimeDTO,
                            type: messageDTO.type,
                            uploaded: messageDTO.uploaded,
                            viewed: messageDTO.viewed,
                        });
                    });
                })
                .catch((error) => this.snackbarStore.showApiError(error));

            ChatMessageService.updateUnreadMessages(
                this.zaehlungId,
                this.mobilitaetsreferat.id
            )
                .then(() => {
                    this.chatStore.resetNotificationsEventSwitch();
                })
                .catch((error) => this.snackbarStore.showApiError(error));
        } else {
            this.messages = [];
            this.zaehlungId = "";
        }
    }
}
</script>