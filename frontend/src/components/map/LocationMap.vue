<template>
  <v-sheet
    :height="height"
    :width="width"
    :min-height="minHeight"
  >
    <div
      id="map"
      ref="mapRef"
      :style="mapStyle"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import L, { Icon, LatLng } from "leaflet";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import markerIconDiamondRed from "@/assets/cards-diamond-red.png";
import markerIconRed from "@/assets/marker-icon-red.png";
import { useLeafletMap } from "@/composables/useLeafletMap";

interface Props {
  latLngMarker: LatLng;
  latLngCircle?: LatLng;
  height?: string;
  width?: string;
  minHeight?: string;
  zoom?: number;
  isMessstelle?: boolean;
  draggable?: boolean;
  resetMarker?: boolean;
  zoomControl?: boolean;
  fullscreenControl?: boolean;
  attributionControl?: boolean;
  layerControl?: boolean;
  activateOverlayLayers?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  latLngCircle: undefined,
  height: "100%",
  width: "100%",
  minHeight: "160px",
  zoom: 16,
  isMessstelle: false,
  draggable: true,
  resetMarker: false,
  zoomControl: true,
  fullscreenControl: true,
  attributionControl: true,
  layerControl: true,
  activateOverlayLayers: true,
});

const emit = defineEmits<{
  (e: "updateZaehlstellenCoords", v: LatLng): void;
  (e: "updateZaehlungCoords", v: LatLng): void;
}>();

const mapRef = ref<HTMLDivElement | null>(null);
const leafletMap = useLeafletMap(mapRef, {
  center:
    props.latLngCircle === undefined ? props.latLngMarker : props.latLngCircle,
  zoom: props.zoom,
  minZoom: 10,
  maxZoom: 18,
  zoomControl: props.zoomControl,
  fullscreenControl: props.fullscreenControl,
  attributionControl: props.attributionControl,
  layerControl: props.layerControl,
  activateOverlayLayers: props.activateOverlayLayers,
});

const marker = ref<L.Marker | null>(null);
const circleMarker = ref<L.CircleMarker | null>(null);

watch(
  () => props.resetMarker,
  () => resetMarkers()
);

onMounted(() => {
  leafletMap.initMap();
  createMarkersAndAddToMap();
});

onBeforeUnmount(() => {
  leafletMap.map.value?.remove();
  leafletMap.map.value = undefined;
});

/**
 * Erstellt einen Marker mit passendem Icon (je nachdem, ob Zählstelle oder Messstelle)
 * und meldet Koordinatenänderungen nach dem Verschieben eines Markers.
 */
function createMarker(latLngMarker: LatLng): L.Marker {
  const defaultIcon = new Icon.Default();
  if (props.isMessstelle) {
    defaultIcon.options.iconUrl = markerIconDiamondRed;
    defaultIcon.options.iconRetinaUrl = markerIconDiamondRed;
  } else {
    defaultIcon.options.iconUrl = markerIconRed;
    defaultIcon.options.iconRetinaUrl = markerIconRed;
  }

  const marker = L.marker(latLngMarker, {
    icon: defaultIcon,
    opacity: 1.0,
    draggable: props.draggable,
  });

  marker.on("dragend", () => {
    if (props.latLngCircle) {
      // Es gibt Koordinaten für den Circle, d.h. der Marker repräsentiert eine Zählung
      emit("updateZaehlungCoords", marker.getLatLng());
    } else {
      // Kein Circle, d.h. der Marker repräsentiert eine Zählstelle/Messstelle
      emit("updateZaehlstellenCoords", marker.getLatLng());
    }
  });

  return marker;
}

/**
 * Erstellt einen Kreismarker mit dem Tooltip „Zählstelle“.
 */
function createCircleMarker(latLngCircle: LatLng): L.CircleMarker {
  const circleMarker = L.circleMarker(latLngCircle, {
    opacity: 1.0,
    radius: 20,
  });

  circleMarker.bindTooltip("Zählstelle", {
    direction: "right",
    offset: [20, 0],
  });

  return circleMarker;
}

/**
 * Fügt einen Marker und bei vorhandenen Kreiskoordinaten auch einen
 * Kreismarker zur Karte hinzu.
 * - Wenn vorhanden, repräsentiert der Kreismarker eine Zählstelle und die
 *   "normalen" Marker die Zählungen der Zählstelle.
 * - Wenn kein Kreismarker vorhanden ist, repräsentiert der "normale" Marker
 *   eine Zählstelle.
 */
function createMarkersAndAddToMap() {
  marker.value = createMarker(props.latLngMarker);
  marker.value.addTo(leafletMap.map.value as L.Map);
  if (props.latLngCircle) {
    circleMarker.value = createCircleMarker(props.latLngCircle);
    circleMarker.value.addTo(leafletMap.map.value as L.Map);
  }
}

/**
 * Ersetzt die vorhandenen Marker anhand der aktuellen Props und setzt
 * Kartenzentrum und Zoom zurück.
 */
function resetMarkers() {
  marker.value?.removeFrom(leafletMap.map.value as L.Map);
  circleMarker.value?.removeFrom(leafletMap.map.value as L.Map);
  createMarkersAndAddToMap();
  const coords =
    props.latLngCircle === undefined ? props.latLngMarker : props.latLngCircle;
  leafletMap.map.value?.setView(coords, props.zoom);
}

const mapStyle = computed(() => {
  return `height: ${props.height}; width: ${props.width}; min-height: ${props.minHeight}; z-index: 1`;
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
