<template>
    <v-dialog
        v-model="value"
        persistent
        max-width="50%"
        height="600px"
    >
        <v-card
            width="100%"
            flat
        >
            <v-card-title>
                <v-icon left>mdi-pencil</v-icon>
                {{ dialogtitle }}
            </v-card-title>

            <v-card-text>
                <update-messstelle-dialog-form
                    :messstelle="messstelle"
                    @cancel="$emit('cancel')"
                    @saved="$emit('saved')"
                />
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import MessstelleDTO from "@/domain/dto/MessstelleDTO";
import UpdateMessstelleDialogForm from "@/components/messstelle/UpdateMessstelleDialogForm.vue";
import { ref, Ref } from "vue";

const dialogtitle: Ref<string> = ref("Messstelle bearbeiten");

interface Props {
    value: boolean;
    messstelle: MessstelleDTO;
}

defineProps<Props>();

defineEmits<{
    (e: "cancel"): void;
    (e: "saved"): void;
    (e: "input", v: boolean): void;
}>();
</script>
