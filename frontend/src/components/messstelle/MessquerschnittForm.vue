<template>
    <v-sheet
        width="100%"
        :min-height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <v-card>
            <v-card-text>
                <v-form
                    ref="messquerschnittform"
                    v-model="isMqValid"
                >
                    <v-row dense>
                        <v-col
                            cols="12"
                            md="4"
                        >
                            <v-autocomplete
                                v-model="selectedMessquerschnitt"
                                outlined
                                :items="editMessstelle.messquerschnitte"
                                item-text="mqId"
                                return-object
                                dense
                                label="ID Messquerschnitt"
                            ></v-autocomplete>
                        </v-col>
                        <v-spacer />
                    </v-row>
                    <v-row dense>
                        <v-col
                            cols="12"
                            md="4"
                        >
                            <lhm-text-field
                                :text="selectedMessquerschnitt.strassenname"
                                caption="Straßenname"
                            />
                        </v-col>
                        <v-col
                            cols="12"
                            md="4"
                        >
                            <lhm-text-field
                                :text="
                                    himmelsRichtungenTextLong.get(
                                        selectedMessquerschnitt.fahrtrichtung
                                    )
                                "
                                caption="Fahrtrichtung"
                            />
                        </v-col>
                        <v-spacer />
                    </v-row>
                    <v-row dense>
                        <v-col
                            cols="12"
                            md="4"
                        >
                            <lhm-text-field
                                :text="
                                    selectedMessquerschnitt.lageMessquerschnitt
                                "
                                caption="Lage Messquerschnitt"
                            />
                        </v-col>
                        <v-col
                            cols="12"
                            md="4"
                        >
                            <lhm-text-field
                                :text="`${selectedMessquerschnitt.anzahlFahrspuren}`"
                                caption="Anzahl Fahrstreifen"
                            />
                        </v-col>
                        <v-col
                            cols="12"
                            md="4"
                        >
                            <lhm-text-field
                                :text="`${selectedMessquerschnitt.anzahlDetektoren}`"
                                caption="Anzahl Detektoren"
                            />
                        </v-col>
                    </v-row>
                    <v-row dense>
                        <v-col
                            cols="12"
                            md="12"
                        >
                            <v-textarea
                                v-model="selectedMessquerschnitt.standort"
                                :rules="[validationUtils.pflichtfeld]"
                                label="Standort MQ"
                                outlined
                                dense
                                rows="2"
                                row-height="10"
                                counter="60"
                                maxlength="60"
                                :disabled="disabled"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from "vue";
import MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";
import LhmTextField from "@/components/common/LhmTextField.vue";
import MessquerschnittEditDTO from "@/domain/dto/messstelle/MessquerschnittEditDTO";
import { himmelsRichtungenTextLong } from "@/domain/enums/Himmelsrichtungen";
import { useValidationUtils } from "@/util/validationUtils";
import type { VForm } from "@/util/useVuetify";

const validationUtils = useValidationUtils();

onMounted(validate);

interface Props {
    height: string;
    disabled: boolean;
    value: MessstelleEditDTO;
    valid: Map<string, boolean>;
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "input", v: MessstelleEditDTO): void;
    (e: "update:valid", v: Map<string, boolean>): void;
}>();

const editMessstelle = computed({
    get: () => props.value,
    set: (v) => emits("input", v),
});

const isFormValid = computed({
    get: () => props.valid,
    set: (v) => emits("update:valid", v),
});

const isMqValid = computed({
    get: () => props.valid.get(selectedMessquerschnitt.value.mqId),
    set: (v) =>
        isFormValid.value.set(selectedMessquerschnitt.value.mqId, v ?? false),
});

const messquerschnittform = ref<VForm>();

const selectedMessquerschnitt: Ref<MessquerschnittEditDTO> = ref(
    editMessstelle.value.messquerschnitte[0]
);

const stadtbezirk: ComputedRef<string> = computed(() => {
    return `${editMessstelle.value.stadtbezirkNummer} - ${editMessstelle.value.stadtbezirk}`;
});

function validate() {
    if (messquerschnittform.value) messquerschnittform.value.validate();
}
</script>