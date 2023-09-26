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

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

// Komponenten
// Typen
/* eslint-disable no-unused-vars */
import ConfigHochrechnungsfaktoren from "@/components/config/subconfig/ConfigHochrechnungsfaktoren.vue";
import ConfigEmailAddress from "@/components/config/subconfig/ConfigEmailAddress.vue";
import ConfigInfoMessage from "@/components/config/subconfig/ConfigInfoMessage.vue";
import ConfigDienstleister from "@/components/config/subconfig/ConfigDienstleister.vue";
/* eslint-enable no-unused-vars */
// API Services

// Util

@Component({
    components: {
        ConfigDienstleister,
        ConfigInfoMessage,
        ConfigEmailAddress,
        ConfigHochrechnungsfaktoren,
    },
})
export default class ConfigView extends Vue {
    private activeTab = 0;

    /**
     * Berechnet die Höhe der Fläche unter den Tabs (72px hoch) in "vh"
     */
    get contentHeight(): string {
        const h =
            100 -
            this.headerHeight -
            this.appBarHeight -
            72 / (this.$vuetify.breakpoint.height / 100);
        return h + "vh";
    }

    /**
     * Berechnet die Höhe des Headers (fix 160px) in "vh" (Höhe Viewport in Hundert)
     */
    get headerHeight(): number {
        return 65 / (this.$vuetify.breakpoint.height / 100);
    }

    /**
     * Berechnet die Höhe der AppBar (65px) in "vh" (Höhe Viewport in Hundert)
     */
    get appBarHeight(): number {
        return 65 / (this.$vuetify.breakpoint.height / 100);
    }
}
</script>