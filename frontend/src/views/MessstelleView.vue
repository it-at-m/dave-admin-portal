<template>
    <v-container
        fluid
        class="pa-0"
    >
        <v-row no-gutters>
            <v-col cols="3">
                <v-sheet
                    :min-height="headerHeightVh"
                    :max-height="headerHeightVh"
                    width="100%"
                    color="grey lighten-3"
                    class="d-flex flex-column"
                >
                    <!-- Basisinformation zur Messstelle -->
                    <messstelle-info
                        :height="headerHeightVh"
                        :minheight="headerHeightVh"
                        :messstelle="messstelle"
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

        <v-row
            dense
            class="ma-2"
            no-gutters
        >
            <update-messstelle-form
                :height="rightHeightVh"
                :content-height="rightContentHeight"
            />
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import MessstelleService from "@/api/service/MessstelleService";
import { useRoute } from "vue-router/composables";
import MessstelleInfo from "@/components/messstelle/MessstelleInfo.vue";
import { useVuetify } from "@/util/useVuetify";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import MessstelleInfoDTO from "@/domain/dto/messstelle/MessstelleInfoDTO";
import UpdateMessstelleForm from "@/components/messstelle/UpdateMessstelleForm.vue";

const reloadMessstelleMap: Ref<boolean> = ref(false);
const messstelle: Ref<MessstelleInfoDTO> = ref(
    DefaultObjectCreator.createDefaultMessstelleInfoDTO()
);
const vuetify = useVuetify();
const route = useRoute();

onMounted(() => {
    loadMessstelle();
});

const headerHeight: ComputedRef<number> = computed(() => {
    return 160 / (vuetify.breakpoint.height / 100);
});

const headerHeightVh: ComputedRef<string> = computed(() => {
    return headerHeight.value + "vh";
});

const appBarHeight = computed(() => {
    return 65 / (vuetify.breakpoint.height / 100);
});

const marginContentHeight = computed(() => {
    return 16 / (vuetify.breakpoint.height / 100);
});

/**
 * Berechnet die Höhe der Inhaltsfläche "vh" - ohne Karte
 */
const rightHeightVh = computed(() => {
    return (
        100 -
        headerHeight.value -
        appBarHeight.value -
        marginContentHeight.value +
        "vh"
    );
});

/**
 * Berechnet die Höhe der Fläche unter den Tabs (72px hoch) in "vh"
 */
const rightContentHeight = computed(() => {
    return (
        100 -
        headerHeight.value -
        appBarHeight.value -
        72 / (vuetify.breakpoint.height / 100)
    );
});

const messstelleId: ComputedRef<string> = computed(() => {
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
    MessstelleService.getMessstelleInfo(messstelleId).then((messstelleById) => {
        messstelle.value = messstelleById;
    });
}
</script>
