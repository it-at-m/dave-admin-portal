<template>
    <v-sheet
        width="100%"
        :height="height"
        :min-height="minheight"
        color="transparent"
        class="pa-4"
        @click="$emit('edit-messstelle')"
    >
        <span class="text-caption">Messstelle</span><br />
        <span class="text-h5">{{ mstId }}</span
        ><br /><br />
        <span class="text-caption"
            >Stadtbezirk {{ stadtbezirkNummer }}, {{ stadtbezirk }}</span
        >
    </v-sheet>
</template>
<script setup lang="ts">
interface Props {
    mstId: string;
    stadtbezirkNummer: string;
    stadtbezirk: string;
    height: string;
    minheight: string;
}

withDefaults(defineProps<Props>(), {
    mstId: "",
    stadtbezirkNummer: "",
    stadtbezirk: "",
    minheight: "160px",
});

defineEmits<(e: "edit-messstelle") => void>();
</script>

