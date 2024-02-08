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
                        <lhm-text-field
                            caption="MessstellenId"
                            :text="editMessstelle.mstId"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="editMessstelle.name"
                            caption="Bezeichnung"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="editMessstelle.detektierteVerkehrsarten"
                            caption="Detektierte Fahrzeuge"
                        />
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="stadtbezirk"
                            caption="Stadtbezirk"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="aufbaudatum"
                            caption="Aufbau"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="abbaudatum"
                            caption="Abbau"
                        />
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="
                                messstelleStatusText.get(editMessstelle.status)
                            "
                            caption="Status"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="editMessstelle.hersteller"
                            caption="Hersteller"
                        />
                    </v-col>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <lhm-text-field
                            :text="editMessstelle.fahrzeugKlassen"
                            caption="FZ-Klassen"
                        />
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-checkbox
                            v-model="editMessstelle.sichtbarDatenportal"
                            color="grey darken-1"
                            dense
                            hide-details
                            class="mb-5"
                        >
                            <template #label>
                                <v-icon
                                    class="mr-1"
                                    color="red darken-1"
                                >
                                    mdi-alert-outline
                                </v-icon>
                                <div>Sichtbarkeitsstatus Datenportal<br /></div>
                            </template>
                        </v-checkbox>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-textarea
                            v-model="editMessstelle.standort"
                            label="Standort MS"
                            outlined
                            dense
                            rows="2"
                            row-height="10"
                            counter="255"
                            maxlength="255"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-textarea
                            v-model="editMessstelle.bemerkung"
                            label="Bemerkung"
                            outlined
                            readonly
                            dense
                            rows="1"
                            row-height="10"
                        ></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-combobox
                            v-model="editMessstelle.customSuchwoerter"
                            multiple
                            label="Suchwörter"
                            outlined
                            dense
                            small-chips
                            deletable-chips
                            class="tag-input"
                            :search-input.sync="newSuchwort"
                            append-icon="mdi-plus"
                            @click:append="addSuchwortToList"
                            @keyup.enter="addSuchwortToList"
                            @blur="addSuchwortToList"
                        >
                        </v-combobox>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col
                        cols="12"
                        md="12"
                    >
                        <v-textarea
                            v-model="editMessstelle.kommentar"
                            label="Kommentar"
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
import { messstelleStatusText } from "@/domain/enums/MessstelleStatus";

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

const stadtbezirk: ComputedRef<string> = computed(() => {
    return `${editMessstelle.value.stadtbezirkNummer} - ${editMessstelle.value.stadtbezirk}`;
});

const aufbaudatum: ComputedRef<string> = computed(() => {
    return formatDate(editMessstelle.value.realisierungsdatum);
});

const abbaudatum: ComputedRef<string> = computed(() => {
    return formatDate(editMessstelle.value.abbaudatum);
});

function formatDate(date: string): string {
    if (!date) {
        return "";
    }
    const [year, month, day] = date.split("-");
    return `${day}.${month}.${year}`;
}

const newSuchwort: Ref<string> = ref("");

function addSuchwortToList(): void {
    if (!editMessstelle.value.customSuchwoerter) {
        editMessstelle.value.customSuchwoerter = [];
    }

    if (newSuchwort.value == null || newSuchwort.value.trim() === "") {
        return;
    }

    if (!editMessstelle.value.customSuchwoerter.includes(newSuchwort.value)) {
        editMessstelle.value.customSuchwoerter.push(
            ...newSuchwort.value.split(",")
        );
    }
    newSuchwort.value = "";
}
</script>