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
                    :height="SHEETHEIGHT"
                    @isValid="setMessstelleFormValid"
                />
            </v-tab-item>
            <v-tab-item ref="messquerschnittform">
                <messquerschnitt-form
                    :height="SHEETHEIGHT"
                    @isValid="setMessquerschnittFormValid"
                />
            </v-tab-item>
        </v-tabs-items>

        <v-card-actions>
            <v-spacer />
            <v-btn
                color="secondary"
                :disabled="!isUpdateMessstelleFormValid"
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
/* eslint-disable no-unused-vars */
/* eslint-enable no-unused-vars */
// Components
// Api
// Util
import MessstelleDTO from "@/domain/dto/MessstelleDTO";
import MessstelleForm from "@/components/messstelle/MessstelleForm.vue";
import MessquerschnittForm from "@/components/messstelle/MessquerschnittForm.vue";
import { computed, ComputedRef, ref, Ref } from "vue";
import MessstelleService from "@/api/service/MessstelleService";
import { ApiError } from "@/api/error";
import { useStore } from "@/util/useStore";

const SHEETHEIGHT: Ref<string> = ref("580px");
const activeTab: Ref<number> = ref(0);
const isMessstelleFormValid: Ref<boolean> = ref(false);
const isMessquerschnittFormValid: Ref<boolean> = ref(false);

const store = useStore();

defineProps<{ messstelle: MessstelleDTO }>();

const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "saved"): void;
}>();

const isUpdateMessstelleFormValid: ComputedRef<boolean> = computed(() => {
    return isMessquerschnittFormValid.value && isMessstelleFormValid.value;
});

function save(): void {
    // TODO Objekt senden
    MessstelleService.saveMessstelle({} as MessstelleDTO)
        .then(() => {
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
    emits("cancel");
}

function setMessstelleFormValid(isPartValid: boolean): void {
    isMessstelleFormValid.value = isPartValid;
}
function setMessquerschnittFormValid(isPartValid: boolean): void {
    isMessquerschnittFormValid.value = isPartValid;
}
</script>