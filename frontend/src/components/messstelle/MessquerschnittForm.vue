<template>
    <v-sheet
        width="100%"
        :height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <v-card-text>
            <v-form>
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
                            :text="selectedMessquerschnitt.fahrtrichtung"
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
                            :text="selectedMessquerschnitt.lageMessquerschnitt"
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
                            label="Standort MQ"
                            outlined
                            dense
                            rows="2"
                            row-height="10"
                            counter="255"
                            maxlength="255"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>
    </v-sheet>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref, Ref } from "vue";
/* eslint-disable no-unused-vars */
import MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";
import LhmTextField from "@/components/common/LhmTextField.vue";
import MessquerschnittEditDTO from "@/domain/dto/messstelle/MessquerschnittEditDTO";

/* eslint-enable no-unused-vars */

interface Props {
    height: string;
    value: MessstelleEditDTO;
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "input", v: MessstelleEditDTO): void;
}>();

const editMessstelle = computed({
    get: () => props.value,
    set: (v) => emits("input", v),
});

const model: Ref<string> = ref(editMessstelle.value.messquerschnitte[0].mqId);

const selectedMessquerschnitt: Ref<MessquerschnittEditDTO> = ref(
    editMessstelle.value.messquerschnitte[0]
);

const stadtbezirk: ComputedRef<string> = computed(() => {
    return `${editMessstelle.value.stadtbezirkNummer} - ${editMessstelle.value.stadtbezirk}`;
});
</script>