<template>
    <v-sheet
        width="100%"
        class="d-flex flex-column"
    >
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
                Messstelle
                <v-icon>mdi-information-outline</v-icon>
            </v-tab>
            <v-tab>
                Messquerschnitt
                <v-icon>mdi-routes</v-icon>
            </v-tab>
            <v-tab>
                Lagepläne
                <v-icon>mdi-map-outline</v-icon>
            </v-tab>
        </v-tabs>
        <div v-if="isMessstelleInPlanung">
            <v-row
                dense
                justify="center"
            >
                <v-banner single-line>
                    <template #icon>
                        <v-icon
                            color="error"
                            size="36"
                        >
                            mdi-alert-decagram-outline
                        </v-icon>
                    </template>
                    <div v-html="tooltipText" />
                </v-banner>
            </v-row>
            <v-divider />
        </div>
        <v-tabs-items
            v-model="activeTab"
            class="d-flex flex-column align-stretch"
        >
            <!-- Inhalte -->
            <v-tab-item ref="messstelleform">
                <messstelle-form
                    v-model="messstelle"
                    :height="SHEETHEIGHT"
                    :disabled="isMessstelleInPlanung"
                />
            </v-tab-item>
            <v-tab-item ref="messquerschnittform">
                <messquerschnitt-form
                    v-model="messstelle"
                    :height="SHEETHEIGHT"
                    :disabled="isMessstelleInPlanung"
                />
            </v-tab-item>
            <v-tab-item ref="lageplaene">
                <lageplan-form :height="SHEETHEIGHT" />
            </v-tab-item>
        </v-tabs-items>

        <v-card-actions v-if="!isMessstelleInPlanung">
            <v-spacer />
            <v-btn
                color="secondary"
                @click="save()"
            >
                Speichern
            </v-btn>
            <v-btn
                color="grey lighten-1"
                @click="cancel()"
            >
                Abbrechen
            </v-btn>
        </v-card-actions>
    </v-sheet>
</template>

<script setup lang="ts">
import MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";
import MessstelleForm from "@/components/messstelle/MessstelleForm.vue";
import MessquerschnittForm from "@/components/messstelle/MessquerschnittForm.vue";
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import MessstelleService from "@/api/service/MessstelleService";
import { ApiError, Levels } from "@/api/error";
import { useStore } from "@/util/useStore";
import { useRoute } from "vue-router/composables";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";
import { MessstelleStatus } from "@/domain/enums/MessstelleStatus";
import LageplanForm from "@/components/messstelle/LageplanForm.vue";

const SHEETHEIGHT: Ref<string> = ref("589px");
const activeTab: Ref<number> = ref(0);
const messstelle: Ref<MessstelleEditDTO> = ref(
    DefaultObjectCreator.createDefaultMessstelleEditDTO()
);

const store = useStore();
const route = useRoute();

const isMessstelleInPlanung: ComputedRef<boolean> = computed(() => {
    return messstelle.value.status === MessstelleStatus.IN_PLANUNG;
});

onMounted(() => {
    loadMessstelle();
});

function save(): void {
    MessstelleService.saveMessstelle(messstelle.value)
        .then(() => {
            store.dispatch("snackbar/showToast", {
                level: Levels.INFO,
                snackbarTextPart1: `Die Messstelle ${messstelle.value.mstId} wurde erfolgreich aktualisiert.`,
            });
        })
        .catch((error: ApiError) => {
            store.dispatch("snackbar/showError", error);
        })
        .finally(() => {
            activeTab.value = 0;
            loadMessstelle();
        });
}

function cancel(): void {
    activeTab.value = 0;
    loadMessstelle();
}

function loadMessstelle(): void {
    const messstelleId = route.params.messstelleId;
    MessstelleService.getMessstelleToEdit(messstelleId).then(
        (messstelleById) => {
            messstelle.value = messstelleById;
        }
    );
}

const tooltipText: ComputedRef<string> = computed(() => {
    let text = "";
    if (isMessstelleInPlanung) {
        text =
            "Solange eine Messstelle den Status <strong>In Planung</strong> hat, kann diese nicht bearbeitet werden.";
    }
    return text;
});
</script>