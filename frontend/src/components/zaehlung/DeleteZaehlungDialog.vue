<template>
    <v-dialog
        v-model="showDialogModel"
        persistent
        width="420px"
    >
        <v-card flat>
            <v-card-title>
                <v-icon left>mdi-calendar-remove</v-icon>
                {{ DIALOG_TITLE }}
            </v-card-title>

            <v-card-text style="font-weight: normal; font-size: larger">
                {{ dialogtext }}
            </v-card-text>

            <v-card-actions>
                <v-row no-gutters>
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-btn
                            color="grey lighten-1"
                            @click="deleteIt()"
                        >
                            Löschen
                        </v-btn>
                    </v-col>
                    <v-spacer />
                    <v-col
                        cols="12"
                        md="4"
                    >
                        <v-btn
                            color="secondary"
                            @click="cancel()"
                        >
                            Abbrechen
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
    showDialog: boolean;
    dialogtext: string;
}
const props = defineProps<Props>();

const showDialogModel = computed(() => {
    return props.showDialog;
});

const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "deleteIt"): void;
}>();

const DIALOG_TITLE = "Zählung löschen";

function cancel(): void {
    emits("cancel");
}

function deleteIt(): void {
    emits("deleteIt");
}
</script>