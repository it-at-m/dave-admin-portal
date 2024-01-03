<template>
    <v-dialog
        :key="props.value"
        v-model="visible"
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
import { computed, ref, Ref } from "vue";

const dialogtitle: Ref<string> = ref("Messstelle bearbeiten");

interface Props {
    value: boolean;
    messstelle: MessstelleDTO;
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "cancel"): void;
    (e: "saved"): void;
    (e: "input", v: boolean): void;
}>();

const visible = computed({
    get: () => props.value,
    set: (v) => emits("input", v),
});
</script>
