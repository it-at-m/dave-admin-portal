<template>
    <v-sheet
        width="100%"
        :min-height="height"
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
                Standort
                <v-icon>mdi-map-marker-outline</v-icon>
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
                    <div>
                        Solange eine Messstelle den Status
                        <strong>In Planung</strong> hat, kann diese nicht
                        bearbeitet werden.
                    </div>
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
                    :valid.sync="validMst"
                    :height="contentHeightVh"
                    :disabled="isMessstelleInPlanung"
                />
            </v-tab-item>
            <v-tab-item ref="messquerschnittform">
                <messquerschnitt-form
                    v-model="messstelle"
                    :valid.sync="validMqs"
                    :height="contentHeightVh"
                    :disabled="isMessstelleInPlanung"
                />
            </v-tab-item>
            <v-tab-item ref="standort">
                <standort-tab-item
                    v-model="messstelle"
                    :height="contentHeightVh"
                    :height-map="mapHeightVh"
                    :reset-marker="resetMarker"
                />
            </v-tab-item>
            <v-tab-item ref="lageplaene">
                <lageplan-form :height="contentHeightVh" />
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
import { useVuetify } from "@/util/useVuetify";
import StandortTabItem from "@/components/messstelle/StandortTabItem.vue";

const activeTab: Ref<number> = ref(0);
const validMst: Ref<boolean> = ref(false);
const validMqs: Ref<Map<string, boolean>> = ref(new Map<string, boolean>());
const messstelle: Ref<MessstelleEditDTO> = ref(
    DefaultObjectCreator.createDefaultMessstelleEditDTO()
);
const resetMarker: Ref<boolean> = ref(false);

interface Props {
    height: string;
    contentHeight: number;
}

const props = defineProps<Props>();

const store = useStore();
const route = useRoute();
const vuetify = useVuetify();

const isMessstelleInPlanung: ComputedRef<boolean> = computed(() => {
    return messstelle.value.status === MessstelleStatus.IN_PLANUNG;
});
const contentHeightVh: ComputedRef<string> = computed(() => {
    return props.contentHeight - 70 / (vuetify.breakpoint.height / 100) + "vh";
});

const mapHeightVh: ComputedRef<string> = computed(() => {
    return props.contentHeight - 105 / (vuetify.breakpoint.height / 100) + "vh";
});

const emit = defineEmits<(e: "reload") => void>();

onMounted(() => {
    loadMessstelle();
});

function save(): void {
    if (areAllFormsValid()) {
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
                emit("reload");
            });
    }
}

function cancel(): void {
    loadMessstelle();
    emit("reload");
}

function loadMessstelle(): void {
    const messstelleId = route.params.messstelleId;
    MessstelleService.getMessstelleToEdit(messstelleId).then(
        (messstelleById) => {
            messstelle.value = messstelleById;
            messstelleById.messquerschnitte.forEach((value) =>
                validMqs.value.set(value.mqId, !!value.standort)
            );
            resetMarker.value = !resetMarker.value;
        }
    );
}

function areAllFormsValid(): boolean {
    const invalidMqs: Array<string> = [];
    validMqs.value.forEach((value, key) => {
        if (!value) {
            invalidMqs.push(key);
        }
    });
    const areAllFormsValid: boolean = validMst.value && invalidMqs.length === 0;
    if (!areAllFormsValid) {
        let errorText = "Der Standort";
        if (!validMst.value) {
            errorText = `${errorText} der Messstelle ${messstelle.value.mstId}`;
            if (invalidMqs.length > 0) {
                errorText = `${errorText} und`;
            }
        }
        if (invalidMqs.length === 1) {
            errorText = `${errorText} des Messquerschnittes ${invalidMqs[0]}`;
        } else if (invalidMqs.length > 1) {
            errorText = `${errorText} der Messquerschnitte ${invalidMqs.join(
                ", "
            )}`;
        }
        errorText = `${errorText} wurde nicht ausgefüllt.`;
        store.dispatch("snackbar/showToast", {
            level: Levels.ERROR,
            snackbarTextPart1: errorText,
        });
    }
    return areAllFormsValid;
}
</script>