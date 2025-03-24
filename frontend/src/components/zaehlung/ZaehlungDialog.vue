<template>
    <v-dialog
        v-model="showDialogModel"
        persistent
        max-width="50%"
        height="600px"
    >
        <v-card
            width="100%"
            flat
        >
            <v-card-title>
                <v-icon
                    v-if="editZaehlung"
                    left
                    >mdi-calendar-edit</v-icon
                >
                <v-icon
                    v-else
                    left
                    >mdi-calendar-plus</v-icon
                >
                {{ dialogtitle }}
            </v-card-title>

            <v-card-text>
                <zaehlung-form
                    :zaehlstelle="zaehlstelle"
                    @cancel="cancelCreate"
                    @saved="saved"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { useZaehlungStore } from "@/store/ZaehlungStore";
import { isEmpty } from "lodash";
import { computed, watch } from "vue";
import ZaehlstelleDTO from "@/domain/dto/ZaehlstelleDTO";
import BackendIdDTO from "@/domain/dto/bearbeiten/BackendIdDTO";

interface Props {
    showDialog: boolean;
    zaehlstelle: ZaehlstelleDTO;
}
const props = defineProps<Props>();
const showDialogModel = computed(() => {
    return props.showDialog;
});
const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "saved", payload: BackendIdDTO): void;
}>();

const zaehlungStore = useZaehlungStore();

const editZaehlung = computed(() => {
    return !isEmpty(zaehlungStore.getZaehlung.id);
});

const dialogtitle = computed(() => {
    if (editZaehlung.value) {
        return "Zählung bearbeiten";
    } else {
        return "Neue Zählung anlegen";
    }
});

watch(
    () => props.showDialog,
    () => {
        zaehlungStore.setResetformevent(!props.showDialog);
    }
);

function cancelCreate(): void {
    emits("cancel");
}

function saved(backendIdDTO: BackendIdDTO): void {
    emits("saved", backendIdDTO);
}
</script>