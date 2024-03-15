<template>
    <v-sheet
        width="100%"
        :height="height"
        :min-height="minheight"
        color="transparent"
        class="pa-4"
    >
        <span class="text-caption">Messstelle</span><br />
        <span class="text-h5">{{ messstelle.mstId }}</span>
        <br /><br />
        <span class="text-caption"
            >Stadtbezirk {{ messstelle.stadtbezirkNummer }},
            {{ messstelle.stadtbezirk }}</span
        >
    </v-sheet>
</template>
<script setup lang="ts">
import MessstelleInfoDTO from "@/domain/dto/messstelle/MessstelleInfoDTO";

interface Props {
    messstelle: MessstelleInfoDTO;
    height: string;
    minheight: string;
}

withDefaults(defineProps<Props>(), {
    minheight: "160px",
});
</script>

