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
import L, { Icon, LatLng, Marker } from "leaflet";
import { computed, ComputedRef, onMounted } from "vue";
import markerIconRed from "@/assets/marker-icon-red.png";

interface Props {
    coords: LatLng;
    height?: string;
    width?: string;
    minheight?: string;
}

const props = withDefaults(defineProps<Props>(), {
    height: "100%",
    width: "100%",
    minheight: "160px",
});

const emit = defineEmits<(e: "updateZaehlstellenCoords", v: LatLng) => void>();

const mapAttribution =
    '&copy; <a href="https://stadt.muenchen.de/infos/geobasisdaten.html">GeodatenService München</a>';

onMounted(() => {
    const map = createMap();

    createLayersAndAddToMap(map);

    const marker = createMarker();
    marker.addTo(map);

    map.whenReady(() =>
        setTimeout(() => {
            map.invalidateSize();
        }, 10)
    );
});

function createMap(): L.Map {
    const map = new L.Map("map", {
        minZoom: 10,
        maxZoom: 18,
        preferCanvas: false,
        attributionControl: false,
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: "topleft",
        },
    });

    map.setView(props.coords, 18);

    return map;
}

function createLayersAndAddToMap(map: L.Map): void {
    const baseMaps = createBaseLayersAndAddDefaultToMap(map);
    const overlayMaps = createOverlayLayers();
    L.control.layers(baseMaps, overlayMaps).addTo(map);
}

function createBaseLayersAndAddDefaultToMap(
    map: L.Map
): L.Control.LayersObject {
    const stadtkarteGesamt = L.tileLayer.wms(
        "https://geoportal.muenchen.de/geoserver/gsm/wms?",
        {
            layers: "gsm:g_stadtkarte_gesamt",
            className: "Stadtkarte",
            attribution: mapAttribution,
        }
    );
    stadtkarteGesamt.addTo(map);

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

function createMarker(): Marker {
    let defaultIcon = new Icon.Default();
    defaultIcon.options.iconUrl = markerIconRed;

    const marker = L.marker(props.coords, {
        icon: defaultIcon,
        opacity: 1.0,
        draggable: true,
    });

    marker.on("dragend", () => {
        emit("updateZaehlstellenCoords", marker.getLatLng());
    });

    return marker;
}

const mapStyle: ComputedRef<string> = computed(() => {
    return `height: ${props.height}; width: ${props.width}; min-height: ${props.minheight}`;
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
