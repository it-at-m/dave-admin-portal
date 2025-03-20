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
                            zaehlung, subIndex
                        ) in getZaehlungenWithUnreadMessagesFromZaehlstelle(
                            zaehlstelle
                        )"
                        :key="subIndex"
                    >
                        {{ $d(Date.parse(zaehlung.datum), "short", "de-DE") }}
                        {{ zaehlung.projektName }}
                    </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script setup lang="ts">
import { useChatStore } from "@/store/ChatStore";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router/composables";
import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import ZaehlungDTO from "@/domain/dto/ZaehlungDTO";

const PARTICIPANT_ID_MOBILITAETSREFERAT = 2;

const chatStore = useChatStore();

const router = useRouter();

const zaehlstellenWithUnreadMessages = ref<Array<ZaehlstelleDTO>>([]);

onMounted(() => {
    loadZaehlstellenWithUnreadMessages();
});

function select(zaehlstelle: ZaehlstelleDTO): void {
    router.push(`/zaehlstelle/${zaehlstelle.id}`);
}

/**
 * Zählstellen mit ungelesenen Nachrichten fuer das Mobilitaetsreferat laden
 * @private
 */
function loadZaehlstellenWithUnreadMessages(): void {
    ZaehlstellenService.getZaehlstellenByUnreadMessages(
        PARTICIPANT_ID_MOBILITAETSREFERAT
    ).then((result) => {
        zaehlstellenWithUnreadMessages.value = result;
    });
}

watch(
    () => chatStore.getNotificationsEventSwitch,
    () => {
        loadZaehlstellenWithUnreadMessages();
    }
);

/**
 * Gibt alle Zählungen einer Zählstelle zurück, bei der ungelesene Nachrichten vorliegt
 * @param zaehlstelleDto Zählstelle die durchsucht werden soll
 * @private
 */
function getZaehlungenWithUnreadMessagesFromZaehlstelle(
    zaehlstelleDto: ZaehlstelleDTO
): Array<ZaehlungDTO> {
    const zaehlungen: Array<ZaehlungDTO> = [];
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
const zaehlstellenWithUnreadMessagesPresent = computed(() => {
    return zaehlstellenWithUnreadMessages.value.length > 0;
});
</script>