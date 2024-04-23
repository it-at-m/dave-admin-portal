<template>
    <v-sheet
        :height="height"
        :width="width"
        :min-height="minheight"
    >
        <div
            id="map"
            :style="mapStyle"
        />
    </v-sheet>
</template>

<script setup lang="ts">
import L, { Icon, LatLng } from "leaflet";
import { computed, ComputedRef, onMounted, Ref, ref, watch } from "vue";
import markerIconRed from "@/assets/marker-icon-red.png";
import markerIconDiamondRed from "@/assets/cards-diamond-red.png";

interface Props {
    coords: LatLng;
    height?: string;
    width?: string;
    minheight?: string;
    isMessstelle?: boolean;
    resetMarker?: boolean;
    draggable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    height: "100%",
    width: "100%",
    minheight: "160px",
    isMessstelle: false,
    resetMarker: false,
    draggable: true,
});

const emit = defineEmits<(e: "updateZaehlstellenCoords", v: LatLng) => void>();

const mapAttribution =
    '&copy; <a href="https://stadt.muenchen.de/infos/geobasisdaten.html">GeodatenService München</a>';
const map: Ref<L.Map | undefined> = ref(undefined);
const marker = ref(createMarker());

const resetMarkerSwitch: ComputedRef<boolean> = computed(() => {
    return props.resetMarker;
});

watch(resetMarkerSwitch, () => {
    resetMarker();
});

onMounted(() => {
    createMap();
    initMap();
});

function initMap(): void {
    if (map.value) {
        map.value.setView(props.coords, 18);

        createLayersAndAddToMap();

        marker.value.addTo(map.value);

        map.value.whenReady(() =>
            setTimeout(() => {
                if (map.value) {
                    map.value.invalidateSize();
                    map.value.addControl(
                        L.control.attribution({
                            position: "bottomleft",
                            prefix: "Leaflet",
                        })
                    );
                }
            }, 10)
        );
    }
}

function resetMarker(): void {
    if (map.value) {
        marker.value.removeFrom(map.value);
        marker.value = createMarker();
        marker.value.addTo(map.value);
    }
}

function createMap(): void {
    if (!map.value) {
        map.value = new L.Map("map", {
            minZoom: 10,
            maxZoom: 18,
            preferCanvas: false,
            attributionControl: false,
            fullscreenControl: true,
            fullscreenControlOptions: {
                position: "topleft",
            },
        });
    }
}

function createLayersAndAddToMap(): void {
    if (map.value) {
        const baseLayers = createBaseLayers();
        const overlayLayers = createOverlayLayers();
        baseLayers.Stadtkarte.addTo(map.value);
        L.control.layers(baseLayers, overlayLayers).addTo(map.value);
    }
}

function createBaseLayers(): L.Control.LayersObject {
    const stadtkarteGesamt = L.tileLayer.wms(
        "https://geoportal.muenchen.de/geoserver/gsm/wms?",
        {
            layers: "gsm:g_stadtkarte_gesamt",
            className: "Stadtkarte",
            attribution: mapAttribution,
        }
    );

    const luftbild = L.tileLayer.wms(
        "https://geoportal.muenchen.de/geoserver/gsm/wms?",
        {
            layers: "gsm:g_luftbild",
            className: "Luftbild",
            attribution: mapAttribution,
        }
    );

    const osm = L.tileLayer.wms("https://ows.terrestris.de/osm/service?", {
        layers: "OSM-WMS",
        className: "OpenStreetMaps",
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a> by terrestris',
    });

    return {
        Stadtkarte: stadtkarteGesamt,
        Luftbild: luftbild,
        OpenStreetMaps: osm,
    };
}

function createOverlayLayers(): L.Control.LayersObject {
    const stadtbezirke = L.tileLayer.wms(
        "https://geoportal.muenchen.de/geoserver/gsm/wms?",
        {
            layers: "gsm:stadtbezirk",
            className: "Stadtbezirke",
            transparent: true,
            format: "image/png",
            attribution: mapAttribution,
        }
    );
    const stadtviertel = L.tileLayer.wms(
        "https://geoportal.muenchen.de/geoserver/gsm/wms?",
        {
            layers: "gsm:vablock_viertel_dave",
            className: "Stadtviertel",
            transparent: true,
            format: "image/png",
            attribution: mapAttribution,
        }
    );

    return {
        Stadtbezirke: stadtbezirke,
        Stadtviertel: stadtviertel,
    };
}

function createMarker(): L.Marker {
    let defaultIcon = new Icon.Default();
    if (props.isMessstelle) {
        defaultIcon.options.iconUrl = markerIconDiamondRed;
    } else {
        defaultIcon.options.iconUrl = markerIconRed;
    }

    const marker = L.marker(props.coords, {
        icon: defaultIcon,
        opacity: 1.0,
        draggable: props.draggable,
    });

    marker.on("dragend", () => {
        emit("updateZaehlstellenCoords", marker.getLatLng());
    });

    return marker;
}

const mapStyle: ComputedRef<string> = computed(() => {
    return `height: ${props.height}; width: ${props.width}; min-height: ${props.minheight}; z-index: 1`;
});
</script>

<style lang="css">
/* Zoom-Buttons verwenden per Default die Farbe 'primary'. Da diese im Button kaum zu erkennen ist,
wurden die Farbe auf schwarz gesetzt */
.leaflet-control-zoom a.leaflet-control-zoom-in {
    color: black;
}

.leaflet-control-zoom a.leaflet-control-zoom-out {
    color: black;
}
</style>
