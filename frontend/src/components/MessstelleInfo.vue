<script setup lang="ts">
interface Props {
    name: string;
    id: string;
    stadtbezirkNummer: number;
    height: string;
    minheight: string;
}

const props = defineProps<Props>();
</script>

<template>
    <v-sheet
        width="100%"
        color="transparent"
        class="pa-4"
        :min-height="props.minheight"
        :height="props.height"
    >
        <span class="text-caption">Messstelle</span><br />
        <span class="text-h5">{{ props.name }}</span
        ><br /><br />
        <div class="text-caption text-truncate">{{ props.id }}</div>
        <span class="text-caption"
            >Stadtbezirksnummer {{ props.stadtbezirkNummer }}</span
        >
    </v-sheet>
</template>

<style scoped>

</style>