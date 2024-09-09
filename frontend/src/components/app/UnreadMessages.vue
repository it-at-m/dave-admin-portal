<template>
    <v-menu offset-y>
        <template #activator="{ on, attrs }">
            <v-btn
                icon
                small
                class="ml-2 mr-2"
                :disabled="!zaehlstellenWithUnreadMessagesPresent"
                v-bind="attrs"
                v-on="on"
            >
                <v-icon>mdi-email</v-icon>
            </v-btn>
        </template>
        <v-list>
            <v-list-item>
                <v-list-item-content>
                    Ungelesene Nachrichten in folgenden Zählungen:
                </v-list-item-content>
            </v-list-item>
            <v-list-item
                v-for="(zaehlstelle, index) in zaehlstellenWithUnreadMessages"
                :key="index"
                @click="select(zaehlstelle)"
            >
                <v-list-item-content>
                    <v-list-item-title
                        >Zählstelle {{ zaehlstelle.nummer }}</v-list-item-title
                    >
                    <v-list-item-subtitle
                        v-for="(
                            zaehlung, index
                        ) in getZaehlungenWithUnreadMessagesFromZaehlstelle(
                            zaehlstelle
                        )"
                        :key="index"
                    >
                        {{ $d(Date.parse(zaehlung.datum), "short", "de-DE") }}
                        {{ zaehlung.projektName }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";
import { useChatStore } from "@/store/ChatStore";

@Component
export default class UnreadMessages extends Vue {
    zaehlstellenWithUnreadMessages: ZaehlstelleDTO[] = [];

    private static readonly PARTICIPANT_ID_MOBILITAETSREFERAT: number = 2;

    private chatStore = useChatStore();

    mounted() {
        this.loadZaehlstellenWithUnreadMessages();
    }

    select(zaehlstelle: ZaehlstelleDTO): void {
        this.$router.push(`/zaehlstelle/${zaehlstelle.id}`);
    }

    /**
     * Zählstellen mit ungelesenen Nachrichten fuer das Mobilitaetsreferat laden
     * @private
     */
    private loadZaehlstellenWithUnreadMessages(): void {
        ZaehlstellenService.getZaehlstellenByUnreadMessages(
            UnreadMessages.PARTICIPANT_ID_MOBILITAETSREFERAT
        ).then((result) => {
            this.zaehlstellenWithUnreadMessages = result;
        });
    }

    get notificationsEventSwitch(): boolean {
        return this.chatStore.getNotificationsEventSwitch;
    }

    @Watch("notificationsEventSwitch")
    private realoadNotifications(): void {
        this.loadZaehlstellenWithUnreadMessages();
    }

    /**
     * Gibt alle Zählungen einer Zählstelle zurück, bei der ungelesene Nachrichten vorliegt
     * @param zaehlstelleDto Zählstelle die durchsucht werden soll
     * @private
     */
    getZaehlungenWithUnreadMessagesFromZaehlstelle(
        zaehlstelleDto: ZaehlstelleDTO
    ): ZaehlungDTO[] {
        let zaehlungen: ZaehlungDTO[] = [];
        zaehlstelleDto.zaehlungen.forEach((zaehlung) => {
            if (zaehlung.unreadMessagesMobilitaetsreferat) {
                zaehlungen.push(zaehlung);
            }
        });
        return zaehlungen;
    }

    /**
     * Gibt ein Boolean zurück, ob es Zählstellen mit ungelesenen Nachrichten gibt
     */
    get zaehlstellenWithUnreadMessagesPresent(): boolean {
        return this.zaehlstellenWithUnreadMessages.length > 0;
    }
}
</script>

<style scoped>

</style>