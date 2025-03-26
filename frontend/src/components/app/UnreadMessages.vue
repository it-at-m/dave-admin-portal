<template>
  <v-btn
    id="menu-activator"
    v-tooltip:bottom="'Ungelesene Nachrichten'"
    icon="mdi-email"
  />

  <v-menu
    activator="#menu-activator"
    location="bottom center"
    max-height="600px"
    class="overflow-y-auto"
  >
    <v-list density="compact">
      <v-list-subheader>
        Ungelesene Nachrichten in folgenden Zählungen:
      </v-list-subheader>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        lines="two"
        @click="selectItem(item)"
      >
        <v-list-item-title>{{ getTitle(item) }}</v-list-item-title>
        <v-list-item-subtitle
          v-for="(zaehlung, subIndex) in item.zaehlungen"
          :key="subIndex"
        >
          {{ getSubTitle(zaehlung) }}
        </v-list-item-subtitle>
        <v-divider />
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import type ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import type ZaehlungDTO from "@/domain/dto/ZaehlungDTO";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import ZaehlstellenService from "@/api/service/ZaehlstellenService";
import { useSnackbarStore } from "@/store/SnackbarStore";
import { useDateUtils } from "@/util/DateUtils";

const router = useRouter();
const dateUtils = useDateUtils();
const snackbarStore = useSnackbarStore();

const items = ref<Array<ZaehlstelleDTO>>([]);

onMounted(() => {
  loadZaehlstellenWithUnreadMessages();
});

/**
 * Zählstellen mit ungelesenen Nachrichten fuer das Mobilitaetsreferat laden
 * @private
 */
function loadZaehlstellenWithUnreadMessages(): void {
  ZaehlstellenService.getZaehlstellenByUnreadMessages()
    .then((result) => {
      items.value = result;
    })
    .catch((error) => snackbarStore.showApiError(error));
}

function selectItem(item: ZaehlstelleDTO): void {
  router.push(`/zaehlstelle/${item.id}`);
}

function getTitle(item: ZaehlstelleDTO): string {
  return `Zählstelle ${item.nummer}`;
}

function getSubTitle(item: ZaehlungDTO): string {
  return `${dateUtils.getShortVersionOfDate(item.datum)} - ${item.projektName}`;
}
</script>
