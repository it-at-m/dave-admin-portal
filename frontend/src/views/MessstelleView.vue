<script setup lang="ts">
import ZaehlstelleInfo from "@/components/zaehlstelle/ZaehlstelleInfo.vue";
import ZaehlstelleMap from "@/components/map/ZaehlstelleMap.vue";
import { WritableComputedRef, computed } from "vue";

const reloadMessstelle = false;

const headerHeight: WritableComputedRef<number> = computed(() => {
    return 160 / (this.$vuetify.breakpoint.height / 100);
});

const headerHeightVh: WritableComputedRef<string> = computed(() => {
    return this.headerHeight + "vh";
});

const messstelleId: WritableComputedRef<string> = computed(() => {
    const messstelle = this.$route.params.messstelle;
    if (!messstelle) {
        return "";
    }
    return messstelle;
});

const latlng = computed(() => {
  if(this)
});

function loadMessstelle() {

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
                    <zaehlstelle-info
                        :height="headerHeightVh"
                        :minheight="headerHeightVh"
                        :nummer="zaehlstelle.nummer"
                        :kreuzungsname="kreuzungsname"
                        :stadtbezirk-nummer="`${zaehlstelle.stadtbezirkNummer}`"
                        :stadtbezirk="zaehlstelle.stadtbezirk"
                        :style="{ cursor: 'pointer' }"
                        @edit-zaehlstelle="editZaehlstelle"
                    ></zaehlstelle-info>
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