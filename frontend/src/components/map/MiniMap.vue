<template>
  <v-sheet
    :height="height"
    :width="width"
    :min-height="minheight"
  >
    <div
      id="minimap"
      ref="minimapRef"
      :style="mapStyle"
    />
  </v-sheet>
</template>

<script setup lang="ts">
import L, { Icon, LatLng } from "leaflet";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import markerIconDiamondRed from "@/assets/cards-diamond-red.png";
import markerIconRed from "@/assets/marker-icon-red.png";
import { useMapConfigStore } from "@/store/MapConfigStore";

interface Props {
  coords: LatLng;
  height?: string;
  width?: string;
  minheight?: string;
  isMessstelle?: boolean;
  resetMarker?: boolean;
  draggable?: boolean;
  activateOverlays?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  height: "100%",
  width: "100%",
  minheight: "160px",
  isMessstelle: false,
  resetMarker: false,
  draggable: true,
  activateOverlays: false,
});

const emit = defineEmits<(e: "updateZaehlstellenCoords", v: LatLng) => void>();

const mapConfigStore = useMapConfigStore();

const minimapRef = ref<HTMLDivElement | null>(null);

let minimap: L.Map;
let layerControl: L.Control.Layers;
const marker = ref(createMarker());

watch(
  () => props.resetMarker,
  () => {
    marker.value.removeFrom(minimap);
    marker.value = createMarker();
    marker.value.addTo(minimap);
    minimap.setView(props.coords, 18);
  }
);

onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  minimap.remove();
});

function initMap(): void {
  minimap = L.map(minimapRef.value as HTMLElement, {
    minZoom: 10,
    maxZoom: 18,
    zoom: 18,
    preferCanvas: false,
    attributionControl: false,
    fullscreenControl: true,
    fullscreenControlOptions: {
      position: "topleft",
    },
    center: props.coords,
  });

  minimap.whenReady(() => {
    setTimeout(() => {
      minimap.invalidateSize();
      minimap.addControl(
        L.control.attribution({
          position: "bottomleft",
          prefix: "Leaflet",
        })
      );
      createLayersAndAddToMap();
      marker.value.addTo(minimap);
    }, 10);
  });
}

function createLayersAndAddToMap(): void {
  layerControl = L.control.layers().addTo(minimap);
  addBaseLayers();
  if (props.activateOverlays) {
    addOverlayLayers();
  }
}

/**
 * Fügt im Backend konfigurierte Base-Layer zur Karte hinzu.
 */
function addBaseLayers(): void {
  const baseLayers = mapConfigStore.getMapConfig.baseLayers;
  let firstLayerAddedToMap = false;

  baseLayers.forEach((layerConfig) => {
    const layer = L.tileLayer.wms(layerConfig.baseUrl, {
      layers: layerConfig.layerName,
      className: layerConfig.layerName,
      attribution: layerConfig.attribution,
      referrerPolicy: "strict-origin-when-cross-origin",
    });
    layerControl.addBaseLayer(layer, layerConfig.layerNameToDisplay);
    if (!firstLayerAddedToMap) {
      layer.addTo(minimap);
      firstLayerAddedToMap = true;
    }
  });
}

/**
 * Fügt im Backend konfigurierte Overlay-Layer zur Karte hinzu.
 */
function addOverlayLayers(): void {
  const overlayLayers = mapConfigStore.getMapConfig.overlayLayers;

  overlayLayers.forEach((layerConfig) => {
    const layer = L.tileLayer.wms(layerConfig.baseUrl, {
      layers: layerConfig.layerName,
      className: layerConfig.layerName,
      transparent: true,
      format: "image/png",
      attribution: layerConfig.attribution,
      referrerPolicy: "strict-origin-when-cross-origin",
    });
    layerControl.addOverlay(layer, layerConfig.layerNameToDisplay);
  });
}

watch(mapConfigStore, () => {
  addBaseLayers();
  if (props.activateOverlays) {
    addOverlayLayers();
  }
});

function createMarker(): L.Marker {
  const defaultIcon = new Icon.Default();
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

const mapStyle = computed(() => {
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
