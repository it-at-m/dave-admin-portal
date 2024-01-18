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
        </v-tabs>
        <v-tabs-items
            v-model="activeTab"
            class="d-flex flex-column align-stretch"
        >
            <!-- Inhalte -->
            <v-tab-item ref="messstelleform">
                <messstelle-form
                    v-model="messstelle"
                    :height="SHEETHEIGHT"
                />
            </v-tab-item>
            <v-tab-item ref="messquerschnittform">
                <messquerschnitt-form
                    v-model="messstelle"
                    :height="SHEETHEIGHT"
                />
            </v-tab-item>
        </v-tabs-items>

        <v-card-actions>
            <v-spacer />
            <v-btn
                color="secondary"
                :disabled="isMessstelleInPlanung"
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

const SHEETHEIGHT: Ref<string> = ref("600px");
const activeTab: Ref<number> = ref(0);
const messstelle: Ref<MessstelleEditDTO> = ref(
    DefaultObjectCreator.createDefaultMessstelleEditDTO()
);

const store = useStore();
const route = useRoute();

const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "saved"): void;
}>();

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
            emits("saved");
        })
        .catch((error: ApiError) => {
            store.dispatch("snackbar/showError", error);
        })
        .finally(() => {
            activeTab.value = 0;
        });
}

function cancel(): void {
    activeTab.value = 0;
    messstelle.value = DefaultObjectCreator.createDefaultMessstelleEditDTO();
    emits("cancel");
}

function loadMessstelle(): void {
    const messstelleId = route.params.messstelleId;
    MessstelleService.getMessstelleToEdit(messstelleId).then(
        (messstelleById) => {
            messstelle.value = messstelleById;
        }
    );
}
</script>