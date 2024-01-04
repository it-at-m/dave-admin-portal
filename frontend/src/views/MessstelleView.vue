<template>
    <v-container
        fluid
        class="pa-0"
    >
        <v-row no-gutters>
            <v-col cols="3">
                <v-sheet
                    :min-height="headerHeightVh"
                    width="100%"
                    color="grey lighten-3"
                    class="d-flex flex-column"
                >
                    <!-- Basisinformation zur Messstelle -->
                    <messstelle-info
                        :height="headerHeightVh"
                        :minheight="headerHeightVh"
                        :mst-id="messstelle.mstId"
                        :stadtbezirk-nummer="messstelle.stadtbezirkNummer"
                        :stadtbezirk="messstelle.stadtbezirk"
                        :style="{ cursor: 'pointer' }"
                        @edit-messstelle="editMessstelle"
                    >
                    </messstelle-info>
                </v-sheet>
            </v-col>
            <v-col cols="9">
                <zaehlstelle-map
                    :z-id="messstelleId"
                    :zoom="17"
                    :latlng="latlng"
                    :height="headerHeightVh"
                    :minheight="headerHeightVh"
                    show-marker="true"
                    :reload="reloadMessstelleMap"
                    width="100%"
                />
            </v-col>
        </v-row>

        <update-messstelle-dialog
            v-model="showUpdateMessstelleDialog"
            :messstelle="messstelle"
            @saved="reloadDataAndCloseDialog"
            @cancel="cancelUpdateMessstelleDialog"
        />
    </v-container>
</template>
<script setup lang="ts">
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import { computed, ComputedRef, ref, Ref } from "vue";
import MessstelleService from "@/api/service/MessstelleService";
import MessstelleDTO from "@/domain/dto/MessstelleDTO";
import { useRoute } from "vue-router/composables";
import MessstelleInfo from "@/components/messstelle/MessstelleInfo.vue";
import { useVuetify } from "@/util/useVuetify";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import UpdateMessstelleDialog from "@/components/messstelle/UpdateMessstelleDialog.vue";

const reloadMessstelleMap: Ref<boolean> = ref(false);
const showUpdateMessstelleDialog: Ref<boolean> = ref(false);
const messstelle: Ref<MessstelleDTO> = ref(
    DefaultObjectCreator.createDefaultMessstelleDTO()
);
const vuetify = useVuetify();
const route = useRoute();
// eslint-disable-next-line no-undef
onMounted(() => {
    loadMessstelle();
});

const headerHeight: ComputedRef<number> = computed(() => {
    return 160 / (vuetify.breakpoint.height / 100);
});

const headerHeightVh: ComputedRef<string> = computed(() => {
    return headerHeight.value + "vh";
});

const messstelleId: ComputedRef<string> = computed(() => {
    const route = useRoute();
    const messstelleId = route.params.messstelleId;
    if (!messstelleId) {
        return "";
    }
    return messstelleId;
});

const latlng: ComputedRef<string[]> = computed(() => {
    if (
        messstelle.value.longitude == undefined ||
        messstelle.value.latitude == undefined
    ) {
        return [];
    } else {
        return [
            messstelle.value.latitude.toString(),
            messstelle.value.longitude.toString(),
        ];
    }
});

function loadMessstelle(): void {
    const messstelleId = route.params.messstelleId;
    // Todo: hier nur die Daten für den Header laden
    MessstelleService.getMessstelleById(messstelleId).then((messstelleById) => {
        messstelle.value = messstelleById;
    });
}

function editMessstelle(): void {
    showUpdateMessstelleDialog.value = true;
}

function reloadDataAndCloseDialog() {
    loadMessstelle();
    reloadMessstelleMap.value = !reloadMessstelleMap.value;
    showUpdateMessstelleDialog.value = false;
}

function cancelUpdateMessstelleDialog() {
    showUpdateMessstelleDialog.value = false;
    loadMessstelle();
}
</script>
