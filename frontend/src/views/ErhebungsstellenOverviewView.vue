<template>
    <v-container
        fluid
        class="pa-0"
    >
        <zaehlstelle-overview />
        <messstelle-overview />
    </v-container>
</template>

<script setup lang="ts">
import MessstelleOverview from "@/components/messstelle/MessstelleOverview.vue";
import ZaehlstelleOverview from "@/components/zaehlstelle/ZaehlstelleOverview.vue";
</script>