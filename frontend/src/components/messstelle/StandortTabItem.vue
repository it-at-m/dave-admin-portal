<template>
    <v-sheet
        width="100%"
        :min-height="height"
        :max-height="height"
        class="overflow-y-auto"
    >
        <v-card elevation="0">
            <v-card-text>
                <mini-map
                    :coords="coords"
                    :height="heightMap"
                    width="100%"
                    :is-messstelle="true"
                    :show-attribution="true"
                    :reset-marker="resetMarker"
                    :draggable="draggable"
                    @updateZaehlstellenCoords="updateZaehlstellenCoords"
                />
            </v-card-text>
        </v-card>
    </v-sheet>
</template>

<script setup lang="ts">
import MiniMap from "@/components/map/MiniMap.vue";
import { LatLng } from "leaflet";
import MessstelleEditDTO from "@/domain/dto/messstelle/MessstelleEditDTO";
import { computed, ComputedRef } from "vue";
import DefaultObjectCreator from "@/util/DefaultObjectCreator";

interface Props {
    height: string;
    heightMap: string;
    resetMarker: boolean;
    draggable: boolean;
    value: MessstelleEditDTO;
}

const props = defineProps<Props>();

const emits = defineEmits<{
    (e: "input", v: MessstelleEditDTO): void;
}>();

const editMessstelle = computed({
    get: () => props.value,
    set: (v) => emits("input", v),
});

const coords: ComputedRef<LatLng> = computed(() => {
    let coords = DefaultObjectCreator.createCenterOfMunichLatLng();
    if (editMessstelle.value.latitude && editMessstelle.value.longitude) {
        return new LatLng(
            editMessstelle.value.latitude,
            editMessstelle.value.longitude
        );
    }
    return coords;
});

function updateZaehlstellenCoords(newCoords: LatLng): void {
    editMessstelle.value.latitude = newCoords.lat;
    editMessstelle.value.longitude = newCoords.lng;
}
</script>