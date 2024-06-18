<template>
    <v-expansion-panel>
        <v-expansion-panel-header>
            <v-row no-gutters>
                <div style="align-self: center">
                    <v-avatar
                        :color="color"
                        size="50"
                    >
                        <v-icon
                            large
                            dense
                            >{{ icon }}</v-icon
                        >
                    </v-avatar>
                </div>
                <div
                    style="font-size: x-large; align-self: center"
                    class="pl-5"
                >
                    {{ header }}
                </div>
                <v-spacer />
            </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content class="mt-1">
            <v-list>
                <v-list-item
                    v-for="(messstelle, index) in messstellen"
                    :key="index"
                    @click="openMessstelle(messstelle)"
                >
                    <v-list-item-content>
                        <v-list-item-title>
                            {{ getItemTitle(messstelle) }}
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-expansion-panel-content>
    </v-expansion-panel>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router/composables";
import MessstelleOverviewDTO from "@/domain/dto/messstelle/MessstelleOverviewDTO";

interface Props {
    header: string;
    icon: string;
    color: string;
    messstellen: Array<MessstelleOverviewDTO>;
}

defineProps<Props>();
const router = useRouter();

function getItemTitle(messstelle: MessstelleOverviewDTO): string {
    return `${messstelle.mstId}, ${messstelle.name}, Stadtbezirk ${messstelle.stadtbezirkNummer}, ${messstelle.stadtbezirk}`;
}

function openMessstelle(messstelle: MessstelleOverviewDTO): void {
    router.push(`/messstelle/${messstelle.id}`);
}
</script>