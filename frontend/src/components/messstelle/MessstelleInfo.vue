<template>
    <v-sheet
        width="100%"
        :height="height"
        :min-height="minheight"
        color="transparent"
        class="pa-4"
    >
        <span class="text-caption">
            Messstelle
            <v-tooltip right>
                <template #activator="{ on, attrs }">
                    <span
                        v-bind="attrs"
                        v-on="on"
                    >
                        <v-btn
                            icon
                            variant="plain"
                            :disabled="!messstelle.lageplanVorhanden"
                            @click="loadLageplan"
                            ><v-icon>mdi-map-outline</v-icon></v-btn
                        >
                    </span>
                </template>
                <span>{{
                    messstelle.lageplanVorhanden
                        ? "Lageplan"
                        : "Kein Lageplan vorhanden"
                }}</span>
            </v-tooltip> </span
        ><br />
        <span class="text-h5">{{ messstelle.mstId }}</span>
        <br /><br />
        <span class="text-caption"
            >Stadtbezirk {{ messstelle.stadtbezirkNummer }},
            {{ messstelle.stadtbezirk }}</span
        >
    </v-sheet>
</template>
<script setup lang="ts">
import MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";
import { ref } from "vue";
import LageplanService from "@/api/service/LageplanService";
import { useSnackbarStore } from "@/store/SnackbarStore";
import LageplanDTO from "@/domain/dto/lageplan/LageplanDTO";

interface Props {
    messstelle: MessstelleEditDTO;
    height: string;
    minheight: string;
}

const props = withDefaults(defineProps<Props>(), {
    minheight: "160px",
});
const snackbarStore = useSnackbarStore();
const lageplanLoading = ref(false);

function loadLageplan() {
    if (lageplanLoading.value) {
        return;
    }
    lageplanLoading.value = true;
    LageplanService.loadLageplan(props.messstelle.mstId)
        .then((result: LageplanDTO) => {
            window.open(result.url);
        })
        .catch((error) => {
            snackbarStore.showApiError(error);
        })
        .finally(() => {
            lageplanLoading.value = false;
        });
}
</script>
