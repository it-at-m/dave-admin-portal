<template>
    <v-sheet
        width="100%"
        :min-height="height"
        :max-height="height"
    >
        <v-card elevation="0">
            <v-card-text>
                <v-form>
                    <v-data-table
                        class="overflow-y-auto"
                        :height="tableHeight"
                        dense
                        :headers="header"
                        :items="messfahigkeiten"
                        :items-per-page="-1"
                        hide-default-footer
                        fixed-header
                        :item-class="activeMessfaehigkeit"
                    />
                </v-form>
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script setup lang="ts">
import MessfaehigkeitEditDTO from "@/domain/dto/messstelle/MessfaehigkeitEditDTO";
import { computed, ComputedRef } from "vue";
import _ from "lodash";

interface Props {
    height: string;
    messfahigkeiten: Array<MessfaehigkeitEditDTO>;
}

const props = defineProps<Props>();
const tableHeight: ComputedRef<string> = computed(() => {
    return parseInt(props.height.replace("px", "")) - 136 + "px";
});

function activeMessfaehigkeit(item: MessfaehigkeitEditDTO) {
    return _.isEmpty(item.gueltigBis) ? "indigo lighten-5" : "";
}

const header = computed(() => {
    return [
        {
            text: "Fahrzeugklasse",
            align: "start",
            sortable: false,
            value: "fahrzeugklasse",
            divider: true,
        },
        {
            text: "Intervallwert",
            align: "start",
            sortable: false,
            value: "intervall",
            divider: true,
        },
        {
            text: "gültig ab",
            align: "start",
            sortable: false,
            value: "gueltigAb",
            divider: true,
        },
        {
            text: "gültig bis",
            align: "start",
            sortable: false,
            value: "gueltigBis",
        },
    ];
});
</script>
