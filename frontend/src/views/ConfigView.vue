<template>
    <v-container
        fluid
        class="pa-0"
    >
        <v-sheet
            width="100%"
            color="transparent"
            class="overflow-y-auto"
        >
            <v-card-title style="justify-content: center">
                <v-icon left>mdi-cogs</v-icon>
                Einstellungen
            </v-card-title>
            <v-tabs
                v-model="activeTab"
                fixed-tabs
                background-color="grey darken-1"
                dark
                icons-and-text
                slider-color="grey lighten-1"
                slider-size="8"
            >
                <!-- Kopfzeile -->
                <v-tab>
                    Hochrechnungsfaktoren
                    <v-icon>mdi-car-cog</v-icon>
                </v-tab>
                <v-tab>
                    EMail-Adressen
                    <v-icon>mdi-email-outline</v-icon>
                </v-tab>
                <v-tab>
                    Dienstleister
                    <v-icon>mdi-account-cog-outline</v-icon>
                </v-tab>
                <v-tab>
                    Info-Nachricht
                    <v-icon>mdi-message-text-outline</v-icon>
                </v-tab>
            </v-tabs>
            <v-tabs-items
                v-model="activeTab"
                class="d-flex flex-column align-stretch"
            >
                <!-- Inhalte -->
                <v-tab-item>
                    <config-hochrechnungsfaktoren :height="contentHeight" />
                </v-tab-item>
                <v-tab-item>
                    <config-email-address :height="contentHeight" />
                </v-tab-item>
                <v-tab-item>
                    <config-dienstleister :height="contentHeight" />
                </v-tab-item>
                <v-tab-item>
                    <config-info-message :height="contentHeight" />
                </v-tab-item>
            </v-tabs-items>
        </v-sheet>
    </v-container>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useVuetify } from "@/util/useVuetify";

const activeTab = ref(0);
const vuetify = useVuetify();

/**
 * Berechnet die Höhe der Fläche unter den Tabs (72px hoch) in "vh"
 */
const contentHeight = computed(() => {
    const h =
        100 -
        headerHeight.value -
        appBarHeight.value -
        72 / (vuetify.breakpoint.height / 100);
    return h + "vh";
});

/**
 * Berechnet die Höhe des Headers (fix 160px) in "vh" (Höhe Viewport in Hundert)
 */
const headerHeight = computed(() => {
    return 65 / (vuetify.breakpoint.height / 100);
});

/**
 * Berechnet die Höhe der AppBar (65px) in "vh" (Höhe Viewport in Hundert)
 */
const appBarHeight = computed(() => {
    return 65 / (vuetify.breakpoint.height / 100);
});
</script>