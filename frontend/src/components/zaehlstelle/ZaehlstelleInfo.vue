<template>
    <v-sheet
        width="100%"
        :height="height"
        :min-height="minheight"
        color="transparent"
        class="pa-4"
        @click="editZaehlstelle"
    >
        <span class="text-caption">Zählstelle</span><br />
        <span class="text-h5">{{ nummer }}</span
        ><br /><br />
        <div class="text-caption text-truncate">{{ kreuzungsname }}</div>
        <span class="text-caption"
            >Stadtbezirk {{ stadtbezirkNummer }}, {{ stadtbezirk }}</span
        >
    </v-sheet>
</template>
<script setup lang="ts">
interface Props {
    height: string;
    minheight: string;
    nummer?: string;
    kreuzungsname: string;
    stadtbezirkNummer: string;
    stadtbezirk?: string;
}

withDefaults(defineProps<Props>(), {
    minheight: "160px",
});

const emits = defineEmits<{
    (e: "edit-zaehlstelle"): void;
}>();

function editZaehlstelle() {
    emits("edit-zaehlstelle");
}
</script>