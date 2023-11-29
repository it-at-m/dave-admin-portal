<script setup lang="ts">
interface Props {
    name: string;
    id: string;
    stadtbezirkNummer: number;
}

const props = defineProps<Props>();
</script>

<template>
    <v-sheet
        width="100%"
        :height="height"
        :min-height="minheight"
        color="transparent"
        class="pa-4"
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