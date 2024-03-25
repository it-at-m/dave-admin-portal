<template>
    <v-sheet
        width="100%"
        :min-height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <v-card elevation="0">
            <v-card-text>
                <v-form>
                    <v-card-title class="justify-center">
                        <v-icon>mdi-account-hard-hat-outline</v-icon>
                        Under Construction
                        <v-icon>mdi-car-wrench</v-icon>
                    </v-card-title>
                </v-form>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script setup lang="ts">
interface Props {
    height: string;
}

defineProps<Props>();
</script>