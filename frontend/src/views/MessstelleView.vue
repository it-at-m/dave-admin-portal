<script setup lang="ts">
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import { computed, ComputedRef, Ref, WritableComputedRef } from "vue";
import MessstelleService from "@/api/service/MessstelleService";
import MessstelleDTO from "@/domain/dto/MessstelleDTO";
import { ref } from "@vue/reactivity";
import { useRoute } from "vue-router/composables";
import MessstelleInfo from "@/components/MessstelleInfo.vue";
import { useVuetify } from "@/util/useVuetify";

const reloadMessstelle = false;
const messstelle: Ref<null | MessstelleDTO> = ref(null);
const vuetify = useVuetify();

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

const latlng: ComputedRef<string[] | undefined> = computed(() => {
    console.log(messstelle.value);
    if (
        messstelle.value?.lng == undefined ||
        messstelle.value?.lat == undefined
    ) {
        return [];
    } else {
        console.log(messstelle.value?.lng);
        return [
            messstelle.value?.lng.toString(),
            messstelle.value?.lng.toString(),
        ];
    }
});

function loadMessstelle() {
    messstelle.value = MessstelleService.getMessstelleById("testid");
}
</script>

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
                    <!-- Basisinformation zur Zählstelle -->
                    <MessstelleInfo
                        :id="messstelleId"
                        :stadtbezirk-nummer="3"
                        name="name"
                    >
                    </MessstelleInfo>
                </v-sheet>
            </v-col>
            <v-col cols="9">
                <zaehlstelle-map
                    :z-id="messstelleId"
                    :latlng="latlng"
                    :zoom="17"
                    :height="headerHeightVh"
                    :minheight="headerHeightVh"
                    show-marker="true"
                    :reload="reloadMessstelle"
                    width="100%"
                />
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>

</style>